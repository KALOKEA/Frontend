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

export default function ProductCard({ product }: ProductCardProps) {
  const { toggle, isWishlisted } = useWishlistStore()
  const [hovered, setHovered] = useState(false)
  const wishlisted = isWishlisted(product.id)
  const discount = formatDiscount(product.compare_price || 0, product.base_price)
  const isOutOfStock = product.product_variants?.every((v) => v.stock === 0) ?? false
  const imgUrl = getPrimaryImage(product)
  const hoverImg = product.product_images?.[1]?.url || imgUrl

  return (
    <div className="group relative">
      {/* Image */}
      <div
        className="relative overflow-hidden bg-[#f4f2ef] aspect-[3/4]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Link href={`/product/${product.slug}`}>
          <Image
            src={hovered ? hoverImg : imgUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <span className="bg-[#c8a4a5] text-white text-[9px] font-sans tracking-widest uppercase px-2 py-0.5">
              -{discount}%
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-[#6b6b6b] text-white text-[9px] font-sans tracking-widest uppercase px-2 py-0.5">
              Sold Out
            </span>
          )}
          {product.is_featured && !discount && !isOutOfStock && (
            <span className="bg-[#0a0a0a] text-white text-[9px] font-sans tracking-widest uppercase px-2 py-0.5">
              New
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); toggle(product.id) }}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Wishlist"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill={wishlisted ? '#c8a4a5' : 'none'} stroke={wishlisted ? '#c8a4a5' : '#0a0a0a'} strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>

        {/* Quick add */}
        {!isOutOfStock && (
          <Link
            href={`/product/${product.slug}`}
            className="absolute bottom-0 left-0 right-0 bg-[#0a0a0a] text-white text-[10px] font-sans tracking-widest uppercase py-3 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-200"
          >
            View Product
          </Link>
        )}
      </div>

      {/* Info */}
      <div className="pt-3">
        {product.categories && (
          <p className="text-[10px] font-sans text-[#6b6b6b] tracking-widest uppercase mb-1">
            {product.categories.name}
          </p>
        )}
        <Link href={`/product/${product.slug}`} className="block font-serif text-[#0a0a0a] hover:text-[#c8a4a5] transition-colors text-[15px] leading-snug mb-1">
          {product.name}
        </Link>
        <div className="flex items-center gap-2">
          <span className="font-sans text-sm text-[#0a0a0a]">{formatPrice(product.base_price)}</span>
          {product.compare_price && product.compare_price > product.base_price && (
            <span className="font-sans text-xs text-[#6b6b6b] line-through">{formatPrice(product.compare_price)}</span>
          )}
        </div>
      </div>
    </div>
  )
}
