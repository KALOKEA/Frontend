'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ordersApi, type Order } from '@/lib/api/orders'
import { formatPrice } from '@/lib/utils/formatPrice'
import Spinner from '@/components/ui/Spinner'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ordersApi.getMyOrders()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>

  if (!orders.length) return (
    <div className="text-center py-16">
      <h2 className="font-serif text-2xl text-[#0a0a0a] mb-2">No orders yet</h2>
      <p className="text-sm font-sans text-[#6b6b6b] mb-6">Time to treat yourself!</p>
      <Link href="/shop" className="bg-[#0a0a0a] text-white text-[11px] font-sans tracking-widest uppercase px-6 py-3 hover:bg-[#2a2a2a]">
        Start Shopping
      </Link>
    </div>
  )

  return (
    <div>
      <h2 className="font-serif text-2xl text-[#0a0a0a] mb-6">My Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-[#e8e4e0] p-5">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-sans font-medium text-[#0a0a0a]">Order #{order.order_number}</p>
                <p className="text-[10px] font-sans text-[#6b6b6b]">
                  {new Date(order.created_at).toLocaleDateString('en-IN')} · {order.order_items?.length || 0} item(s)
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] font-sans tracking-widest uppercase px-2 py-1 rounded ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
                  {order.status}
                </span>
                <span className="text-sm font-sans font-medium text-[#0a0a0a]">{formatPrice(order.total)}</span>
              </div>
            </div>

            {order.order_items && (
              <div className="flex gap-2 mb-4">
                {order.order_items.slice(0, 3).map((item) => (
                  <div key={item.id} className="text-[10px] font-sans text-[#6b6b6b]">
                    {item.snapshot_name} × {item.quantity}
                  </div>
                ))}
                {(order.order_items.length > 3) && (
                  <div className="text-[10px] font-sans text-[#6b6b6b]">+{order.order_items.length - 3} more</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
