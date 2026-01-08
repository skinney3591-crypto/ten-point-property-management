'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
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
import {
  MessageSquare,
  Send,
  CheckCircle,
  Phone,
  Mail,
  Clock,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Guest, GuestCommunicationInsert } from '@/types/database'

interface FormData {
  subject: string
  category: string
  message: string
}

export default function ContactPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [guest, setGuest] = useState<Guest | null>(null)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      subject: '',
      category: 'general',
      message: '',
    },
  })

  useEffect(() => {
    async function init() {
      const { token } = await params

      // Get guest from token - using typed query
      const { data: tokenData, error: tokenError } = await supabase
        .from('guest_portal_tokens')
        .select('guest_id')
        .eq('token', token)
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
    }
    init()
  }, [params, supabase])

  const onSubmit = async (data: FormData) => {
    if (!guest) return

    setLoading(true)

    // Log the message as a communication - using typed insert
    const communication: GuestCommunicationInsert = {
      guest_id: guest.id,
      type: 'email',
      direction: 'in',
      subject: `[${data.category}] ${data.subject}`,
      content: data.message,
      sent_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('guest_communications')
      .insert(communication as never)

    if (error) {
      toast.error('Failed to send message')
      console.error(error)
    } else {
      setSubmitted(true)
      toast.success('Message sent!')
    }

    setLoading(false)
  }

  const sendAnother = () => {
    setSubmitted(false)
    reset()
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-green-100 p-4">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="mt-6 text-2xl font-bold">Message Sent!</h2>
        <p className="mt-2 text-center text-muted-foreground max-w-md">
          Thank you for reaching out. We'll get back to you as soon as possible,
          usually within a few hours.
        </p>
        <Button variant="outline" className="mt-6" onClick={sendAnother}>
          Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Contact Us</h1>
        <p className="text-muted-foreground">
          Have a question or need assistance? We're here to help.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Send a Message
              </CardTitle>
              <CardDescription>
                Fill out the form and we'll respond as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    defaultValue="general"
                    onValueChange={(value) => setValue('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Question</SelectItem>
                      <SelectItem value="booking">Booking Inquiry</SelectItem>
                      <SelectItem value="issue">Report an Issue</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="What's this about?"
                    {...register('subject', { required: 'Subject is required' })}
                  />
                  {errors.subject && (
                    <p className="text-sm text-destructive">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="How can we help you?"
                    rows={6}
                    {...register('message', { required: 'Message is required' })}
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    'Sending...'
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <a
                    href="tel:+15551234567"
                    className="text-sm text-primary hover:underline"
                  >
                    (555) 123-4567
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <a
                    href="mailto:hello@tenpoint.com"
                    className="text-sm text-primary hover:underline"
                  >
                    hello@tenpoint.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Response Time</p>
                  <p className="text-sm text-muted-foreground">
                    Usually within a few hours
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <p className="text-sm text-amber-800">
                <strong>Urgent Issue?</strong>
                <br />
                For emergencies during your stay (e.g., lockouts, water leaks),
                please call us directly at{' '}
                <a href="tel:+15551234567" className="underline font-medium">
                  (555) 123-4567
                </a>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
