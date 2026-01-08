'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { format, addDays } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import { Calendar, Send, CheckCircle, Home } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Property, Guest, GuestCommunicationInsert } from '@/types/database'

interface FormData {
  property_id: string
  check_in: string
  check_out: string
  guests: string
  message: string
}

export default function RebookPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const [token, setToken] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [guest, setGuest] = useState<Guest | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      check_in: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
      check_out: format(addDays(new Date(), 10), 'yyyy-MM-dd'),
      guests: '2',
      message: '',
    },
  })

  useEffect(() => {
    async function init() {
      const { token: t } = await params
      setToken(t)

      // Get guest from token - using typed queries
      const { data: tokenData, error: tokenError } = await supabase
        .from('guest_portal_tokens')
        .select('guest_id')
        .eq('token', t)
        .single() as { data: { guest_id: string } | null; error: unknown }

      if (tokenError || !tokenData) {
        console.error('Failed to fetch token:', tokenError)
        return
      }

      const { data: guestData, error: guestError } = await supabase
        .from('guests')
        .select('*')
        .eq('id', tokenData.guest_id)
        .single()

      if (!guestError && guestData) {
        setGuest(guestData as Guest)
      }

      // Get available properties - using typed query
      const { data: props, error: propsError } = await supabase
        .from('properties')
        .select('*')
        .order('name')

      if (!propsError && props) {
        setProperties(props as Property[])
      }
    }
    init()
  }, [params, supabase])

  const onSubmit = async (data: FormData) => {
    if (!guest) return

    setLoading(true)

    // Log the booking request as a communication - using typed insert
    // In production, this would also send an email notification to the property manager
    const communication: GuestCommunicationInsert = {
      guest_id: guest.id,
      type: 'email',
      direction: 'in',
      subject: 'Rebooking Request',
      content: `Booking Request Details:
Property: ${properties.find((p) => p.id === data.property_id)?.name || 'Not specified'}
Check-in: ${data.check_in}
Check-out: ${data.check_out}
Number of guests: ${data.guests}

Message from guest:
${data.message || 'No additional message'}`,
      sent_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('guest_communications')
      .insert(communication as never)

    if (error) {
      toast.error('Failed to submit request')
      console.error(error)
    } else {
      setSubmitted(true)
      toast.success('Booking request submitted!')
    }

    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-green-100 p-4">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="mt-6 text-2xl font-bold">Request Submitted!</h2>
        <p className="mt-2 text-center text-muted-foreground max-w-md">
          Thank you for your booking request. We'll review availability and get
          back to you within 24 hours.
        </p>
        <Button
          className="mt-6"
          onClick={() => router.push(`/portal/${token}`)}
        >
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Request a Booking</h1>
        <p className="text-muted-foreground">
          Submit a request for your next stay. We'll check availability and
          confirm with you.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Booking Details
          </CardTitle>
          <CardDescription>
            Fill out the form below with your preferred dates and property.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="property">Preferred Property</Label>
              <Select onValueChange={(value) => setValue('property_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a property" />
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

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="check_in">Check-in Date *</Label>
                <Input
                  id="check_in"
                  type="date"
                  {...register('check_in', { required: 'Check-in date is required' })}
                />
                {errors.check_in && (
                  <p className="text-sm text-destructive">
                    {errors.check_in.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="check_out">Check-out Date *</Label>
                <Input
                  id="check_out"
                  type="date"
                  {...register('check_out', { required: 'Check-out date is required' })}
                />
                {errors.check_out && (
                  <p className="text-sm text-destructive">
                    {errors.check_out.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guests">Number of Guests</Label>
              <Select
                defaultValue="2"
                onValueChange={(value) => setValue('guests', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'guest' : 'guests'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Additional Message</Label>
              <Textarea
                id="message"
                placeholder="Any special requests or notes for your stay..."
                rows={4}
                {...register('message')}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Request
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This is a booking request, not a confirmed
            reservation. We will check availability and respond to your request
            within 24 hours. Payment details will be provided upon confirmation.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
