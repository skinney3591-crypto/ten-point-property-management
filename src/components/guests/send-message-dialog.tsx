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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Mail, MessageSquare, Send, FileText } from 'lucide-react'
import type { Guest } from '@/types/database'

interface SendMessageDialogProps {
  guest: Guest
  bookingId?: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface CustomFormData {
  subject: string
  content: string
}

const templates = [
  { id: 'booking_confirmation', label: 'Booking Confirmation', requiresBooking: true },
  { id: 'pre_arrival', label: 'Pre-Arrival (Check-in Instructions)', requiresBooking: true },
  { id: 'check_in_day', label: 'Check-in Day Welcome', requiresBooking: true, smsOnly: true },
  { id: 'checkout_reminder', label: 'Checkout Reminder', requiresBooking: true, smsOnly: true },
  { id: 'post_checkout', label: 'Post-Checkout Thank You', requiresBooking: true },
  { id: 'review_request', label: 'Review Request', requiresBooking: true },
  { id: 'portal_link', label: 'Guest Portal Link', requiresBooking: false },
]

export function SendMessageDialog({
  guest,
  bookingId,
  open,
  onOpenChange,
}: SendMessageDialogProps) {
  const [loading, setLoading] = useState(false)
  const [messageType, setMessageType] = useState<'email' | 'sms'>('email')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [channel, setChannel] = useState<'email' | 'sms' | 'both'>('email')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomFormData>({
    defaultValues: {
      subject: '',
      content: '',
    },
  })

  const onSubmitCustom = async (data: CustomFormData) => {
    setLoading(true)

    try {
      const response = await fetch('/api/communications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestId: guest.id,
          bookingId,
          type: messageType,
          subject: data.subject,
          content: data.content,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(
          messageType === 'email' ? 'Email sent!' : 'SMS sent!'
        )
        reset()
        onOpenChange(false)
      } else if (result.logged) {
        toast.success('Message logged')
        toast.info(result.error || 'Delivery service not configured')
        reset()
        onOpenChange(false)
      } else {
        toast.error(result.error || 'Failed to send message')
      }
    } catch {
      toast.error('Failed to send message')
    }

    setLoading(false)
  }

  const sendTemplate = async () => {
    if (!selectedTemplate) {
      toast.error('Please select a template')
      return
    }

    const template = templates.find((t) => t.id === selectedTemplate)
    if (template?.requiresBooking && !bookingId) {
      toast.error('This template requires a booking context')
      return
    }

    setLoading(true)

    try {
      // Generate portal link first if needed
      let portalUrl: string | undefined

      if (selectedTemplate === 'portal_link' || selectedTemplate === 'pre_arrival') {
        const linkResponse = await fetch('/api/portal/generate-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ guestId: guest.id }),
        })
        const linkData = await linkResponse.json()
        if (linkData.url) {
          portalUrl = linkData.url
        }
      }

      const response = await fetch('/api/communications/send-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guestId: guest.id,
          bookingId,
          template: selectedTemplate,
          channel,
          portalUrl,
        }),
      })

      const result = await response.json()

      if (result.success) {
        const sentChannels = []
        if (result.results.email?.success) sentChannels.push('email')
        if (result.results.sms?.success) sentChannels.push('SMS')

        if (sentChannels.length > 0) {
          toast.success(`Sent via ${sentChannels.join(' and ')}!`)
        } else {
          toast.success('Message logged (delivery services not configured)')
        }
        onOpenChange(false)
      } else {
        toast.error(result.error || 'Failed to send')
      }
    } catch {
      toast.error('Failed to send message')
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Send Message to {guest.name}</DialogTitle>
          <DialogDescription>
            Send an email or SMS to this guest.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="template" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="template">
              <FileText className="mr-2 h-4 w-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="custom">
              <Mail className="mr-2 h-4 w-4" />
              Custom
            </TabsTrigger>
          </TabsList>

          <TabsContent value="template" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Template</Label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem
                      key={template.id}
                      value={template.id}
                      disabled={template.requiresBooking && !bookingId}
                    >
                      {template.label}
                      {template.smsOnly && ' (SMS only)'}
                      {template.requiresBooking && !bookingId && ' (needs booking)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Send via</Label>
              <Select
                value={channel}
                onValueChange={(v: 'email' | 'sms' | 'both') => setChannel(v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email only
                    </div>
                  </SelectItem>
                  <SelectItem value="sms" disabled={!guest.phone}>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      SMS only {!guest.phone && '(no phone)'}
                    </div>
                  </SelectItem>
                  <SelectItem value="both" disabled={!guest.phone}>
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Email & SMS {!guest.phone && '(no phone)'}
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={sendTemplate} disabled={loading || !selectedTemplate}>
                {loading ? 'Sending...' : 'Send Template'}
              </Button>
            </DialogFooter>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4 mt-4">
            <form onSubmit={handleSubmit(onSubmitCustom)} className="space-y-4">
              <div className="space-y-2">
                <Label>Message Type</Label>
                <Select
                  value={messageType}
                  onValueChange={(v: 'email' | 'sms') => setMessageType(v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email ({guest.email})
                      </div>
                    </SelectItem>
                    <SelectItem value="sms" disabled={!guest.phone}>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        SMS {guest.phone ? `(${guest.phone})` : '(no phone)'}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {messageType === 'email' && (
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    placeholder="Your upcoming stay at..."
                    {...register('subject', {
                      required: messageType === 'email' ? 'Subject is required' : false,
                    })}
                  />
                  {errors.subject && (
                    <p className="text-sm text-destructive">{errors.subject.message}</p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="content">Message *</Label>
                <Textarea
                  id="content"
                  placeholder={
                    messageType === 'email'
                      ? 'Write your email message here...'
                      : 'Write your SMS (160 char limit recommended)...'
                  }
                  rows={messageType === 'email' ? 6 : 3}
                  {...register('content', { required: 'Message is required' })}
                />
                {errors.content && (
                  <p className="text-sm text-destructive">{errors.content.message}</p>
                )}
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
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
