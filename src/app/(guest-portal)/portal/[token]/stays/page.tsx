import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format, isFuture, isPast } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Calendar,
  Home,
  Clock,
  MapPin,
  ChevronRight,
} from 'lucide-react'
import type { Guest, Booking, Property } from '@/types/database'

interface BookingWithProperty extends Booking {
  properties: Property
}

export default async function PortalStaysPage({
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

  // Get all bookings
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: bookings } = await (supabase
    .from('bookings')
    .select('*, properties(*)')
    .eq('guest_id', guest.id)
    .neq('status', 'cancelled')
    .order('check_in', { ascending: false }) as any) as {
    data: BookingWithProperty[] | null
  }

  const upcomingBookings =
    bookings?.filter((b) => isFuture(new Date(b.check_in))) || []
  const currentBookings =
    bookings?.filter(
      (b) =>
        isPast(new Date(b.check_in)) &&
        isFuture(new Date(b.check_out))
    ) || []
  const pastBookings =
    bookings?.filter((b) => isPast(new Date(b.check_out))) || []

  const getStatusBadge = (booking: Booking) => {
    if (booking.status === 'checked_in') {
      return <Badge className="bg-green-500">Checked In</Badge>
    }
    if (isFuture(new Date(booking.check_in))) {
      return <Badge>Upcoming</Badge>
    }
    return <Badge variant="secondary">Completed</Badge>
  }

  const BookingCard = ({ booking }: { booking: BookingWithProperty }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">{booking.properties.name}</h3>
              {getStatusBadge(booking)}
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {booking.properties.address}
            </div>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              {format(new Date(booking.check_in), 'MMM d, yyyy')} -{' '}
              {format(new Date(booking.check_out), 'MMM d, yyyy')}
            </div>
          </div>
          <Link href={`/portal/${token}/stays/${booking.id}`}>
            <Button variant="outline">
              View Details
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Stays</h1>
        <p className="text-muted-foreground">
          View all your bookings and stay details
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingBookings.length + currentBookings.length})
          </TabsTrigger>
          <TabsTrigger value="past">Past ({pastBookings.length})</TabsTrigger>
          <TabsTrigger value="all">All ({bookings?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6 space-y-4">
          {currentBookings.length > 0 && (
            <div>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                Current Stay
              </h3>
              {currentBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}

          {upcomingBookings.length > 0 ? (
            <div>
              <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                Upcoming
              </h3>
              <div className="space-y-4">
                {upcomingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            </div>
          ) : (
            currentBookings.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">
                    No upcoming stays
                  </h3>
                  <p className="text-muted-foreground">
                    Ready to book your next getaway?
                  </p>
                  <Link href={`/portal/${token}/rebook`} className="mt-4">
                    <Button>Request a Booking</Button>
                  </Link>
                </CardContent>
              </Card>
            )
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6 space-y-4">
          {pastBookings.length > 0 ? (
            pastBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No past stays</h3>
                <p className="text-muted-foreground">
                  Your completed stays will appear here.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-6 space-y-4">
          {bookings && bookings.length > 0 ? (
            bookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No stays yet</h3>
                <p className="text-muted-foreground">
                  Your bookings will appear here.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
