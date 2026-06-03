'use client'
import { useEffect, useState } from 'react'
import { adminApi, type DashboardStats, type TopProduct, type MonthlyStats } from '@/lib/api/admin'
import StatsCard from '@/components/admin/StatsCard'
import Spinner from '@/components/ui/Spinner'
import { formatPrice } from '@/lib/utils/formatPrice'

function monthLabel(ym: string) {
  const [y, m] = ym.split('-')
  return new Date(Number(y), Number(m) - 1, 1).toLocaleString('en-IN', { month: 'short', year: '2-digit' })
}

export default function AdminAnalyticsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [top, setTop] = useState<TopProduct[]>([])
  const [monthly, setMonthly] = useState<MonthlyStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      adminApi.getDashboard().catch(() => null),
      adminApi.getTopProducts().catch(() => []),
      adminApi.getMonthlyStats(6).catch(() => []),
    ]).then(([s, t, m]) => {
      if (s) setStats(s as DashboardStats)
      setTop((t as TopProduct[]) || [])
      setMonthly((m as MonthlyStats[]) || [])
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  const maxRev = Math.max(1, ...top.map(t => t.revenue))
  const maxMonthly = Math.max(1, ...monthly.map(m => m.revenue))

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

      {/* Monthly revenue chart */}
      <div className="bg-white border border-[#e8e4e0] p-6 mb-6">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-serif text-xl text-[#0a0a0a]">Revenue — Last 6 Months</h2>
          <p className="text-xs text-[#9b9b9b]">Paid orders only</p>
        </div>
        {monthly.length > 0 ? (
          <div className="flex items-end gap-3 h-48">
            {monthly.map(m => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col justify-end" style={{ height: '160px' }}>
                  <div
                    className="w-full bg-[#c8a4a5] hover:bg-[#b8949a] transition-colors rounded-t-sm cursor-default relative group"
                    style={{ height: `${Math.max(4, (m.revenue / maxMonthly) * 160)}px` }}
                  >
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-[#0a0a0a] text-white text-[10px] px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      {formatPrice(m.revenue)}<br />
                      <span className="text-[#c8a4a5]">{m.orders} orders</span>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-[#6b6b6b] text-center">{monthLabel(m.month)}</p>
                <p className="text-[10px] font-medium text-[#0a0a0a] text-center">{formatPrice(m.revenue)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#6b6b6b] text-center py-10">No revenue data yet.</p>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top products */}
        <div className="bg-white border border-[#e8e4e0] p-6">
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-5">Top Products by Revenue</h2>
          {top.length ? (
            <div className="space-y-4">
              {top.map((t, i) => (
                <div key={t.name + i}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-[#0a0a0a] truncate mr-4">{t.name}</span>
                    <span className="text-[#6b6b6b] shrink-0">{formatPrice(t.revenue)} · {t.units} units</span>
                  </div>
                  <div className="h-2 bg-[#f0ece8] rounded-full">
                    <div
                      className="h-2 bg-[#c8a4a5] rounded-full"
                      style={{ width: `${(t.revenue / maxRev) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#6b6b6b]">No sales data yet.</p>
          )}
        </div>

        {/* Low stock */}
        <div className="bg-white border border-[#e8e4e0] p-6">
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-5">Low Stock Alerts</h2>
          {stats?.low_stock_variants?.length ? (
            <ul className="divide-y divide-[#f0ece8]">
              {stats.low_stock_variants.map(v => (
                <li key={v.id} className="flex justify-between items-center py-3">
                  <div>
                    <p className="text-sm text-[#0a0a0a]">{v.products?.name || v.sku}</p>
                    <p className="text-[10px] text-[#9b9b9b] font-mono">{v.sku}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${v.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {v.stock === 0 ? 'Out of stock' : `${v.stock} left`}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-[#6b6b6b] text-center py-6">All variants are well stocked ✓</p>
          )}
        </div>
      </div>

      <p className="text-[11px] text-[#9b9b9b] mt-6">GA4 funnel metrics (add_to_cart, begin_checkout, purchase) are tracked via the storefront and visible in your Google Analytics dashboard.</p>
    </>
  )
}
