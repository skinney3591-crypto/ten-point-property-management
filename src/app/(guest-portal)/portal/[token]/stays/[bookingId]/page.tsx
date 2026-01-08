import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format, differenceInDays, isFuture, isPast } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Home,
  FileText,
  Wifi,
  Phone,
  AlertCircle,
} from 'lucide-react'
import { CheckInInstructions } from '@/components/portal/check-in-instructions'
import { getPortalTokenByToken, getGuestById } from '@/lib/supabase/queries'
import type { Guest, Booking, Property } from '@/types/database'

interface BookingWithProperty extends Booking {
  properties: Property
}

export default async function StayDetailPage({
  params,
}: {
  params: Promise<{ token: string; bookingId: string }>
}) {
  const { token, bookingId } = await params
  const supabase = await createClient()

  // Verify token and get guest using typed helpers
  const tokenData = await getPortalTokenByToken(token)

  if (!tokenData) {
    notFound()
  }

  const guest = await getGuestById(tokenData.guest_id)

  if (!guest) {
    notFound()
  }

  // Get booking details with property (complex query without helper)
  const { data: booking } = await supabase
    .from('bookings')
    .select('*, properties(*)')
    .eq('id', bookingId)
    .eq('guest_id', guest.id)
    .single() as { data: BookingWithProperty | null }

  if (!booking) {
    notFound()
  }

  const property = booking.properties
  const checkIn = new Date(booking.check_in)
  const checkOut = new Date(booking.check_out)
  const now = new Date()
  const isUpcoming = isFuture(checkIn)
  const isCurrent = isPast(checkIn) && isFuture(checkOut)
  const isPastStay = isPast(checkOut)
  const nights = differenceInDays(checkOut, checkIn)

  // Parse amenities if available
  const amenities = property.amenities as string[] | null

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link href={`/portal/${token}/stays`}>
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Stays
        </Button>
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{property.name}</h1>
            {isCurrent && <Badge className="bg-green-500">Current Stay</Badge>}
            {isUpcoming && <Badge>Upcoming</Badge>}
            {isPastStay && <Badge variant="secondary">Completed</Badge>}
          </div>
          <div className="mt-1 flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {property.address}
          </div>
        </div>
      </div>

      {/* Stay Dates Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-blue-100 p-3">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Check-in</p>
                <p className="font-semibold">{format(checkIn, 'EEE, MMM d, yyyy')}</p>
                <p className="text-sm text-muted-foreground">
                  {property.check_in_time || '3:00 PM'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-purple-100 p-3">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Check-out</p>
                <p className="font-semibold">{format(checkOut, 'EEE, MMM d, yyyy')}</p>
                <p className="text-sm text-muted-foreground">
                  {property.check_out_time || '11:00 AM'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-100 p-3">
                <Home className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-semibold">
                  {nights} {nights === 1 ? 'night' : 'nights'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Check-in Instructions (for upcoming/current stays) */}
      {(isUpcoming || isCurrent) && (
        <CheckInInstructions property={property} booking={booking} />
      )}

      {/* Property Details */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* House Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              House Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            {property.house_rules ? (
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap text-sm">{property.house_rules}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No specific house rules listed.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              Amenities
            </CardTitle>
          </CardHeader>
          <CardContent>
            {amenities && amenities.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity) => (
                  <Badge key={amenity} variant="secondary">
                    {amenity}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Amenities information not available.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Property Description */}
      {property.description && (
        <Card>
          <CardHeader>
            <CardTitle>About This Property</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{property.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Booking Summary (for past stays) */}
      {isPastStay && booking.total_amount && (
        <Card>
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {booking.nightly_rate && (
                <div className="flex justify-between">
                  <span>
                    ${booking.nightly_rate} x {nights} nights
                  </span>
                  <span>${booking.nightly_rate * nights}</span>
                </div>
              )}
              {booking.cleaning_fee && (
                <div className="flex justify-between">
                  <span>Cleaning fee</span>
                  <span>${booking.cleaning_fee}</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${booking.total_amount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Need Help */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900">Need Assistance?</h3>
              <p className="text-sm text-blue-700 mt-1">
                If you have any questions about your stay, please don't hesitate
                to reach out.
              </p>
              <Link href={`/portal/${token}/contact`} className="mt-3 inline-block">
                <Button size="sm">
                  <Phone className="mr-2 h-4 w-4" />
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
