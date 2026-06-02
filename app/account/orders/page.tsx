'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ordersApi, type Order } from '@/lib/api/orders'
import { returnsApi, RETURN_REASONS, type ReturnRequest } from '@/lib/api/returns'
import { formatPrice } from '@/lib/utils/formatPrice'
import { useToast } from '@/components/ui/Toast'
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
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [returns, setReturns] = useState<ReturnRequest[]>([])
  const [loading, setLoading] = useState(true)

  // Return modal state
  const [returnFor, setReturnFor] = useState<Order | null>(null)
  const [reason, setReason] = useState<string>(RETURN_REASONS[0])
  const [submitting, setSubmitting] = useState(false)

  function load() {
    Promise.all([
      ordersApi.getMyOrders().catch(() => []),
      returnsApi.getMy().catch(() => []),
    ]).then(([o, r]) => {
      setOrders(o as Order[])
      setReturns(r as ReturnRequest[])
    }).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const returnByOrder = (orderId: string) => returns.find((r) => r.order_id === orderId)

  async function openInvoice(orderId: string) {
    try {
      const html = await ordersApi.getInvoice(orderId)
      const w = window.open('', '_blank')
      if (w) { w.document.write(html); w.document.close() }
      else toast('Allow pop-ups to view the invoice', 'error')
    } catch {
      toast('Could not open invoice', 'error')
    }
  }

  async function submitReturn() {
    if (!returnFor) return
    setSubmitting(true)
    try {
      await returnsApi.create({ order_id: returnFor.id, reason })
      toast('Return request submitted')
      setReturnFor(null)
      load()
    } catch (e: any) {
      toast(e?.message || 'Could not submit return', 'error')
    } finally {
      setSubmitting(false)
    }
  }

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
        {orders.map((order) => {
          const ret = returnByOrder(order.id)
          const canReturn = order.status === 'delivered' && !ret
          return (
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
                <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4">
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

              <div className="flex items-center gap-4 border-t border-[#f4f2ef] pt-3">
                <button
                  onClick={() => openInvoice(order.id)}
                  className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] hover:text-[#0a0a0a]"
                >
                  Invoice
                </button>
                {canReturn && (
                  <button
                    onClick={() => { setReturnFor(order); setReason(RETURN_REASONS[0]) }}
                    className="text-[10px] font-sans tracking-widest uppercase text-[#c8a4a5] hover:underline"
                  >
                    Request return
                  </button>
                )}
                {ret && (
                  <span className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b]">
                    Return: {ret.status}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {returnFor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setReturnFor(null)}>
          <div className="bg-white w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-serif text-xl text-[#0a0a0a] mb-1">Request a return</h3>
            <p className="text-xs font-sans text-[#6b6b6b] mb-4">Order #{returnFor.order_number}</p>
            <label className="block text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-1">Reason</label>
            <select value={reason} onChange={(e) => setReason(e.target.value)} className="w-full border border-[#e8e4e0] px-3 py-2 text-sm mb-4">
              {RETURN_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <p className="text-[11px] font-sans text-[#6b6b6b] mb-4">Returns are accepted within 7 days of delivery for unworn items with original tags.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setReturnFor(null)} className="px-4 py-2 text-sm border border-[#e8e4e0]">Cancel</button>
              <button onClick={submitReturn} disabled={submitting} className="px-4 py-2 text-sm bg-[#0a0a0a] text-white disabled:opacity-50">
                {submitting ? 'Submitting…' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
