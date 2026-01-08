'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import Link from 'next/link'
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Users,
  Mail,
  Phone,
  MessageSquare,
  Star,
} from 'lucide-react'
import { getSupabaseBrowser } from '@/lib/supabase/client-queries'
import { toast } from 'sonner'
import { EditGuestDialog } from './edit-guest-dialog'
import { SendMessageDialog } from './send-message-dialog'
import type { Guest, Booking } from '@/types/database'

interface GuestWithBookings extends Guest {
  bookings: Booking[]
}

interface GuestsTableProps {
  guests: GuestWithBookings[]
}

export function GuestsTable({ guests: initialGuests }: GuestsTableProps) {
  const [guests, setGuests] = useState(initialGuests)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editGuest, setEditGuest] = useState<GuestWithBookings | null>(null)
  const [messageGuest, setMessageGuest] = useState<GuestWithBookings | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = getSupabaseBrowser()

  // Filter guests based on search
  const searchQuery = searchParams.get('q')?.toLowerCase() || ''
  const filteredGuests = guests.filter((guest) => {
    if (!searchQuery) return true
    return (
      guest.name.toLowerCase().includes(searchQuery) ||
      guest.email.toLowerCase().includes(searchQuery) ||
      guest.phone?.toLowerCase().includes(searchQuery)
    )
  })

  const handleDelete = async () => {
    if (!deleteId) return

    const { error } = await supabase.from('guests')
      .delete()
      .eq('id', deleteId)

    if (error) {
      toast.error('Failed to delete guest')
    } else {
      setGuests(guests.filter((g) => g.id !== deleteId))
      toast.success('Guest deleted')
    }
    setDeleteId(null)
  }

  const handleGuestUpdated = (updated: Guest) => {
    setGuests(
      guests.map((g) =>
        g.id === updated.id ? { ...g, ...updated } : g
      )
    )
    setEditGuest(null)
  }

  if (guests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
        <Users className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No guests yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Guests will appear here when you add bookings.
        </p>
      </div>
    )
  }

  if (filteredGuests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
        <Users className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No guests found</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Try adjusting your search terms.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Stays</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGuests.map((guest) => {
              const completedStays = guest.bookings.filter(
                (b) => b.status === 'checked_out'
              ).length
              const isRepeat = completedStays > 1
              const lastBooking = guest.bookings
                .filter((b) => b.status !== 'cancelled')
                .sort(
                  (a, b) =>
                    new Date(b.check_out).getTime() -
                    new Date(a.check_out).getTime()
                )[0]

              return (
                <TableRow key={guest.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div>
                        <Link
                          href={`/guests/${guest.id}`}
                          className="font-medium hover:underline"
                        >
                          {guest.name}
                        </Link>
                        {isRepeat && (
                          <div className="flex items-center gap-1 text-xs text-amber-600">
                            <Star className="h-3 w-3 fill-amber-500" />
                            Repeat guest
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <a
                          href={`mailto:${guest.email}`}
                          className="hover:underline"
                        >
                          {guest.email}
                        </a>
                      </div>
                      {guest.phone && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <a href={`tel:${guest.phone}`}>{guest.phone}</a>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {guest.bookings.filter((b) => b.status !== 'cancelled').length}{' '}
                      {guest.bookings.length === 1 ? 'stay' : 'stays'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {lastBooking ? (
                      <span className="text-sm">
                        {format(new Date(lastBooking.check_out), 'MMM d, yyyy')}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    {guest.notes ? (
                      <span className="truncate text-sm text-muted-foreground">
                        {guest.notes}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Open guest menu">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/guests/${guest.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setEditGuest(guest)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setMessageGuest(guest)}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteId(guest.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Guest</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this guest? Their booking history
              will be preserved but unlinked. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      {editGuest && (
        <EditGuestDialog
          guest={editGuest}
          open={!!editGuest}
          onOpenChange={(open) => !open && setEditGuest(null)}
          onSuccess={handleGuestUpdated}
        />
      )}

      {/* Send Message Dialog */}
      {messageGuest && (
        <SendMessageDialog
          guest={messageGuest}
          open={!!messageGuest}
          onOpenChange={(open) => !open && setMessageGuest(null)}
        />
      )}
    </>
  )
}
