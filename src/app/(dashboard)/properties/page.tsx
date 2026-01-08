// import { redirect } from 'next/navigation' // TEMPORARILY DISABLED FOR DEMO
import { PropertiesTable } from '@/components/properties/properties-table'
import { AddPropertyButton } from '@/components/properties/add-property-button'
import { getProperties } from '@/lib/supabase/queries'

export default async function PropertiesPage() {
  // TEMPORARILY DISABLED FOR DEMO
  // const supabase = await createClient()
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  // if (!user) {
  //   redirect('/login')
  // }

  // Fetch properties using typed helper
  const properties = await getProperties()

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

      <PropertiesTable properties={properties} />
    </div>
  )
}
