'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VendorFormDialog } from './vendor-form-dialog'

export function AddVendorButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Vendor
      </Button>
      <VendorFormDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
