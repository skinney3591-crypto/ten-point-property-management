import {
  getMaintenanceTasksWithDetails,
  getProperties,
  getVendors,
} from '@/lib/supabase/queries'
// import { redirect } from 'next/navigation' // TEMPORARILY DISABLED FOR DEMO
import { MaintenanceTable } from '@/components/maintenance/maintenance-table'
import { AddMaintenanceButton } from '@/components/maintenance/add-maintenance-button'
import { MaintenanceFilters } from '@/components/maintenance/maintenance-filters'

export default async function MaintenancePage() {
  // TEMPORARILY DISABLED FOR DEMO
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  // if (!user) {
  //   redirect('/login')
  // }

  // Fetch maintenance tasks with property and vendor info, plus properties and vendors for forms
  const [tasks, properties, vendors] = await Promise.all([
    getMaintenanceTasksWithDetails(),
    getProperties(),
    getVendors(),
  ])

  // Calculate stats
  const now = new Date()
  const today = now.toISOString().split('T')[0]

  const pendingTasks = tasks.filter(
    (t) => !t.completed_date && t.scheduled_date >= today
  ).length

  const overdueTasks = tasks.filter(
    (t) => !t.completed_date && t.scheduled_date < today
  ).length

  const completedThisMonth = tasks.filter((t) => {
    if (!t.completed_date) return false
    const completedDate = new Date(t.completed_date)
    return (
      completedDate.getMonth() === now.getMonth() &&
      completedDate.getFullYear() === now.getFullYear()
    )
  }).length

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
          properties={properties}
          vendors={vendors}
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

      <MaintenanceFilters properties={properties} />

      <MaintenanceTable
        tasks={tasks}
        properties={properties}
        vendors={vendors}
      />
    </div>
  )
}
