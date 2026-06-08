'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useWishlistStore } from '@/lib/store/useWishlistStore'
import { formatPrice, formatDiscount } from '@/lib/utils/formatPrice'
import type { Product } from '@/lib/api/products'

interface ProductCardProps {
  product: Product
}

function getPrimaryImage(product: Product): string {
  const primary = product.product_images?.find((i) => i.is_primary)
  return primary?.url || product.product_images?.[0]?.url || '/placeholder.jpg'
}

/** Extract unique swatch colors from variants (up to 5) */
function getSwatches(product: Product): string[] {
  const colors: string[] = []
  for (const v of product.product_variants ?? []) {
    if (v.color && !colors.includes(v.color) && colors.length < 5) {
      colors.push(v.color)
    }
  }
  return colors
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toggle, isWishlisted } = useWishlistStore()
  const [hovered, setHovered] = useState(false)
  const [wishlisting, setWishlisting] = useState(false)
  const wishlisted = isWishlisted(product.id)
  const discount = formatDiscount(product.compare_price || 0, product.base_price)
  const isOutOfStock = product.product_variants?.every((v) => v.stock === 0) ?? false
  const imgUrl = getPrimaryImage(product)
  const hoverImg = product.product_images?.[1]?.url || imgUrl
  const swatches = getSwatches(product)

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    setWishlisting(true)
    toggle(product.id)
    setTimeout(() => setWishlisting(false), 600)
  }

  return (
    <div className="group relative card-lift">
      {/* Image container */}
      <div
        className="relative overflow-hidden bg-[#f4f2ef] aspect-[3/4]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Link href={`/product/${product.slug}`} tabIndex={-1}>
          <Image
            src={hovered ? hoverImg : imgUrl}
            alt={product.name}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-[1.06]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            unoptimized
          />
        </Link>

        {/* Top-left badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discount > 0 && (
            <span className="bg-[#c8a4a5] text-white text-[9px] font-sans font-semibold tracking-widest uppercase px-2.5 py-1 shadow-sm">
              -{discount}% OFF
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-[#6b6b6b]/90 text-white text-[9px] font-sans tracking-widest uppercase px-2.5 py-1">
              Sold Out
            </span>
          )}
          {product.is_new && !isOutOfStock && (
            <span className="bg-[#0a0a0a] text-white text-[9px] font-sans tracking-widest uppercase px-2.5 py-1">
              New
            </span>
          )}
          {product.is_featured && !product.is_new && !discount && !isOutOfStock && (
            <span className="bg-white/90 text-[#0a0a0a] text-[9px] font-sans tracking-widest uppercase px-2.5 py-1 border border-[#e8e4e0]">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist button — animated heart */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 shadow-sm flex items-center justify-center z-10 transition-all duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:scale-110 ${wishlisting ? 'animate-heart-pulse' : ''}`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            width="14" height="14" viewBox="0 0 24 24"
            fill={wishlisted ? '#c8a4a5' : 'none'}
            stroke={wishlisted ? '#c8a4a5' : '#0a0a0a'}
            strokeWidth="1.5"
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>

        {/* Quick-view CTA — slides up on hover */}
        {!isOutOfStock && (
          <Link
            href={`/product/${product.slug}`}
            className="btn-shimmer absolute bottom-0 left-0 right-0 bg-[#0a0a0a] text-white text-[10px] font-sans tracking-widest uppercase py-3.5 text-center translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 ease-out relative overflow-hidden z-10"
          >
            View Product
          </Link>
        )}
      </div>

      {/* Card info */}
      <div className="pt-3 pb-1">
        {product.categories && (
          <p className="text-[9px] font-sans text-[#9b9b9b] tracking-[0.18em] uppercase mb-1">
            {product.categories.name}
          </p>
        )}
        <Link
          href={`/product/${product.slug}`}
          className="block font-serif text-[#0a0a0a] hover:text-[#c8a4a5] transition-colors leading-snug mb-1.5 text-[15px]"
        >
          {product.name}
        </Link>

        {/* Price row */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="font-sans text-[13px] font-medium text-[#0a0a0a]">{formatPrice(product.base_price)}</span>
          {product.compare_price && product.compare_price > product.base_price && (
            <span className="font-sans text-[12px] text-[#9b9b9b] line-through">{formatPrice(product.compare_price)}</span>
          )}
        </div>

        {/* Color swatches */}
        {swatches.length > 0 && (
          <div className="flex items-center gap-1.5 mb-1.5">
            {swatches.map((color) => (
              <span
                key={color}
                title={color}
                className="w-3 h-3 rounded-full border border-[#e8e4e0] ring-offset-1 hover:ring-1 hover:ring-[#c8a4a5] transition-all cursor-default"
                style={{ backgroundColor: color.startsWith('#') ? color : undefined }}
              />
            ))}
            {(product.product_variants?.length ?? 0) > swatches.length && (
              <span className="text-[10px] font-sans text-[#9b9b9b]">+{(product.product_variants?.length ?? 0) - swatches.length}</span>
            )}
          </div>
        )}

        {/* Star rating */}
        {(product.review_count ?? 0) > 0 && (
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(i => (
              <svg key={i} width="9" height="9" viewBox="0 0 24 24" fill={(product.avg_rating ?? 0) >= i ? '#c8a4a5' : 'none'} stroke="#c8a4a5" strokeWidth="1.5">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
            ))}
            <span className="text-[10px] font-sans text-[#6b6b6b] ml-0.5">({product.review_count})</span>
          </div>
        )}
      </div>
    </div>
  )
}
