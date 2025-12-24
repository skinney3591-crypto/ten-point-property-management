'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Home, Calendar, FileText, MessageSquare } from 'lucide-react'

interface PortalNavProps {
  token: string
}

export function PortalNav({ token }: PortalNavProps) {
  const pathname = usePathname()
  const basePath = `/portal/${token}`

  const navItems = [
    { href: basePath, label: 'Home', icon: Home },
    { href: `${basePath}/stays`, label: 'My Stays', icon: Calendar },
    { href: `${basePath}/rebook`, label: 'Book Again', icon: FileText },
    { href: `${basePath}/contact`, label: 'Contact', icon: MessageSquare },
  ]

  return (
    <nav className="flex gap-1 rounded-lg bg-white p-1 shadow-sm">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== basePath && pathname.startsWith(item.href))

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <item.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
