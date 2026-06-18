import type { Order } from '@/lib/api/orders'
import { formatPrice } from '@/lib/utils/formatPrice'

export default function OrderDetail({ order }: { order: Order }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
        <div>
          <p className="text-[#6b6b6b] mb-1">Delivery Address</p>
          <p className="text-[#0a0a0a]">{order.address_snapshot?.name ?? '—'}</p>
          <p className="text-[#6b6b6b]">{[order.address_snapshot?.line1, order.address_snapshot?.city].filter(Boolean).join(', ') || '—'}</p>
        </div>
        <div>
          <p className="text-[#6b6b6b] mb-1">Payment</p>
          <p className="text-[#0a0a0a]">{order.payment_method}</p>
          <p className="text-[#6b6b6b]">{order.payment_status}</p>
        </div>
      </div>
      {order.order_items?.map((item) => (
        <div key={item.id} className="flex justify-between items-center py-3 border-t border-[#e8e4e0]">
          <div>
            <p className="text-xs font-sans text-[#0a0a0a]">{item.snapshot_name}</p>
            {(item.snapshot_size || item.snapshot_colour) && (
              <p className="text-[10px] font-sans text-[#6b6b6b]">{[item.snapshot_colour, item.snapshot_size].filter(Boolean).join(' · ')}</p>
            )}
          </div>
          <p className="text-xs font-sans text-[#0a0a0a]">{formatPrice(item.snapshot_price)} × {item.quantity}</p>
        </div>
      ))}
      <div className="border-t border-[#e8e4e0] pt-3 flex justify-between">
        <span className="text-sm font-sans font-medium text-[#0a0a0a]">Total</span>
        <span className="text-sm font-sans font-medium text-[#0a0a0a]">{formatPrice(order.total)}</span>
      </div>
    </div>
  )
}
