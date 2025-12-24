'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Wrench,
  LogIn,
  LogOut,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react'
import { format, isToday, isTomorrow, addDays } from 'date-fns'

interface TaskItem {
  id: string
  type: 'maintenance' | 'check-in' | 'check-out'
  title: string
  subtitle: string
  date: Date
  status?: string
  priority?: string
}

export function UpcomingTasks() {
  const [tasks, setTasks] = useState<TaskItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchUpcomingTasks() {
      const today = new Date()
      const nextWeek = addDays(today, 7)
      const todayStr = today.toISOString().split('T')[0]
      const nextWeekStr = nextWeek.toISOString().split('T')[0]

      const allTasks: TaskItem[] = []

      // Fetch maintenance tasks for the next week
      const { data: maintenanceTasks } = await (supabase
        .from('maintenance_tasks') as any)
        .select(`
          id,
          type,
          description,
          scheduled_date,
          status,
          priority,
          properties:property_id (name)
        `)
        .gte('scheduled_date', todayStr)
        .lte('scheduled_date', nextWeekStr)
        .neq('status', 'completed')
        .order('scheduled_date')

      if (maintenanceTasks) {
        maintenanceTasks.forEach((task: any) => {
          allTasks.push({
            id: `maintenance-${task.id}`,
            type: 'maintenance',
            title: task.type.charAt(0).toUpperCase() + task.type.slice(1),
            subtitle: task.properties?.name || 'Unknown property',
            date: new Date(task.scheduled_date),
            status: task.status,
            priority: task.priority,
          })
        })
      }

      // Fetch check-ins for the next week
      const { data: checkIns } = await (supabase
        .from('bookings') as any)
        .select(`
          id,
          check_in,
          guests:guest_id (name),
          properties:property_id (name)
        `)
        .gte('check_in', todayStr)
        .lte('check_in', nextWeekStr)
        .order('check_in')

      if (checkIns) {
        checkIns.forEach((booking: any) => {
          allTasks.push({
            id: `checkin-${booking.id}`,
            type: 'check-in',
            title: `Check-in: ${booking.guests?.name || 'Guest'}`,
            subtitle: booking.properties?.name || 'Unknown property',
            date: new Date(booking.check_in),
          })
        })
      }

      // Fetch check-outs for the next week
      const { data: checkOuts } = await (supabase
        .from('bookings') as any)
        .select(`
          id,
          check_out,
          guests:guest_id (name),
          properties:property_id (name)
        `)
        .gte('check_out', todayStr)
        .lte('check_out', nextWeekStr)
        .order('check_out')

      if (checkOuts) {
        checkOuts.forEach((booking: any) => {
          allTasks.push({
            id: `checkout-${booking.id}`,
            type: 'check-out',
            title: `Check-out: ${booking.guests?.name || 'Guest'}`,
            subtitle: booking.properties?.name || 'Unknown property',
            date: new Date(booking.check_out),
          })
        })
      }

      // Sort all tasks by date
      allTasks.sort((a, b) => a.date.getTime() - b.date.getTime())

      setTasks(allTasks)
      setLoading(false)
    }

    fetchUpcomingTasks()
  }, [supabase])

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    return format(date, 'EEE, MMM d')
  }

  const getIcon = (type: TaskItem['type']) => {
    switch (type) {
      case 'maintenance':
        return <Wrench className="h-4 w-4" />
      case 'check-in':
        return <LogIn className="h-4 w-4" />
      case 'check-out':
        return <LogOut className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: TaskItem['type']) => {
    switch (type) {
      case 'maintenance':
        return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'check-in':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'check-out':
        return 'bg-blue-100 text-blue-700 border-blue-200'
    }
  }

  const getPriorityIcon = (priority?: string) => {
    if (priority === 'urgent') {
      return <AlertCircle className="h-3 w-3 text-red-500" />
    }
    if (priority === 'high') {
      return <Clock className="h-3 w-3 text-orange-500" />
    }
    return null
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            To Do This Week
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          To Do This Week
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-slate-300" />
            <p>No tasks scheduled for this week</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.slice(0, 10).map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 p-3 rounded-lg border bg-white hover:bg-slate-50 transition-colors"
              >
                <div className={`p-2 rounded-full ${getTypeColor(task.type)}`}>
                  {getIcon(task.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm truncate">{task.title}</p>
                    {getPriorityIcon(task.priority)}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {task.subtitle}
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    variant="outline"
                    className={isToday(task.date) ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                  >
                    {getDateLabel(task.date)}
                  </Badge>
                  {task.status && task.status !== 'pending' && (
                    <p className="text-xs text-muted-foreground mt-1 capitalize">
                      {task.status}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {tasks.length > 10 && (
              <p className="text-center text-sm text-muted-foreground pt-2">
                +{tasks.length - 10} more tasks
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
