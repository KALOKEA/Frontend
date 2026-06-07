'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { productsApi, type Product } from '@/lib/api/products'
import ProductGrid from '@/components/shop/ProductGrid'
import FilterSidebar, { FilterPanel, PRICE_RANGES } from '@/components/shop/FilterSidebar'
import SortDropdown from '@/components/shop/SortDropdown'
import Pagination from '@/components/shop/Pagination'

// ── Active filter chips ─────────────────────────────────────────────────────

function ActiveFilters() {
  const router = useRouter()
  const params = useSearchParams()

  const chips: { label: string; remove: () => void }[] = []

  const size = params.get('size')
  const colour = params.get('colour')
  const minPrice = params.get('min_price')
  const sort = params.get('sort')

  function removeParam(...keys: string[]) {
    const p = new URLSearchParams(params.toString())
    keys.forEach(k => p.delete(k))
    p.delete('page')
    router.push(`/shop?${p.toString()}`)
  }

  if (size) chips.push({ label: `Size: ${size}`, remove: () => removeParam('size') })
  if (colour) chips.push({ label: `Colour: ${colour}`, remove: () => removeParam('colour') })
  if (minPrice) {
    const range = PRICE_RANGES.find(r => String(r.min) === minPrice)
    if (range) chips.push({ label: range.label, remove: () => removeParam('min_price', 'max_price') })
  }
  if (sort) chips.push({ label: `Sort: ${sort.replace('_', ' ')}`, remove: () => removeParam('sort') })

  if (!chips.length) return null

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {chips.map(c => (
        <button
          key={c.label}
          onClick={c.remove}
          className="flex items-center gap-1 px-3 py-1 text-[10px] uppercase tracking-widest bg-[#0a0a0a] text-white hover:bg-[#333] transition-colors"
        >
          {c.label}
          <span className="ml-1 text-[#c8a4a5]">×</span>
        </button>
      ))}
      <button
        onClick={() => router.push('/shop')}
        className="text-[10px] uppercase tracking-widest text-[#c8a4a5] hover:underline ml-1"
      >
        Clear all
      </button>
    </div>
  )
}

// ── Mobile filter drawer ────────────────────────────────────────────────────

function MobileFilterDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto lg:hidden">
        <div className="sticky top-0 bg-white px-5 pt-5 pb-3 border-b border-[#f0ece8] flex items-center justify-between">
          <h3 className="font-serif text-lg text-[#0a0a0a]">Filter</h3>
          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#6b6b6b] hover:text-[#0a0a0a] text-xl leading-none -mr-2"
            aria-label="Close filters"
          >
            ×
          </button>
        </div>
        <div className="px-5 py-4">
          <FilterPanel onApply={onClose} />
        </div>
      </div>
    </>
  )
}

// ── Main shop content ───────────────────────────────────────────────────────

function ShopContent() {
  const params = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const page = Number(params.get('page') || 1)
  const limit = 20
  const category = params.get('category')

  useEffect(() => {
    setLoading(true)
    const query: Record<string, string> = { limit: String(limit), page: String(page) }
    if (params.get('category')) query.category_slug = params.get('category')!
    if (params.get('sort')) query.sort = params.get('sort')!
    if (params.get('min_price')) query.min_price = params.get('min_price')!
    if (params.get('max_price')) query.max_price = params.get('max_price')!
    if (params.get('size')) query.size = params.get('size')!
    if (params.get('colour')) query.colour = params.get('colour')!
    if (params.get('featured')) query.featured = params.get('featured')!

    productsApi.getAll(query)
      .then(res => { setProducts(res.data || []); setTotal(res.meta?.total || 0) })
      .catch(() => { setProducts([]); setTotal(0) })
      .finally(() => setLoading(false))
  }, [params, page])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-serif text-3xl md:text-4xl text-[#0a0a0a] mb-1">
          {category
            ? category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
            : 'All Products'}
        </h1>
        <p className="text-xs font-sans text-[#6b6b6b]">{total} products</p>
      </div>

      {/* Active filter chips */}
      <Suspense><ActiveFilters /></Suspense>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <Suspense><FilterSidebar /></Suspense>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Sort + mobile filter button */}
          <div className="flex items-center justify-between mb-6 gap-3">
            {/* Mobile filter trigger */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 min-h-[44px] border border-[#e8e4e0] text-[11px] uppercase tracking-widest text-[#0a0a0a] hover:bg-[#faf8f5]"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="20" y2="12" />
                <line x1="12" y1="18" x2="20" y2="18" />
              </svg>
              Filter
            </button>

            <div className="ml-auto">
              <Suspense><SortDropdown /></Suspense>
            </div>
          </div>

          <ProductGrid products={products} loading={loading} />
          <Suspense><Pagination total={total} page={page} limit={limit} /></Suspense>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <MobileFilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopContent />
    </Suspense>
  )
}
