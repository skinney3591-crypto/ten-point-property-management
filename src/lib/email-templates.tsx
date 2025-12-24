import { format } from 'date-fns'
import type { Booking, Property, Guest } from '@/types/database'

// Base email wrapper
function emailWrapper(content: string, previewText?: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${previewText ? `<meta name="x-apple-disable-message-reformatting">` : ''}
  <title>Ten Point Properties</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: #1a1a1a; color: white; padding: 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 32px 24px; }
    .footer { background: #f9f9f9; padding: 24px; text-align: center; font-size: 12px; color: #666; }
    .button { display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; }
    .info-box { background: #f0f9ff; border-left: 4px solid #2563eb; padding: 16px; margin: 16px 0; }
    .detail-row { display: flex; padding: 8px 0; border-bottom: 1px solid #eee; }
    .detail-label { color: #666; width: 120px; }
    .detail-value { font-weight: 500; }
    h2 { color: #1a1a1a; margin-top: 0; }
    p { margin: 0 0 16px 0; }
  </style>
</head>
<body>
  ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;">${previewText}</div>` : ''}
  <div class="container">
    <div class="header">
      <h1>Ten Point Properties</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>Ten Point Properties</p>
      <p>Questions? Reply to this email or call (555) 123-4567</p>
    </div>
  </div>
</body>
</html>`
}

// Booking Confirmation Email
export function bookingConfirmationEmail(
  guest: Guest,
  booking: Booking,
  property: Property,
  portalUrl?: string
) {
  const checkIn = new Date(booking.check_in)
  const checkOut = new Date(booking.check_out)
  const nights = Math.ceil(
    (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)
  )

  const content = `
    <h2>Booking Confirmed! 🎉</h2>
    <p>Hi ${guest.name.split(' ')[0]},</p>
    <p>Great news! Your reservation at <strong>${property.name}</strong> is confirmed.</p>

    <div class="info-box">
      <h3 style="margin-top:0;">Reservation Details</h3>
      <div class="detail-row">
        <span class="detail-label">Property</span>
        <span class="detail-value">${property.name}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Address</span>
        <span class="detail-value">${property.address}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Check-in</span>
        <span class="detail-value">${format(checkIn, 'EEEE, MMMM d, yyyy')} at ${property.check_in_time || '3:00 PM'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Check-out</span>
        <span class="detail-value">${format(checkOut, 'EEEE, MMMM d, yyyy')} at ${property.check_out_time || '11:00 AM'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Duration</span>
        <span class="detail-value">${nights} night${nights > 1 ? 's' : ''}</span>
      </div>
      ${booking.total_amount ? `
      <div class="detail-row" style="border-bottom:none;">
        <span class="detail-label">Total</span>
        <span class="detail-value">$${booking.total_amount.toLocaleString()}</span>
      </div>
      ` : ''}
    </div>

    ${portalUrl ? `
    <p style="text-align:center;margin:32px 0;">
      <a href="${portalUrl}" class="button">View Your Reservation</a>
    </p>
    <p style="text-align:center;font-size:14px;color:#666;">
      Access check-in instructions, property details, and more in your guest portal.
    </p>
    ` : ''}

    <p>We're looking forward to hosting you!</p>
    <p>Best regards,<br>The Ten Point Properties Team</p>
  `

  return {
    subject: `Booking Confirmed: ${property.name} - ${format(checkIn, 'MMM d-')}${format(checkOut, 'd, yyyy')}`,
    html: emailWrapper(content, `Your stay at ${property.name} is confirmed!`),
    text: `Booking Confirmed!\n\nHi ${guest.name.split(' ')[0]},\n\nYour reservation at ${property.name} is confirmed.\n\nCheck-in: ${format(checkIn, 'MMMM d, yyyy')} at ${property.check_in_time || '3:00 PM'}\nCheck-out: ${format(checkOut, 'MMMM d, yyyy')} at ${property.check_out_time || '11:00 AM'}\nAddress: ${property.address}\n\nWe look forward to hosting you!`,
  }
}

// Pre-Arrival Email (sent 1-2 days before check-in)
export function preArrivalEmail(
  guest: Guest,
  booking: Booking,
  property: Property,
  portalUrl?: string
) {
  const checkIn = new Date(booking.check_in)

  const content = `
    <h2>Your Stay is Almost Here! 🏠</h2>
    <p>Hi ${guest.name.split(' ')[0]},</p>
    <p>We're excited to welcome you to <strong>${property.name}</strong> tomorrow!</p>

    <div class="info-box">
      <h3 style="margin-top:0;">Check-in Details</h3>
      <p><strong>Date:</strong> ${format(checkIn, 'EEEE, MMMM d, yyyy')}</p>
      <p><strong>Time:</strong> ${property.check_in_time || '3:00 PM'} or later</p>
      <p><strong>Address:</strong> ${property.address}</p>
    </div>

    ${portalUrl ? `
    <p style="text-align:center;margin:32px 0;">
      <a href="${portalUrl}" class="button">View Check-in Instructions</a>
    </p>
    <p style="text-align:center;font-size:14px;color:#666;">
      Access your door code, WiFi info, parking instructions, and more.
    </p>
    ` : ''}

    <h3>Before You Arrive</h3>
    <ul>
      <li>Check-in instructions and door code are in your guest portal</li>
      <li>Free parking is available at the property</li>
      <li>Contact us if you have any questions or need late check-in</li>
    </ul>

    <p>Safe travels, and we'll see you soon!</p>
    <p>Best regards,<br>The Ten Point Properties Team</p>
  `

  return {
    subject: `Check-in Tomorrow: ${property.name}`,
    html: emailWrapper(content, `Your stay at ${property.name} starts tomorrow!`),
    text: `Your Stay is Almost Here!\n\nHi ${guest.name.split(' ')[0]},\n\nWe're excited to welcome you to ${property.name} tomorrow!\n\nCheck-in: ${format(checkIn, 'MMMM d, yyyy')} at ${property.check_in_time || '3:00 PM'}\nAddress: ${property.address}\n\nCheck-in instructions and door code are available in your guest portal.\n\nSafe travels!`,
  }
}

// Post-Checkout Email
export function postCheckoutEmail(
  guest: Guest,
  booking: Booking,
  property: Property,
  rebookUrl?: string
) {
  const checkOut = new Date(booking.check_out)

  const content = `
    <h2>Thank You for Staying With Us! ⭐</h2>
    <p>Hi ${guest.name.split(' ')[0]},</p>
    <p>We hope you had a wonderful stay at <strong>${property.name}</strong>!</p>

    <p>Your feedback helps us improve and helps future guests make informed decisions. If you have a moment, we'd love to hear about your experience.</p>

    <div class="info-box">
      <p><strong>How was your stay?</strong></p>
      <p>Reply to this email with any feedback, suggestions, or comments. We read every message!</p>
    </div>

    ${rebookUrl ? `
    <h3>Ready for Your Next Getaway?</h3>
    <p>As a returning guest, you can request a direct booking for your next visit.</p>
    <p style="text-align:center;margin:24px 0;">
      <a href="${rebookUrl}" class="button">Book Again</a>
    </p>
    ` : ''}

    <p>Thank you for choosing Ten Point Properties. We hope to host you again soon!</p>
    <p>Best regards,<br>The Ten Point Properties Team</p>
  `

  return {
    subject: `Thanks for Staying at ${property.name}!`,
    html: emailWrapper(content, `We hope you enjoyed your stay at ${property.name}!`),
    text: `Thank You for Staying With Us!\n\nHi ${guest.name.split(' ')[0]},\n\nWe hope you had a wonderful stay at ${property.name}!\n\nYour feedback helps us improve. Reply to this email with any comments or suggestions.\n\nThank you for choosing Ten Point Properties!`,
  }
}

// Review Request Email
export function reviewRequestEmail(
  guest: Guest,
  booking: Booking,
  property: Property
) {
  const content = `
    <h2>Share Your Experience ⭐</h2>
    <p>Hi ${guest.name.split(' ')[0]},</p>
    <p>We hope you enjoyed your recent stay at <strong>${property.name}</strong>!</p>

    <p>Your review helps other travelers and helps us continue to improve. Would you take a moment to share your experience?</p>

    <div class="info-box">
      <p style="margin:0;"><strong>Quick Feedback:</strong> Reply to this email with a rating (1-5 stars) and a short review of your stay.</p>
    </div>

    <p>Thank you for taking the time to share your thoughts!</p>
    <p>Best regards,<br>The Ten Point Properties Team</p>
  `

  return {
    subject: `How was your stay at ${property.name}?`,
    html: emailWrapper(content, `We'd love to hear about your stay at ${property.name}`),
    text: `Share Your Experience\n\nHi ${guest.name.split(' ')[0]},\n\nWe hope you enjoyed your stay at ${property.name}!\n\nYour review helps other travelers. Reply to this email with a rating (1-5 stars) and your thoughts.\n\nThank you!`,
  }
}

// Portal Link Email
export function portalLinkEmail(guest: Guest, portalUrl: string) {
  const content = `
    <h2>Your Guest Portal Access</h2>
    <p>Hi ${guest.name.split(' ')[0]},</p>
    <p>Here's your secure link to access your Ten Point Properties guest portal:</p>

    <p style="text-align:center;margin:32px 0;">
      <a href="${portalUrl}" class="button">Access Guest Portal</a>
    </p>

    <p>In your portal, you can:</p>
    <ul>
      <li>View your upcoming and past stays</li>
      <li>Access check-in instructions and door codes</li>
      <li>See property details and house rules</li>
      <li>Request new bookings</li>
      <li>Contact us directly</li>
    </ul>

    <div class="info-box">
      <p style="margin:0;"><strong>Note:</strong> This link is valid for 30 days. You can request a new link at any time.</p>
    </div>

    <p>Best regards,<br>The Ten Point Properties Team</p>
  `

  return {
    subject: 'Your Ten Point Properties Guest Portal',
    html: emailWrapper(content, 'Access your guest portal to view stays and check-in info'),
    text: `Your Guest Portal Access\n\nHi ${guest.name.split(' ')[0]},\n\nAccess your guest portal here: ${portalUrl}\n\nThis link is valid for 30 days.\n\nBest regards,\nThe Ten Point Properties Team`,
  }
}

// Custom Message Email
export function customMessageEmail(
  guest: Guest,
  subject: string,
  message: string
) {
  const content = `
    <p>Hi ${guest.name.split(' ')[0]},</p>
    <div style="white-space: pre-wrap;">${message}</div>
    <p style="margin-top: 24px;">Best regards,<br>The Ten Point Properties Team</p>
  `

  return {
    subject,
    html: emailWrapper(content),
    text: `Hi ${guest.name.split(' ')[0]},\n\n${message}\n\nBest regards,\nThe Ten Point Properties Team`,
  }
}
