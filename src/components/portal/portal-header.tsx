'use client'

import { Home, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PortalHeaderProps {
  guestName: string
}

export function PortalHeader({ guestName }: PortalHeaderProps) {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary p-2">
            <Home className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold">Guest Portal</h1>
            <p className="text-xs text-muted-foreground">Ten Point Properties</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Welcome, {guestName.split(' ')[0]}
          </span>
          <Button variant="ghost" size="sm" onClick={() => window.close()}>
            <LogOut className="mr-2 h-4 w-4" />
            Exit
          </Button>
        </div>
      </div>
    </header>
  )
}
