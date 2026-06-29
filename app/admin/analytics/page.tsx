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
  const [clv, setClv] = useState<{ avg_clv: number; total_paying_customers: number; total_revenue: number } | null>(null)
  const [conv, setConv] = useState<{ conversion_rate: number; total_users: number; unique_buyers: number } | null>(null)
  const [catSales, setCatSales] = useState<{ category: string; revenue: number; units: number }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      adminApi.getDashboard().catch(() => null),
      adminApi.getTopProducts().catch(() => []),
      adminApi.getMonthlyStats(6).catch(() => []),
      adminApi.getClv().catch(() => null),
      adminApi.getConversionRate().catch(() => null),
      adminApi.getSalesByCategory().catch(() => []),
    ]).then(([s, t, m, c, cv, cs]) => {
      if (s) setStats(s as DashboardStats)
      setTop((t as TopProduct[]) || [])
      setMonthly((m as MonthlyStats[]) || [])
      if (c) setClv(c as any)
      if (cv) setConv(cv as any)
      setCatSales((cs as any) || [])
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  const maxRev = Math.max(1, ...top.map(t => t.revenue))
  const maxMonthly = Math.max(1, ...monthly.map(m => m.revenue))
  const maxCatRev = Math.max(1, ...catSales.map(c => c.revenue))

  return (
    <>
      <h1 className="font-serif text-2xl md:text-3xl text-[#0a0a0a] mb-8">Analytics</h1>

      {/* Primary stat cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatsCard title="Revenue (This Month)" value={formatPrice(stats.revenue_this_month)} />
          <StatsCard title="Orders (This Month)" value={stats.orders_this_month} />
          <StatsCard title="New Customers" value={stats.new_customers} />
          <StatsCard title="Pending Orders" value={stats.pending_orders} />
        </div>
      )}

      {/* CLV + Conversion Rate cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-[#e8e4e0] p-5">
          <p className="text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Avg. Customer Lifetime Value</p>
          <p className="font-serif text-3xl text-[#0a0a0a]">{clv ? formatPrice(clv.avg_clv) : '—'}</p>
          {clv && (
            <p className="text-xs text-[#6b6b6b] mt-1">
              {clv.total_paying_customers.toLocaleString()} paying customers · {formatPrice(clv.total_revenue)} lifetime revenue
            </p>
          )}
        </div>

        <div className="bg-white border border-[#e8e4e0] p-5">
          <p className="text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Conversion Rate</p>
          <p className="font-serif text-3xl text-[#0a0a0a]">{conv ? `${conv.conversion_rate}%` : '—'}</p>
          {conv && (
            <p className="text-xs text-[#6b6b6b] mt-1">
              {conv.unique_buyers.toLocaleString()} buyers out of {conv.total_users.toLocaleString()} total users
            </p>
          )}
        </div>

        <div className="bg-white border border-[#e8e4e0] p-5">
          <p className="text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Low Stock Alerts</p>
          <p className="font-serif text-3xl text-[#0a0a0a]">{stats?.low_stock_variants?.length ?? '—'}</p>
          <p className="text-xs text-[#6b6b6b] mt-1">variants with ≤ 5 units remaining</p>
        </div>
      </div>

      {/* Monthly revenue chart */}
      <div className="bg-white border border-[#e8e4e0] p-6 mb-6">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-serif text-xl text-[#0a0a0a]">Revenue — Last 6 Months</h2>
          <p className="text-xs text-[#6b6b6b]">Paid orders only</p>
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

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Best-selling Products */}
        <div className="bg-white border border-[#e8e4e0] p-6">
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-5">Best-selling Products</h2>
          {top.length ? (
            <div className="space-y-4">
              {top.map((t, i) => (
                <div key={t.name + i}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[10px] font-medium text-[#6b6b6b] w-4 shrink-0">#{i + 1}</span>
                      <span className="text-[#0a0a0a] truncate">{t.name}</span>
                    </div>
                    <span className="text-[#6b6b6b] shrink-0 ml-2 text-xs">{formatPrice(t.revenue)} · {t.units} units</span>
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

        {/* Sales by Category */}
        <div className="bg-white border border-[#e8e4e0] p-6">
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-5">Sales by Category</h2>
          {catSales.length ? (
            <div className="space-y-4">
              {catSales.map((c, i) => (
                <div key={c.category + i}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-[#0a0a0a] truncate">{c.category}</span>
                    <span className="text-[#6b6b6b] shrink-0 ml-2 text-xs">{formatPrice(c.revenue)} · {c.units} units</span>
                  </div>
                  <div className="h-2 bg-[#f0ece8] rounded-full">
                    <div
                      className="h-2 bg-[#7a6e68] rounded-full"
                      style={{ width: `${(c.revenue / maxCatRev) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#6b6b6b]">No category data yet.</p>
          )}
        </div>
      </div>

      {/* Low stock detail */}
      {stats?.low_stock_variants?.length ? (
        <div className="bg-white border border-[#e8e4e0] p-6 mb-6">
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-5">Low Stock Alerts</h2>
          <ul className="divide-y divide-[#f0ece8]">
            {stats.low_stock_variants.map(v => (
              <li key={v.id} className="flex justify-between items-center py-3">
                <div>
                  <p className="text-sm text-[#0a0a0a]">{v.products?.name || v.sku || '—'}</p>
                  <p className="text-[10px] text-[#6b6b6b] font-mono">{v.sku || '—'}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${v.stock === 0 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                  {v.stock === 0 ? 'Out of stock' : `${v.stock} left`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="text-[11px] text-[#6b6b6b] mt-2">GA4 funnel metrics (add_to_cart, begin_checkout, purchase) are tracked via the storefront and visible in your Google Analytics dashboard.</p>
    </>
  )
}
