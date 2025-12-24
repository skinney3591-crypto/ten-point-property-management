import twilio from 'twilio'

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const fromPhone = process.env.TWILIO_PHONE_NUMBER

// Only create client if credentials are available
const client = accountSid && authToken ? twilio(accountSid, authToken) : null

export interface SendSmsOptions {
  to: string
  body: string
}

export async function sendSms(options: SendSmsOptions) {
  // Check if Twilio is configured
  if (!client || !fromPhone) {
    console.log('[SMS] Twilio not configured, skipping SMS send')
    console.log('[SMS] Would have sent:', {
      to: options.to,
      body: options.body.substring(0, 50) + '...',
    })
    return { success: false, error: 'Twilio not configured' }
  }

  try {
    // Format phone number (ensure it starts with +1 for US)
    let formattedPhone = options.to.replace(/\D/g, '')
    if (formattedPhone.length === 10) {
      formattedPhone = `+1${formattedPhone}`
    } else if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+${formattedPhone}`
    }

    const message = await client.messages.create({
      body: options.body,
      from: fromPhone,
      to: formattedPhone,
    })

    console.log('[SMS] Sent successfully:', message.sid)
    return { success: true, sid: message.sid }
  } catch (error) {
    console.error('[SMS] Error:', error)
    return { success: false, error: 'Failed to send SMS' }
  }
}

// Send bulk SMS (one at a time due to Twilio limitations)
export async function sendBulkSms(
  messages: Array<{ to: string; body: string }>
) {
  const results = await Promise.all(
    messages.map((msg) => sendSms(msg))
  )

  const successful = results.filter((r) => r.success).length
  const failed = results.filter((r) => !r.success).length

  return {
    success: failed === 0,
    sent: successful,
    failed,
    results,
  }
}
