'use client'
/**
 * CartCrossSell
 *
 * "You May Also Like" strip shown inside the cart drawer when the cart has items.
 * Fetches up to 6 featured products and shows 3 that are not already in the cart.
 * Keeps the bundle small — no QuickView, just a compact image + name + price + link.
 */
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { productsApi, type Product } from '@/lib/api/products'
import { useCartStore } from '@/lib/store/useCartStore'
import { formatPrice } from '@/lib/utils/formatPrice'

interface CartCrossSellProps {
  onNavigate: () => void   // close the cart drawer on link click
}

function getPrimaryImage(product: Product): string {
  const primary = product.product_images?.find((i) => i.is_primary)
  return primary?.url || product.product_images?.[0]?.url || '/placeholder.jpg'
}

export default function CartCrossSell({ onNavigate }: CartCrossSellProps) {
  const cartItems = useCartStore((s) => s.items)
  const [suggestions, setSuggestions] = useState<Product[]>([])

  useEffect(() => {
    const cartProductIds = new Set(cartItems.map((i) => i.product_id))

    productsApi
      .getAll({ featured: 'true', limit: '8' })
      .then((res) => {
        const pool = res.data ?? []
        const filtered: Product[] = pool
          .filter((p: Product) => !cartProductIds.has(p.id) && p.is_active)
          .slice(0, 3)
        setSuggestions(filtered)
      })
      .catch(() => {
        // silently ignore — cross-sell is non-critical
      })
  }, [cartItems])

  if (suggestions.length === 0) return null

  return (
    <div className="mt-6 pt-5 border-t border-[#E0D4C4]">
      <p className="text-[9px] font-sans uppercase tracking-[0.25em] text-[#6b5c55] mb-3">
        You May Also Like
      </p>
      <div className="flex flex-col gap-3">
        {suggestions.map((product) => {
          const imgUrl = getPrimaryImage(product)
          return (
            <Link
              key={product.id}
              href={`/product/${product.slug}/`}
              onClick={onNavigate}
              className="flex items-center gap-3 group"
            >
              {/* Image */}
              <div className="relative w-14 h-[4.375rem] bg-[#F2EAE0] shrink-0 overflow-hidden">
                <Image
                  src={imgUrl}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="56px"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-[#0A0908] group-hover:text-[#7C4A2D] transition-colors line-clamp-2 leading-snug">
                  {product.name}
                </p>
                <p className="text-[11px] text-[#6b5c55] mt-0.5">
                  {formatPrice(product.base_price)}
                </p>
              </div>

              {/* Arrow */}
              <svg
                width="12" height="12" viewBox="0 0 24 24"
                fill="none" stroke="#C4A882" strokeWidth="1.5"
                className="shrink-0 group-hover:stroke-[#7C4A2D] transition-colors"
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
