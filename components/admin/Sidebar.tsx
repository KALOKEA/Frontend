'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const NAV = [
  { label: 'Dashboard',  href: '/admin' },
  { label: 'Homepage',   href: '/admin/homepage' },
  { label: 'CMS Pages',  href: '/admin/cms' },
  { label: 'Products',   href: '/admin/products' },
  { label: 'Categories', href: '/admin/categories' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Shipments', href: '/admin/shipments' },
  { label: 'Inventory', href: '/admin/inventory' },
  { label: 'Coupons', href: '/admin/coupons' },
  { label: 'Banners', href: '/admin/banners' },
  { label: 'Customers', href: '/admin/customers' },
  { label: 'Reviews', href: '/admin/reviews' },
  { label: 'Returns', href: '/admin/returns' },
  { label: 'Exchanges', href: '/admin/exchanges' },
  { label: 'Analytics', href: '/admin/analytics' },
  { label: 'GST', href: '/admin/gst' },
  { label: 'Newsletter', href: '/admin/newsletter' },
  { label: 'Email Log', href: '/admin/email-log' },
  { label: 'Activity', href: '/admin/activity' },
  { label: 'Settings', href: '/admin/settings' },
]

interface SidebarProps {
  open?: boolean
  onClose?: () => void
}

export default function AdminSidebar({ open = false, onClose }: SidebarProps) {
  const pathname = usePathname()

  // Auto-close mobile drawer on navigation
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { onClose?.() }, [pathname])

  const NavLinks = () => (
    <>
      {NAV.map((n) => (
        <Link
          key={n.href}
          href={n.href}
          className={`flex items-center px-5 py-2.5 text-[11px] font-sans tracking-widest uppercase transition-colors ${
            pathname === n.href
              ? 'bg-[#faf8f5] text-[#0a0a0a] font-medium border-l-2 border-[#c8a4a5]'
              : 'text-[#6b6b6b] hover:text-[#0a0a0a] hover:bg-[#faf8f5]'
          }`}
        >
          {n.label}
        </Link>
      ))}
    </>
  )

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────────── */}
      <aside className="hidden md:block w-56 shrink-0 border-r border-[#e8e4e0] min-h-screen pt-6">
        <div className="px-5 mb-6">
          <p className="font-serif text-lg tracking-widest text-[#0a0a0a]">KALOKEA</p>
          <p className="text-[10px] font-sans text-[#6b6b6b] tracking-widest uppercase">Admin</p>
        </div>
        <nav><NavLinks /></nav>
      </aside>

      {/* ── Mobile: backdrop ────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* ── Mobile: slide-in drawer ──────────────────────────────── */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 md:hidden overflow-y-auto ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-[#e8e4e0]">
          <div>
            <p className="font-serif text-lg tracking-widest text-[#0a0a0a]">KALOKEA</p>
            <p className="text-[10px] font-sans text-[#6b6b6b] tracking-widest uppercase">Admin</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-[#6b6b6b] hover:text-[#0a0a0a] text-2xl leading-none"
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        <nav><NavLinks /></nav>
      </div>
    </>
  )
}
