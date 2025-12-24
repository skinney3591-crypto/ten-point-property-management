import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { guestId } = await request.json()

  if (!guestId) {
    return NextResponse.json({ error: 'Guest ID required' }, { status: 400 })
  }

  // Generate a secure token
  const token = randomBytes(32).toString('hex')

  // Token expires in 30 days
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 30)

  // Delete any existing tokens for this guest
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from('guest_portal_tokens') as any)
    .delete()
    .eq('guest_id', guestId)

  // Create new token
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase.from('guest_portal_tokens') as any)
    .insert({
      guest_id: guestId,
      token,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create portal token:', error)
    return NextResponse.json(
      { error: 'Failed to generate portal link' },
      { status: 500 }
    )
  }

  // Build the portal URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const portalUrl = `${baseUrl}/portal/${token}`

  return NextResponse.json({
    token: data.token,
    url: portalUrl,
    expiresAt: data.expires_at,
  })
}
