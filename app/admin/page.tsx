'use client'
import { useEffect, useState } from 'react'
import { adminApi, type DashboardStats, type AdminOrder } from '@/lib/api/admin'
import StatsCard from '@/components/admin/StatsCard'
import OrderTable from '@/components/admin/OrderTable'
import Spinner from '@/components/ui/Spinner'
import { formatPrice } from '@/lib/utils/formatPrice'

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      adminApi.getDashboard().catch(() => null),
      adminApi.getRecentOrders().catch(() => []),
    ]).then(([s, o]) => {
      if (s) setStats(s)
      setRecentOrders(o as AdminOrder[])
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center items-center h-96"><Spinner size="lg" /></div>

  const lowStockCount = stats?.low_stock_variants?.length ?? stats?.low_stock_count ?? 0

  return (
    <>
      <h1 className="font-serif text-3xl text-[#0a0a0a] mb-8">Dashboard</h1>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard title="Revenue (This Month)" value={formatPrice(stats.revenue_this_month)} />
          <StatsCard title="Orders (This Month)" value={stats.orders_this_month} />
          <StatsCard title="New Customers" value={stats.new_customers} />
          <StatsCard title="Pending Orders" value={stats.pending_orders} sub={lowStockCount ? `${lowStockCount} low stock alerts` : undefined} />
        </div>
      )}

      <div className="bg-white border border-[#e8e4e0] p-6">
        <h2 className="font-serif text-xl text-[#0a0a0a] mb-4">Recent Orders</h2>
        {recentOrders.length ? (
          <OrderTable orders={recentOrders} />
        ) : (
          <p className="text-sm font-sans text-[#6b6b6b]">No orders yet</p>
        )}
      </div>
    </>
  )
}
