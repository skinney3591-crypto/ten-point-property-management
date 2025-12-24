'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send, CheckCircle, Loader2 } from 'lucide-react'

interface InquiryFormProps {
  propertyId: string
  propertyName: string
}

export function InquiryForm({ propertyId, propertyName }: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = {
      property_id: propertyId,
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      check_in: formData.get('check_in') || null,
      check_out: formData.get('check_out') || null,
      guests: formData.get('guests') ? parseInt(formData.get('guests') as string) : null,
      message: formData.get('message'),
    }

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        throw new Error('Failed to submit inquiry')
      }

      setIsSuccess(true)
    } catch (err) {
      setError('Failed to submit inquiry. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">
              Inquiry Sent!
            </h3>
            <p className="text-slate-600">
              Thank you for your interest in {propertyName}. We&apos;ll get back to you within 24 hours.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Inquire About This Property</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input id="name" name="name" required placeholder="Your name" />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" name="email" type="email" required placeholder="you@email.com" />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" type="tel" placeholder="(555) 123-4567" />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="check_in">Check-in Date</Label>
              <Input id="check_in" name="check_in" type="date" />
            </div>
            <div>
              <Label htmlFor="check_out">Check-out Date</Label>
              <Input id="check_out" name="check_out" type="date" />
            </div>
            <div>
              <Label htmlFor="guests">Guests</Label>
              <Input id="guests" name="guests" type="number" min="1" placeholder="2" />
            </div>
          </div>

          <div>
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              name="message"
              required
              placeholder="Tell us about your trip..."
              rows={4}
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">{error}</p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Inquiry
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
