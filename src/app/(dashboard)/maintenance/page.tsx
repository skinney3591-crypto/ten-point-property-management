import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { MaintenanceTable } from '@/components/maintenance/maintenance-table'
import { AddMaintenanceButton } from '@/components/maintenance/add-maintenance-button'
import { MaintenanceFilters } from '@/components/maintenance/maintenance-filters'
import type { MaintenanceTask, Property, Vendor } from '@/types/database'

interface MaintenanceWithDetails extends MaintenanceTask {
  properties: Property
  vendors: Vendor | null
}

export default async function MaintenancePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch maintenance tasks with property and vendor info
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: tasks } = (await (supabase
    .from('maintenance_tasks')
    .select('*, properties(*), vendors(*)')
    .order('scheduled_date', { ascending: true }) as any)) as { data: MaintenanceWithDetails[] | null }

  // Fetch properties for the filter/form
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: properties } = (await (supabase
    .from('properties')
    .select('id, name')
    .order('name') as any)) as { data: Pick<Property, 'id' | 'name'>[] | null }

  // Fetch vendors for the form
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: vendors } = (await (supabase
    .from('vendors')
    .select('id, name, service_type')
    .order('name') as any)) as { data: Pick<Vendor, 'id' | 'name' | 'service_type'>[] | null }

  // Calculate stats
  const now = new Date()
  const today = now.toISOString().split('T')[0]

  const pendingTasks = tasks?.filter(
    (t) => !t.completed_date && t.scheduled_date >= today
  ).length || 0

  const overdueTasks = tasks?.filter(
    (t) => !t.completed_date && t.scheduled_date < today
  ).length || 0

  const completedThisMonth = tasks?.filter((t) => {
    if (!t.completed_date) return false
    const completedDate = new Date(t.completed_date)
    return (
      completedDate.getMonth() === now.getMonth() &&
      completedDate.getFullYear() === now.getFullYear()
    )
  }).length || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Maintenance</h2>
          <p className="text-muted-foreground">
            Schedule and track maintenance tasks for your properties
          </p>
        </div>
        <AddMaintenanceButton
          properties={properties || []}
          vendors={vendors || []}
        />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Upcoming Tasks</p>
          <p className="text-2xl font-bold text-blue-600">{pendingTasks}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Overdue</p>
          <p className="text-2xl font-bold text-red-600">{overdueTasks}</p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Completed This Month</p>
          <p className="text-2xl font-bold text-green-600">{completedThisMonth}</p>
        </div>
      </div>

      <MaintenanceFilters properties={properties || []} />

      <MaintenanceTable
        tasks={tasks || []}
        properties={properties || []}
        vendors={vendors || []}
      />
    </div>
  )
}
