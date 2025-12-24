'use client'

import { useMemo } from 'react'
import {
  format,
  startOfMonth,
  endOfMonth,
  eachMonthOfInterval,
  startOfYear,
  endOfYear,
  differenceInDays,
  isSameMonth,
  max,
  min,
} from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Calendar, TrendingUp } from 'lucide-react'
import type { Property, Booking } from '@/types/database'

interface BookingWithProperty extends Booking {
  properties: Property
}

interface OccupancyStatsProps {
  properties: Property[]
  bookings: BookingWithProperty[]
}

export function OccupancyStats({ properties, bookings }: OccupancyStatsProps) {
  const now = new Date()
  const yearStart = startOfYear(now)
  const yearEnd = endOfYear(now)
  const months = eachMonthOfInterval({ start: yearStart, end: yearEnd })

  const occupancyData = useMemo(() => {
    return properties.map((property) => {
      const propertyBookings = bookings.filter(
        (b) => b.property_id === property.id && b.status !== 'cancelled'
      )

      const monthlyOccupancy = months.map((month) => {
        const monthStart = startOfMonth(month)
        const monthEnd = endOfMonth(month)
        const daysInMonth = differenceInDays(monthEnd, monthStart) + 1

        // Calculate occupied days for this month
        const occupiedDays = propertyBookings.reduce((sum, booking) => {
          const checkIn = new Date(booking.check_in)
          const checkOut = new Date(booking.check_out)

          // Check if booking overlaps with this month
          if (checkOut < monthStart || checkIn > monthEnd) {
            return sum
          }

          // Calculate overlap
          const overlapStart = max([checkIn, monthStart])
          const overlapEnd = min([checkOut, monthEnd])
          const days = differenceInDays(overlapEnd, overlapStart)

          return sum + Math.max(0, days)
        }, 0)

        const rate = Math.round((occupiedDays / daysInMonth) * 100)

        return {
          month: format(month, 'MMM'),
          occupiedDays,
          daysInMonth,
          rate,
        }
      })

      // Calculate yearly average
      const totalDays = monthlyOccupancy.reduce((sum, m) => sum + m.daysInMonth, 0)
      const totalOccupied = monthlyOccupancy.reduce((sum, m) => sum + m.occupiedDays, 0)
      const yearlyRate = Math.round((totalOccupied / totalDays) * 100)

      return {
        property,
        monthlyOccupancy,
        yearlyRate,
        totalBookings: propertyBookings.length,
      }
    })
  }, [properties, bookings, months])

  // Calculate overall occupancy by month
  const overallMonthly = useMemo(() => {
    return months.map((month) => {
      const monthStart = startOfMonth(month)
      const monthEnd = endOfMonth(month)
      const daysInMonth = differenceInDays(monthEnd, monthStart) + 1
      const totalPropertyDays = properties.length * daysInMonth

      const occupiedDays = bookings.reduce((sum, booking) => {
        if (booking.status === 'cancelled') return sum

        const checkIn = new Date(booking.check_in)
        const checkOut = new Date(booking.check_out)

        if (checkOut < monthStart || checkIn > monthEnd) return sum

        const overlapStart = max([checkIn, monthStart])
        const overlapEnd = min([checkOut, monthEnd])
        const days = differenceInDays(overlapEnd, overlapStart)

        return sum + Math.max(0, days)
      }, 0)

      return {
        month: format(month, 'MMM'),
        rate: totalPropertyDays > 0 ? Math.round((occupiedDays / totalPropertyDays) * 100) : 0,
      }
    })
  }, [properties, bookings, months])

  const getOccupancyColor = (rate: number) => {
    if (rate >= 80) return 'bg-green-500'
    if (rate >= 60) return 'bg-emerald-400'
    if (rate >= 40) return 'bg-yellow-400'
    if (rate >= 20) return 'bg-orange-400'
    return 'bg-red-400'
  }

  const getOccupancyBadge = (rate: number) => {
    if (rate >= 80) return 'text-green-600 border-green-200'
    if (rate >= 60) return 'text-emerald-600 border-emerald-200'
    if (rate >= 40) return 'text-yellow-600 border-yellow-200'
    if (rate >= 20) return 'text-orange-600 border-orange-200'
    return 'text-red-600 border-red-200'
  }

  if (properties.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No properties</h3>
          <p className="text-muted-foreground">
            Add properties to see occupancy statistics.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overall Occupancy Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Occupancy by Month ({now.getFullYear()})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2 h-40">
            {overallMonthly.map((data) => (
              <div key={data.month} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-100 rounded-t relative" style={{ height: '120px' }}>
                  <div
                    className={`absolute bottom-0 w-full rounded-t transition-all ${getOccupancyColor(data.rate)}`}
                    style={{ height: `${data.rate}%` }}
                  />
                </div>
                <span className="text-xs mt-1 text-muted-foreground">{data.month}</span>
                <span className="text-xs font-medium">{data.rate}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Property Occupancy Table */}
      <Card>
        <CardHeader>
          <CardTitle>Occupancy by Property</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sticky left-0 bg-background">Property</TableHead>
                  {months.map((month) => (
                    <TableHead key={month.toISOString()} className="text-center min-w-[60px]">
                      {format(month, 'MMM')}
                    </TableHead>
                  ))}
                  <TableHead className="text-center">YTD</TableHead>
                  <TableHead className="text-center">Bookings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {occupancyData.map(({ property, monthlyOccupancy, yearlyRate, totalBookings }) => (
                  <TableRow key={property.id}>
                    <TableCell className="sticky left-0 bg-background font-medium">
                      {property.name}
                    </TableCell>
                    {monthlyOccupancy.map((data, idx) => (
                      <TableCell key={idx} className="text-center p-2">
                        <div
                          className={`h-8 w-full rounded flex items-center justify-center text-xs font-medium text-white ${getOccupancyColor(data.rate)}`}
                        >
                          {data.rate}%
                        </div>
                      </TableCell>
                    ))}
                    <TableCell className="text-center">
                      <Badge variant="outline" className={getOccupancyBadge(yearlyRate)}>
                        <TrendingUp className="mr-1 h-3 w-3" />
                        {yearlyRate}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {totalBookings}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">Occupancy:</span>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-green-500" />
              <span>80%+</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-emerald-400" />
              <span>60-79%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-yellow-400" />
              <span>40-59%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-orange-400" />
              <span>20-39%</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-red-400" />
              <span>&lt;20%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
