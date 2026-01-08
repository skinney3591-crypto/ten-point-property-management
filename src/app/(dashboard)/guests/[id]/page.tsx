import { getGuestWithFullData, type GuestWithFullData } from '@/lib/supabase/queries'
import { notFound } from 'next/navigation'
// import { redirect } from 'next/navigation' // TEMPORARILY DISABLED FOR DEMO
import Link from 'next/link'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Star,
  Home,
  DollarSign,
  MessageSquare,
} from 'lucide-react'
import { GuestActions } from '@/components/guests/guest-actions'
import { CommunicationLog } from '@/components/guests/communication-log'

export default async function GuestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  // TEMPORARILY DISABLED FOR DEMO
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  // if (!user) {
  //   redirect('/login')
  // }

  // Fetch guest with bookings and communications
  const guest = await getGuestWithFullData(id)

  if (!guest) {
    notFound()
  }

  // Calculate stats
  const totalStays = guest.bookings.filter((b) => b.status !== 'cancelled').length
  const completedStays = guest.bookings.filter((b) => b.status === 'checked_out').length
  const totalSpent = guest.bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (b.total_amount || 0), 0)
  const isRepeatGuest = completedStays > 1

  // Sort bookings by check-in date (most recent first)
  const sortedBookings = [...guest.bookings]
    .filter((b) => b.status !== 'cancelled')
    .sort((a, b) => new Date(b.check_in).getTime() - new Date(a.check_in).getTime())

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="default">Confirmed</Badge>
      case 'checked_in':
        return <Badge className="bg-green-500">Checked In</Badge>
      case 'checked_out':
        return <Badge variant="secondary">Checked Out</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'airbnb':
        return <Badge variant="outline" className="text-rose-600 border-rose-200">Airbnb</Badge>
      case 'vrbo':
        return <Badge variant="outline" className="text-blue-600 border-blue-200">VRBO</Badge>
      case 'direct':
        return <Badge variant="outline" className="text-green-600 border-green-200">Direct</Badge>
      default:
        return <Badge variant="outline">{source}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/guests">
          <Button variant="ghost" size="icon" aria-label="Back to guests">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">{guest.name}</h2>
            {isRepeatGuest && (
              <Badge className="bg-amber-100 text-amber-800">
                <Star className="mr-1 h-3 w-3 fill-amber-500" />
                Repeat Guest
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            Guest since {format(new Date(guest.created_at), 'MMMM yyyy')}
          </p>
        </div>
        <GuestActions guest={guest} />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-100 p-3">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Stays</p>
                <p className="text-2xl font-bold">{totalStays}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-emerald-100 p-3">
                <Home className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{completedStays}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-purple-100 p-3">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">
                  ${totalSpent.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-amber-100 p-3">
                <MessageSquare className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Messages</p>
                <p className="text-2xl font-bold">
                  {guest.guest_communications?.length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contact Info & Notes */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a
                  href={`mailto:${guest.email}`}
                  className="text-sm hover:underline"
                >
                  {guest.email}
                </a>
              </div>
              {guest.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${guest.phone}`} className="text-sm">
                    {guest.phone}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notes & Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              {guest.notes ? (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {guest.notes}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No notes added yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Communication Log */}
          <CommunicationLog
            communications={guest.guest_communications || []}
            guestId={guest.id}
          />
        </div>

        {/* Stay History */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Stay History</CardTitle>
            </CardHeader>
            <CardContent>
              {sortedBookings.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No bookings found for this guest.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <Link
                            href={`/properties/${booking.property_id}`}
                            className="font-medium hover:underline"
                          >
                            {booking.properties?.name || 'Unknown Property'}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {format(new Date(booking.check_in), 'MMM d')} -{' '}
                            {format(new Date(booking.check_out), 'MMM d, yyyy')}
                          </div>
                        </TableCell>
                        <TableCell>{getSourceBadge(booking.source)}</TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell className="text-right">
                          {booking.total_amount
                            ? `$${booking.total_amount.toLocaleString()}`
                            : '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
