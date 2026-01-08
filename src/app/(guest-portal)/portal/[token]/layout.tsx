import { notFound } from 'next/navigation'
import { PortalHeader } from '@/components/portal/portal-header'
import { PortalNav } from '@/components/portal/portal-nav'
import { getPortalTokenByToken, getGuestById } from '@/lib/supabase/queries'

interface PortalLayoutProps {
  children: React.ReactNode
  params: Promise<{ token: string }>
}

export default async function PortalLayout({
  children,
  params,
}: PortalLayoutProps) {
  const { token } = await params

  // Verify the token using typed helper
  const tokenData = await getPortalTokenByToken(token)

  if (!tokenData) {
    notFound()
  }

  // Check expiration
  if (new Date(tokenData.expires_at) < new Date()) {
    notFound()
  }

  const guest = await getGuestById(tokenData.guest_id)

  if (!guest) {
    notFound()
  }

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
