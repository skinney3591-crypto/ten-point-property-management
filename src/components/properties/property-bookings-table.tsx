'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Trash2, User } from 'lucide-react'
import { getSupabaseBrowser } from '@/lib/supabase/client-queries'
import { toast } from 'sonner'
import type { Booking, Guest } from '@/types/database'

interface BookingWithGuest extends Booking {
  guests?: Guest | null
}

interface PropertyBookingsTableProps {
  bookings: BookingWithGuest[]
  propertyId: string
}

const statusColors: Record<string, string> = {
  confirmed: 'bg-blue-100 text-blue-700',
  checked_in: 'bg-green-100 text-green-700',
  checked_out: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
}

const sourceColors: Record<string, string> = {
  airbnb: 'bg-rose-100 text-rose-700',
  vrbo: 'bg-blue-100 text-blue-700',
  direct: 'bg-emerald-100 text-emerald-700',
  other: 'bg-gray-100 text-gray-700',
}

export function PropertyBookingsTable({ bookings: initialBookings, propertyId }: PropertyBookingsTableProps) {
  const [bookings, setBookings] = useState(initialBookings)
  const supabase = getSupabaseBrowser()

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Failed to delete booking')
    } else {
      setBookings(bookings.filter((b) => b.id !== id))
      toast.success('Booking deleted')
    }
  }

  if (bookings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
        <User className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No bookings yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Add a booking manually or sync from Airbnb/VRBO.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Guest</TableHead>
            <TableHead>Check-in</TableHead>
            <TableHead>Check-out</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">
                {booking.guests?.name || 'Unknown Guest'}
              </TableCell>
              <TableCell>
                {format(new Date(booking.check_in), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                {format(new Date(booking.check_out), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={sourceColors[booking.source]}>
                  {booking.source}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={statusColors[booking.status]}>
                  {booking.status.replace('_', ' ')}
                </Badge>
              </TableCell>
              <TableCell>
                {booking.total_amount
                  ? `$${booking.total_amount.toLocaleString()}`
                  : '-'}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Open booking menu">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(booking.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
