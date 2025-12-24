import { Resend } from 'resend'

// Lazy initialize Resend client
let resend: Resend | null = null

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null
  }
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

// Default from address
const FROM_EMAIL = process.env.FROM_EMAIL || 'Ten Point Properties <noreply@tenpoint.com>'

export interface SendEmailOptions {
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
}

export async function sendEmail(options: SendEmailOptions) {
  // Check if Resend is configured
  const client = getResendClient()
  if (!client) {
    console.log('[Email] Resend not configured, skipping email send')
    console.log('[Email] Would have sent:', {
      to: options.to,
      subject: options.subject,
    })
    return { success: false, error: 'Resend not configured' }
  }

  try {
    const { data, error } = await client.emails.send({
      from: FROM_EMAIL,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    })

    if (error) {
      console.error('[Email] Failed to send:', error)
      return { success: false, error: error.message }
    }

    console.log('[Email] Sent successfully:', data?.id)
    return { success: true, id: data?.id }
  } catch (error) {
    console.error('[Email] Error:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

// Batch send emails
export async function sendBatchEmails(
  emails: Array<{
    to: string
    subject: string
    html: string
  }>
) {
  const client = getResendClient()
  if (!client) {
    console.log('[Email] Resend not configured, skipping batch send')
    return { success: false, error: 'Resend not configured' }
  }

  try {
    const { data, error } = await client.batch.send(
      emails.map((email) => ({
        from: FROM_EMAIL,
        to: email.to,
        subject: email.subject,
        html: email.html,
      }))
    )

    if (error) {
      console.error('[Email] Batch send failed:', error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error('[Email] Batch error:', error)
    return { success: false, error: 'Failed to send batch emails' }
  }
}
