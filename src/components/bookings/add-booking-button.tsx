'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BookingFormDialog } from './booking-form-dialog'

interface AddBookingButtonProps {
  propertyId: string
  propertyName: string
}

export function AddBookingButton({ propertyId, propertyName }: AddBookingButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Booking
      </Button>
      <BookingFormDialog
        open={open}
        onOpenChange={setOpen}
        propertyId={propertyId}
        propertyName={propertyName}
      />
    </>
  )
}
