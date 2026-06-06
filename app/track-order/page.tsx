'use client'

import { useState } from 'react'
import { formatPrice } from '@/lib/utils/formatPrice'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-73aa.up.railway.app'

interface TrackResult {
  order_number: string
  status: string
  fulfillment_status: string
  payment_status: string
  payment_method: string
  total: number
  created_at: string
  items: { product_name: string; variant_label?: string; quantity: number; unit_price: number }[]
}

const STATUS_LABEL: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
}

const STATUS_COLOR: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
  refunded: 'bg-gray-100 text-gray-600',
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TrackResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const res = await fetch(
        `${BASE_URL}/orders/track?order_number=${encodeURIComponent(orderNumber.trim())}&email=${encodeURIComponent(email.trim())}`,
        { headers: { 'X-Requested-With': 'XMLHttpRequest' } }
      )
      if (!res.ok) {
        setError('Order not found. Please check your order number and email.')
        return
      }
      const data = await res.json()
      setResult(data)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] py-16 px-4">
      <div className="max-w-lg mx-auto">
        <h1 className="font-serif text-3xl text-[#0a0a0a] mb-2 text-center">Track Your Order</h1>
        <p className="text-sm text-[#6b6b6b] text-center mb-10">
          Enter your order number and the email you used at checkout.
        </p>

        <form onSubmit={handleSubmit} className="bg-white border border-[#e8e4e0] p-8 mb-6">
          <div className="mb-4">
            <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">
              Order Number
            </label>
            <input
              type="text"
              value={orderNumber}
              onChange={e => setOrderNumber(e.target.value.toUpperCase())}
              placeholder="KLK-XXXXXXXX"
              required
              className="w-full border border-[#e8e4e0] px-3 py-2 text-sm font-mono focus:border-[#0a0a0a] outline-none uppercase"
            />
          </div>
          <div className="mb-6">
            <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none"
            />
          </div>
          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0a0a0a] text-white text-[11px] uppercase tracking-widest hover:bg-[#333] transition-colors disabled:opacity-50"
          >
            {loading ? 'Looking up…' : 'Track Order'}
          </button>
        </form>

        {result && (
          <div className="bg-white border border-[#e8e4e0] p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-[#6b6b6b]">Order</p>
                <p className="font-mono font-medium text-[#0a0a0a] mt-0.5">{result.order_number}</p>
              </div>
              <span className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded font-medium ${STATUS_COLOR[result.status] || 'bg-gray-100 text-gray-600'}`}>
                {STATUS_LABEL[result.status] || result.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-[#6b6b6b]">Payment</p>
                <p className="mt-0.5 text-[#0a0a0a] capitalize">{result.payment_method?.replace('_', ' ')} — {result.payment_status}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-[#6b6b6b]">Placed</p>
                <p className="mt-0.5 text-[#0a0a0a]">
                  {new Date(result.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
              {result.fulfillment_status && (
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-[#6b6b6b]">Fulfillment</p>
                  <p className="mt-0.5 text-[#0a0a0a] capitalize">{result.fulfillment_status}</p>
                </div>
              )}
              <div>
                <p className="text-[11px] uppercase tracking-widest text-[#6b6b6b]">Total</p>
                <p className="mt-0.5 font-medium text-[#0a0a0a]">{formatPrice(result.total)}</p>
              </div>
            </div>

            <div className="border-t border-[#e8e4e0] pt-5">
              <p className="text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-3">Items</p>
              <div className="space-y-3">
                {result.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <div>
                      <span className="text-[#0a0a0a]">{item.product_name}</span>
                      {item.variant_label && (
                        <span className="text-[#6b6b6b] ml-2">({item.variant_label})</span>
                      )}
                      <span className="text-[#6b6b6b] ml-2">× {item.quantity}</span>
                    </div>
                    <span className="text-[#0a0a0a]">{formatPrice(item.unit_price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <p className="text-center text-sm text-[#6b6b6b] mt-8">
          Need help?{' '}
          <a href="/contact" className="underline hover:text-[#0a0a0a]">Contact us</a>
          {' '}or email{' '}
          <a href="mailto:support@kalokea.in" className="underline hover:text-[#0a0a0a]">support@kalokea.in</a>
        </p>
      </div>
    </div>
  )
}
