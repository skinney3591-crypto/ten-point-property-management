import ICAL from 'ical.js'

export interface ParsedBooking {
  externalId: string
  summary: string
  checkIn: Date
  checkOut: Date
  description?: string
}

export function parseIcalData(icalData: string): ParsedBooking[] {
  const bookings: ParsedBooking[] = []

  try {
    const jcalData = ICAL.parse(icalData)
    const vcalendar = new ICAL.Component(jcalData)
    const vevents = vcalendar.getAllSubcomponents('vevent')

    for (const vevent of vevents) {
      const event = new ICAL.Event(vevent)

      // Skip if no start/end dates
      if (!event.startDate || !event.endDate) {
        continue
      }

      // Get the UID which we'll use as external_id
      const uid = event.uid || `${event.startDate.toString()}-${event.summary}`

      bookings.push({
        externalId: uid,
        summary: event.summary || 'Blocked',
        checkIn: event.startDate.toJSDate(),
        checkOut: event.endDate.toJSDate(),
        description: event.description || undefined,
      })
    }
  } catch (error) {
    console.error('Failed to parse iCal data:', error)
    throw new Error('Invalid iCal data')
  }

  return bookings
}

export async function fetchIcalData(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'TenPointPM/1.0',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch iCal: ${response.status}`)
    }

    return await response.text()
  } catch (error) {
    console.error('Failed to fetch iCal URL:', error)
    throw new Error('Failed to fetch calendar data')
  }
}

export function determineBookingSource(url: string): 'airbnb' | 'vrbo' | 'other' {
  const lowerUrl = url.toLowerCase()
  if (lowerUrl.includes('airbnb')) {
    return 'airbnb'
  }
  if (lowerUrl.includes('vrbo') || lowerUrl.includes('homeaway')) {
    return 'vrbo'
  }
  return 'other'
}

export function isBlockedEvent(summary: string): boolean {
  const blockedTerms = [
    'blocked',
    'not available',
    'unavailable',
    'reserved',
    'airbnb (not available)',
  ]
  const lowerSummary = summary.toLowerCase()
  return blockedTerms.some((term) => lowerSummary.includes(term))
}
