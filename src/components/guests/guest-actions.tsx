'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
  Pencil,
  Trash2,
  MessageSquare,
  Mail,
  Phone,
  Link2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { EditGuestDialog } from './edit-guest-dialog'
import { SendMessageDialog } from './send-message-dialog'
import { GeneratePortalLink } from './generate-portal-link'
import type { Guest } from '@/types/database'

interface GuestActionsProps {
  guest: Guest
}

export function GuestActions({ guest: initialGuest }: GuestActionsProps) {
  const [guest, setGuest] = useState(initialGuest)
  const [showEdit, setShowEdit] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showPortalLink, setShowPortalLink] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('guests') as any)
      .delete()
      .eq('id', guest.id)

    if (error) {
      toast.error('Failed to delete guest')
    } else {
      toast.success('Guest deleted')
      router.push('/guests')
    }
    setShowDelete(false)
  }

  const handleGuestUpdated = (updated: Guest) => {
    setGuest(updated)
    setShowEdit(false)
    router.refresh()
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => setShowPortalLink(true)}>
          <Link2 className="mr-2 h-4 w-4" />
          Portal Link
        </Button>
        <Button variant="outline" onClick={() => setShowMessage(true)}>
          <MessageSquare className="mr-2 h-4 w-4" />
          Send Message
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowEdit(true)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Guest
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <a href={`mailto:${guest.email}`}>
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </a>
            </DropdownMenuItem>
            {guest.phone && (
              <DropdownMenuItem asChild>
                <a href={`tel:${guest.phone}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  Call Guest
                </a>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => setShowDelete(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Guest
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Edit Dialog */}
      {showEdit && (
        <EditGuestDialog
          guest={guest}
          open={showEdit}
          onOpenChange={setShowEdit}
          onSuccess={handleGuestUpdated}
        />
      )}

      {/* Send Message Dialog */}
      {showMessage && (
        <SendMessageDialog
          guest={guest}
          open={showMessage}
          onOpenChange={setShowMessage}
        />
      )}

      {/* Generate Portal Link Dialog */}
      {showPortalLink && (
        <GeneratePortalLink
          guestId={guest.id}
          guestName={guest.name}
          open={showPortalLink}
          onOpenChange={setShowPortalLink}
        />
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Guest</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {guest.name}? Their booking history
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
    </>
  )
}
