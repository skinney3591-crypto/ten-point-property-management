import { createClient } from '@/lib/supabase/server'
// import { redirect } from 'next/navigation' // TEMPORARILY DISABLED FOR DEMO
import { PropertiesTable } from '@/components/properties/properties-table'
import { AddPropertyButton } from '@/components/properties/add-property-button'
import type { Property } from '@/types/database'

export default async function PropertiesPage() {
  const supabase = await createClient()

  // TEMPORARILY DISABLED FOR DEMO
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  // if (!user) {
  //   redirect('/login')
  // }

  // Fetch properties
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: properties } = (await (supabase
    .from('properties')
    .select('*')
    .order('name') as any)) as { data: Property[] | null }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Properties</h2>
          <p className="text-muted-foreground">
            Manage your vacation rental properties
          </p>
        </div>
        <AddPropertyButton />
      </div>

      <PropertiesTable properties={properties || []} />
    </div>
  )
}
