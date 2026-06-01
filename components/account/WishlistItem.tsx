import Image from 'next/image'
import Link from 'next/link'
import { useWishlistStore } from '@/lib/store/useWishlistStore'
import { formatPrice } from '@/lib/utils/formatPrice'
import type { Product } from '@/lib/api/products'

export default function WishlistItem({ product }: { product: Product }) {
  const { toggle } = useWishlistStore()
  const img = product.product_images?.find((i) => i.is_primary)?.url || product.product_images?.[0]?.url

  return (
    <div className="flex gap-4 border-b border-[#e8e4e0] py-4">
      <Link href={`/product?slug=${product.slug}`} className="relative w-16 h-24 shrink-0 bg-[#f4f2ef] overflow-hidden">
        {img && <Image src={img} alt={product.name} fill className="object-cover" sizes="64px" />}
      </Link>
      <div className="flex-1">
        <Link href={`/product?slug=${product.slug}`} className="font-serif text-sm text-[#0a0a0a] hover:text-[#c8a4a5]">{product.name}</Link>
        <p className="text-xs font-sans text-[#0a0a0a] mt-1">{formatPrice(product.base_price)}</p>
        <button onClick={() => toggle(product.id)} className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] hover:text-red-500 mt-2 underline">
          Remove
        </button>
      </div>
    </div>
  )
}
