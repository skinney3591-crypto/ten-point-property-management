import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { token } = await request.json()

  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 })
  }

  // Look up the token
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: tokenData, error } = await (supabase
    .from('guest_portal_tokens')
    .select('*, guests(*)')
    .eq('token', token)
    .single() as any)

  if (error || !tokenData) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    )
  }

  // Check if token is expired
  if (new Date(tokenData.expires_at) < new Date()) {
    return NextResponse.json(
      { error: 'Token has expired' },
      { status: 401 }
    )
  }

  return NextResponse.json({
    valid: true,
    guest: tokenData.guests,
  })
}
