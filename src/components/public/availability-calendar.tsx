'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Booking {
  check_in: string
  check_out: string
}

interface AvailabilityCalendarProps {
  bookings: Booking[]
}

export function AvailabilityCalendar({ bookings }: AvailabilityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startingDay = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const isDateBooked = (day: number) => {
    const date = new Date(year, month, day)
    const dateStr = date.toISOString().split('T')[0]

    return bookings.some((booking) => {
      const checkIn = new Date(booking.check_in)
      const checkOut = new Date(booking.check_out)
      return date >= checkIn && date < checkOut
    })
  }

  const isPastDate = (day: number) => {
    const date = new Date(year, month, day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const days = []
  for (let i = 0; i < startingDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-10" />)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const booked = isDateBooked(day)
    const past = isPastDate(day)

    days.push(
      <div
        key={day}
        className={`h-10 flex items-center justify-center text-sm rounded ${
          past
            ? 'text-slate-300'
            : booked
            ? 'bg-red-100 text-red-700'
            : 'bg-emerald-50 text-emerald-700'
        }`}
      >
        {day}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={prevMonth} aria-label="Previous month">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-semibold">
          {monthNames[month]} {year}
        </span>
        <Button variant="ghost" size="sm" onClick={nextMonth} aria-label="Next month">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="h-8 flex items-center justify-center text-xs font-medium text-slate-500">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">{days}</div>

      <div className="flex items-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-emerald-50 border border-emerald-200" />
          <span className="text-slate-600">Available</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-100 border border-red-200" />
          <span className="text-slate-600">Booked</span>
        </div>
      </div>
    </div>
  )
}
