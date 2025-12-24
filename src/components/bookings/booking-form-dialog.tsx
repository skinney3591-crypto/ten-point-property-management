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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { BookingInsert, GuestInsert } from '@/types/database'

interface BookingFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  propertyId: string
  propertyName: string
}

interface FormData {
  // Guest info
  guest_name: string
  guest_email: string
  guest_phone: string
  // Booking info
  check_in: string
  check_out: string
  source: 'airbnb' | 'vrbo' | 'direct' | 'other'
  // Financial
  nightly_rate: string
  cleaning_fee: string
  total_amount: string
  platform_fee: string
  payout_amount: string
  notes: string
}

export function BookingFormDialog({
  open,
  onOpenChange,
  propertyId,
  propertyName,
}: BookingFormDialogProps) {
  const [loading, setLoading] = useState(false)
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
      guest_name: '',
      guest_email: '',
      guest_phone: '',
      check_in: format(new Date(), 'yyyy-MM-dd'),
      check_out: format(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      source: 'direct',
      nightly_rate: '',
      cleaning_fee: '',
      total_amount: '',
      platform_fee: '',
      payout_amount: '',
      notes: '',
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

    try {
      // First, create or find the guest
      let guestId: string | null = null

      if (data.guest_name && data.guest_email) {
        // Check if guest exists
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: existingGuest } = (await (supabase
          .from('guests')
          .select('id')
          .eq('email', data.guest_email)
          .single() as any)) as { data: { id: string } | null }

        if (existingGuest) {
          guestId = existingGuest.id
        } else {
          // Create new guest
          const newGuest: GuestInsert = {
            user_id: user.id,
            name: data.guest_name,
            email: data.guest_email,
            phone: data.guest_phone || null,
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: createdGuest, error: guestError } = await (supabase.from('guests') as any)
            .insert(newGuest)
            .select('id')
            .single() as { data: { id: string } | null; error: Error | null }

          if (guestError) {
            throw new Error('Failed to create guest')
          }
          guestId = createdGuest?.id || null
        }
      }

      // Create the booking
      const booking: BookingInsert = {
        property_id: propertyId,
        guest_id: guestId,
        check_in: data.check_in,
        check_out: data.check_out,
        source: data.source,
        nightly_rate: data.nightly_rate ? parseFloat(data.nightly_rate) : null,
        cleaning_fee: data.cleaning_fee ? parseFloat(data.cleaning_fee) : null,
        total_amount: data.total_amount ? parseFloat(data.total_amount) : null,
        platform_fee: data.platform_fee ? parseFloat(data.platform_fee) : null,
        payout_amount: data.payout_amount ? parseFloat(data.payout_amount) : null,
        notes: data.notes || null,
        status: 'confirmed',
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: bookingError } = await (supabase.from('bookings') as any).insert(booking)

      if (bookingError) {
        throw new Error('Failed to create booking')
      }

      toast.success('Booking created successfully')
      reset()
      onOpenChange(false)
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error('Failed to create booking')
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Booking</DialogTitle>
          <DialogDescription>
            Add a booking for {propertyName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Guest Information */}
          <div>
            <h3 className="text-sm font-medium mb-3">Guest Information</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="guest_name">Guest Name *</Label>
                <Input
                  id="guest_name"
                  placeholder="John Smith"
                  {...register('guest_name', { required: 'Guest name is required' })}
                />
                {errors.guest_name && (
                  <p className="text-sm text-destructive">{errors.guest_name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="guest_email">Email *</Label>
                <Input
                  id="guest_email"
                  type="email"
                  placeholder="guest@example.com"
                  {...register('guest_email', { required: 'Email is required' })}
                />
                {errors.guest_email && (
                  <p className="text-sm text-destructive">{errors.guest_email.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="guest_phone">Phone</Label>
                <Input
                  id="guest_phone"
                  placeholder="+1 (555) 123-4567"
                  {...register('guest_phone')}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Booking Details */}
          <div>
            <h3 className="text-sm font-medium mb-3">Booking Details</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="check_in">Check-in Date *</Label>
                <Input
                  id="check_in"
                  type="date"
                  {...register('check_in', { required: 'Check-in date is required' })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="check_out">Check-out Date *</Label>
                <Input
                  id="check_out"
                  type="date"
                  {...register('check_out', { required: 'Check-out date is required' })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Booking Source *</Label>
                <Select
                  defaultValue="direct"
                  onValueChange={(value) => setValue('source', value as FormData['source'])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="airbnb">Airbnb</SelectItem>
                    <SelectItem value="vrbo">VRBO</SelectItem>
                    <SelectItem value="direct">Direct</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Financial Details */}
          <div>
            <h3 className="text-sm font-medium mb-3">Financial Details (Optional)</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="nightly_rate">Nightly Rate</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="nightly_rate"
                    type="number"
                    step="0.01"
                    className="pl-7"
                    placeholder="0.00"
                    {...register('nightly_rate')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cleaning_fee">Cleaning Fee</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="cleaning_fee"
                    type="number"
                    step="0.01"
                    className="pl-7"
                    placeholder="0.00"
                    {...register('cleaning_fee')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="total_amount">Total Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="total_amount"
                    type="number"
                    step="0.01"
                    className="pl-7"
                    placeholder="0.00"
                    {...register('total_amount')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="platform_fee">Platform Fee</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="platform_fee"
                    type="number"
                    step="0.01"
                    className="pl-7"
                    placeholder="0.00"
                    {...register('platform_fee')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payout_amount">Your Payout</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="payout_amount"
                    type="number"
                    step="0.01"
                    className="pl-7"
                    placeholder="0.00"
                    {...register('payout_amount')}
                  />
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes about this booking..."
              rows={3}
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
              {loading ? 'Creating...' : 'Create Booking'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
