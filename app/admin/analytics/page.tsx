'use client'
import { useEffect, useState } from 'react'
import { adminApi, type DashboardStats, type TopProduct } from '@/lib/api/admin'
import StatsCard from '@/components/admin/StatsCard'
import Spinner from '@/components/ui/Spinner'
import { formatPrice } from '@/lib/utils/formatPrice'

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [top, setTop] = useState<TopProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      adminApi.getDashboard().catch(() => null),
      adminApi.getTopProducts().catch(() => []),
    ]).then(([s, t]) => {
      if (s) setStats(s)
      setTop((t as TopProduct[]) || [])
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  const maxRev = Math.max(1, ...top.map((t) => t.revenue))

  return (
    <>
      <h1 className="font-serif text-3xl text-[#0a0a0a] mb-8">Analytics</h1>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Revenue (This Month)" value={formatPrice(stats.revenue_this_month)} />
          <StatsCard title="Orders (This Month)" value={stats.orders_this_month} />
          <StatsCard title="New Customers" value={stats.new_customers} />
          <StatsCard title="Pending Orders" value={stats.pending_orders} />
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#e8e4e0] p-6">
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-4">Top Products by Revenue</h2>
          {top.length ? (
            <div className="space-y-3">
              {top.map((t, i) => (
                <div key={t.name + i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#0a0a0a]">{t.name}</span>
                    <span className="text-[#6b6b6b]">{formatPrice(t.revenue)} · {t.units} units</span>
                  </div>
                  <div className="h-2 bg-[#f0ece8] rounded">
                    <div className="h-2 bg-[#c8a4a5] rounded" style={{ width: `${(t.revenue / maxRev) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#6b6b6b]">No sales data yet.</p>
          )}
        </div>

        <div className="bg-white border border-[#e8e4e0] p-6">
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-4">Low Stock Alerts</h2>
          {stats?.low_stock_variants?.length ? (
            <ul className="space-y-2 text-sm">
              {stats.low_stock_variants.map((v) => (
                <li key={v.id} className="flex justify-between border-b border-[#f0ece8] pb-2 last:border-0">
                  <span className="text-[#0a0a0a]">{v.products?.name || v.sku}</span>
                  <span className="text-amber-700">{v.stock} left</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#6b6b6b]">All variants are well stocked.</p>
          )}
        </div>
      </div>

      <p className="text-[11px] text-[#6b6b6b] mt-6">Storefront/GA4 funnel analytics (add_to_cart, begin_checkout, purchase) are a separate P2 task — this view reflects order-derived metrics only.</p>
    </>
  )
}
