'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/useCartStore'
import CartItem from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'
import EmptyCart from '@/components/cart/EmptyCart'
import CouponInput from '@/components/checkout/CouponInput'
import { formatPrice } from '@/lib/utils/formatPrice'

const SHIPPING_THRESHOLD = 99900

export default function CartPage() {
  const { items } = useCartStore()
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [appliedCode, setAppliedCode] = useState<string | null>(null)

  if (!items.length) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <EmptyCart />
    </div>
  )

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : 4900
  const total = subtotal + shipping - couponDiscount
  const amountToFree = Math.max(0, SHIPPING_THRESHOLD - subtotal)
  const shippingProgress = Math.min(100, Math.round((subtotal / SHIPPING_THRESHOLD) * 100))

  return (
    <>
      {/* Sticky mobile checkout bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-[#e8e4e0] px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-sans text-[#6b6b6b] uppercase tracking-widest">Total</p>
            <p className="text-sm font-sans font-medium text-[#0a0a0a]">{formatPrice(total)}</p>
          </div>
          <Link
            href="/checkout"
            className="shrink-0 bg-[#0a0a0a] text-white text-[11px] font-sans tracking-widest uppercase px-5 py-3 hover:bg-[#2a2a2a] transition-colors"
          >
            Checkout
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 pb-24 lg:pb-10">
        <h1 className="font-serif text-3xl text-[#0a0a0a] mb-6">Your Bag ({items.length})</h1>

        {/* Free shipping progress bar */}
        <div className="mb-8 p-4 bg-[#faf8f5] border border-[#f0ece8]">
          {amountToFree > 0 ? (
            <>
              <p className="text-[11px] font-sans text-[#6b6b6b] mb-2">
                Add <span className="text-[#0a0a0a] font-medium">{formatPrice(amountToFree)}</span> more for{' '}
                <span className="text-[#0a0a0a] font-medium">free shipping</span>
              </p>
              <div className="h-1 bg-[#e8e4e0] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#0a0a0a] rounded-full transition-all duration-500"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </>
          ) : (
            <p className="text-[11px] font-sans text-[#0a0a0a] font-medium">
              🎉 You&apos;ve unlocked free shipping!
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {items.map((item) => <CartItem key={item.variant_id} item={item} />)}

            <div className="mt-6">
              <p className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-2">Have a coupon?</p>
              <CouponInput
                onApply={(discount, code) => { setCouponDiscount(discount); setAppliedCode(code) }}
                onRemove={() => { setCouponDiscount(0); setAppliedCode(null) }}
                appliedCode={appliedCode}
              />
            </div>
          </div>

          <CartSummary couponDiscount={couponDiscount} />
        </div>
      </div>
    </>
  )
}
