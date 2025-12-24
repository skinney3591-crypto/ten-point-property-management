'use client'

import { useState } from 'react'
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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Property, Vendor, MaintenanceTaskInsert } from '@/types/database'

interface MaintenanceFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  properties: Pick<Property, 'id' | 'name'>[]
  vendors: Pick<Vendor, 'id' | 'name' | 'service_type'>[]
}

interface FormData {
  property_id: string
  type: 'cleaning' | 'landscaping' | 'pool' | 'repair' | 'other'
  title: string
  scheduled_date: string
  vendor_id: string
  cost: string
  notes: string
  recurring: boolean
  recurrence_rule: string
}

const taskTypes = [
  { value: 'cleaning', label: '🧹 Cleaning' },
  { value: 'landscaping', label: '🌿 Landscaping' },
  { value: 'pool', label: '🏊 Pool Service' },
  { value: 'repair', label: '🔧 Repair' },
  { value: 'other', label: '📋 Other' },
]

const recurrenceOptions = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Every 2 weeks' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
]

export function MaintenanceFormDialog({
  open,
  onOpenChange,
  properties,
  vendors,
}: MaintenanceFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const [isRecurring, setIsRecurring] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      property_id: '',
      type: 'cleaning',
      title: '',
      scheduled_date: format(new Date(), 'yyyy-MM-dd'),
      vendor_id: '',
      cost: '',
      notes: '',
      recurring: false,
      recurrence_rule: '',
    },
  })

  const selectedType = watch('type')

  const onSubmit = async (data: FormData) => {
    setLoading(true)

    const task: MaintenanceTaskInsert = {
      property_id: data.property_id,
      type: data.type,
      title: data.title,
      scheduled_date: data.scheduled_date,
      vendor_id: data.vendor_id || null,
      cost: data.cost ? parseFloat(data.cost) : null,
      notes: data.notes || null,
      recurring: isRecurring,
      recurrence_rule: isRecurring ? data.recurrence_rule : null,
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('maintenance_tasks') as any).insert(task)

    if (error) {
      toast.error('Failed to create task')
      console.error(error)
    } else {
      toast.success('Maintenance task created')
      reset()
      setIsRecurring(false)
      onOpenChange(false)
      router.refresh()
    }

    setLoading(false)
  }

  // Auto-generate title based on type
  const generateTitle = (type: string) => {
    const titles: Record<string, string> = {
      cleaning: 'Cleaning service',
      landscaping: 'Lawn & landscaping',
      pool: 'Pool maintenance',
      repair: 'Repair',
      other: 'Maintenance task',
    }
    return titles[type] || 'Maintenance task'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Maintenance Task</DialogTitle>
          <DialogDescription>
            Schedule a maintenance task for one of your properties.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="property_id">Property *</Label>
            <Select
              onValueChange={(value) => setValue('property_id', value)}
            >
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
            {errors.property_id && (
              <p className="text-sm text-destructive">{errors.property_id.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Task Type *</Label>
              <Select
                defaultValue="cleaning"
                onValueChange={(value) => {
                  setValue('type', value as FormData['type'])
                  // Auto-fill title if empty
                  const currentTitle = watch('title')
                  if (!currentTitle) {
                    setValue('title', generateTitle(value))
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {taskTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled_date">Scheduled Date *</Label>
              <Input
                id="scheduled_date"
                type="date"
                {...register('scheduled_date', { required: 'Date is required' })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Weekly pool cleaning"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendor_id">Vendor (Optional)</Label>
              <Select
                onValueChange={(value) => setValue('vendor_id', value)}
              >
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
              <Label htmlFor="cost">Estimated Cost</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  className="pl-7"
                  placeholder="0.00"
                  {...register('cost')}
                />
              </div>
            </div>
          </div>

          {/* Recurring Task */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="recurring"
                checked={isRecurring}
                onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
              />
              <Label htmlFor="recurring" className="font-normal">
                This is a recurring task
              </Label>
            </div>

            {isRecurring && (
              <div className="space-y-2 pt-2">
                <Label htmlFor="recurrence_rule">Repeat</Label>
                <Select
                  onValueChange={(value) => setValue('recurrence_rule', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {recurrenceOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional details..."
              rows={2}
              {...register('notes')}
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
              {loading ? 'Creating...' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
