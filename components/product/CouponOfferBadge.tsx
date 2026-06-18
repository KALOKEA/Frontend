'use client'
import { useEffect, useState } from 'react'
import { couponsApi, type BestOffer } from '@/lib/api/coupons'
import { formatPrice } from '@/lib/utils/formatPrice'

/**
 * "Get it at ₹X — How?" badge. Shows the best featured coupon applied to this
 * item's price, with a tap-to-reveal explainer of the code + discount.
 * Renders nothing when no featured offer applies, so it's always safe to mount.
 */
export default function CouponOfferBadge({ price }: { price: number }) {
  const [offer, setOffer] = useState<BestOffer | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let alive = true
    couponsApi.bestOffer(price)
      .then((res) => { if (alive) setOffer(res?.best ?? null) })
      .catch(() => { if (alive) setOffer(null) })
    return () => { alive = false }
  }, [price])

  if (!offer) return null

  const offText = offer.type === 'percent' ? `${offer.value}% off` : `${formatPrice(offer.discount)} off`

  return (
    <div className="rounded-md bg-[#EAF5EF] border border-[#CDE7D8] px-3.5 py-2.5">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-[#1F7A4D] font-sans text-sm font-semibold">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.59 3H4v5.59A2 2 0 0 0 4.59 10l9.58 9.59a2 2 0 0 0 2.83 0l3.59-3.59a2 2 0 0 0 0-2.59z" />
            <circle cx="7.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
          </svg>
          Get it at {formatPrice(offer.final_price)}
        </span>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="text-[#1F7A4D] text-xs font-sans underline underline-offset-2 shrink-0"
          aria-expanded={open}
        >
          {open ? 'Hide' : 'How?'}
        </button>
      </div>
      {open && (
        <p className="mt-2 text-[12px] font-sans text-[#2C231C] leading-relaxed">
          Apply code <span className="font-semibold tracking-wide">{offer.code}</span> at checkout for {offText} — you pay <span className="font-semibold">{formatPrice(offer.final_price)}</span>.
        </p>
      )}
    </div>
  )
}
