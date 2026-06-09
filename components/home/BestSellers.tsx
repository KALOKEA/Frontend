'use client'
import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { productsApi, type Product } from '@/lib/api/products'
import ProductCard from '@/components/shop/ProductCard'

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    productsApi.getAll({ sort: 'bestseller', limit: '8' })
      .then((res) => setProducts(res.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && products.length === 0) return null

  return (
    <section className="py-20 bg-[#F2EAE0] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="eyebrow mb-3">Most Loved</div>
            <h2 className="font-serif font-light text-[#0A0908]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
              Best <em className="italic" style={{ color: '#7C4A2D' }}>Sellers</em>
            </h2>
          </div>
          <Link
            href="/shop?sort=bestseller"
            className="hidden sm:block text-[9.5px] font-sans tracking-[0.22em] uppercase text-[#7C4A2D] border-b border-[#7C4A2D]/40 pb-0.5 hover:text-[#5C3520] transition-colors whitespace-nowrap"
          >
            See All →
          </Link>
        </div>

        {loading ? (
          /* Skeleton */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-[#E0D4C4] rounded-none mb-3" />
                <div className="h-3 bg-[#E0D4C4] rounded w-3/4 mb-2" />
                <div className="h-3 bg-[#E0D4C4] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Desktop: 4-col grid */}
            <div className="hidden md:grid grid-cols-4 gap-x-5 gap-y-10">
              {products.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {/* Mobile: horizontal scroll */}
            <div
              ref={trackRef}
              className="md:hidden flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none"
              style={{ scrollbarWidth: 'none' }}
            >
              {products.map((p) => (
                <div key={p.id} className="snap-start shrink-0" style={{ width: '72vw', maxWidth: 280 }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>

            {/* Mobile view all */}
            <div className="sm:hidden text-center mt-8">
              <Link
                href="/shop?sort=bestseller"
                className="text-[9.5px] font-sans tracking-[0.22em] uppercase text-[#7C4A2D] border-b border-[#7C4A2D]/40 pb-0.5"
              >
                See All Best Sellers →
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
