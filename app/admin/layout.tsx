'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/store/useAuthStore'
import AdminSidebar from '@/components/admin/Sidebar'
import Spinner from '@/components/ui/Spinner'

/**
 * Shared admin shell: session-aware client-side guard + sidebar layout.
 *
 * Waits for `hydrated` (set by AuthBootstrap once /auth/me settles) before
 * deciding, so an admin isn't bounced to /login on a hard refresh. NOTE: this
 * is defense-in-depth only — real protection is the backend AdminGuard on every
 * /admin and mutation endpoint. (middleware.ts route protection is P1-8.)
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoggedIn, hydrated } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!hydrated) return
    if (!isLoggedIn) { router.replace(`/login/?redirect=${encodeURIComponent(pathname)}`); return }
    if (user?.role !== 'admin') { router.replace('/'); return }
  }, [hydrated, isLoggedIn, user, router, pathname])

  if (!hydrated || !isLoggedIn || user?.role !== 'admin') {
    return (
      <div className="flex justify-center items-center h-screen bg-[#faf8f5]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#faf8f5]">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <div className="md:hidden sticky top-0 z-20 bg-white border-b border-[#e8e4e0] flex items-center gap-3 px-4 h-14 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 text-[#0a0a0a]"
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <span className="font-serif text-base tracking-widest text-[#0a0a0a]">KALOKEA Admin</span>
        </div>
        <main className="flex-1 p-4 md:p-8 overflow-x-auto">{children}</main>
      </div>
    </div>
  )
}
