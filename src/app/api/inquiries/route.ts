import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { property_id, name, email, phone, check_in, check_out, guests, message } = body

    if (!property_id || !name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Verify the property exists and is public
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('id, name')
      .eq('id', property_id)
      .eq('is_public', true)
      .single()

    if (propertyError || !property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      )
    }

    // Insert the inquiry
    const { data: inquiry, error: insertError } = await (supabase
      .from('inquiries') as any)
      .insert({
        property_id,
        name,
        email,
        phone: phone || null,
        check_in: check_in || null,
        check_out: check_out || null,
        guests: guests || null,
        message,
        status: 'new',
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting inquiry:', insertError)
      return NextResponse.json(
        { error: 'Failed to submit inquiry' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, inquiry })
  } catch (error) {
    console.error('Inquiry API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
