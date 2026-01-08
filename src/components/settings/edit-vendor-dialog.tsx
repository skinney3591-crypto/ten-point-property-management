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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getSupabaseBrowser } from '@/lib/supabase/client-queries'
import { toast } from 'sonner'
import type { Vendor } from '@/types/database'

interface EditVendorDialogProps {
  vendor: Vendor
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (vendor: Vendor) => void
}

interface FormData {
  name: string
  service_type: string
  email: string
  phone: string
  notes: string
}

const serviceTypes = [
  'Cleaning',
  'Landscaping',
  'Pool',
  'Plumbing',
  'Electrical',
  'HVAC',
  'Handyman',
  'Pest Control',
  'General',
]

export function EditVendorDialog({
  vendor,
  open,
  onOpenChange,
  onSuccess,
}: EditVendorDialogProps) {
  const [loading, setLoading] = useState(false)
  const supabase = getSupabaseBrowser()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: vendor.name,
      service_type: vendor.service_type,
      email: vendor.email || '',
      phone: vendor.phone || '',
      notes: vendor.notes || '',
    },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)

    const updates = {
      name: data.name,
      service_type: data.service_type,
      email: data.email || null,
      phone: data.phone || null,
      notes: data.notes || null,
    }

    const { data: updated, error } = await supabase.from('vendors')
      .update(updates as never)
      .eq('id', vendor.id)
      .select()
      .single() as { data: Vendor | null; error: unknown }

    if (error) {
      toast.error('Failed to update vendor')
      console.error(error)
    } else if (updated) {
      toast.success('Vendor updated')
      onSuccess(updated)
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Vendor</DialogTitle>
          <DialogDescription>
            Update the details for {vendor.name}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Vendor Name *</Label>
            <Input
              id="edit-name"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-service_type">Service Type *</Label>
            <Select
              defaultValue={vendor.service_type}
              onValueChange={(value) => setValue('service_type', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                {...register('email')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                {...register('phone')}
              />
            </div>
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
