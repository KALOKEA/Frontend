'use client'
import { useState } from 'react'
import { useCartStore } from '@/lib/store/useCartStore'
import CartItem from '@/components/cart/CartItem'
import CartSummary from '@/components/cart/CartSummary'
import EmptyCart from '@/components/cart/EmptyCart'
import CouponInput from '@/components/checkout/CouponInput'

export default function CartPage() {
  const { items } = useCartStore()
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [appliedCode, setAppliedCode] = useState<string | null>(null)

  if (!items.length) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <EmptyCart />
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-serif text-3xl text-[#0a0a0a] mb-8">Your Cart ({items.length})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2">
          {items.map((item) => <CartItem key={item.variant_id} item={item} />)}

          {/* Coupon */}
          <div className="mt-6">
            <p className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-2">Have a coupon?</p>
            <CouponInput
              onApply={(discount, code) => { setCouponDiscount(discount); setAppliedCode(code) }}
              onRemove={() => { setCouponDiscount(0); setAppliedCode(null) }}
              appliedCode={appliedCode}
            />
          </div>
        </div>

        {/* Summary */}
        <CartSummary couponDiscount={couponDiscount} />
      </div>
    </div>
  )
}
