'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { authApi } from '@/lib/api/auth'
import { useToast } from '@/components/ui/Toast'
import { ADMIN_NAV, type AdminNavItem, type MinimalUser } from '@/lib/permissions'

/** Which nav items this user is allowed to see. */
function visibleNav(user: MinimalUser | null | undefined): AdminNavItem[] {
  if (!user) return []
  if (user.role === 'admin') return ADMIN_NAV
  if (user.role !== 'staff') return []
  const perms = Array.isArray(user.permissions) ? user.permissions : []
  return ADMIN_NAV.filter((n) => {
    if (n.owner) return false // owner/full-admin only
    if (n.perm) return perms.includes(n.perm)
    return true // shared (dashboard)
  })
}

interface NavLinksProps {
  items: AdminNavItem[]
  pathname: string
  onLogout: () => void
}

function NavLinks({ items, pathname, onLogout }: NavLinksProps) {
  return (
    <>
      {items.map((n) => {
        const active = n.href === '/admin/' ? pathname === '/admin/' : pathname.startsWith(n.href)
        return (
          <Link
            key={n.href}
            href={n.href}
            className={`flex items-center px-5 py-2.5 text-[11px] font-sans tracking-widest uppercase transition-colors ${
              active
                ? 'bg-[#1c1c22] text-[#e8c98a] font-medium border-l-2 border-[#c9a96a]'
                : 'text-[#9a9aa3] hover:text-[#f3f3f5] hover:bg-[#17171b] border-l-2 border-transparent'
            }`}
          >
            {n.label}
          </Link>
        )
      })}
      {/* Logout */}
      <button
        onClick={onLogout}
        className="flex items-center gap-2.5 w-full px-5 py-3 text-[11px] font-sans tracking-widest uppercase text-[#9a9aa3] hover:text-red-400 hover:bg-[#1f1416] transition-colors border-t border-[#26262d] mt-2"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Logout
      </button>
    </>
  )
}

interface SidebarProps {
  open?: boolean
  onClose?: () => void
}

export default function AdminSidebar({ open = false, onClose }: SidebarProps) {
  const pathname    = usePathname()
  const router      = useRouter()
  const { user, clearAuth } = useAuthStore()
  const { toast }   = useToast()
  const closeRef    = useRef<HTMLButtonElement>(null)

  const items = visibleNav(user)
  const isStaff = user?.role === 'staff'

  // Auto-close mobile drawer on navigation
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { onClose?.() }, [pathname])

  // Escape key + focus trap when mobile drawer opens
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', handler)
    const focusTimer = setTimeout(() => closeRef.current?.focus(), 30)
    return () => {
      window.removeEventListener('keydown', handler)
      clearTimeout(focusTimer)
    }
  }, [open, onClose])

  const handleLogout = async () => {
    await authApi.logout().catch(() => {})
    clearAuth()
    toast('Logged out')
    router.push('/')
  }

  const brand = (
    <div>
      <p className="font-serif text-lg tracking-widest text-[#f3f3f5]">KALOKEA</p>
      <p className="text-[10px] font-sans text-[#8a8a93] tracking-widest uppercase">
        {isStaff ? 'Staff' : 'Admin'}
      </p>
    </div>
  )

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────────────── */}
      <aside className="hidden md:flex md:flex-col w-56 shrink-0 border-r border-[#26262d] bg-[#101013] min-h-screen">
        <div className="px-5 pt-6 pb-4">{brand}</div>
        <nav aria-label="Admin navigation" className="flex-1 overflow-y-auto">
          <NavLinks items={items} pathname={pathname} onLogout={handleLogout} />
        </nav>
      </aside>

      {/* ── Mobile: backdrop ────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile: slide-in drawer ──────────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Admin navigation"
        inert={!open ? true : undefined}
        className={`fixed top-0 left-0 h-full w-64 bg-[#101013] z-50 transform transition-transform duration-300 md:hidden overflow-y-auto flex flex-col ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-[#26262d] shrink-0">
          {brand}
          <button
            ref={closeRef}
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-[#9a9aa3] hover:text-[#f3f3f5]"
            aria-label="Close menu"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <nav aria-label="Admin navigation mobile" className="flex-1 overflow-y-auto">
          <NavLinks items={items} pathname={pathname} onLogout={handleLogout} />
        </nav>
      </div>
    </>
  )
}
