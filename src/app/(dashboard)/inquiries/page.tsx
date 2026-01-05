import { createClient } from '@/lib/supabase/server'
// import { redirect } from 'next/navigation' // TEMPORARILY DISABLED FOR DEMO
import { InquiriesTable } from '@/components/inquiries/inquiries-table'

export const metadata = {
  title: 'Inquiries',
}

export default async function InquiriesPage() {
  const supabase = await createClient()

  // TEMPORARILY DISABLED FOR DEMO
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  // if (!user) {
  //   redirect('/login')
  // }

  // Fetch inquiries for user's properties
  const { data: inquiries, error } = await (supabase
    .from('inquiries') as any)
    .select(`
      *,
      properties (
        id,
        name
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching inquiries:', error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Inquiries</h2>
        <p className="text-muted-foreground">
          Manage booking inquiries from potential guests.
        </p>
      </div>

      <InquiriesTable inquiries={inquiries || []} />
    </div>
  )
}
