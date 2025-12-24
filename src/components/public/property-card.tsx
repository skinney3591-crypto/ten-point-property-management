import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Users, Bed } from 'lucide-react'

interface PropertyCardProps {
  id: string
  name: string
  address: string
  description: string | null
  photos: string[]
  nightly_rate: number | null
  amenities: string[]
}

export function PropertyCard({
  id,
  name,
  address,
  description,
  photos,
  nightly_rate,
  amenities,
}: PropertyCardProps) {
  const mainPhoto = photos?.[0] || '/placeholder-property.jpg'
  const bedroomCount = amenities?.find((a: string) => a.toLowerCase().includes('bedroom'))
  const guestCount = amenities?.find((a: string) => a.toLowerCase().includes('guest'))

  return (
    <Link href={`/listings/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
        <div className="relative h-48 bg-slate-200">
          {photos && photos.length > 0 ? (
            <Image
              src={mainPhoto}
              alt={name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-slate-400">
              <MapPin className="h-12 w-12" />
            </div>
          )}
          {nightly_rate && (
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="font-bold text-emerald-700">${nightly_rate}</span>
              <span className="text-slate-600 text-sm">/night</span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg text-slate-900 mb-1">{name}</h3>
          <div className="flex items-center text-slate-500 text-sm mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            {address}
          </div>
          {description && (
            <p className="text-slate-600 text-sm line-clamp-2 mb-3">{description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-slate-500">
            {bedroomCount && (
              <span className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                {bedroomCount}
              </span>
            )}
            {guestCount && (
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {guestCount}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
