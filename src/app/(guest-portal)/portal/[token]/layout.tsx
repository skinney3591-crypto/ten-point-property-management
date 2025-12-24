import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PortalHeader } from '@/components/portal/portal-header'
import { PortalNav } from '@/components/portal/portal-nav'
import type { Guest } from '@/types/database'

interface PortalLayoutProps {
  children: React.ReactNode
  params: Promise<{ token: string }>
}

export default async function PortalLayout({
  children,
  params,
}: PortalLayoutProps) {
  const { token } = await params
  const supabase = await createClient()

  // Verify the token
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: tokenData } = await (supabase
    .from('guest_portal_tokens')
    .select('*, guests(*)')
    .eq('token', token)
    .single() as any) as { data: { guests: Guest; expires_at: string } | null }

  if (!tokenData) {
    notFound()
  }

  // Check expiration
  if (new Date(tokenData.expires_at) < new Date()) {
    notFound()
  }

  const guest = tokenData.guests

  return (
    <div className="min-h-screen bg-gray-50">
      <PortalHeader guestName={guest.name} />
      <div className="mx-auto max-w-4xl px-4 py-8">
        <PortalNav token={token} />
        <main className="mt-6">{children}</main>
      </div>
    </div>
  )
}
