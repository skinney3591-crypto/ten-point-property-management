import { Mountain } from 'lucide-react'

export function PublicFooter() {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Mountain className="h-6 w-6 text-emerald-400" />
              <span className="text-lg font-bold">Ten Point Properties</span>
            </div>
            <p className="text-slate-400 text-sm">
              Premium vacation rentals in beautiful Montana.
              Experience the mountains like never before.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="text-slate-400 text-sm space-y-2">
              <p>Montana, USA</p>
              <p>info@tenpointproperties.com</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="text-slate-400 text-sm space-y-2">
              <p>
                <a href="/listings" className="hover:text-white">
                  Browse Properties
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} Ten Point Properties. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
