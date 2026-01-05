import { createClient } from '@/lib/supabase/server'
// import { redirect } from 'next/navigation' // TEMPORARILY DISABLED FOR DEMO
import { DashboardCalendar } from '@/components/calendar/dashboard-calendar'
import { UpcomingTasks } from '@/components/dashboard/upcoming-tasks'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, Building2, DollarSign } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  // TEMPORARILY DISABLED FOR DEMO
  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  // if (!user) {
  //   redirect('/login')
  // }

  // Fetch summary stats
  const [
    { count: propertyCount },
    { count: guestCount },
    { count: upcomingBookings },
  ] = await Promise.all([
    supabase.from('properties').select('*', { count: 'exact', head: true }),
    supabase.from('guests').select('*', { count: 'exact', head: true }),
    supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .gte('check_in', new Date().toISOString().split('T')[0]),
  ])

  const stats = [
    {
      name: 'Properties',
      value: propertyCount || 0,
      icon: Building2,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      name: 'Guests',
      value: guestCount || 0,
      icon: Users,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
    },
    {
      name: 'Upcoming Bookings',
      value: upcomingBookings || 0,
      icon: Calendar,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
    },
    {
      name: 'This Month Revenue',
      value: '$0',
      icon: DollarSign,
      color: 'text-amber-600',
      bg: 'bg-amber-100',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your properties.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.name}
              </CardTitle>
              <div className={`rounded-full p-2 ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* To Do This Week */}
      <UpcomingTasks />

      {/* Calendar */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <DashboardCalendar />
        </CardContent>
      </Card>
    </div>
  )
}
