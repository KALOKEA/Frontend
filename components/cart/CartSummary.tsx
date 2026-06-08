'use client'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/useCartStore'
import { formatPrice } from '@/lib/utils/formatPrice'

const SHIPPING_THRESHOLD = 99900 // ₹999 in paise

export default function CartSummary({ couponDiscount = 0 }: { couponDiscount?: number }) {
  const { items } = useCartStore()
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : 4900
  const total = subtotal + shipping - couponDiscount

  return (
    <div className="bg-[#faf8f5] p-6">
      <h3 className="font-serif text-lg text-[#0a0a0a] mb-4">Order Summary</h3>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-xs font-sans text-[#6b6b6b]">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {couponDiscount > 0 && (
          <div className="flex justify-between text-xs font-sans text-[#7C4A2D]">
            <span>Discount</span>
            <span>-{formatPrice(couponDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between text-xs font-sans text-[#6b6b6b]">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
        </div>
        {shipping > 0 && (
          <p className="text-[10px] font-sans text-[#7C4A2D]">
            Add {formatPrice(SHIPPING_THRESHOLD - subtotal)} more for free shipping
          </p>
        )}
      </div>

      <div className="border-t border-[#e8e4e0] pt-4 mb-6">
        <div className="flex justify-between font-sans text-sm font-medium text-[#0a0a0a]">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
        <p className="text-[10px] font-sans text-[#6b6b6b] mt-1">Inclusive of all taxes</p>
      </div>

      <Link
        href="/checkout"
        className="block w-full bg-[#0a0a0a] text-white text-[11px] font-sans tracking-widest uppercase py-4 text-center hover:bg-[#2a2a2a] transition-colors"
      >
        Proceed to Checkout
      </Link>

      <Link
        href="/shop"
        className="block text-center text-[10px] font-sans text-[#6b6b6b] hover:text-[#0a0a0a] mt-3 tracking-widest uppercase"
      >
        Continue Shopping
      </Link>
    </div>
  )
}
