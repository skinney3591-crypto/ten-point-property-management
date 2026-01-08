import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PropertyGallery } from '@/components/public/property-gallery'
import { AvailabilityCalendar } from '@/components/public/availability-calendar'
import { InquiryForm } from '@/components/public/inquiry-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, Clock, DollarSign, CheckCircle } from 'lucide-react'
import type { Property } from '@/types/database'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch property metadata with typed query
  const { data: property } = await supabase
    .from('properties')
    .select('name, description')
    .eq('id', id)
    .eq('is_public', true)
    .single() as { data: { name: string; description: string | null } | null }

  if (!property) {
    return { title: 'Property Not Found' }
  }

  return {
    title: `${property.name} | Ten Point Properties`,
    description: property.description || 'Montana vacation rental property',
  }
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch property with typed query
  const { data: property, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .eq('is_public', true)
    .single() as { data: Property | null; error: unknown }

  if (error || !property) {
    notFound()
  }

  // Fetch bookings for availability calendar
  const today = new Date().toISOString().split('T')[0]
  const { data: bookings } = await supabase
    .from('bookings')
    .select('check_in, check_out')
    .eq('property_id', id)
    .gte('check_out', today)
    .neq('status', 'cancelled')

  const photos = (property.photos as string[]) || []
  const amenities = (property.amenities as string[]) || []

  return (
    <div className="min-h-screen">
      {/* Gallery */}
      <div className="container mx-auto px-4 py-6">
        <PropertyGallery photos={photos} propertyName={property.name} />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {property.name}
              </h1>
              <div className="flex items-center text-slate-500">
                <MapPin className="h-5 w-5 mr-1" />
                {property.address}
              </div>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-4">
              {property.nightly_rate && (
                <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg">
                  <DollarSign className="h-5 w-5" />
                  <span className="font-semibold">${property.nightly_rate}</span>
                  <span className="text-emerald-600">/night</span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg">
                <Clock className="h-5 w-5" />
                <span>Check-in: {property.check_in_time || '3:00 PM'}</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg">
                <Clock className="h-5 w-5" />
                <span>Check-out: {property.check_out_time || '11:00 AM'}</span>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <Card>
                <CardHeader>
                  <CardTitle>About This Property</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 whitespace-pre-wrap">
                    {property.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Amenities */}
            {amenities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {amenities.map((amenity: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                        <span className="text-slate-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* House Rules */}
            {property.house_rules && (
              <Card>
                <CardHeader>
                  <CardTitle>House Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 whitespace-pre-wrap">
                    {property.house_rules}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Availability Calendar */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Availability</h3>
              <AvailabilityCalendar bookings={bookings || []} />
            </div>

            {/* Inquiry Form */}
            <InquiryForm propertyId={property.id} propertyName={property.name} />
          </div>
        </div>
      </div>
    </div>
  )
}
