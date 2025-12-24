'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import type { PropertyInsert } from '@/types/database'

interface PropertyFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
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

export function PropertyFormDialog({ open, onOpenChange }: PropertyFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      address: '',
      description: '',
      check_in_time: '15:00',
      check_out_time: '11:00',
      house_rules: '',
      airbnb_ical_url: '',
      vrbo_ical_url: '',
    },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast.error('You must be logged in')
      setLoading(false)
      return
    }

    const property: PropertyInsert = {
      user_id: user.id,
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
    const { error } = await (supabase.from('properties') as any).insert(property)

    if (error) {
      toast.error('Failed to create property')
      console.error(error)
    } else {
      toast.success('Property created successfully')
      reset()
      onOpenChange(false)
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
          <DialogDescription>
            Enter the details for your vacation rental property.
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
                <Label htmlFor="name">Property Name *</Label>
                <Input
                  id="name"
                  placeholder="Beach House, Mountain Cabin, etc."
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  placeholder="123 Main St, City, State ZIP"
                  {...register('address', { required: 'Address is required' })}
                />
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the property..."
                  rows={3}
                  {...register('description')}
                />
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="check_in_time">Check-in Time</Label>
                  <Input
                    id="check_in_time"
                    type="time"
                    {...register('check_in_time')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="check_out_time">Check-out Time</Label>
                  <Input
                    id="check_out_time"
                    type="time"
                    {...register('check_out_time')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="house_rules">House Rules</Label>
                <Textarea
                  id="house_rules"
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
                <Label htmlFor="airbnb_ical_url">Airbnb iCal URL</Label>
                <Input
                  id="airbnb_ical_url"
                  placeholder="https://www.airbnb.com/calendar/ical/..."
                  {...register('airbnb_ical_url')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vrbo_ical_url">VRBO iCal URL</Label>
                <Input
                  id="vrbo_ical_url"
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
              {loading ? 'Creating...' : 'Create Property'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
