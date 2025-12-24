'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
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
import type { MaintenanceTask, Property, Vendor } from '@/types/database'

interface MaintenanceWithDetails extends MaintenanceTask {
  properties: Property
  vendors: Vendor | null
}

interface EditMaintenanceDialogProps {
  task: MaintenanceWithDetails
  properties: Pick<Property, 'id' | 'name'>[]
  vendors: Pick<Vendor, 'id' | 'name' | 'service_type'>[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (task: MaintenanceWithDetails) => void
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

export function EditMaintenanceDialog({
  task,
  properties,
  vendors,
  open,
  onOpenChange,
  onSuccess,
}: EditMaintenanceDialogProps) {
  const [loading, setLoading] = useState(false)
  const [isRecurring, setIsRecurring] = useState(task.recurring)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      property_id: task.property_id,
      type: task.type,
      title: task.title,
      scheduled_date: task.scheduled_date,
      vendor_id: task.vendor_id || '',
      cost: task.cost?.toString() || '',
      notes: task.notes || '',
      recurring: task.recurring,
      recurrence_rule: task.recurrence_rule || '',
    },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)

    const updates = {
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
    const { data: updated, error } = await (supabase.from('maintenance_tasks') as any)
      .update(updates)
      .eq('id', task.id)
      .select('*, properties(*), vendors(*)')
      .single() as { data: MaintenanceWithDetails | null; error: Error | null }

    if (error) {
      toast.error('Failed to update task')
      console.error(error)
    } else if (updated) {
      toast.success('Task updated')
      onSuccess(updated)
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Maintenance Task</DialogTitle>
          <DialogDescription>
            Update the details for this maintenance task.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-property_id">Property *</Label>
            <Select
              defaultValue={task.property_id}
              onValueChange={(value) => setValue('property_id', value)}
            >
              <SelectTrigger>
                <SelectValue />
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
              <Label htmlFor="edit-type">Task Type *</Label>
              <Select
                defaultValue={task.type}
                onValueChange={(value) => setValue('type', value as FormData['type'])}
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
              <Label htmlFor="edit-scheduled_date">Scheduled Date *</Label>
              <Input
                id="edit-scheduled_date"
                type="date"
                {...register('scheduled_date', { required: 'Date is required' })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-title">Task Title *</Label>
            <Input
              id="edit-title"
              {...register('title', { required: 'Title is required' })}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-vendor_id">Vendor</Label>
              <Select
                defaultValue={task.vendor_id || ''}
                onValueChange={(value) => setValue('vendor_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="No vendor" />
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
              <Label htmlFor="edit-cost">Estimated Cost</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="edit-cost"
                  type="number"
                  step="0.01"
                  className="pl-7"
                  {...register('cost')}
                />
              </div>
            </div>
          </div>

          {/* Recurring Task */}
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-recurring"
                checked={isRecurring}
                onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
              />
              <Label htmlFor="edit-recurring" className="font-normal">
                This is a recurring task
              </Label>
            </div>

            {isRecurring && (
              <div className="space-y-2 pt-2">
                <Label htmlFor="edit-recurrence_rule">Repeat</Label>
                <Select
                  defaultValue={task.recurrence_rule || ''}
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
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea
              id="edit-notes"
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
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
