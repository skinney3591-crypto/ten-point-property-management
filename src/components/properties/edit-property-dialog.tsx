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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Property } from '@/types/database'

interface EditPropertyDialogProps {
  property: Property
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (property: Property) => void
}

interface FormData {
  name: string
  address: string
  description: string
  check_in_time: string
  check_out_time: string
  house_rules: string
  airbnb_ical_url: string
  vrbo_ical_url: string
}

export function EditPropertyDialog({
  property,
  open,
  onOpenChange,
  onSuccess,
}: EditPropertyDialogProps) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: property.name,
      address: property.address,
      description: property.description || '',
      check_in_time: property.check_in_time || '15:00',
      check_out_time: property.check_out_time || '11:00',
      house_rules: property.house_rules || '',
      airbnb_ical_url: property.airbnb_ical_url || '',
      vrbo_ical_url: property.vrbo_ical_url || '',
    },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)

    const updates = {
      name: data.name,
      address: data.address,
      description: data.description || null,
      check_in_time: data.check_in_time,
      check_out_time: data.check_out_time,
      house_rules: data.house_rules || null,
      airbnb_ical_url: data.airbnb_ical_url || null,
      vrbo_ical_url: data.vrbo_ical_url || null,
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: updated, error } = await (supabase.from('properties') as any)
      .update(updates)
      .eq('id', property.id)
      .select()
      .single() as { data: Property | null; error: Error | null }

    if (error) {
      toast.error('Failed to update property')
      console.error(error)
    } else if (updated) {
      toast.success('Property updated successfully')
      onSuccess(updated)
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
          <DialogDescription>
            Update the details for {property.name}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs defaultValue="basic" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="sync">Calendar Sync</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Property Name *</Label>
                <Input
                  id="edit-name"
                  placeholder="Beach House, Mountain Cabin, etc."
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-address">Address *</Label>
                <Input
                  id="edit-address"
                  placeholder="123 Main St, City, State ZIP"
                  {...register('address', { required: 'Address is required' })}
                />
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  placeholder="Brief description of the property..."
                  rows={3}
                  {...register('description')}
                />
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-check_in_time">Check-in Time</Label>
                  <Input
                    id="edit-check_in_time"
                    type="time"
                    {...register('check_in_time')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-check_out_time">Check-out Time</Label>
                  <Input
                    id="edit-check_out_time"
                    type="time"
                    {...register('check_out_time')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-house_rules">House Rules</Label>
                <Textarea
                  id="edit-house_rules"
                  placeholder="Enter house rules for guests..."
                  rows={5}
                  {...register('house_rules')}
                />
              </div>
            </TabsContent>

            <TabsContent value="sync" className="space-y-4 pt-4">
              <div className="rounded-lg border bg-muted/50 p-4">
                <h4 className="font-medium">iCal Calendar Sync</h4>
                <p className="mt-1 text-sm text-muted-foreground">
                  Paste the iCal URL from Airbnb or VRBO to automatically sync
                  bookings. You can find these in your listing&apos;s calendar settings.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-airbnb_ical_url">Airbnb iCal URL</Label>
                <Input
                  id="edit-airbnb_ical_url"
                  placeholder="https://www.airbnb.com/calendar/ical/..."
                  {...register('airbnb_ical_url')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-vrbo_ical_url">VRBO iCal URL</Label>
                <Input
                  id="edit-vrbo_ical_url"
                  placeholder="https://www.vrbo.com/icalendar/..."
                  {...register('vrbo_ical_url')}
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
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
