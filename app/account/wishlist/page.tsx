'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Check } from 'lucide-react'
import { productsApi, type Product } from '@/lib/api/products'
import { useWishlistStore } from '@/lib/store/useWishlistStore'
import { useCartStore } from '@/lib/store/useCartStore'
import { formatPrice, formatDiscount } from '@/lib/utils/formatPrice'

// ── Helpers ──────────────────────────────────────────────────────────────────

function getPrimaryImage(product: Product): string {
  const primary = product.product_images?.find((i) => i.is_primary)
  return primary?.url || product.product_images?.[0]?.url || '/placeholder.jpg'
}

// ── Single wishlist card ──────────────────────────────────────────────────────

function WishlistCard({ product }: { product: Product }) {
  const { toggle } = useWishlistStore()
  const { addItem } = useCartStore()
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const imgUrl = getPrimaryImage(product)
  const discount = formatDiscount(product.compare_price || 0, product.base_price)
  const inStockVariant = product.product_variants?.find((v) => v.is_active && v.stock > 0)
  const isOutOfStock = !inStockVariant

  function handleAddToCart() {
    if (!inStockVariant) return
    setAdding(true)
    addItem({
      variant_id: inStockVariant.id,
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      image_url: imgUrl,
      size: inStockVariant.size,
      colour: inStockVariant.colour,
      price: inStockVariant.price || product.base_price,
      quantity: 1,
      max_stock: inStockVariant.stock,
    })
    setTimeout(() => {
      setAdding(false)
      setAdded(true)
      setTimeout(() => setAdded(false), 2500)
    }, 500)
  }

  return (
    <div className="group relative bg-white border border-[#e8e4e0] overflow-hidden flex flex-col">
      {/* Image */}
      <Link href={`/product/${product.slug}/`} className="relative block aspect-[3/4] overflow-hidden bg-[#F2EAE0] flex-shrink-0">
        <Image
          src={imgUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discount > 0 && (
            <span className="bg-[#7C4A2D] text-white text-[9px] font-sans font-semibold tracking-widest uppercase px-2.5 py-1">
              -{discount}%
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-[#6b6b6b]/90 text-white text-[9px] font-sans tracking-widest uppercase px-2.5 py-1">
              Sold Out
            </span>
          )}
        </div>
        {/* Remove X (top-right, hover reveal) */}
        <button
          onClick={(e) => { e.preventDefault(); toggle(product.id) }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 shadow-sm flex items-center justify-center z-10 opacity-100 transition-opacity duration-200 hover:bg-red-50 md:opacity-0 md:group-hover:opacity-100"
          aria-label="Remove from wishlist"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#6b5c55" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        {product.categories && (
          <p className="text-[9px] font-sans text-[#6b5c55] tracking-[0.18em] uppercase mb-1">
            {product.categories.name}
          </p>
        )}
        <Link
          href={`/product/${product.slug}/`}
          className="font-serif text-[#0A0908] hover:text-[#7C4A2D] transition-colors text-[15px] leading-snug mb-2 line-clamp-2"
        >
          {product.name}
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-sans text-[13px] font-medium text-[#0A0908]">
            {formatPrice(product.base_price)}
          </span>
          {product.compare_price && product.compare_price > product.base_price && (
            <span className="font-sans text-[12px] text-[#6b5c55] line-through">
              {formatPrice(product.compare_price)}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto flex flex-col gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock || adding}
            className={`w-full py-2.5 text-[10px] font-sans tracking-widest uppercase transition-colors ${
              added
                ? 'bg-green-700 text-white cursor-default'
                : isOutOfStock
                  ? 'bg-[#e8e4e0] text-[#6b6b6b] cursor-not-allowed'
                  : 'bg-[#0A0908] text-white hover:bg-[#7C4A2D]'
            }`}
          >
            {added ? <><Check size={11} className="inline mr-1" aria-hidden={true} />Added to Cart</> : adding ? 'Adding…' : isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          </button>
          <button
            onClick={() => toggle(product.id)}
            className="w-full py-2 text-[10px] font-sans tracking-widest uppercase text-[#6b5c55] hover:text-red-500 transition-colors border border-[#e8e4e0] hover:border-red-200"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Skeleton ─────────────────────────────────────────────────────────────────

function WishlistSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="animate-pulse bg-white border border-[#e8e4e0]">
          <div className="aspect-[3/4] bg-[#E0D4C4]" />
          <div className="p-4 space-y-2">
            <div className="h-2.5 bg-[#E0D4C4] w-1/3 rounded" />
            <div className="h-3.5 bg-[#E0D4C4] w-3/4 rounded" />
            <div className="h-3 bg-[#E0D4C4] w-1/4 rounded" />
            <div className="h-9 bg-[#E0D4C4] w-full mt-4 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function WishlistPage() {
  const { items } = useWishlistStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!items.length) { setLoading(false); return }
    setLoading(true)
    productsApi.getByIds(items)
      .then((data) => setProducts(data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [items])

  // Empty state
  if (!loading && !items.length) {
    return (
      <div className="py-20 flex flex-col items-center text-center">
        <div aria-hidden="true" className="w-16 h-16 rounded-full bg-[#F2EAE0] flex items-center justify-center mb-6">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.3" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </div>
        <h2 className="font-serif text-2xl text-[#0A0908] mb-2 font-light">Your wishlist is empty</h2>
        <p className="text-sm font-sans text-[#6b6b6b] mb-8 max-w-xs leading-relaxed">
          Save the pieces you love — they&apos;ll wait right here for you.
        </p>
        <Link
          href="/shop/"
          className="bg-[#0A0908] text-white text-[10px] font-sans tracking-widest uppercase px-8 py-3.5 hover:bg-[#7C4A2D] transition-colors"
        >
          Browse Products
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-baseline justify-between mb-8 pb-4 border-b border-[#e8e4e0]">
        <div>
          <h2 className="font-serif text-2xl text-[#0A0908] font-light">Wishlist</h2>
          {!loading && (
            <p className="text-[10px] font-sans text-[#6b5c55] tracking-widest uppercase mt-1">
              {items.length} {items.length === 1 ? 'item' : 'items'} saved
            </p>
          )}
        </div>
        {!loading && products.length > 0 && (
          <Link
            href="/shop/"
            className="text-[10px] font-sans tracking-widest uppercase text-[#7C4A2D] hover:underline"
          >
            Continue Shopping
          </Link>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <WishlistSkeleton />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <WishlistCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
