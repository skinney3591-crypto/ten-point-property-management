'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { format, isPast, isToday } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Wrench,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { EditMaintenanceDialog } from './edit-maintenance-dialog'
import type { MaintenanceTask, Property, Vendor } from '@/types/database'

interface MaintenanceWithDetails extends MaintenanceTask {
  properties: Property
  vendors: Vendor | null
}

interface MaintenanceTableProps {
  tasks: MaintenanceWithDetails[]
  properties: Pick<Property, 'id' | 'name'>[]
  vendors: Pick<Vendor, 'id' | 'name' | 'service_type'>[]
}

const typeColors: Record<string, string> = {
  cleaning: 'bg-blue-100 text-blue-700',
  landscaping: 'bg-green-100 text-green-700',
  pool: 'bg-cyan-100 text-cyan-700',
  repair: 'bg-orange-100 text-orange-700',
  other: 'bg-gray-100 text-gray-700',
}

const typeIcons: Record<string, string> = {
  cleaning: '🧹',
  landscaping: '🌿',
  pool: '🏊',
  repair: '🔧',
  other: '📋',
}

export function MaintenanceTable({ tasks: initialTasks, properties, vendors }: MaintenanceTableProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editTask, setEditTask] = useState<MaintenanceWithDetails | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleComplete = async (task: MaintenanceWithDetails) => {
    const newCompletedDate = task.completed_date ? null : new Date().toISOString().split('T')[0]

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('maintenance_tasks') as any)
      .update({ completed_date: newCompletedDate })
      .eq('id', task.id)

    if (error) {
      toast.error('Failed to update task')
    } else {
      setTasks(
        tasks.map((t) =>
          t.id === task.id ? { ...t, completed_date: newCompletedDate } : t
        )
      )
      toast.success(newCompletedDate ? 'Task marked complete' : 'Task marked incomplete')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('maintenance_tasks') as any)
      .delete()
      .eq('id', deleteId)

    if (error) {
      toast.error('Failed to delete task')
    } else {
      setTasks(tasks.filter((t) => t.id !== deleteId))
      toast.success('Task deleted')
    }
    setDeleteId(null)
  }

  const handleTaskUpdated = (updated: MaintenanceWithDetails) => {
    setTasks(tasks.map((t) => (t.id === updated.id ? updated : t)))
    setEditTask(null)
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
        <Wrench className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No maintenance tasks</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Schedule cleaning, landscaping, pool service, and repairs.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Done</TableHead>
              <TableHead>Task</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Scheduled</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => {
              const scheduledDate = new Date(task.scheduled_date)
              const isOverdue = !task.completed_date && isPast(scheduledDate) && !isToday(scheduledDate)
              const isDueToday = !task.completed_date && isToday(scheduledDate)

              return (
                <TableRow
                  key={task.id}
                  className={task.completed_date ? 'opacity-60' : ''}
                >
                  <TableCell>
                    <Checkbox
                      checked={!!task.completed_date}
                      onCheckedChange={() => handleComplete(task)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{typeIcons[task.type]}</span>
                      <div>
                        <p className={`font-medium ${task.completed_date ? 'line-through' : ''}`}>
                          {task.title}
                        </p>
                        {task.recurring && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <RefreshCw className="h-3 w-3" />
                            Recurring
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{task.properties?.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={typeColors[task.type]}>
                      {task.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {format(scheduledDate, 'MMM d, yyyy')}
                      {isOverdue && (
                        <Badge variant="destructive" className="text-xs">
                          Overdue
                        </Badge>
                      )}
                      {isDueToday && (
                        <Badge className="bg-amber-100 text-amber-700 text-xs">
                          Today
                        </Badge>
                      )}
                      {task.completed_date && (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {task.vendors?.name || (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {task.cost ? `$${task.cost.toLocaleString()}` : '-'}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditTask(task)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteId(task.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this maintenance task? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      {editTask && (
        <EditMaintenanceDialog
          task={editTask}
          properties={properties}
          vendors={vendors}
          open={!!editTask}
          onOpenChange={(open) => !open && setEditTask(null)}
          onSuccess={handleTaskUpdated}
        />
      )}
    </>
  )
}
