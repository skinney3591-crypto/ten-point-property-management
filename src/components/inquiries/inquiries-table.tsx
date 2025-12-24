'use client'

import { useState } from 'react'
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
import { MoreHorizontal, Mail, Phone, Calendar, Users, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface Inquiry {
  id: string
  property_id: string
  name: string
  email: string
  phone: string | null
  check_in: string | null
  check_out: string | null
  guests: number | null
  message: string
  status: 'new' | 'contacted' | 'converted' | 'declined'
  created_at: string
  properties: {
    id: string
    name: string
  }
}

interface InquiriesTableProps {
  inquiries: Inquiry[]
}

const statusColors = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  converted: 'bg-green-100 text-green-700',
  declined: 'bg-red-100 text-red-700',
}

export function InquiriesTable({ inquiries: initialInquiries }: InquiriesTableProps) {
  const [inquiries, setInquiries] = useState(initialInquiries)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)

  const updateStatus = async (id: string, status: string) => {
    const supabase = createClient()

    const { error } = await (supabase
      .from('inquiries') as any)
      .update({ status })
      .eq('id', id)

    if (error) {
      toast.error('Failed to update status')
      return
    }

    setInquiries(inquiries.map(i =>
      i.id === id ? { ...i, status: status as Inquiry['status'] } : i
    ))
    toast.success('Status updated')
  }

  if (inquiries.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <MessageSquare className="h-12 w-12 mx-auto text-slate-300 mb-4" />
        <h3 className="text-lg font-medium text-slate-600 mb-1">No inquiries yet</h3>
        <p className="text-slate-500 text-sm">
          Inquiries from your public listings will appear here.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Guest</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Received</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.map((inquiry) => (
              <TableRow key={inquiry.id} className="cursor-pointer" onClick={() => setSelectedInquiry(inquiry)}>
                <TableCell>
                  <div>
                    <div className="font-medium">{inquiry.name}</div>
                    <div className="text-sm text-slate-500 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {inquiry.email}
                    </div>
                    {inquiry.phone && (
                      <div className="text-sm text-slate-500 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {inquiry.phone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{inquiry.properties?.name}</TableCell>
                <TableCell>
                  {inquiry.check_in && inquiry.check_out ? (
                    <div className="flex items-center gap-1 text-sm">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(inquiry.check_in), 'MMM d')} - {format(new Date(inquiry.check_out), 'MMM d, yyyy')}
                    </div>
                  ) : (
                    <span className="text-slate-400">Not specified</span>
                  )}
                  {inquiry.guests && (
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <Users className="h-3 w-3" />
                      {inquiry.guests} guests
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[inquiry.status]}>
                    {inquiry.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-slate-500">
                  {format(new Date(inquiry.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => updateStatus(inquiry.id, 'contacted')}>
                        Mark as Contacted
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus(inquiry.id, 'converted')}>
                        Mark as Converted
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => updateStatus(inquiry.id, 'declined')}>
                        Mark as Declined
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Inquiry Detail Dialog */}
      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Inquiry from {selectedInquiry?.name}</DialogTitle>
          </DialogHeader>
          {selectedInquiry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-500">Email</div>
                  <a href={`mailto:${selectedInquiry.email}`} className="text-blue-600 hover:underline">
                    {selectedInquiry.email}
                  </a>
                </div>
                {selectedInquiry.phone && (
                  <div>
                    <div className="text-slate-500">Phone</div>
                    <a href={`tel:${selectedInquiry.phone}`} className="text-blue-600 hover:underline">
                      {selectedInquiry.phone}
                    </a>
                  </div>
                )}
                <div>
                  <div className="text-slate-500">Property</div>
                  <div>{selectedInquiry.properties?.name}</div>
                </div>
                <div>
                  <div className="text-slate-500">Status</div>
                  <Badge className={statusColors[selectedInquiry.status]}>
                    {selectedInquiry.status}
                  </Badge>
                </div>
                {selectedInquiry.check_in && (
                  <div>
                    <div className="text-slate-500">Check-in</div>
                    <div>{format(new Date(selectedInquiry.check_in), 'MMM d, yyyy')}</div>
                  </div>
                )}
                {selectedInquiry.check_out && (
                  <div>
                    <div className="text-slate-500">Check-out</div>
                    <div>{format(new Date(selectedInquiry.check_out), 'MMM d, yyyy')}</div>
                  </div>
                )}
                {selectedInquiry.guests && (
                  <div>
                    <div className="text-slate-500">Guests</div>
                    <div>{selectedInquiry.guests}</div>
                  </div>
                )}
              </div>
              <div>
                <div className="text-slate-500 text-sm mb-1">Message</div>
                <div className="bg-slate-50 p-3 rounded-lg text-sm whitespace-pre-wrap">
                  {selectedInquiry.message}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    updateStatus(selectedInquiry.id, 'contacted')
                    setSelectedInquiry(null)
                  }}
                >
                  Mark Contacted
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    updateStatus(selectedInquiry.id, 'converted')
                    setSelectedInquiry(null)
                  }}
                >
                  Mark Converted
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
