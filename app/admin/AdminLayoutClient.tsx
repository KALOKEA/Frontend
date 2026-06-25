'use client'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { isAdminAreaUser, canAccessPath, firstAccessiblePath } from '@/lib/permissions'
import AdminSidebar from '@/components/admin/Sidebar'
import Spinner from '@/components/ui/Spinner'

/**
 * Client-side admin shell: session-aware guard + sidebar layout.
 * Rendered by the server layout.tsx which handles robots/noindex metadata.
 *
 * Access model:
 *   • full admins  → every section
 *   • staff        → only the sections their permissions allow (per-route guard)
 *   • anyone else  → bounced to the storefront
 */
export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoggedIn, hydrated } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const inAdminArea = isAdminAreaUser(user)
  const allowed = inAdminArea && canAccessPath(user, pathname)

  useEffect(() => {
    if (!hydrated) return
    if (!isLoggedIn) { router.replace(`/login/?redirect=${encodeURIComponent(pathname)}`); return }
    if (!inAdminArea) { router.replace('/'); return }
    // Staff hitting a section they're not permitted to: send them somewhere they can use.
    if (!canAccessPath(user, pathname)) { router.replace(firstAccessiblePath(user)); return }
  }, [hydrated, isLoggedIn, inAdminArea, user, router, pathname])

  if (!hydrated || !isLoggedIn || !allowed) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0b0b0d]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="admin-shell flex min-h-screen bg-[#0b0b0d] text-[#e6e6ea]">
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <div className="md:hidden sticky top-0 z-20 bg-[#101013] border-b border-[#26262d] flex items-center gap-3 px-4 h-14 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 text-[#f3f3f5]"
            aria-label="Open menu"
            aria-expanded={sidebarOpen}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <span className="font-serif text-base tracking-widest text-[#f3f3f5]">KALOKEA Admin</span>
        </div>
        <div className="flex-1 p-4 md:p-8 overflow-x-auto">{children}</div>
      </div>
    </div>
  )
}
