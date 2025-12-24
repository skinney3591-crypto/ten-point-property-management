import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  parseIcalData,
  fetchIcalData,
  determineBookingSource,
  isBlockedEvent,
} from '@/lib/ical-parser'
import type { Property, BookingInsert } from '@/types/database'

export async function POST(request: Request) {
  try {
    const { propertyId } = await request.json()

    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch the property
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: property, error: propertyError } = (await (supabase
      .from('properties')
      .select('*')
      .eq('id', propertyId)
      .single() as any)) as { data: Property | null; error: Error | null }

    if (propertyError || !property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 })
    }

    // Verify the property belongs to this user
    if (property.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const icalUrls: { url: string; source: 'airbnb' | 'vrbo' | 'other' }[] = []

    if (property.airbnb_ical_url) {
      icalUrls.push({
        url: property.airbnb_ical_url,
        source: 'airbnb',
      })
    }

    if (property.vrbo_ical_url) {
      icalUrls.push({
        url: property.vrbo_ical_url,
        source: 'vrbo',
      })
    }

    if (icalUrls.length === 0) {
      return NextResponse.json({ error: 'No iCal URLs configured' }, { status: 400 })
    }

    let totalImported = 0

    for (const { url, source } of icalUrls) {
      try {
        // Fetch iCal data
        const icalData = await fetchIcalData(url)

        // Parse the data
        const parsedBookings = parseIcalData(icalData)

        for (const parsed of parsedBookings) {
          // Skip blocked/unavailable events (these are just calendar blocks, not real bookings)
          if (isBlockedEvent(parsed.summary)) {
            continue
          }

          // Check if this booking already exists
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: existing } = (await (supabase
            .from('bookings')
            .select('id')
            .eq('property_id', propertyId)
            .eq('external_id', parsed.externalId)
            .single() as any)) as { data: { id: string } | null }

          if (existing) {
            // Booking already exists, skip
            continue
          }

          // Create new booking
          const booking: BookingInsert = {
            property_id: propertyId,
            source,
            check_in: parsed.checkIn.toISOString().split('T')[0],
            check_out: parsed.checkOut.toISOString().split('T')[0],
            external_id: parsed.externalId,
            notes: parsed.summary !== 'Reserved' ? parsed.summary : null,
            status: 'confirmed',
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { error: insertError } = await (supabase.from('bookings') as any).insert(booking)

          if (!insertError) {
            totalImported++
          } else {
            console.error('Failed to insert booking:', insertError)
          }
        }
      } catch (error) {
        console.error(`Failed to sync ${source}:`, error)
        // Continue with other sources even if one fails
      }
    }

    return NextResponse.json({
      success: true,
      imported: totalImported,
    })
  } catch (error) {
    console.error('iCal sync error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
