'use client'
import Image from 'next/image'
import { useCartStore } from '@/lib/store/useCartStore'
import { formatPrice } from '@/lib/utils/formatPrice'

const SHIPPING_THRESHOLD = 99900

export default function OrderSummary({ couponDiscount = 0, paymentMethod }: { couponDiscount?: number; paymentMethod?: string }) {
  const { items } = useCartStore()
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : 4900
  const codFee = paymentMethod === 'cod' ? 4900 : 0
  const total = Math.max(0, subtotal - couponDiscount) + shipping + codFee

  return (
    <div className="bg-[#faf8f5] p-6 sticky top-24">
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
        <div className="flex justify-between text-xs font-sans text-[#6b6b6b]">
          <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
        </div>
        {couponDiscount > 0 && (
          <div className="flex justify-between text-xs font-sans text-[#c8a4a5]">
            <span>Discount</span><span>-{formatPrice(couponDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between text-xs font-sans text-[#6b6b6b]">
          <span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
        </div>
        {codFee > 0 && (
          <div className="flex justify-between text-xs font-sans text-[#6b6b6b]">
            <span>COD fee</span><span>{formatPrice(codFee)}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-sans font-medium text-[#0a0a0a] pt-2 border-t border-[#e8e4e0]">
          <span>Total</span><span>{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  )
}
