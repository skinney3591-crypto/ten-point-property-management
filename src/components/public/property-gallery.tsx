'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PropertyGalleryProps {
  photos: string[]
  propertyName: string
}

export function PropertyGallery({ photos, propertyName }: PropertyGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  if (!photos || photos.length === 0) {
    return (
      <div className="bg-slate-200 rounded-lg h-64 md:h-96 flex items-center justify-center">
        <span className="text-slate-400">No photos available</span>
      </div>
    )
  }

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  const goToPrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length)
    }
  }

  const goToNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % photos.length)
    }
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-4 gap-2 rounded-lg overflow-hidden">
        {/* Main image */}
        <div
          className="col-span-4 md:col-span-2 md:row-span-2 relative h-64 md:h-full cursor-pointer"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={photos[0]}
            alt={`${propertyName} - Main`}
            fill
            className="object-cover hover:opacity-90 transition-opacity"
          />
        </div>

        {/* Thumbnails */}
        {photos.slice(1, 5).map((photo, idx) => (
          <div
            key={idx}
            className="relative h-32 cursor-pointer hidden md:block"
            onClick={() => openLightbox(idx + 1)}
          >
            <Image
              src={photo}
              alt={`${propertyName} - ${idx + 2}`}
              fill
              className="object-cover hover:opacity-90 transition-opacity"
            />
            {idx === 3 && photos.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold">
                  +{photos.length - 5} more
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={closeLightbox}
          >
            <X className="h-6 w-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 text-white hover:bg-white/20"
            onClick={goToPrev}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <div className="relative w-full max-w-4xl h-[80vh]">
            <Image
              src={photos[lightboxIndex]}
              alt={`${propertyName} - ${lightboxIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 text-white hover:bg-white/20"
            onClick={goToNext}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          <div className="absolute bottom-4 text-white text-sm">
            {lightboxIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  )
}
