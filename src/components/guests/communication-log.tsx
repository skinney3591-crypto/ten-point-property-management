'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Mail,
  MessageSquare,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import type { GuestCommunication } from '@/types/database'

interface CommunicationLogProps {
  communications: GuestCommunication[]
  guestId: string
}

export function CommunicationLog({
  communications,
  guestId,
}: CommunicationLogProps) {
  const [expanded, setExpanded] = useState(false)

  // Sort by most recent first
  const sortedComms = [...communications].sort(
    (a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime()
  )

  const displayComms = expanded ? sortedComms : sortedComms.slice(0, 3)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base">Communication Log</CardTitle>
        <Badge variant="secondary">{communications.length}</Badge>
      </CardHeader>
      <CardContent>
        {sortedComms.length === 0 ? (
          <p className="text-sm text-muted-foreground italic">
            No communications logged yet.
          </p>
        ) : (
          <>
            <ScrollArea className={expanded ? 'h-[400px]' : ''}>
              <div className="space-y-3">
                {displayComms.map((comm) => (
                  <div
                    key={comm.id}
                    className="flex gap-3 rounded-lg border p-3"
                  >
                    <div className="flex-shrink-0">
                      {comm.type === 'email' ? (
                        <div className="rounded-full bg-blue-100 p-2">
                          <Mail className="h-4 w-4 text-blue-600" />
                        </div>
                      ) : (
                        <div className="rounded-full bg-green-100 p-2">
                          <MessageSquare className="h-4 w-4 text-green-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className={
                            comm.direction === 'out'
                              ? 'text-blue-600 border-blue-200'
                              : 'text-green-600 border-green-200'
                          }
                        >
                          {comm.direction === 'out' ? (
                            <>
                              <ArrowUpRight className="mr-1 h-3 w-3" />
                              Sent
                            </>
                          ) : (
                            <>
                              <ArrowDownLeft className="mr-1 h-3 w-3" />
                              Received
                            </>
                          )}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(comm.sent_at), 'MMM d, yyyy h:mm a')}
                        </span>
                      </div>
                      {comm.subject && (
                        <p className="text-sm font-medium truncate">
                          {comm.subject}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {comm.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {sortedComms.length > 3 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? (
                  <>
                    <ChevronUp className="mr-2 h-4 w-4" />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="mr-2 h-4 w-4" />
                    Show All ({sortedComms.length})
                  </>
                )}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
