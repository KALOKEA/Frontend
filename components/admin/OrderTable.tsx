import OrderStatusBadge from './OrderStatusBadge'
import { formatPrice } from '@/lib/utils/formatPrice'

interface OrderRow {
  id: string
  order_number: string
  status: string
  total: number
  created_at: string
  users?: { name?: string }
}

export default function OrderTable({ orders }: { orders: OrderRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs font-sans" aria-label="Orders">
        <thead>
          <tr className="border-b border-[#e8e4e0]">
            {['Order', 'Customer', 'Status', 'Amount', 'Date'].map((h) => (
              <th key={h} className="text-left py-3 px-4 text-[10px] tracking-widest uppercase text-[#6b6b6b] font-normal">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-[#f4f2ef] hover:bg-[#faf8f5]">
              <td className="py-3 px-4 font-medium text-[#0a0a0a]">#{o.order_number}</td>
              <td className="py-3 px-4 text-[#6b6b6b]">{o.users?.name || 'Guest'}</td>
              <td className="py-3 px-4"><OrderStatusBadge status={o.status} /></td>
              <td className="py-3 px-4 text-[#0a0a0a]">{formatPrice(o.total)}</td>
              <td className="py-3 px-4 text-[#6b6b6b]">{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
