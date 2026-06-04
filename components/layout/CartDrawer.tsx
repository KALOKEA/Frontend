'use client'
import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useCartStore } from '@/lib/store/useCartStore'
import { formatPrice } from '@/lib/utils/formatPrice'

export default function CartDrawer() {
  const { items, isOpen, closeCart, updateQuantity, removeItem } = useCartStore()
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const count = items.reduce((s, i) => s + i.quantity, 0)

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [closeCart])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e4e0]">
          <div>
            <h2 className="font-serif text-lg text-[#0a0a0a]">Your Cart</h2>
            {count > 0 && (
              <p className="text-[11px] text-[#9b9b9b] uppercase tracking-widest">{count} item{count !== 1 ? 's' : ''}</p>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors"
            aria-label="Close cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-full bg-[#faf8f5] border border-[#e8e4e0] flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c8a4a5" strokeWidth="1.5">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
              </div>
              <p className="font-serif text-lg text-[#0a0a0a] mb-1">Your cart is empty</p>
              <p className="text-sm text-[#9b9b9b] mb-5">Add something beautiful</p>
              <button
                onClick={closeCart}
                className="text-[10px] uppercase tracking-widest text-[#c8a4a5] hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.variant_id} className="flex gap-3">
                  {/* Image */}
                  <div className="relative w-16 h-20 bg-[#f4f2ef] shrink-0 overflow-hidden">
                    {item.image_url ? (
                      <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="64px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d0ccc8" strokeWidth="1.5">
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
                      href={`/product/${item.slug}`}
                      onClick={closeCart}
                      className="text-sm font-medium text-[#0a0a0a] hover:text-[#c8a4a5] transition-colors line-clamp-2 leading-tight"
                    >
                      {item.name}
                    </Link>
                    {(item.colour || item.size) && (
                      <p className="text-[11px] text-[#9b9b9b] mt-0.5">
                        {[item.colour, item.size].filter(Boolean).join(' · ')}
                      </p>
                    )}
                    <p className="text-sm font-medium text-[#0a0a0a] mt-1">{formatPrice(item.price)}</p>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-[#e8e4e0]">
                        <button
                          onClick={() => updateQuantity(item.variant_id, Math.max(1, item.quantity - 1))}
                          className="w-7 h-7 flex items-center justify-center text-[#6b6b6b] hover:text-[#0a0a0a] text-sm"
                        >−</button>
                        <span className="w-7 text-center text-xs text-[#0a0a0a]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variant_id, Math.min(item.max_stock || 99, item.quantity + 1))}
                          className="w-7 h-7 flex items-center justify-center text-[#6b6b6b] hover:text-[#0a0a0a] text-sm"
                        >+</button>
                      </div>
                      <button
                        onClick={() => removeItem(item.variant_id)}
                        className="text-[10px] uppercase tracking-widest text-[#9b9b9b] hover:text-red-500 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-medium text-[#0a0a0a]">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[#e8e4e0] px-5 py-4 space-y-3 bg-white">
            {/* Subtotal */}
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#6b6b6b]">Subtotal</span>
              <span className="font-serif text-base text-[#0a0a0a]">{formatPrice(total)}</span>
            </div>
            <p className="text-[10px] text-[#9b9b9b]">GST and shipping calculated at checkout</p>

            {/* CTA buttons */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full bg-[#0a0a0a] text-white text-[11px] font-sans tracking-widest uppercase text-center py-4 hover:bg-[#333] transition-colors"
            >
              Checkout
            </Link>
            <Link
              href="/cart"
              onClick={closeCart}
              className="block w-full border border-[#e8e4e0] text-[#0a0a0a] text-[11px] font-sans tracking-widest uppercase text-center py-3 hover:bg-[#faf8f5] transition-colors"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
