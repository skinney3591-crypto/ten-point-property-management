'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link2, Copy, Check, ExternalLink, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

interface GeneratePortalLinkProps {
  guestId: string
  guestName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GeneratePortalLink({
  guestId,
  guestName,
  open,
  onOpenChange,
}: GeneratePortalLinkProps) {
  const [loading, setLoading] = useState(false)
  const [portalUrl, setPortalUrl] = useState<string | null>(null)
  const [expiresAt, setExpiresAt] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const generateLink = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/portal/generate-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestId }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate link')
      }

      const data = await response.json()
      setPortalUrl(data.url)
      setExpiresAt(data.expiresAt)
      toast.success('Portal link generated!')
    } catch {
      toast.error('Failed to generate portal link')
    }

    setLoading(false)
  }

  const copyLink = async () => {
    if (!portalUrl) return

    await navigator.clipboard.writeText(portalUrl)
    setCopied(true)
    toast.success('Link copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const openLink = () => {
    if (portalUrl) {
      window.open(portalUrl, '_blank')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Guest Portal Link
          </DialogTitle>
          <DialogDescription>
            Generate a secure portal link for {guestName} to view their stays
            and property information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!portalUrl ? (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground mb-4">
                Click below to generate a secure portal link. The link will be
                valid for 30 days.
              </p>
              <Button onClick={generateLink} disabled={loading}>
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Link2 className="mr-2 h-4 w-4" />
                    Generate Link
                  </>
                )}
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label>Portal URL</Label>
                <div className="flex gap-2">
                  <Input value={portalUrl} readOnly className="font-mono text-xs" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyLink}
                    className="flex-shrink-0"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {expiresAt && (
                <p className="text-sm text-muted-foreground">
                  This link expires on{' '}
                  {new Date(expiresAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              )}

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={copyLink}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Link
                </Button>
                <Button variant="outline" className="flex-1" onClick={openLink}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Portal
                </Button>
              </div>

              <div className="border-t pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={generateLink}
                  disabled={loading}
                  className="w-full"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate New Link
                </Button>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  This will invalidate the previous link.
                </p>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
