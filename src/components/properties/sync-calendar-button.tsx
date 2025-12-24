'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import type { Property } from '@/types/database'

interface SyncCalendarButtonProps {
  property: Property
}

export function SyncCalendarButton({ property }: SyncCalendarButtonProps) {
  const [syncing, setSyncing] = useState(false)
  const router = useRouter()

  const hasIcalUrls = property.airbnb_ical_url || property.vrbo_ical_url

  const handleSync = async () => {
    if (!hasIcalUrls) {
      toast.error('No iCal URLs configured. Edit the property to add them.')
      return
    }

    setSyncing(true)

    try {
      const response = await fetch('/api/ical-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: property.id }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Sync failed')
      }

      toast.success(`Synced ${result.imported} bookings`)
      router.refresh()
    } catch (error) {
      console.error('Sync error:', error)
      toast.error('Failed to sync calendar')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleSync}
      disabled={syncing || !hasIcalUrls}
    >
      <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
      {syncing ? 'Syncing...' : 'Sync Calendar'}
    </Button>
  )
}
