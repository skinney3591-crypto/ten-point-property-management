'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { ExpenseFormDialog } from './expense-form-dialog'
import type { Property } from '@/types/database'

interface AddExpenseButtonProps {
  properties: Property[]
}

export function AddExpenseButton({ properties }: AddExpenseButtonProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Expense
      </Button>
      <ExpenseFormDialog
        properties={properties}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}
