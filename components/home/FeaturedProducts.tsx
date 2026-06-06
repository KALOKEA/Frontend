'use client'
import { useState, useEffect, useMemo } from 'react'
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
  { label: 'Featured', featured: 'true' },
  { label: 'Sale', category: 'sale' },
  { label: 'View All', sort: 'newest', viewAll: true },
]

export default function FeaturedProducts() {
  const [tab, setTab] = useState(0)
  const [cache, setCache] = useState<Record<number, Product[]>>({})
  const [loading, setLoading] = useState(false)
  const [sectionHeading, setSectionHeading] = useState(HERO_DEFAULTS.featured_section_heading)

  useEffect(() => {
    // Use the shared homepage fetch — no extra network request if already cached
    getHomepageData().then((d) => {
      if (d.cms.featured_section_heading) setSectionHeading(d.cms.featured_section_heading)
      // Seed tab 0 (New Arrivals) with the pre-fetched featured_products so the
      // grid appears instantly on first load without a second API call.
      if (d.featured_products?.length) {
        setCache((prev) => prev[0] ? prev : { ...prev, 0: d.featured_products })
      }
    }).catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const products = useMemo(() => cache[tab] || [], [cache, tab])

  useEffect(() => {
    // Skip fetch if already cached (including the seed from homepage endpoint)
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

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <p className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#c8a4a5] mb-2">Hand-Picked</p>
        <h2 className="font-serif text-3xl md:text-4xl text-[#0a0a0a] mb-6">{sectionHeading}</h2>
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex items-center gap-0 border border-[#e8e4e0] w-fit mx-auto">
            {TABS.map((t, i) => (
              <button
                key={t.label}
                onClick={() => setTab(i)}
                className={`px-4 sm:px-5 py-2.5 text-[10px] font-sans tracking-widest uppercase transition-colors border-r last:border-r-0 border-[#e8e4e0] whitespace-nowrap ${i === tab ? 'bg-[#0a0a0a] text-white' : 'text-[#6b6b6b] hover:text-[#0a0a0a]'}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/shop"
              className="inline-block border border-[#0a0a0a] text-[#0a0a0a] text-[10px] font-sans tracking-widest uppercase px-8 py-3 hover:bg-[#0a0a0a] hover:text-white transition-colors duration-200"
            >
              View All Products
            </Link>
          </div>
        </>
      )}
    </section>
  )
}
