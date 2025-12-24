'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PropertyFormDialog } from './property-form-dialog'

export function AddPropertyButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Property
      </Button>
      <PropertyFormDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
