import { createClient } from '@/lib/supabase/server'
// import { redirect } from 'next/navigation' // TEMPORARILY DISABLED FOR DEMO
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { VendorsTable } from '@/components/settings/vendors-table'
import { AddVendorButton } from '@/components/settings/add-vendor-button'
import type { Vendor } from '@/types/database'

export default async function SettingsPage() {
  const supabase = await createClient()

  // TEMPORARILY DISABLED FOR DEMO
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  // if (!user) {
  //   redirect('/login')
  // }

  // Fetch vendors
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: vendors } = (await (supabase
    .from('vendors')
    .select('*')
    .order('name') as any)) as { data: Vendor[] | null }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account and application settings
        </p>
      </div>

      <Tabs defaultValue="vendors">
        <TabsList>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="vendors" className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Vendors & Contractors</h3>
              <p className="text-sm text-muted-foreground">
                Manage the vendors you use for property maintenance.
              </p>
            </div>
            <AddVendorButton />
          </div>
          <VendorsTable vendors={vendors || []} />
        </TabsContent>

        <TabsContent value="account" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium">Email</p>
                <p className="text-muted-foreground">Demo Mode</p>
              </div>
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-muted-foreground">Demo User</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Configure email and SMS notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Notification settings coming in Phase 6.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
