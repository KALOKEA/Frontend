'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useCartStore } from '@/lib/store/useCartStore'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { ordersApi, type OrderQuote } from '@/lib/api/orders'
import { formatPrice } from '@/lib/utils/formatPrice'

const SHIPPING_THRESHOLD = 99900

export default function OrderSummary({
  couponDiscount = 0,
  couponCode,
  paymentMethod,
  addressState,
}: {
  couponDiscount?: number
  couponCode?: string | null
  paymentMethod?: string
  addressState?: string | null
}) {
  const { items, guestSessionId } = useCartStore()
  const { isLoggedIn } = useAuthStore()
  const [quote, setQuote] = useState<OrderQuote | null>(null)
  // Tracks whether a quote request is in-flight so we can show "Calculating..."
  // only while loading -- not forever when the request fails.
  const [quoteLoading, setQuoteLoading] = useState(false)

  // Authoritative GST + totals from the backend (matches what the customer is
  // charged). Re-quotes whenever the cart, coupon, state or payment changes.
  // Guest users must send their session_id so the backend can load the correct
  // server-side cart; without it loadCart() throws and the response is always null.
  useEffect(() => {
    let active = true
    if (!items.length) { setQuote(null); return }
    setQuoteLoading(true)
    ordersApi
      .quote({
        address_snapshot: addressState ? { state: addressState } : undefined,
        coupon_code: couponCode || undefined,
        payment_method: paymentMethod || 'upi',
        session_id: isLoggedIn ? undefined : guestSessionId,
        // Fallback: if server cart is empty (add race, cold-start, etc.)
        // the backend can still compute GST from the client-side cart items.
        // Prices are always re-fetched from DB on the backend — client only sends IDs.
        cart_items: items.map(i => ({ variant_id: i.variant_id, quantity: i.quantity })),
      })
      .then((q) => { if (active) { setQuote(q); setQuoteLoading(false) } })
      .catch(() => { if (active) { setQuote(null); setQuoteLoading(false) } })
    return () => { active = false }
  }, [items, couponCode, paymentMethod, addressState, isLoggedIn, guestSessionId])

  // Fallback (pre-tax) figures if the quote hasn't loaded yet.
  const subtotal = quote?.subtotal ?? items.reduce((s, i) => s + i.price * i.quantity, 0)
  const discount = quote?.discount ?? couponDiscount
  const shipping = quote?.shipping ?? (subtotal >= SHIPPING_THRESHOLD ? 0 : 4900)
  const codFee = quote?.cod_fee ?? (paymentMethod === 'cod' ? 4900 : 0)
  const totalGst = quote?.total_gst ?? 0
  const total = quote?.total ?? Math.max(0, subtotal - discount) + shipping + codFee

  return (
    <div className="bg-[#faf8f5] p-6 lg:sticky lg:top-24">
      <h3 className="font-serif text-lg text-[#0a0a0a] mb-5">Order Summary</h3>

      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.variant_id} className="flex gap-3">
            <div className="relative w-14 h-20 shrink-0 bg-[#e8e4e0] overflow-hidden">
              {item.image_url && (
                <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="56px" />
              )}
              <span className="absolute -top-1 -right-1 bg-[#0a0a0a] text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">{item.quantity}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-sans text-[#0a0a0a] truncate">{item.name}</p>
              {(item.size || item.colour) && (
                <p className="text-[10px] font-sans text-[#6b6b6b]">{[item.colour, item.size].filter(Boolean).join(' · ')}</p>
              )}
              <p className="text-xs font-sans text-[#0a0a0a] mt-1">{formatPrice(item.price * item.quantity)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[#e8e4e0] pt-4 space-y-2">
        <Line label="Subtotal" value={formatPrice(subtotal)} />
        {discount > 0 && <Line label="Discount" value={`-${formatPrice(discount)}`} accent />}

        {quote && quote.total_gst > 0 ? (
          quote.intra_state ? (
            <>
              <Line label="CGST" value={formatPrice(quote.cgst)} />
              <Line label="SGST" value={formatPrice(quote.sgst)} />
            </>
          ) : (
            <Line label="IGST" value={formatPrice(quote.igst)} />
          )
        ) : totalGst > 0 ? (
          <Line label="GST" value={formatPrice(totalGst)} />
        ) : (
          <Line label="GST" value={quoteLoading ? 'Calculating…' : '₹0'} />
        )}

        <Line label="Shipping" value={shipping === 0 ? 'Free' : formatPrice(shipping)} />
        {codFee > 0 && <Line label="COD fee" value={formatPrice(codFee)} />}

        <div className="flex justify-between text-sm font-sans font-medium text-[#0a0a0a] pt-2 border-t border-[#e8e4e0]">
          <span>Total</span><span>{formatPrice(total)}</span>
        </div>
        <p className="text-[10px] font-sans text-[#6b6b6b] pt-1">Final total includes all applicable GST (shown above).</p>
      </div>
    </div>
  )
}


function Line({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between text-xs font-sans">
      <span className={accent ? "text-[#7C4A2D]" : "text-[#6b6b6b]"}>{label}</span>
      <span className={accent ? "text-[#7C4A2D] font-medium" : "text-[#0a0a0a]"}>{value}</span>
    </div>
  )
}
