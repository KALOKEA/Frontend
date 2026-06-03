'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { adminApi, type DashboardStats, type AdminOrder } from '@/lib/api/admin'
import StatsCard from '@/components/admin/StatsCard'
import Spinner from '@/components/ui/Spinner'
import { formatPrice } from '@/lib/utils/formatPrice'

const ORDER_STATUS_COLOR: Record<string, string> = {
  pending:   'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped:   'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-700',
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      adminApi.getDashboard().catch(() => null),
      adminApi.getRecentOrders().catch(() => []),
    ]).then(([s, o]) => {
      if (s) setStats(s as DashboardStats)
      setRecentOrders(o as AdminOrder[])
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center items-center h-96"><Spinner size="lg" /></div>

  const lowStock = stats?.low_stock_variants || []

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl text-[#0a0a0a]">Dashboard</h1>
        <p className="text-xs text-[#9b9b9b]">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Stats row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Revenue (This Month)" value={formatPrice(stats.revenue_this_month)} />
          <StatsCard title="Orders (This Month)" value={stats.orders_this_month} />
          <StatsCard title="New Customers" value={stats.new_customers} />
          <StatsCard title="Pending Orders" value={stats.pending_orders} sub={lowStock.length ? `${lowStock.length} low-stock alerts` : undefined} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders — takes 2/3 width */}
        <div className="lg:col-span-2 bg-white border border-[#e8e4e0]">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0ece8]">
            <h2 className="font-serif text-lg text-[#0a0a0a]">Recent Orders</h2>
            <Link href="/admin/orders" className="text-[11px] uppercase tracking-widest text-[#c8a4a5] hover:underline">
              View all →
            </Link>
          </div>
          {recentOrders.length ? (
            <table className="w-full text-sm font-sans">
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.id} className="border-b border-[#f0ece8] last:border-0 hover:bg-[#faf8f5]">
                    <td className="px-5 py-3 font-medium text-[#0a0a0a]">{o.order_number}</td>
                    <td className="px-5 py-3 text-[#6b6b6b] text-xs">{o.users?.name || 'Guest'}</td>
                    <td className="px-5 py-3">{formatPrice(o.total)}</td>
                    <td className="px-5 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-widest ${ORDER_STATUS_COLOR[o.status] || 'bg-gray-100 text-gray-600'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[#9b9b9b] text-xs text-right whitespace-nowrap">
                      {new Date(o.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="px-5 py-10 text-sm text-[#6b6b6b] text-center">No orders yet</p>
          )}
        </div>

        {/* Right column — low stock + quick links */}
        <div className="space-y-6">
          {/* Low stock */}
          <div className="bg-white border border-[#e8e4e0]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#f0ece8]">
              <h2 className="font-serif text-lg text-[#0a0a0a]">Low Stock</h2>
              <Link href="/admin/inventory" className="text-[11px] uppercase tracking-widest text-[#c8a4a5] hover:underline">
                Manage →
              </Link>
            </div>
            {lowStock.length ? (
              <ul className="divide-y divide-[#f0ece8]">
                {lowStock.map((v: any) => (
                  <li key={v.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm text-[#0a0a0a]">{v.products?.name || '—'}</p>
                      <p className="text-[10px] text-[#9b9b9b]">{v.sku}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${v.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {v.stock} left
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-6 text-sm text-[#6b6b6b] text-center">All variants are well-stocked ✓</p>
            )}
          </div>

          {/* Quick links */}
          <div className="bg-white border border-[#e8e4e0] p-5">
            <h2 className="font-serif text-lg text-[#0a0a0a] mb-4">Quick actions</h2>
            <div className="space-y-2">
              {[
                { label: '+ Add new product', href: '/admin/products' },
                { label: 'Review pending orders', href: '/admin/orders' },
                { label: 'Moderate reviews', href: '/admin/reviews' },
                { label: 'Manage returns', href: '/admin/returns' },
                { label: 'View activity log', href: '/admin/activity' },
                { label: 'GST report', href: '/admin/gst' },
              ].map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center justify-between text-sm text-[#0a0a0a] hover:text-[#c8a4a5] py-1.5 border-b border-[#f0ece8] last:border-0 transition-colors"
                >
                  {l.label}
                  <span className="text-[#d0ccc8]">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
