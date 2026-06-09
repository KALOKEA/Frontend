'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { productsApi, type Product } from '@/lib/api/products'
import ProductGrid from '@/components/shop/ProductGrid'

// ── Types ─────────────────────────────────────────────────────────────────────

type SortOption = 'newest' | 'price_asc' | 'price_desc'

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Newest First',
  price_asc: 'Price: Low to High',
  price_desc: 'Price: High to Low',
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  category: string
  displayName: string
}

export default function CategoryShopClient({ category, displayName }: Props) {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sort, setSort] = useState<SortOption>('newest')

  const fetchProducts = useCallback(() => {
    setLoading(true)
    setError(null)
    productsApi
      .getAll({ category_slug: category, sort, limit: 48, page: 1 })
      .then((res) => {
        setProducts(res.data || [])
        setTotal(res.meta?.total || 0)
      })
      .catch(() => setError('Failed to load products. Please refresh the page.'))
      .finally(() => setLoading(false))
  }, [category, sort])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  return (
    <div className="min-h-screen bg-[#fafaf8]">

      {/* ── Page Header ── */}
      <div className="border-b border-[#f0ece8] bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14 text-center">
          <h1 className="font-serif text-3xl md:text-5xl text-[#0a0a0a] mb-2">
            {displayName}
          </h1>
          <p className="text-[11px] font-sans text-[#6b6b6b] tracking-[0.25em] uppercase">
            {loading ? ' ' : `${total} Style${total !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#f0ece8] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
          <Link
            href="/shop"
            className="text-[11px] font-sans tracking-[0.15em] uppercase text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors flex items-center gap-1.5"
          >
            <span aria-hidden="true">←</span> All Categories
          </Link>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="border border-[#e8e4e0] text-xs font-sans text-[#0a0a0a] px-3 py-1.5 min-h-[44px] outline-none focus:border-[#0a0a0a] bg-white cursor-pointer"
            aria-label="Sort products"
          >
            {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Products ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {error && (
          <div className="text-center py-20">
            <p className="text-[#c0392b] text-sm font-sans mb-4">{error}</p>
            <button
              onClick={fetchProducts}
              className="text-[11px] font-sans uppercase tracking-widest underline text-[#0a0a0a]"
            >
              Try again
            </button>
          </div>
        )}

        {!error && <ProductGrid products={products} loading={loading} />}

        {!loading && !error && products.length === 0 && (
          <div className="text-center py-24">
            <p className="font-serif text-2xl text-[#0a0a0a] mb-2">No products yet</p>
            <p className="text-sm font-sans text-[#6b6b6b] mb-6">Check back soon — new styles are on their way.</p>
            <Link href="/shop" className="text-[11px] font-sans tracking-widest uppercase underline text-[#0a0a0a] hover:text-[#7C4A2D] transition-colors">
              Browse all collections
            </Link>
          </div>
        )}
      </div>

    </div>
  )
}
