const COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
}

export default function OrderStatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-[9px] font-sans tracking-widest uppercase px-2 py-1 ${COLORS[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  )
}
