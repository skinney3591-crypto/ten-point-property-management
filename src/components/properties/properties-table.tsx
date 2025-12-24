'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
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
import { MoreHorizontal, Pencil, Trash2, Eye, Calendar } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Property } from '@/types/database'
import { EditPropertyDialog } from './edit-property-dialog'

interface PropertiesTableProps {
  properties: Property[]
}

export function PropertiesTable({ properties: initialProperties }: PropertiesTableProps) {
  const [properties, setProperties] = useState(initialProperties)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editProperty, setEditProperty] = useState<Property | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!deleteId) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase
      .from('properties')
      .delete()
      .eq('id', deleteId) as any)

    if (error) {
      toast.error('Failed to delete property')
    } else {
      setProperties(properties.filter((p) => p.id !== deleteId))
      toast.success('Property deleted')
    }
    setDeleteId(null)
  }

  const handlePropertyUpdated = (updated: Property) => {
    setProperties(properties.map((p) => (p.id === updated.id ? updated : p)))
    setEditProperty(null)
  }

  if (properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
        <Calendar className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No properties yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Add your first property to get started managing bookings.
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
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Check-in</TableHead>
              <TableHead>Check-out</TableHead>
              <TableHead>iCal Sync</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium">{property.name}</TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {property.address}
                </TableCell>
                <TableCell>{property.check_in_time || '3:00 PM'}</TableCell>
                <TableCell>{property.check_out_time || '11:00 AM'}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {property.airbnb_ical_url && (
                      <span className="rounded bg-rose-100 px-2 py-0.5 text-xs text-rose-700">
                        Airbnb
                      </span>
                    )}
                    {property.vrbo_ical_url && (
                      <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                        VRBO
                      </span>
                    )}
                    {!property.airbnb_ical_url && !property.vrbo_ical_url && (
                      <span className="text-xs text-muted-foreground">None</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => router.push(`/properties/${property.id}`)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditProperty(property)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteId(property.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this property? This will also delete
              all associated bookings and maintenance tasks. This action cannot be
              undone.
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

      {/* Edit Property Dialog */}
      {editProperty && (
        <EditPropertyDialog
          property={editProperty}
          open={!!editProperty}
          onOpenChange={(open) => !open && setEditProperty(null)}
          onSuccess={handlePropertyUpdated}
        />
      )}
    </>
  )
}
