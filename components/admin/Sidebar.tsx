'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Products', href: '/admin/products' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Inventory', href: '/admin/inventory' },
  { label: 'Coupons', href: '/admin/coupons' },
  { label: 'Banners', href: '/admin/banners' },
  { label: 'Customers', href: '/admin/customers' },
  { label: 'Reviews', href: '/admin/reviews' },
  { label: 'Returns', href: '/admin/returns' },
  { label: 'Exchanges', href: '/admin/exchanges' },
  { label: 'Analytics', href: '/admin/analytics' },
  { label: 'GST', href: '/admin/gst' },
  { label: 'Activity', href: '/admin/activity' },
  { label: 'Settings', href: '/admin/settings' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  return (
    <aside className="w-56 shrink-0 border-r border-[#e8e4e0] min-h-screen pt-6">
      <div className="px-5 mb-6">
        <p className="font-serif text-lg tracking-widest text-[#0a0a0a]">KALOKEA</p>
        <p className="text-[10px] font-sans text-[#6b6b6b] tracking-widest uppercase">Admin</p>
      </div>
      <nav>
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={`flex items-center px-5 py-2.5 text-[11px] font-sans tracking-widest uppercase transition-colors ${pathname === n.href ? 'bg-[#faf8f5] text-[#0a0a0a] font-medium' : 'text-[#6b6b6b] hover:text-[#0a0a0a]'}`}
          >
            {n.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
