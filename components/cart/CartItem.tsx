'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore, type CartItem as CartItemType } from '@/lib/store/useCartStore'
import { formatPrice } from '@/lib/utils/formatPrice'

export default function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCartStore()

  return (
    <div className="flex gap-4 py-4 border-b border-[#e8e4e0]">
      <Link href={`/product/${item.slug}`} className="relative w-20 h-28 shrink-0 overflow-hidden bg-[#f4f2ef]">
        {item.image_url && (
          <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="80px" />
        )}
      </Link>

      <div className="flex-1 min-w-0">
        <Link href={`/product/${item.slug}`} className="font-serif text-sm text-[#0a0a0a] hover:text-[#7C4A2D] leading-snug block mb-1">
          {item.name}
        </Link>
        {(item.size || item.colour) && (
          <p className="text-[10px] font-sans text-[#6b6b6b] tracking-wide mb-2">
            {[item.colour, item.size].filter(Boolean).join(' · ')}
          </p>
        )}
        <p className="text-sm font-sans text-[#0a0a0a] mb-3">{formatPrice(item.price)}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center border border-[#e8e4e0]">
            <button
              onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-[#6b6b6b] hover:text-[#0a0a0a] text-lg"
            >−</button>
            <span className="w-8 text-center text-xs font-sans text-[#0a0a0a]">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.variant_id, Math.min(item.quantity + 1, item.max_stock))}
              className="w-8 h-8 flex items-center justify-center text-[#6b6b6b] hover:text-[#0a0a0a] text-lg"
            >+</button>
          </div>

          <button
            onClick={() => removeItem(item.variant_id)}
            className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] hover:text-[#0a0a0a]"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}
