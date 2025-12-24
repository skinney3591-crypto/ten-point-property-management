import Link from 'next/link'
import { DeerHead } from '@/components/icons/deer-head'

export function PublicHeader() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/listings" className="flex items-center gap-2">
          <DeerHead className="h-8 w-8 text-emerald-600" />
          <span className="text-xl font-bold text-slate-900">Ten Point Properties</span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/listings"
            className="text-slate-600 hover:text-slate-900 font-medium"
          >
            Properties
          </Link>
          <Link
            href="/listings#contact"
            className="text-slate-600 hover:text-slate-900 font-medium"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  )
}
