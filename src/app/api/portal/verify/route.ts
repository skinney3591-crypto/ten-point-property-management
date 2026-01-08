import { NextRequest, NextResponse } from 'next/server'
import { getPortalTokenByToken, getGuestById } from '@/lib/supabase/queries'

export async function POST(request: NextRequest) {
  const { token } = await request.json()

  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 })
  }

  try {
    // Look up the token
    const tokenData = await getPortalTokenByToken(token)

    if (!tokenData) {
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

    // Fetch the guest
    const guest = await getGuestById(tokenData.guest_id)

    return NextResponse.json({
      valid: true,
      guest,
    })
  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify token' },
      { status: 500 }
    )
  }
}
