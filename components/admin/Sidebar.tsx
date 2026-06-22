'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { authApi } from '@/lib/api/auth'
import { useToast } from '@/components/ui/Toast'

const NAV = [
  { label: 'Dashboard',  href: '/admin/' },
  { label: 'Homepage',   href: '/admin/homepage/' },
  { label: 'About',      href: '/admin/about/' },
  { label: 'Footer',     href: '/admin/footer/' },
  { label: 'CMS Pages',  href: '/admin/cms/' },
  { label: 'Help & FAQ', href: '/admin/help/' },
  { label: 'Products',   href: '/admin/products/' },
  { label: 'Categories', href: '/admin/categories/' },
  { label: 'Orders',     href: '/admin/orders/' },
  { label: 'Shipments',  href: '/admin/shipments/' },
  { label: 'Inventory',  href: '/admin/inventory/' },
  { label: 'Coupons',    href: '/admin/coupons/' },
  { label: 'Banners',    href: '/admin/banners/' },
  { label: 'Customers',  href: '/admin/customers/' },
  { label: 'Reviews',    href: '/admin/reviews/' },
  { label: 'Returns',    href: '/admin/returns/' },
  { label: 'Exchanges',  href: '/admin/exchanges/' },
  { label: 'Analytics',  href: '/admin/analytics/' },
  { label: 'GST',        href: '/admin/gst/' },
  { label: 'Newsletter', href: '/admin/newsletter/' },
  { label: 'Email Log',  href: '/admin/email-log/' },
  { label: 'Activity',   href: '/admin/activity/' },
  { label: 'Settings',   href: '/admin/settings/' },
]

interface NavLinksProps {
  pathname: string
  onLogout: () => void
}

function NavLinks({ pathname, onLogout }: NavLinksProps) {
  return (
    <>
      {NAV.map((n) => (
        <Link
          key={n.href}
          href={n.href}
          className={`flex items-center px-5 py-2.5 text-[11px] font-sans tracking-widest uppercase transition-colors ${
            // Dashboard exact match; all others: active if pathname starts with the href
            (n.href === '/admin/' ? pathname === '/admin/' : pathname.startsWith(n.href))
              ? 'bg-[#faf8f5] text-[#0a0a0a] font-medium border-l-2 border-[#c8a4a5]'
              : 'text-[#6b6b6b] hover:text-[#0a0a0a] hover:bg-[#faf8f5]'
          }`}
        >
          {n.label}
        </Link>
      ))}
      {/* Logout */}
      <button
        onClick={onLogout}
        className="flex items-center gap-2.5 w-full px-5 py-3 text-[11px] font-sans tracking-widest uppercase text-[#6b6b6b] hover:text-red-500 hover:bg-[#fef8f8] transition-colors border-t border-[#f4f2ef] mt-2"
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
  const { clearAuth } = useAuthStore()
  const { toast }   = useToast()
  const closeRef    = useRef<HTMLButtonElement>(null)

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

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────────────── */}
      <aside className="hidden md:flex md:flex-col w-56 shrink-0 border-r border-[#e8e4e0] min-h-screen">
        <div className="px-5 pt-6 pb-4">
          <p className="font-serif text-lg tracking-widest text-[#0a0a0a]">KALOKEA</p>
          <p className="text-[10px] font-sans text-[#6b6b6b] tracking-widest uppercase">Admin</p>
        </div>
        <nav aria-label="Admin navigation" className="flex-1 overflow-y-auto">
          <NavLinks pathname={pathname} onLogout={handleLogout} />
        </nav>
      </aside>

      {/* ── Mobile: backdrop ────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
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
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 md:hidden overflow-y-auto flex flex-col ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-[#e8e4e0] shrink-0">
          <div>
            <p className="font-serif text-lg tracking-widest text-[#0a0a0a]">KALOKEA</p>
            <p className="text-[10px] font-sans text-[#6b6b6b] tracking-widest uppercase">Admin</p>
          </div>
          <button
            ref={closeRef}
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-[#6b6b6b] hover:text-[#0a0a0a]"
            aria-label="Close menu"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <nav aria-label="Admin navigation mobile" className="flex-1 overflow-y-auto">
          <NavLinks pathname={pathname} onLogout={handleLogout} />
        </nav>
      </div>
    </>
  )
}
