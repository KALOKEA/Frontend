'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/lib/store/useCartStore'
import { formatPrice } from '@/lib/utils/formatPrice'
import CartCrossSell from '@/components/cart/CartCrossSell'

// Free shipping threshold in paise — matches backend default (₹999)
const FREE_SHIPPING_THRESHOLD = 99900

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem } = useCartStore()
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const count = items.reduce((s, i) => s + i.quantity, 0)

  // Free shipping progress
  const freeShippingPct = Math.min(100, Math.round((total / FREE_SHIPPING_THRESHOLD) * 100))
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total)
  const freeShippingUnlocked = total >= FREE_SHIPPING_THRESHOLD

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [closeCart])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-[#0A0908]/40 z-40 transition-opacity" onClick={closeCart} />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#FDFAF6] z-50 flex flex-col shadow-float"
      >

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E0D4C4]">
          <div>
            <h2 className="font-serif text-lg text-[#0A0908]">Your Cart</h2>
            {count > 0 && (
              <p className="text-[10px] text-[#6B5E55] uppercase tracking-widest">{count} item{count !== 1 ? 's' : ''}</p>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-11 h-11 flex items-center justify-center text-[#6B5E55] hover:text-[#0A0908] transition-colors -mr-2"
            aria-label="Close cart"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 flex items-center justify-center mb-4 border border-[#E0D4C4]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.4">
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
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="1.5">
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
          <div className="border-t border-[#E0D4C4] px-5 py-4 space-y-3 bg-[#FDFAF6]">

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
              <div className="mt-1.5 h-1 bg-[#e8e4e0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#7C4A2D] rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingPct}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-[#6B5E55]">Subtotal</span>
              <span className="font-serif text-base text-[#0A0908]">{formatPrice(total)}</span>
            </div>
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
