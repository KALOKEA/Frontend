'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { adminApi } from '@/lib/api/admin'
import AdminSidebar from '@/components/admin/Sidebar'
import StatsCard from '@/components/admin/StatsCard'
import OrderTable from '@/components/admin/OrderTable'
import Spinner from '@/components/ui/Spinner'
import { formatPrice } from '@/lib/utils/formatPrice'

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isLoggedIn } = useAuthStore()
  const [stats, setStats] = useState<{ revenue_this_month: number; orders_this_month: number; new_customers: number; pending_orders: number; low_stock_count: number } | null>(null)
  const [recentOrders, setRecentOrders] = useState<{ id: string; order_number: string; status: string; total: number; created_at: string; users?: { name?: string } }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isLoggedIn) { router.push('/login'); return }
    if (user?.role !== 'admin') { router.push('/'); return }
    Promise.all([
      adminApi.getDashboard().catch(() => null),
      adminApi.getRecentOrders().catch(() => []),
    ]).then(([s, o]) => {
      if (s) setStats(s)
      setRecentOrders(o)
    }).finally(() => setLoading(false))
  }, [isLoggedIn, user, router])

  if (loading) return <div className="flex justify-center items-center h-screen"><Spinner size="lg" /></div>

  return (
    <div className="flex min-h-screen bg-[#faf8f5]">
      <AdminSidebar />
      <main className="flex-1 p-8">
        <h1 className="font-serif text-3xl text-[#0a0a0a] mb-8">Dashboard</h1>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatsCard title="Revenue (This Month)" value={formatPrice(stats.revenue_this_month)} />
            <StatsCard title="Orders (This Month)" value={stats.orders_this_month} />
            <StatsCard title="New Customers" value={stats.new_customers} />
            <StatsCard title="Pending Orders" value={stats.pending_orders} sub={stats.low_stock_count ? `${stats.low_stock_count} low stock alerts` : undefined} />
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
      </main>
    </div>
  )
}
