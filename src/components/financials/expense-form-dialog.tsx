'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getSupabaseBrowser } from '@/lib/supabase/client-queries'
import { toast } from 'sonner'
import type { Property, Vendor, ExpenseInsert } from '@/types/database'

interface ExpenseFormDialogProps {
  properties: Property[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface FormData {
  property_id: string
  category: string
  amount: string
  description: string
  date: string
  vendor_id: string
}

const categories = [
  'Cleaning',
  'Maintenance',
  'Repairs',
  'Supplies',
  'Utilities',
  'Insurance',
  'Taxes',
  'Mortgage',
  'HOA Fees',
  'Landscaping',
  'Pool',
  'Pest Control',
  'Marketing',
  'Software',
  'Other',
]

export function ExpenseFormDialog({
  properties,
  open,
  onOpenChange,
}: ExpenseFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [vendors, setVendors] = useState<Vendor[]>([])
  const router = useRouter()
  const supabase = getSupabaseBrowser()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      property_id: '',
      category: '',
      amount: '',
      description: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      vendor_id: '',
    },
  })

  useEffect(() => {
    async function fetchVendors() {
      const { data } = await supabase
        .from('vendors')
        .select('*')
        .order('name')

      if (data) {
        setVendors(data)
      }
    }
    if (open) {
      fetchVendors()
    }
  }, [open, supabase])

  const onSubmit = async (data: FormData) => {
    setLoading(true)

    const expense: ExpenseInsert = {
      property_id: data.property_id,
      category: data.category,
      amount: parseFloat(data.amount),
      description: data.description || null,
      date: data.date,
      vendor_id: data.vendor_id || null,
    }

    const { error } = await supabase.from('expenses').insert(expense as never)

    if (error) {
      toast.error('Failed to add expense')
      console.error(error)
    } else {
      toast.success('Expense added')
      reset()
      onOpenChange(false)
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>
            Record a new expense for one of your properties.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="property_id">Property *</Label>
            <Select onValueChange={(value) => setValue('property_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select onValueChange={(value) => setValue('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  className="pl-7"
                  placeholder="0.00"
                  {...register('amount', { required: 'Amount is required' })}
                />
              </div>
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date *</Label>
            <Input
              id="date"
              type="date"
              {...register('date', { required: 'Date is required' })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor_id">Vendor (optional)</Label>
            <Select onValueChange={(value) => setValue('vendor_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select vendor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No vendor</SelectItem>
                {vendors.map((vendor) => (
                  <SelectItem key={vendor.id} value={vendor.id}>
                    {vendor.name} ({vendor.service_type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Notes about this expense..."
              rows={2}
              {...register('description')}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Expense'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
