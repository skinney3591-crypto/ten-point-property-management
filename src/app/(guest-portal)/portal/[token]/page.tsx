import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format, differenceInDays, isFuture, isPast } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Home,
  Clock,
  MapPin,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import type { Guest, Booking, Property } from '@/types/database'

interface BookingWithProperty extends Booking {
  properties: Property
}

export default async function PortalHomePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const supabase = await createClient()

  // Get guest from token
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: tokenData } = await (supabase
    .from('guest_portal_tokens')
    .select('*, guests(*)')
    .eq('token', token)
    .single() as any) as { data: { guests: Guest } | null }

  if (!tokenData) {
    notFound()
  }

  const guest = tokenData.guests

  // Get guest's bookings
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: bookings } = await (supabase
    .from('bookings')
    .select('*, properties(*)')
    .eq('guest_id', guest.id)
    .neq('status', 'cancelled')
    .order('check_in', { ascending: false }) as any) as {
    data: BookingWithProperty[] | null
  }

  // Categorize bookings
  const now = new Date()
  const upcomingBookings = bookings?.filter((b) => isFuture(new Date(b.check_in))) || []
  const currentBooking = bookings?.find(
    (b) =>
      isPast(new Date(b.check_in)) &&
      isFuture(new Date(b.check_out)) &&
      b.status === 'checked_in'
  )
  const pastBookings = bookings?.filter((b) => isPast(new Date(b.check_out))) || []

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold">Welcome, {guest.name.split(' ')[0]}!</h1>
        <p className="text-muted-foreground">
          View your stays and property information below.
        </p>
      </div>

      {/* Current Stay */}
      {currentBooking && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-green-600" />
              <CardTitle className="text-green-800">Current Stay</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  {currentBooking.properties.name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {currentBooking.properties.address}
                </div>
                <div className="mt-2 flex items-center gap-4 text-sm">
                  <span>
                    Check-out:{' '}
                    <strong>
                      {format(new Date(currentBooking.check_out), 'MMM d, yyyy')}
                    </strong>
                  </span>
                  <Badge variant="outline" className="text-green-600 border-green-300">
                    {differenceInDays(new Date(currentBooking.check_out), now)} days left
                  </Badge>
                </div>
              </div>
              <Link href={`/portal/${token}/stays/${currentBooking.id}`}>
                <Button>
                  View Details
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Stays */}
      {upcomingBookings.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Stays
          </h2>
          <div className="space-y-4">
            {upcomingBookings.map((booking) => {
              const daysUntil = differenceInDays(new Date(booking.check_in), now)
              return (
                <Card key={booking.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4 text-muted-foreground" />
                          <h3 className="font-semibold">
                            {booking.properties.name}
                          </h3>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {format(new Date(booking.check_in), 'MMM d')} -{' '}
                          {format(new Date(booking.check_out), 'MMM d, yyyy')}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge>
                          {daysUntil === 0
                            ? 'Today!'
                            : daysUntil === 1
                            ? 'Tomorrow'
                            : `In ${daysUntil} days`}
                        </Badge>
                        <Link href={`/portal/${token}/stays/${booking.id}`}>
                          <Button variant="outline" size="sm">
                            View
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Past Stays */}
      {pastBookings.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Past Stays
          </h2>
          <div className="space-y-3">
            {pastBookings.slice(0, 5).map((booking) => (
              <Card key={booking.id} className="bg-gray-50">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{booking.properties.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(booking.check_in), 'MMM d')} -{' '}
                        {format(new Date(booking.check_out), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <Link href={`/portal/${token}/stays/${booking.id}`}>
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Bookings */}
      {!currentBooking && upcomingBookings.length === 0 && pastBookings.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No stays yet</h3>
            <p className="text-muted-foreground">
              Your booking information will appear here.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Need something?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href={`/portal/${token}/rebook`}>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Request a New Booking
              </Button>
            </Link>
            <Link href={`/portal/${token}/contact`}>
              <Button variant="outline" className="w-full justify-start">
                <Home className="mr-2 h-4 w-4" />
                Contact Property Manager
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
