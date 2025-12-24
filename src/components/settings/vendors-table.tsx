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
import { Badge } from '@/components/ui/badge'
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
import { MoreHorizontal, Pencil, Trash2, Users, Mail, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { EditVendorDialog } from './edit-vendor-dialog'
import type { Vendor } from '@/types/database'

interface VendorsTableProps {
  vendors: Vendor[]
}

const serviceTypeColors: Record<string, string> = {
  cleaning: 'bg-blue-100 text-blue-700',
  landscaping: 'bg-green-100 text-green-700',
  pool: 'bg-cyan-100 text-cyan-700',
  plumbing: 'bg-orange-100 text-orange-700',
  electrical: 'bg-yellow-100 text-yellow-700',
  hvac: 'bg-purple-100 text-purple-700',
  general: 'bg-gray-100 text-gray-700',
}

export function VendorsTable({ vendors: initialVendors }: VendorsTableProps) {
  const [vendors, setVendors] = useState(initialVendors)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editVendor, setEditVendor] = useState<Vendor | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!deleteId) return

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from('vendors') as any)
      .delete()
      .eq('id', deleteId)

    if (error) {
      toast.error('Failed to delete vendor')
    } else {
      setVendors(vendors.filter((v) => v.id !== deleteId))
      toast.success('Vendor deleted')
    }
    setDeleteId(null)
  }

  const handleVendorUpdated = (updated: Vendor) => {
    setVendors(vendors.map((v) => (v.id === updated.id ? updated : v)))
    setEditVendor(null)
  }

  if (vendors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12">
        <Users className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No vendors yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Add vendors to assign them to maintenance tasks.
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
              <TableHead>Service Type</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell className="font-medium">{vendor.name}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={serviceTypeColors[vendor.service_type.toLowerCase()] || serviceTypeColors.general}
                  >
                    {vendor.service_type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    {vendor.email && (
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        {vendor.email}
                      </div>
                    )}
                    {vendor.phone && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {vendor.phone}
                      </div>
                    )}
                    {!vendor.email && !vendor.phone && (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {vendor.notes || <span className="text-muted-foreground">-</span>}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditVendor(vendor)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteId(vendor.id)}
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

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Vendor</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this vendor? Maintenance tasks
              assigned to this vendor will be unassigned.
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
      {editVendor && (
        <EditVendorDialog
          vendor={editVendor}
          open={!!editVendor}
          onOpenChange={(open) => !open && setEditVendor(null)}
          onSuccess={handleVendorUpdated}
        />
      )}
    </>
  )
}
