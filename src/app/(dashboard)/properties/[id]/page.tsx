import { getPropertyById, getBookingsByPropertyWithGuest } from '@/lib/supabase/queries'
import { notFound } from 'next/navigation'
// import { redirect } from 'next/navigation' // TEMPORARILY DISABLED FOR DEMO
import Link from 'next/link'
import { ArrowLeft, MapPin, Clock, Calendar, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PropertyBookingsTable } from '@/components/properties/property-bookings-table'
import { AddBookingButton } from '@/components/bookings/add-booking-button'
import { SyncCalendarButton } from '@/components/properties/sync-calendar-button'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params

  // TEMPORARILY DISABLED FOR DEMO
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  // if (!user) {
  //   redirect('/login')
  // }

  // Fetch property and bookings in parallel
  const [property, bookings] = await Promise.all([
    getPropertyById(id),
    getBookingsByPropertyWithGuest(id),
  ])

  if (!property) {
    notFound()
  }

  // Calculate stats
  const now = new Date()
  const upcomingBookings = bookings.filter(
    (b) => new Date(b.check_in) >= now && b.status !== 'cancelled'
  ).length
  const pastBookings = bookings.filter(
    (b) => new Date(b.check_out) < now
  ).length
  const totalRevenue = bookings.reduce(
    (sum, b) => sum + (b.payout_amount || b.total_amount || 0),
    0
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/properties">
              <Button variant="ghost" size="icon" aria-label="Back to properties">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h2 className="text-2xl font-bold tracking-tight">{property.name}</h2>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{property.address}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <SyncCalendarButton property={property} />
          <AddBookingButton propertyId={property.id} propertyName={property.name} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Upcoming Bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingBookings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Past Bookings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pastBookings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Calendar Sync</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-1">
              {property.airbnb_ical_url && (
                <Badge variant="secondary">Airbnb</Badge>
              )}
              {property.vrbo_ical_url && (
                <Badge variant="secondary">VRBO</Badge>
              )}
              {!property.airbnb_ical_url && !property.vrbo_ical_url && (
                <span className="text-sm text-muted-foreground">Not configured</span>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="bookings">
        <TabsList>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="details">Property Details</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="mt-6">
          <PropertyBookingsTable bookings={bookings} propertyId={property.id} />
        </TabsContent>

        <TabsContent value="details" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Check-in/Check-out</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Check-in Time</p>
                    <p className="text-muted-foreground">
                      {property.check_in_time || '3:00 PM'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Check-out Time</p>
                    <p className="text-muted-foreground">
                      {property.check_out_time || '11:00 AM'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {property.description || 'No description provided.'}
                </p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>House Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {property.house_rules || 'No house rules specified.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Tasks</CardTitle>
              <CardDescription>
                Scheduled maintenance for this property
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Maintenance tracking coming in Phase 3.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
