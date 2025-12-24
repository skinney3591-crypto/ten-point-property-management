import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { GuestsTable } from '@/components/guests/guests-table'
import { GuestSearch } from '@/components/guests/guest-search'
import { AddGuestButton } from '@/components/guests/add-guest-button'
import { Card, CardContent } from '@/components/ui/card'
import { Users, Mail, Star, Calendar } from 'lucide-react'
import type { Guest, Booking } from '@/types/database'

interface GuestWithBookings extends Guest {
  bookings: Booking[]
}

export default async function GuestsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch guests with their bookings
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: guests } = (await (supabase
    .from('guests')
    .select('*, bookings(*)')
    .order('name') as any)) as { data: GuestWithBookings[] | null }

  // Calculate stats
  const totalGuests = guests?.length || 0
  const repeatGuests = guests?.filter((g) => g.bookings.length > 1).length || 0
  const totalStays = guests?.reduce((sum, g) => sum + g.bookings.length, 0) || 0
  const guestsWithEmail = guests?.filter((g) => g.email).length || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Guests</h2>
          <p className="text-muted-foreground">
            Manage your guest database and communications
          </p>
        </div>
        <AddGuestButton />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-blue-100 p-3">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Guests</p>
                <p className="text-2xl font-bold">{totalGuests}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-emerald-100 p-3">
                <Star className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Repeat Guests</p>
                <p className="text-2xl font-bold">{repeatGuests}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-purple-100 p-3">
                <Calendar className="h-5 w-5 text-purple-600" />
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
              <div className="rounded-full bg-amber-100 p-3">
                <Mail className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">With Email</p>
                <p className="text-2xl font-bold">{guestsWithEmail}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <GuestSearch />

      <GuestsTable guests={guests || []} />
    </div>
  )
}
