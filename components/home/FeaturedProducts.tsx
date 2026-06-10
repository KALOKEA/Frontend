'use client'
import { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { productsApi, type Product } from '@/lib/api/products'
import { getHomepageData, HERO_DEFAULTS } from '@/lib/api/homepageContent'
import ProductCard from '@/components/shop/ProductCard'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'

interface Tab {
  label: string
  sort?: string
  featured?: string
  category?: string
  viewAll?: boolean
}

const TABS: Tab[] = [
  { label: 'New Arrivals', sort: 'newest' },
  { label: 'Best Sellers', sort: 'bestseller' },
  { label: 'Featured',     featured: 'true' },
  { label: 'Sale',         category: 'sale' },
  { label: 'View All',     sort: 'newest', viewAll: true },
]

export default function FeaturedProducts() {
  const [tab, setTab] = useState(0)
  const [cache, setCache] = useState<Record<number, Product[]>>({})
  const [loading, setLoading] = useState(false)
  const [sectionHeading, setSectionHeading] = useState(HERO_DEFAULTS.featured_section_heading)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getHomepageData().then((d) => {
      if (d.cms.featured_section_heading) setSectionHeading(d.cms.featured_section_heading)
      if (d.featured_products?.length) {
        setCache((prev) => prev[0] ? prev : { ...prev, 0: d.featured_products })
      }
    }).catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const products = useMemo(() => cache[tab] || [], [cache, tab])

  useEffect(() => {
    if (cache[tab]) return
    setLoading(true)
    const t = TABS[tab]
    const limit = t.viewAll ? '16' : '8'
    const params: Record<string, string> = { limit, sort: t.sort || 'newest' }
    if (t.featured) params.featured = t.featured
    if (t.category) params.category_slug = t.category

    productsApi.getAll(params)
      .then((res) => setCache(prev => ({ ...prev, [tab]: res.data || [] })))
      .catch(() => setCache(prev => ({ ...prev, [tab]: [] })))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab])

  // Stagger reveal
  useEffect(() => {
    if (!gridRef.current || loading) return
    const cards = Array.from(gridRef.current.querySelectorAll<HTMLElement>('[data-card]'))
    cards.forEach(card => {
      card.style.opacity = '0'
      card.style.transform = 'translateY(28px)'
      card.style.transition = ''
    })
    const timeout = setTimeout(() => {
      cards.forEach((card, i) => {
        card.style.transition = `opacity 0.5s ease ${i * 60}ms, transform 0.5s ease ${i * 60}ms`
        card.style.opacity = '1'
        card.style.transform = 'translateY(0)'
      })
    }, 30)
    return () => clearTimeout(timeout)
  }, [products, loading])

  return (
    <section className="py-20 bg-[#FDFAF6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section header */}
        <div className="text-center mb-12">
          <div className="eyebrow-center mb-4">Hand-Picked</div>
          <h2 className="font-serif font-light text-[#0A0908] mb-2" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            {sectionHeading}
          </h2>
          {/* Sienna underline accent */}
          <div className="mx-auto w-10 h-px bg-[#7C4A2D] mt-4 mb-8" />

          {/* Tab bar */}
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 pb-0.5">
            <div className="flex items-end gap-0 w-fit mx-auto border-b border-[#E0D4C4]">
              {TABS.map((t, i) => (
                <button
                  key={t.label}
                  onClick={() => setTab(i)}
                  className={`relative px-4 sm:px-6 py-2.5 text-[9.5px] font-sans tracking-[0.22em] uppercase transition-colors whitespace-nowrap ${
                    i === tab
                      ? 'text-[#0A0908] font-medium'
                      : 'text-[#9B8F87] hover:text-[#0A0908]'
                  }`}
                >
                  {t.label}
                  <span className={`absolute bottom-0 left-0 right-0 h-[2px] bg-[#7C4A2D] transition-all duration-300 ${i === tab ? 'opacity-100' : 'opacity-0'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <>
            <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
              {products.map((p) => (
                <div key={p.id} data-card>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href="/shop/"
                className="btn-shimmer inline-block border border-[#0A0908] text-[#0A0908] text-[9.5px] font-sans tracking-[0.22em] uppercase px-10 py-3.5 hover:bg-[#0A0908] hover:text-[#FDFAF6] transition-colors duration-300 relative overflow-hidden"
              >
                View All Products
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
