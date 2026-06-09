'use client'
import { useState } from 'react'
import { formatPrice } from '@/lib/utils/formatPrice'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-73aa.up.railway.app'

interface TrackResult {
  order_number:       string
  status:             string
  fulfillment_status: string
  payment_status:     string
  payment_method:     string
  total:              number
  created_at:         string
  awb_code:           string | null
  courier_name:       string | null
  shiprocket_status:  string | null
  items: { product_name: string; variant_label?: string; quantity: number; unit_price: number }[]
}

const STATUS_STEPS = [
  { key: 'pending',   label: 'Order Placed' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'shipped',   label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
]

const CANCELLED_STATUSES = ['cancelled', 'refunded']

const STATUS_LABEL: Record<string, string> = {
  pending:   'Order Placed',
  confirmed: 'Confirmed',
  processing:'Processing',
  shipped:   'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded:  'Refunded',
}

function getStepIndex(status: string) {
  const idx = STATUS_STEPS.findIndex(s => s.key === status)
  return idx === -1 ? 0 : idx
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TrackResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setResult(null); setError(null)
    try {
      const res = await fetch(`${BASE_URL}/orders/guest/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ order_number: orderNumber.trim(), email: email.trim() }),
      })
      if (!res.ok) { setError('Order not found. Please check your order number and email.'); return }
      const json = await res.json()
      const data = json.data ?? json
      setResult(data)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally { setLoading(false) }
  }

  const isCancelled = result && CANCELLED_STATUSES.includes(result.status)
  const stepIndex   = result ? getStepIndex(result.status) : -1

  return (
    <div className="min-h-screen bg-[#faf8f5] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-serif text-3xl md:text-4xl text-[#0a0a0a] mb-2 text-center">Track Your Order</h1>
        <p className="text-center text-[#6b6b6b] text-sm mb-8">
          Enter your order number and the email used at checkout
        </p>

        <form onSubmit={handleSubmit} className="bg-white border border-[#e8e4e0] p-6 mb-8">
          <div className="grid gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Order Number</label>
              <input
                type="text"
                value={orderNumber}
                onChange={e => setOrderNumber(e.target.value)}
                required
                placeholder="e.g. KLK-1234567890-ABCD"
                className="w-full border border-[#e8e4e0] px-3 py-2.5 text-sm focus:outline-none focus:border-[#0a0a0a]"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="email@example.com"
                className="w-full border border-[#e8e4e0] px-3 py-2.5 text-sm focus:outline-none focus:border-[#0a0a0a]"
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-[#0a0a0a] text-white text-sm tracking-widest uppercase hover:bg-[#1a1a1a] transition-colors disabled:opacity-50">
              {loading ? 'Searching…' : 'Track Order'}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-[#fdecea] border border-[#ef9a9a] px-5 py-4 text-sm text-[#c62828] mb-6">
            {error}
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {/* Order header */}
            <div className="bg-white border border-[#e8e4e0] p-5">
              <div className="flex flex-wrap justify-between items-start gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-[#6b6b6b]">Order</p>
                  <p className="font-serif text-xl text-[#0a0a0a]">#{result.order_number}</p>
                  <p className="text-xs text-[#6b6b6b] mt-0.5">
                    Placed {new Date(result.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-widest text-[#6b6b6b]">Total</p>
                  <p className="font-medium text-[#0a0a0a] text-lg">{formatPrice(result.total)}</p>
                  <p className="text-xs uppercase tracking-wider text-[#6b6b6b]">{result.payment_method}</p>
                </div>
              </div>
            </div>

            {/* Progress stepper */}
            {!isCancelled ? (
              <div className="bg-white border border-[#e8e4e0] p-5">
                <p className="text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-5">Order Progress</p>
                <div className="flex items-start">
                  {STATUS_STEPS.map((step, i) => {
                    const done    = i <= stepIndex
                    const current = i === stepIndex
                    return (
                      <div key={step.key} className="flex-1 flex flex-col items-center">
                        <div className="flex items-center w-full">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border-2 flex-shrink-0 ${
                            done ? 'bg-[#0a0a0a] border-[#0a0a0a] text-white' : 'bg-white border-[#d0ccc8] text-[#6b6b6b]'
                          } ${current ? 'ring-2 ring-[#7C4A2D] ring-offset-2' : ''}`}>
                            {done && !current ? '✓' : i + 1}
                          </div>
                          {i < STATUS_STEPS.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-1 ${i < stepIndex ? 'bg-[#0a0a0a]' : 'bg-[#e8e4e0]'}`} />
                          )}
                        </div>
                        <p className={`text-[10px] mt-2 text-center ${done ? 'text-[#0a0a0a] font-medium' : 'text-[#6b6b6b]'}`}>
                          {step.label}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-[#fdecea] border border-[#ef9a9a] px-5 py-4 text-sm text-[#c62828]">
                This order has been <strong>{STATUS_LABEL[result.status] || result.status}</strong>.
                {result.payment_status === 'refunded' && ' A refund has been processed.'}
              </div>
            )}

            {/* ShipRocket tracking info */}
            {result.awb_code && (
              <div className="bg-white border border-[#e8e4e0] p-5">
                <p className="text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-4">Shipping Details</p>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-1">Courier</p>
                    <p className="text-sm font-medium text-[#0a0a0a]">{result.courier_name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-1">Tracking Number</p>
                    <p className="font-mono text-sm text-[#0a0a0a]">{result.awb_code}</p>
                  </div>
                </div>
                {result.shiprocket_status && (
                  <div className="mb-3">
                    <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-1">Courier Status</p>
                    <span className="text-[11px] uppercase tracking-widest px-2 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200">
                      {result.shiprocket_status}
                    </span>
                  </div>
                )}
                <p className="text-xs text-[#6b6b6b]">
                  You can also track your order directly on the courier's website using the tracking number above.
                </p>
              </div>
            )}

            {/* Order items */}
            <div className="bg-white border border-[#e8e4e0] p-5">
              <p className="text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-4">Items Ordered</p>
              <div className="divide-y divide-[#f0ece8]">
                {result.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-start py-2.5">
                    <div>
                      <p className="text-sm text-[#0a0a0a]">{item.product_name}</p>
                      {item.variant_label && <p className="text-xs text-[#6b6b6b]">{item.variant_label}</p>}
                      <p className="text-xs text-[#6b6b6b]">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-[#0a0a0a]">{formatPrice(item.unit_price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
