'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/lib/store/useCartStore'
import { formatPrice } from '@/lib/utils/formatPrice'
import CartCrossSell from '@/components/cart/CartCrossSell'

// Free shipping threshold in paise — ₹999. Synced with backend default.
const FREE_SHIPPING_THRESHOLD = 99900

// ── Coupon codes (frontend-only) ─────────────────────────────────────────────
const COUPONS: Record<string, { type: 'percent' | 'flat'; value: number; label: string }> = {
  KALOKEA10: { type: 'percent', value: 10, label: '10% off' },
  WELCOME:   { type: 'flat',    value: 20000, label: '₹200 off' },
}
function calcDiscount(total: number, code: string): number {
  const c = COUPONS[code.toUpperCase().trim()]
  if (!c) return 0
  return c.type === 'percent' ? Math.round(total * c.value / 100) : Math.min(c.value, total)
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem } = useCartStore()
  const [couponInput, setCouponInput] = useState('')
  const [appliedCode, setAppliedCode] = useState<string | null>(null)
  const [couponError, setCouponError] = useState('')
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const discount = appliedCode ? calcDiscount(subtotal, appliedCode) : 0
  const total = subtotal - discount
  const count = items.reduce((s, i) => s + i.quantity, 0)

  // Free shipping progress
  const freeShippingPct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100))
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const freeShippingUnlocked = subtotal >= FREE_SHIPPING_THRESHOLD

  const closeRef = useRef<HTMLButtonElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const previousFocus = useRef<HTMLElement | null>(null)

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Focus management: save trigger, move into drawer on open; restore on close
  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement as HTMLElement
      // Small delay so the drawer has rendered
      const t = setTimeout(() => closeRef.current?.focus(), 30)
      return () => clearTimeout(t)
    } else {
      previousFocus.current?.focus()
      previousFocus.current = null
    }
  }, [isOpen])

  // Escape closes drawer
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, closeCart])

  // Focus trap: cycle Tab within drawer
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const drawer = drawerRef.current
      if (!drawer) return
      const focusable = Array.from(
        drawer.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter(el => !el.hasAttribute('disabled'))
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen])

  return (
    <>
      {/* Overlay — fades in/out */}
      <div
        className={`fixed inset-0 bg-[#0A0908]/40 z-[998] transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer — slides in from the right */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-[#FDFAF6] z-[999] flex flex-col shadow-float
          transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        // Prevent focus reaching hidden drawer via keyboard when closed
        inert={!isOpen ? true : undefined}
      >

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E0D4C4] shrink-0">
          <div>
            <h2 className="font-serif text-lg text-[#0A0908]">Your Cart</h2>
            {count > 0 && (
              <p className="text-[10px] text-[#6B5E55] uppercase tracking-widest">{count} item{count !== 1 ? 's' : ''}</p>
            )}
          </div>
          <button
            ref={closeRef}
            onClick={closeCart}
            className="w-11 h-11 flex items-center justify-center text-[#6B5E55] hover:text-[#0A0908] transition-colors -mr-2"
            aria-label="Close cart"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 flex items-center justify-center mb-4 border border-[#E0D4C4]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.4" aria-hidden="true">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </div>
              <p className="font-serif text-lg text-[#0A0908] mb-1">Your cart is empty</p>
              <p className="text-sm text-[#6B5E55] mb-5">Add something beautiful</p>
              <button
                onClick={closeCart}
                className="text-[9.5px] uppercase tracking-[0.22em] text-[#7C4A2D] hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4 pb-2">
              {items.map((item) => (
                <div key={item.variant_id} className="flex gap-3">
                  {/* Image */}
                  <div className="relative w-16 h-20 bg-[#F2EAE0] shrink-0 overflow-hidden">
                    {item.image_url ? (
                      <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="64px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="1.5" aria-hidden="true">
                          <rect x="3" y="3" width="18" height="18" rx="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/product/${item.slug}/`}
                      onClick={closeCart}
                      className="text-sm font-medium text-[#0A0908] hover:text-[#7C4A2D] transition-colors line-clamp-2 leading-tight"
                    >
                      {item.name}
                    </Link>
                    {(item.colour || item.size) && (
                      <p className="text-[11px] text-[#6B5E55] mt-0.5">
                        {[item.colour, item.size].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <p className="text-sm font-medium text-[#0A0908] mt-1">{formatPrice(item.price)}</p>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-[#E0D4C4]">
                        <button
                          onClick={() => updateQuantity(item.variant_id, Math.max(1, item.quantity - 1))}
                          className="w-11 h-11 flex items-center justify-center text-[#6B5E55] hover:text-[#0A0908] text-sm"
                          aria-label={`Decrease quantity of ${item.name}`}
                        >−</button>
                        <span className="w-8 text-center text-xs text-[#0A0908]" aria-live="polite" aria-label={`Quantity: ${item.quantity}`}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variant_id, Math.min(item.max_stock || 99, item.quantity + 1))}
                          className="w-11 h-11 flex items-center justify-center text-[#6B5E55] hover:text-[#0A0908] text-sm"
                          aria-label={`Increase quantity of ${item.name}`}
                        >+</button>
                      </div>
                      <button
                        onClick={() => removeItem(item.variant_id)}
                        className="text-[9.5px] uppercase tracking-widest text-[#6B5E55] hover:text-red-500 transition-colors"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-medium text-[#0A0908]">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
              <CartCrossSell onNavigate={closeCart} />
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#E0D4C4] px-5 py-4 space-y-3 bg-[#FDFAF6] shrink-0">

            {/* Free shipping progress bar */}
            <div className="pb-1">
              {freeShippingUnlocked ? (
                <p className="text-[10px] font-sans text-green-700 font-semibold tracking-wide text-center">
                  🎉 You&apos;ve unlocked free shipping!
                </p>
              ) : (
                <p className="text-[10px] font-sans text-[#6b5e55] tracking-wide">
                  Add <span className="font-semibold text-[#0a0908]">{formatPrice(remaining)}</span> more for free shipping
                </p>
              )}
              <div
                className="mt-1.5 h-1 bg-[#e8e4e0] rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={freeShippingPct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Free shipping progress: ${freeShippingPct}%`}
              >
                <div
                  className="h-full bg-[#7C4A2D] rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingPct}%` }}
                />
              </div>
            </div>

            {/* Coupon row */}
            <div>
              {appliedCode ? (
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>
                    <span className="text-[11px] text-green-700 font-medium tracking-wider uppercase">{appliedCode}</span>
                  </div>
                  <button
                    onClick={() => { setAppliedCode(null); setCouponInput(''); setCouponError('') }}
                    className="text-[10px] text-[#6b5e55] hover:text-red-500 uppercase tracking-widest"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={e => { setCouponInput(e.target.value); setCouponError('') }}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        const code = couponInput.trim().toUpperCase()
                        if (COUPONS[code]) { setAppliedCode(code); setCouponError('') }
                        else setCouponError('Invalid code')
                      }
                    }}
                    placeholder="Coupon code"
                    className="flex-1 border border-[#E0D4C4] px-3 py-2 text-[11px] font-sans outline-none focus:border-[#0A0908] bg-transparent uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal placeholder:text-[#b0a898]"
                    aria-label="Coupon code"
                  />
                  <button
                    onClick={() => {
                      const code = couponInput.trim().toUpperCase()
                      if (COUPONS[code]) { setAppliedCode(code); setCouponError('') }
                      else setCouponError('Invalid code')
                    }}
                    className="px-3 py-2 bg-[#0A0908] text-white text-[10px] uppercase tracking-widest hover:bg-[#1a1612] transition-colors shrink-0"
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponError && (
                <p className="text-[10px] text-red-500 mt-1">{couponError}</p>
              )}
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-[#6B5E55]">Subtotal</span>
              <span className="font-serif text-base text-[#0A0908]">{formatPrice(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-700">Discount ({appliedCode})</span>
                <span className="text-sm font-medium text-green-700">−{formatPrice(discount)}</span>
              </div>
            )}
            {discount > 0 && (
              <div className="flex justify-between items-center border-t border-[#E0D4C4] pt-2">
                <span className="text-sm font-medium text-[#0A0908]">Total</span>
                <span className="font-serif text-base text-[#0A0908]">{formatPrice(total)}</span>
              </div>
            )}
            <p className="text-[10px] text-[#6b5c55]">GST and shipping calculated at checkout</p>

            <Link
              href="/checkout/"
              onClick={closeCart}
              className="block w-full bg-[#0A0908] text-[#FDFAF6] text-[10px] font-sans tracking-[0.22em] uppercase text-center py-4 hover:bg-[#1A1612] transition-colors"
            >
              Checkout
            </Link>
            <Link
              href="/cart/"
              onClick={closeCart}
              className="block w-full border border-[#E0D4C4] text-[#0A0908] text-[10px] font-sans tracking-[0.22em] uppercase text-center py-3 hover:bg-[#F2EAE0] transition-colors"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
