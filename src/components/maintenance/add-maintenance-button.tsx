'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MaintenanceFormDialog } from './maintenance-form-dialog'
import type { Property, Vendor } from '@/types/database'

interface AddMaintenanceButtonProps {
  properties: Pick<Property, 'id' | 'name'>[]
  vendors: Pick<Vendor, 'id' | 'name' | 'service_type'>[]
}

export function AddMaintenanceButton({ properties, vendors }: AddMaintenanceButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Task
      </Button>
      <MaintenanceFormDialog
        open={open}
        onOpenChange={setOpen}
        properties={properties}
        vendors={vendors}
      />
    </>
  )
}
