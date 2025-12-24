import { format } from 'date-fns'
import type { Booking, Property, Guest } from '@/types/database'

// Booking Confirmation SMS
export function bookingConfirmationSms(
  guest: Guest,
  booking: Booking,
  property: Property
) {
  const checkIn = new Date(booking.check_in)
  const checkOut = new Date(booking.check_out)

  return {
    body: `Hi ${guest.name.split(' ')[0]}! Your booking at ${property.name} is confirmed for ${format(checkIn, 'MMM d')}-${format(checkOut, 'd')}. Check-in at ${property.check_in_time || '3:00 PM'}. We'll send check-in details closer to your arrival. - Ten Point Properties`,
  }
}

// Pre-Arrival SMS (day before)
export function preArrivalSms(
  guest: Guest,
  booking: Booking,
  property: Property,
  portalUrl?: string
) {
  const checkIn = new Date(booking.check_in)

  const baseMessage = `Hi ${guest.name.split(' ')[0]}! Your stay at ${property.name} starts tomorrow. Check-in: ${property.check_in_time || '3:00 PM'}. Address: ${property.address}.`

  if (portalUrl) {
    return {
      body: `${baseMessage} View check-in instructions: ${portalUrl}`,
    }
  }

  return {
    body: `${baseMessage} Reply HELP if you need anything! - Ten Point Properties`,
  }
}

// Check-in Day SMS
export function checkInDaySms(
  guest: Guest,
  booking: Booking,
  property: Property,
  accessCode?: string
) {
  const accessInfo = accessCode
    ? `Your door code: ${accessCode}.`
    : 'Check your email for door code.'

  return {
    body: `Welcome to ${property.name}! 🏠 ${accessInfo} Address: ${property.address}. Check-in: ${property.check_in_time || '3:00 PM'}. Text us if you need anything!`,
  }
}

// Check-out Reminder SMS (morning of checkout)
export function checkoutReminderSms(
  guest: Guest,
  booking: Booking,
  property: Property
) {
  return {
    body: `Hi ${guest.name.split(' ')[0]}! Quick reminder: checkout is at ${property.check_out_time || '11:00 AM'} today. Please leave keys inside and lock the door. Thank you for staying with us! ⭐ - Ten Point Properties`,
  }
}

// Post-Checkout SMS
export function postCheckoutSms(guest: Guest, property: Property) {
  return {
    body: `Thanks for staying at ${property.name}! 🙏 We hope you had a great time. Reply with any feedback - we'd love to hear from you! - Ten Point Properties`,
  }
}

// Portal Link SMS
export function portalLinkSms(guest: Guest, portalUrl: string) {
  return {
    body: `Hi ${guest.name.split(' ')[0]}! Here's your Ten Point Properties guest portal link: ${portalUrl} - View stays, check-in info & more.`,
  }
}

// Custom SMS
export function customSms(guest: Guest, message: string) {
  return {
    body: `Hi ${guest.name.split(' ')[0]}, ${message} - Ten Point Properties`,
  }
}

// Maintenance Notification SMS
export function maintenanceNotificationSms(
  guest: Guest,
  property: Property,
  maintenanceInfo: string
) {
  return {
    body: `Hi ${guest.name.split(' ')[0]}, heads up: ${maintenanceInfo} at ${property.name}. We apologize for any inconvenience. Questions? Reply to this message. - Ten Point Properties`,
  }
}
