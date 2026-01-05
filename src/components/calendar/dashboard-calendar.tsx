'use client'

import { useEffect, useState, useMemo } from 'react'
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { LogIn, LogOut, Wrench, CalendarDays } from 'lucide-react'
import type { Booking, Property, MaintenanceTask } from '@/types/database'
import 'react-big-calendar/lib/css/react-big-calendar.css'

const locales = {
  'en-US': enUS,
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

type EventType = 'booking' | 'check-in' | 'check-out' | 'maintenance'

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  allDay?: boolean
  resource: {
    type: EventType
    propertyId?: string
    data: Booking | MaintenanceTask
  }
}

// Property colors for visual distinction
const propertyColors = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#8b5cf6', // purple
  '#f59e0b', // amber
  '#ef4444', // red
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#84cc16', // lime
]

// Maintenance type icons
const maintenanceIcons: Record<string, string> = {
  cleaning: '🧹',
  landscaping: '🌿',
  pool: '🏊',
  repair: '🔧',
  other: '📋',
}

export function DashboardCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [showBookings, setShowBookings] = useState(true)
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [showCheckOut, setShowCheckOut] = useState(false)
  const [showMaintenance, setShowMaintenance] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      // Fetch properties
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: propertiesData } = await (supabase
        .from('properties')
        .select('*')
        .order('name') as any) as { data: Property[] | null }

      if (propertiesData) {
        setProperties(propertiesData)
      }

      // Fetch bookings with property info
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: bookingsData } = await (supabase
        .from('bookings')
        .select('*, properties(*)')
        .neq('status', 'cancelled')
        .order('check_in') as any) as { data: (Booking & { properties: Property })[] | null }

      // Fetch maintenance tasks
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: maintenanceData } = await (supabase
        .from('maintenance_tasks')
        .select('*, properties(*)')
        .is('completed_date', null)
        .order('scheduled_date') as any) as { data: (MaintenanceTask & { properties: Property })[] | null }

      const allEvents: CalendarEvent[] = []

      // Add booking events (booking spans, check-ins, and check-outs)
      if (bookingsData) {
        bookingsData.forEach((booking) => {
          const property = booking.properties

          // Booking span (full duration)
          allEvents.push({
            id: `booking-${booking.id}`,
            title: `${property?.name || 'Unknown'} - ${booking.source}`,
            start: new Date(booking.check_in),
            end: new Date(booking.check_out),
            resource: {
              type: 'booking',
              propertyId: property?.id,
              data: booking,
            },
          })

          // Check-in marker
          allEvents.push({
            id: `checkin-${booking.id}`,
            title: `↓ Check-in: ${property?.name || 'Unknown'}`,
            start: new Date(booking.check_in),
            end: new Date(booking.check_in),
            allDay: true,
            resource: {
              type: 'check-in',
              propertyId: property?.id,
              data: booking,
            },
          })

          // Check-out marker
          allEvents.push({
            id: `checkout-${booking.id}`,
            title: `↑ Check-out: ${property?.name || 'Unknown'}`,
            start: new Date(booking.check_out),
            end: new Date(booking.check_out),
            allDay: true,
            resource: {
              type: 'check-out',
              propertyId: property?.id,
              data: booking,
            },
          })
        })
      }

      // Add maintenance events
      if (maintenanceData) {
        maintenanceData.forEach((task) => {
          const property = task.properties as Property
          const icon = maintenanceIcons[task.type] || '📋'
          allEvents.push({
            id: `maintenance-${task.id}`,
            title: `${icon} ${task.title}`,
            start: new Date(task.scheduled_date),
            end: new Date(task.scheduled_date),
            allDay: true,
            resource: {
              type: 'maintenance',
              propertyId: property?.id,
              data: task,
            },
          })
        })
      }

      setEvents(allEvents)
      setLoading(false)
    }

    fetchData()
  }, [supabase])

  // Create color map for properties
  const propertyColorMap = useMemo(() => {
    const map = new Map<string, string>()
    properties.forEach((property, index) => {
      map.set(property.id, propertyColors[index % propertyColors.length])
    })
    return map
  }, [properties])

  // Filter events based on toggles
  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      switch (e.resource.type) {
        case 'booking':
          return showBookings
        case 'check-in':
          return showCheckIn
        case 'check-out':
          return showCheckOut
        case 'maintenance':
          return showMaintenance
        default:
          return true
      }
    })
  }, [events, showBookings, showCheckIn, showCheckOut, showMaintenance])

  // Event styling based on type and property
  const eventStyleGetter = (event: CalendarEvent) => {
    const propertyColor = propertyColorMap.get(event.resource.propertyId || '') || '#6b7280'

    if (event.resource.type === 'maintenance') {
      return {
        style: {
          backgroundColor: '#fef3c7',
          borderLeft: `3px solid #f59e0b`,
          borderRadius: '4px',
          color: '#92400e',
          fontSize: '11px',
        },
      }
    }

    if (event.resource.type === 'check-in') {
      return {
        style: {
          backgroundColor: '#dcfce7',
          borderLeft: `3px solid #22c55e`,
          borderRadius: '4px',
          color: '#166534',
          fontSize: '11px',
          fontWeight: '500',
        },
      }
    }

    if (event.resource.type === 'check-out') {
      return {
        style: {
          backgroundColor: '#fee2e2',
          borderLeft: `3px solid #ef4444`,
          borderRadius: '4px',
          color: '#991b1b',
          fontSize: '11px',
          fontWeight: '500',
        },
      }
    }

    // Booking span
    return {
      style: {
        backgroundColor: propertyColor,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: 'none',
        fontSize: '12px',
      },
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-muted-foreground">Loading calendar...</div>
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="flex h-96 flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">No properties yet.</p>
        <p className="text-sm text-muted-foreground">
          Add your first property to see bookings on the calendar.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filter toggles */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground mr-2">Show:</span>
        <Button
          variant={showBookings ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowBookings(!showBookings)}
          className={showBookings ? 'bg-blue-600 hover:bg-blue-700' : ''}
        >
          <CalendarDays className="h-4 w-4 mr-1" />
          Stays
        </Button>
        <Button
          variant={showCheckIn ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowCheckIn(!showCheckIn)}
          className={showCheckIn ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          <LogIn className="h-4 w-4 mr-1" />
          Check-ins
        </Button>
        <Button
          variant={showCheckOut ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowCheckOut(!showCheckOut)}
          className={showCheckOut ? 'bg-red-500 hover:bg-red-600' : ''}
        >
          <LogOut className="h-4 w-4 mr-1" />
          Check-outs
        </Button>
        <Button
          variant={showMaintenance ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowMaintenance(!showMaintenance)}
          className={showMaintenance ? 'bg-amber-500 hover:bg-amber-600' : ''}
        >
          <Wrench className="h-4 w-4 mr-1" />
          Maintenance
        </Button>
      </div>

      <div className="h-[600px]">
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          defaultView={Views.MONTH}
          views={[Views.MONTH, Views.WEEK, Views.DAY]}
          eventPropGetter={eventStyleGetter}
          popup
          selectable
          onSelectEvent={(event) => {
            console.log('Selected event:', event)
          }}
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-6">
        {/* Property colors - only show if stays are visible */}
        {showBookings && (
          <div className="flex flex-wrap gap-4">
            {properties.map((property, index) => (
              <div key={property.id} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded"
                  style={{
                    backgroundColor: propertyColors[index % propertyColors.length],
                  }}
                />
                <span className="text-sm text-muted-foreground">{property.name}</span>
              </div>
            ))}
          </div>
        )}
        {/* Event type legend */}
        <div className="flex items-center gap-4 border-l pl-4">
          {showCheckIn && (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-green-200 border-l-2 border-green-500" />
              <span className="text-sm text-muted-foreground">Check-in</span>
            </div>
          )}
          {showCheckOut && (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-red-200 border-l-2 border-red-500" />
              <span className="text-sm text-muted-foreground">Check-out</span>
            </div>
          )}
          {showMaintenance && (
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-amber-200 border-l-2 border-amber-500" />
              <span className="text-sm text-muted-foreground">Maintenance</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
