'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useWishlistStore } from '@/lib/store/useWishlistStore'
import { formatPrice, formatDiscount } from '@/lib/utils/formatPrice'
import type { Product } from '@/lib/api/products'

// Lazy-loaded so the modal bundle only loads when first triggered
const QuickView = dynamic(() => import('./QuickView'), { ssr: false })

interface ProductCardProps {
  product: Product
}

function getPrimaryImage(product: Product): string {
  const primary = product.product_images?.find((i) => i.is_primary)
  return primary?.url || product.product_images?.[0]?.url || '/placeholder.jpg'
}

function getSwatches(product: Product): string[] {
  const colours: string[] = []
  for (const v of product.product_variants ?? []) {
    if (v.colour && !colours.includes(v.colour) && colours.length < 5) {
      colours.push(v.colour)
    }
  }
  return colours
}

// Render a half-star or full star fill for decimal ratings
function StarFill({ index, rating }: { index: number; rating: number }) {
  const filled = rating >= index
  const half   = !filled && rating >= index - 0.5
  const fillId = `star-half-${index}-${Math.round(rating * 10)}`

  if (filled) {
    return <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="#D4A853" />
  }
  if (half) {
    return (
      <>
        <defs>
          <linearGradient id={fillId} x1="0" x2="1" y1="0" y2="0">
            <stop offset="50%" stopColor="#D4A853" />
            <stop offset="50%" stopColor="#E8E0D5" />
          </linearGradient>
        </defs>
        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill={`url(#${fillId})`} />
      </>
    )
  }
  return <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="#E8E0D5" />
}

export default function ProductCard({ product }: ProductCardProps) {
  const { toggle, isWishlisted } = useWishlistStore()
  const [hovered, setHovered]       = useState(false)
  const [wishlisting, setWishlisting] = useState(false)
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const wishlisted   = isWishlisted(product.id)
  const discount     = formatDiscount(product.compare_price || 0, product.base_price)
  const isOutOfStock = !product.product_variants?.some((v) => v.is_active && v.stock > 0)
  const imgUrl       = getPrimaryImage(product)
  const hoverImg     = product.product_images?.[1]?.url || imgUrl
  const swatches     = getSwatches(product)
  const rating       = product.avg_rating ?? 0
  const reviewCount  = product.review_count ?? 0


  // ── 3D tilt on hover (pointer devices only) ──────────────────────────────
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const { left, top, width, height } = el.getBoundingClientRect()
    const cx = (e.clientX - left) / width  - 0.5
    const cy = (e.clientY - top)  / height - 0.5
    setTilt({ x: cy * -6, y: cx * 6 })
  }, [])

  const resetTilt = useCallback(() => setTilt({ x: 0, y: 0 }), [])

    function handleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    setWishlisting(true)
    toggle(product.id)
    setTimeout(() => setWishlisting(false), 600)
  }

  return (
    <>
    <div
      ref={cardRef}
      className="group relative"
      style={{
        transform: `perspective(700px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: tilt.x === 0 && tilt.y === 0
          ? 'transform 0.5s cubic-bezier(0.23,1,0.32,1)'
          : 'transform 0.08s linear',
        willChange: 'transform',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
    >

      {/* ── Image container ─────────────────────────────────────── */}
      <div
        className="relative overflow-hidden bg-[#F2EAE0] aspect-[3/4]"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Link href={`/product/${product.slug}/`} tabIndex={-1}>
          <Image
            src={hovered ? hoverImg : imgUrl}
            alt={product.name}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-[1.04]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </Link>

        {/* ── Top-left badges — rounded pill like reference ── */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discount > 0 && (
            <span className="bg-[#7C4A2D] text-white text-[9px] font-sans font-semibold tracking-widest uppercase rounded-full px-2.5 py-1 shadow-sm">
              -{discount}%
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-[#5a5a5a]/90 text-white text-[9px] font-sans tracking-widest uppercase rounded-full px-2.5 py-1">
              Sold Out
            </span>
          )}
          {product.is_featured && !discount && !isOutOfStock && (
            <span className="bg-[#0A0908] text-white text-[9px] font-sans font-semibold tracking-widest uppercase rounded-full px-2.5 py-1">
              NEW
            </span>
          )}
        </div>

        {/* ── Wishlist button — top-right ── */}
        <button
          onClick={handleWishlist}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 shadow-sm flex items-center justify-center z-10 transition-all duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:scale-110 ${wishlisting ? 'scale-125' : ''}`}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <svg
            width="14" height="14" viewBox="0 0 24 24"
            fill={wishlisted ? '#7C4A2D' : 'none'}
            stroke={wishlisted ? '#7C4A2D' : '#0A0908'}
            strokeWidth="1.5"
          >
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>

        {/* ── Quick View pill — appears on hover above the ATC bar ── */}
        <button
          onClick={(e) => { e.preventDefault(); setQuickViewOpen(true) }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-white/95 text-[#0A0908] text-[9px] font-sans font-semibold tracking-[0.18em] uppercase px-3.5 py-1.5 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 whitespace-nowrap hover:bg-white hidden md:block"
          aria-label={`Quick view ${product.name}`}
        >
          Quick View
        </button>

        {/* ── Add to Bag CTA — slides up from bottom on hover ── */}
        {!isOutOfStock && (
          <Link
            href={`/product/${product.slug}/`}
            className="absolute bottom-0 left-0 right-0 bg-[#0A0908] text-white text-[10px] font-sans font-semibold tracking-[0.15em] uppercase py-3.5 text-center translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 ease-out z-10 hover:bg-[#1a1208]"
          >
            Add to Bag
          </Link>
        )}
      </div>

      {/* ── Card info ──────────────────────────────────────────── */}
      <div className="pt-3 pb-2">

        {/* Product name */}
        <Link
          href={`/product/${product.slug}/`}
          className="block font-serif text-[#0A0908] hover:text-[#7C4A2D] transition-colors leading-snug mb-1.5"
          style={{ fontSize: '0.9rem' }}
        >
          {product.name}
        </Link>

        {/* Price row */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="font-sans text-[13px] font-medium text-[#0A0908]">
            {formatPrice(product.base_price)}
          </span>
          {product.compare_price && product.compare_price > product.base_price && (
            <span className="font-sans text-[12px] text-[#6b5c55] line-through">
              {formatPrice(product.compare_price)}
            </span>
          )}
        </div>

        {/* Star ratings — gold stars + decimal rating like reference ── */}
        {reviewCount > 0 && (
          <div
            className="flex items-center gap-1 mb-2"
            role="img"
            aria-label={`Rated ${rating.toFixed(1)} out of 5 stars (${reviewCount} review${reviewCount !== 1 ? 's' : ''})`}
          >
            {[1, 2, 3, 4, 5].map(i => (
              <svg key={i} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="none" aria-hidden="true">
                <StarFill index={i} rating={rating} />
              </svg>
            ))}
            <span className="text-[11px] font-sans text-[#6B5E55] ml-0.5 font-medium" aria-hidden="true">
              {rating.toFixed(1)}
            </span>
            <span className="text-[10px] font-sans text-[#6b5c55]" aria-hidden="true">
              ({reviewCount})
            </span>
          </div>
        )}

        {/* Color swatches */}
        {swatches.length > 0 && (
          <div className="flex items-center gap-1.5" role="group" aria-label="Available colours">
            {swatches.map((colour) => (
              <span
                key={colour}
                role="img"
                aria-label={colour}
                title={colour}
                className="w-3.5 h-3.5 rounded-full border border-[#D8CFC5] hover:ring-1 hover:ring-offset-1 hover:ring-[#7C4A2D] transition-all cursor-default"
                style={{ backgroundColor: colour.toLowerCase() }}
              />
            ))}
            {(product.product_variants?.length ?? 0) > swatches.length && (
              <span className="text-[10px] font-sans text-[#6b5c55]">
                +{(product.product_variants?.length ?? 0) - swatches.length}
              </span>
            )}
          </div>
        )}
      </div>
    </div>

    {/* Quick view modal — portal-like via fixed positioning */}
    {quickViewOpen && (
      <QuickView product={product} onClose={() => setQuickViewOpen(false)} />
    )}
    </>
  )
}
