import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { sendSms } from '@/lib/sms'
import { customMessageEmail } from '@/lib/email-templates'
import { customSms } from '@/lib/sms-templates'
import { getGuestById, createCommunication } from '@/lib/supabase/queries'
import type { GuestCommunicationInsert } from '@/types/database'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { guestId, bookingId, type, subject, content } = await request.json()

  if (!guestId || !type || !content) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  // Get guest info
  let guest
  try {
    guest = await getGuestById(guestId)
  } catch (err) {
    console.error('Error fetching guest:', err)
    return NextResponse.json({ error: 'Failed to fetch guest' }, { status: 500 })
  }

  if (!guest) {
    return NextResponse.json({ error: 'Guest not found' }, { status: 404 })
  }

  let sendResult: { success: boolean; error?: string; id?: string; sid?: string }

  if (type === 'email') {
    if (!subject) {
      return NextResponse.json(
        { error: 'Subject required for email' },
        { status: 400 }
      )
    }

    const emailContent = customMessageEmail(guest, subject, content)
    sendResult = await sendEmail({
      to: guest.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    })
  } else if (type === 'sms') {
    if (!guest.phone) {
      return NextResponse.json(
        { error: 'Guest has no phone number' },
        { status: 400 }
      )
    }

    const smsContent = customSms(guest, content)
    sendResult = await sendSms({
      to: guest.phone,
      body: smsContent.body,
    })
  } else {
    return NextResponse.json({ error: 'Invalid message type' }, { status: 400 })
  }

  // Log communication in database
  const communication: GuestCommunicationInsert = {
    guest_id: guestId,
    booking_id: bookingId || null,
    type,
    direction: 'out',
    subject: type === 'email' ? subject : null,
    content,
    sent_at: new Date().toISOString(),
  }

  try {
    await createCommunication(communication)
  } catch (err) {
    console.error('Failed to log communication:', err)
  }

  if (!sendResult.success) {
    return NextResponse.json({
      success: false,
      logged: true,
      error: sendResult.error,
      message: 'Message logged but delivery failed (check API configuration)',
    })
  }

  return NextResponse.json({
    success: true,
    logged: true,
    messageId: sendResult.id || sendResult.sid,
  })
}
