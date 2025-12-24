'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { GuestFormDialog } from './guest-form-dialog'

export function AddGuestButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Guest
      </Button>
      <GuestFormDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
