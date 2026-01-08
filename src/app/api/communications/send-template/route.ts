import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { sendSms } from '@/lib/sms'
import {
  bookingConfirmationEmail,
  preArrivalEmail,
  postCheckoutEmail,
  reviewRequestEmail,
  portalLinkEmail,
} from '@/lib/email-templates'
import {
  bookingConfirmationSms,
  preArrivalSms,
  checkInDaySms,
  checkoutReminderSms,
  postCheckoutSms,
  portalLinkSms,
} from '@/lib/sms-templates'
import { getGuestById, createCommunication } from '@/lib/supabase/queries'
import type { Booking, Property, GuestCommunicationInsert } from '@/types/database'

type TemplateType =
  | 'booking_confirmation'
  | 'pre_arrival'
  | 'check_in_day'
  | 'checkout_reminder'
  | 'post_checkout'
  | 'review_request'
  | 'portal_link'

interface BookingWithProperty extends Booking {
  properties: Property
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const {
    guestId,
    bookingId,
    template,
    channel, // 'email' | 'sms' | 'both'
    portalUrl,
    accessCode,
  } = await request.json()

  if (!guestId || !template) {
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

  // Get booking if needed
  let booking: BookingWithProperty | null = null
  let property: Property | null = null

  if (bookingId) {
     
    const { data } = await (supabase
      .from('bookings')
      .select('*, properties(*)')
      .eq('id', bookingId)
      .single() as any) as { data: BookingWithProperty | null }

    booking = data
    property = data?.properties || null
  }

  const results: {
    email?: { success: boolean; error?: string }
    sms?: { success: boolean; error?: string }
  } = {}

  const sendChannels = channel || 'email'
  const shouldSendEmail = sendChannels === 'email' || sendChannels === 'both'
  const shouldSendSms = sendChannels === 'sms' || sendChannels === 'both'

  // Generate and send email
  if (shouldSendEmail) {
    let emailTemplate: { subject: string; html: string; text: string } | null = null

    switch (template as TemplateType) {
      case 'booking_confirmation':
        if (booking && property) {
          emailTemplate = bookingConfirmationEmail(guest, booking, property, portalUrl)
        }
        break
      case 'pre_arrival':
        if (booking && property) {
          emailTemplate = preArrivalEmail(guest, booking, property, portalUrl)
        }
        break
      case 'post_checkout':
        if (booking && property) {
          emailTemplate = postCheckoutEmail(guest, booking, property, portalUrl)
        }
        break
      case 'review_request':
        if (booking && property) {
          emailTemplate = reviewRequestEmail(guest, booking, property)
        }
        break
      case 'portal_link':
        if (portalUrl) {
          emailTemplate = portalLinkEmail(guest, portalUrl)
        }
        break
    }

    if (emailTemplate) {
      results.email = await sendEmail({
        to: guest.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
        text: emailTemplate.text,
      })

      // Log email
      const emailLog: GuestCommunicationInsert = {
        guest_id: guestId,
        booking_id: bookingId || null,
        type: 'email',
        direction: 'out',
        subject: emailTemplate.subject,
        content: `[Template: ${template}]`,
        sent_at: new Date().toISOString(),
      }
      try {
        await createCommunication(emailLog)
      } catch (err) {
        console.error('Failed to log email communication:', err)
      }
    }
  }

  // Generate and send SMS
  if (shouldSendSms && guest.phone) {
    let smsTemplate: { body: string } | null = null

    switch (template as TemplateType) {
      case 'booking_confirmation':
        if (booking && property) {
          smsTemplate = bookingConfirmationSms(guest, booking, property)
        }
        break
      case 'pre_arrival':
        if (booking && property) {
          smsTemplate = preArrivalSms(guest, booking, property, portalUrl)
        }
        break
      case 'check_in_day':
        if (booking && property) {
          smsTemplate = checkInDaySms(guest, booking, property, accessCode)
        }
        break
      case 'checkout_reminder':
        if (booking && property) {
          smsTemplate = checkoutReminderSms(guest, booking, property)
        }
        break
      case 'post_checkout':
        if (property) {
          smsTemplate = postCheckoutSms(guest, property)
        }
        break
      case 'portal_link':
        if (portalUrl) {
          smsTemplate = portalLinkSms(guest, portalUrl)
        }
        break
    }

    if (smsTemplate) {
      results.sms = await sendSms({
        to: guest.phone,
        body: smsTemplate.body,
      })

      // Log SMS
      const smsLog: GuestCommunicationInsert = {
        guest_id: guestId,
        booking_id: bookingId || null,
        type: 'sms',
        direction: 'out',
        subject: null,
        content: smsTemplate.body,
        sent_at: new Date().toISOString(),
      }
      try {
        await createCommunication(smsLog)
      } catch (err) {
        console.error('Failed to log SMS communication:', err)
      }
    }
  }

  return NextResponse.json({
    success: true,
    results,
  })
}
