'use client'

import { useEffect, useState, useMemo } from 'react'
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar'
import { format, parse, startOfWeek, getDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { createClient } from '@/lib/supabase/client'
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

interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  allDay?: boolean
  resource: {
    type: 'booking' | 'maintenance'
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

      // Add booking events
      if (bookingsData) {
        bookingsData.forEach((booking) => {
          const property = booking.properties
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

  // Filter events based on showMaintenance toggle
  const filteredEvents = useMemo(() => {
    if (showMaintenance) return events
    return events.filter((e) => e.resource.type === 'booking')
  }, [events, showMaintenance])

  // Event styling based on type and property
  const eventStyleGetter = (event: CalendarEvent) => {
    if (event.resource.type === 'maintenance') {
      return {
        style: {
          backgroundColor: '#f3f4f6',
          borderLeft: `3px solid ${propertyColorMap.get(event.resource.propertyId || '') || '#6b7280'}`,
          borderRadius: '4px',
          color: '#374151',
          fontSize: '11px',
        },
      }
    }

    const color = propertyColorMap.get(event.resource.propertyId || '') || '#6b7280'
    return {
      style: {
        backgroundColor: color,
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
      {/* Toggle for maintenance */}
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showMaintenance}
            onChange={(e) => setShowMaintenance(e.target.checked)}
            className="rounded border-gray-300"
          />
          Show maintenance tasks
        </label>
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
        {showMaintenance && (
          <div className="flex items-center gap-2 border-l pl-4">
            <div className="h-3 w-3 rounded bg-gray-200" />
            <span className="text-sm text-muted-foreground">Maintenance</span>
          </div>
        )}
      </div>
    </div>
  )
}
