import type { Order } from '@/lib/api/orders'
import { formatPrice } from '@/lib/utils/formatPrice'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
}

export default function OrderCard({ order }: { order: Order }) {
  return (
    <div className="border border-[#e8e4e0] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-sans font-medium text-[#0a0a0a]">#{order.order_number}</p>
          <p className="text-[10px] font-sans text-[#6b6b6b]">{new Date(order.created_at).toLocaleDateString('en-IN')}</p>
        </div>
        <div className="text-right">
          <span className={`text-[9px] font-sans tracking-widest uppercase px-2 py-1 ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}`}>
            {order.status}
          </span>
          <p className="text-sm font-sans font-medium text-[#0a0a0a] mt-1">{formatPrice(order.total)}</p>
        </div>
      </div>
    </div>
  )
}
