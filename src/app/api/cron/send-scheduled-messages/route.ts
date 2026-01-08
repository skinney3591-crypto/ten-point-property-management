import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { addDays, isSameDay, startOfDay } from 'date-fns'
import { sendEmail } from '@/lib/email'
import { sendSms } from '@/lib/sms'
import {
  preArrivalEmail,
  postCheckoutEmail,
  reviewRequestEmail,
} from '@/lib/email-templates'
import {
  preArrivalSms,
  checkInDaySms,
  checkoutReminderSms,
  postCheckoutSms,
} from '@/lib/sms-templates'
import { createCommunication } from '@/lib/supabase/queries'
import type { Booking, Property, Guest, GuestCommunicationInsert } from '@/types/database'

interface BookingWithDetails extends Booking {
  properties: Property
  guests: Guest | null
}

// This endpoint should be called by a cron job (e.g., Vercel Cron, daily at 8 AM)
// Add to vercel.json: { "crons": [{ "path": "/api/cron/send-scheduled-messages", "schedule": "0 8 * * *" }] }

export async function GET(request: NextRequest) {
  // Verify cron secret (optional security measure)
  const authHeader = request.headers.get('authorization')
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = await createClient()
  const today = startOfDay(new Date())
  const tomorrow = addDays(today, 1)
  const twoDaysAgo = addDays(today, -2)
  const fiveDaysAgo = addDays(today, -5)

  const results = {
    preArrival: { sent: 0, failed: 0 },
    checkInDay: { sent: 0, failed: 0 },
    checkoutReminder: { sent: 0, failed: 0 },
    postCheckout: { sent: 0, failed: 0 },
    reviewRequest: { sent: 0, failed: 0 },
  }

  // Get all relevant bookings
   
  const { data: bookings } = (await (supabase
    .from('bookings')
    .select('*, properties(*), guests(*)')
    .neq('status', 'cancelled')
    .gte('check_in', fiveDaysAgo.toISOString())
    .lte('check_out', addDays(today, 7).toISOString()) as any)) as {
    data: BookingWithDetails[] | null
  }

  if (!bookings) {
    return NextResponse.json({ message: 'No bookings to process', results })
  }

  for (const booking of bookings) {
    const guest = booking.guests
    const property = booking.properties

    if (!guest || !property) continue

    const checkIn = startOfDay(new Date(booking.check_in))
    const checkOut = startOfDay(new Date(booking.check_out))

    // Generate portal URL for this guest
     
    const { data: tokenData } = await (supabase
      .from('guest_portal_tokens')
      .select('token')
      .eq('guest_id', guest.id)
      .single() as any)

    const portalUrl = tokenData?.token
      ? `${process.env.NEXT_PUBLIC_APP_URL}/portal/${tokenData.token}`
      : undefined

    // PRE-ARRIVAL: Send day before check-in
    if (isSameDay(checkIn, tomorrow) && booking.status === 'confirmed') {
      try {
        // Send email
        const emailTemplate = preArrivalEmail(guest, booking, property, portalUrl)
        const emailResult = await sendEmail({
          to: guest.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          text: emailTemplate.text,
        })

        // Send SMS if phone available
        if (guest.phone) {
          const smsTemplate = preArrivalSms(guest, booking, property, portalUrl)
          await sendSms({ to: guest.phone, body: smsTemplate.body })
        }

        // Log communications
        const logs: GuestCommunicationInsert[] = [
          {
            guest_id: guest.id,
            booking_id: booking.id,
            type: 'email',
            direction: 'out',
            subject: emailTemplate.subject,
            content: '[Auto: Pre-arrival reminder]',
            sent_at: new Date().toISOString(),
          },
        ]

        if (guest.phone) {
          logs.push({
            guest_id: guest.id,
            booking_id: booking.id,
            type: 'sms',
            direction: 'out',
            subject: null,
            content: '[Auto: Pre-arrival reminder]',
            sent_at: new Date().toISOString(),
          })
        }

        for (const log of logs) {
          try {
            await createCommunication(log)
          } catch (err) {
            console.error('Failed to log communication:', err)
          }
        }

        if (emailResult.success) {
          results.preArrival.sent++
        } else {
          results.preArrival.failed++
        }
      } catch {
        results.preArrival.failed++
      }
    }

    // CHECK-IN DAY: Send on day of check-in
    if (isSameDay(checkIn, today) && booking.status === 'confirmed') {
      try {
        if (guest.phone) {
          // Placeholder access code - in production, this would come from property details
          const smsTemplate = checkInDaySms(guest, booking, property, '1234#')
          const smsResult = await sendSms({ to: guest.phone, body: smsTemplate.body })

          const log: GuestCommunicationInsert = {
            guest_id: guest.id,
            booking_id: booking.id,
            type: 'sms',
            direction: 'out',
            subject: null,
            content: '[Auto: Check-in day welcome]',
            sent_at: new Date().toISOString(),
          }
          try {
            await createCommunication(log)
          } catch (err) {
            console.error('Failed to log communication:', err)
          }

          if (smsResult.success) {
            results.checkInDay.sent++
          } else {
            results.checkInDay.failed++
          }
        }
      } catch {
        results.checkInDay.failed++
      }
    }

    // CHECKOUT REMINDER: Send morning of checkout
    if (isSameDay(checkOut, today) && booking.status === 'checked_in') {
      try {
        if (guest.phone) {
          const smsTemplate = checkoutReminderSms(guest, booking, property)
          const smsResult = await sendSms({ to: guest.phone, body: smsTemplate.body })

          const log: GuestCommunicationInsert = {
            guest_id: guest.id,
            booking_id: booking.id,
            type: 'sms',
            direction: 'out',
            subject: null,
            content: '[Auto: Checkout reminder]',
            sent_at: new Date().toISOString(),
          }
          try {
            await createCommunication(log)
          } catch (err) {
            console.error('Failed to log communication:', err)
          }

          if (smsResult.success) {
            results.checkoutReminder.sent++
          } else {
            results.checkoutReminder.failed++
          }
        }
      } catch {
        results.checkoutReminder.failed++
      }
    }

    // POST-CHECKOUT: Send day after checkout
    if (
      isSameDay(addDays(checkOut, 1), today) &&
      booking.status === 'checked_out'
    ) {
      try {
        const emailTemplate = postCheckoutEmail(guest, booking, property, portalUrl)
        const emailResult = await sendEmail({
          to: guest.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          text: emailTemplate.text,
        })

        if (guest.phone) {
          const smsTemplate = postCheckoutSms(guest, property)
          await sendSms({ to: guest.phone, body: smsTemplate.body })
        }

        const log: GuestCommunicationInsert = {
          guest_id: guest.id,
          booking_id: booking.id,
          type: 'email',
          direction: 'out',
          subject: emailTemplate.subject,
          content: '[Auto: Post-checkout thank you]',
          sent_at: new Date().toISOString(),
        }
        try {
          await createCommunication(log)
        } catch (err) {
          console.error('Failed to log communication:', err)
        }

        if (emailResult.success) {
          results.postCheckout.sent++
        } else {
          results.postCheckout.failed++
        }
      } catch {
        results.postCheckout.failed++
      }
    }

    // REVIEW REQUEST: Send 3 days after checkout
    if (
      isSameDay(addDays(checkOut, 3), today) &&
      booking.status === 'checked_out'
    ) {
      try {
        const emailTemplate = reviewRequestEmail(guest, booking, property)
        const emailResult = await sendEmail({
          to: guest.email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          text: emailTemplate.text,
        })

        const log: GuestCommunicationInsert = {
          guest_id: guest.id,
          booking_id: booking.id,
          type: 'email',
          direction: 'out',
          subject: emailTemplate.subject,
          content: '[Auto: Review request]',
          sent_at: new Date().toISOString(),
        }
        try {
          await createCommunication(log)
        } catch (err) {
          console.error('Failed to log communication:', err)
        }

        if (emailResult.success) {
          results.reviewRequest.sent++
        } else {
          results.reviewRequest.failed++
        }
      } catch {
        results.reviewRequest.failed++
      }
    }
  }

  return NextResponse.json({
    success: true,
    processedAt: new Date().toISOString(),
    results,
  })
}
