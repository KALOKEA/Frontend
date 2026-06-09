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
  const search = params.get('search')

  function removeParam(...keys: string[]) {
    const p = new URLSearchParams(params.toString())
    keys.forEach(k => p.delete(k))
    p.delete('page')
    router.push(`/shop?${p.toString()}`)
  }

  if (search) chips.push({ label: `Search: "${search}"`, remove: () => removeParam('search') })
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
          <span className="ml-1 text-[#C4A882]">×</span>
        </button>
      ))}
      <button
        onClick={() => router.push('/shop')}
        className="text-[10px] uppercase tracking-widest text-[#7C4A2D] hover:underline ml-1"
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
        <div className="sticky top-0 bg-white px-5 pt-5 pb-3 border-b border-[#E0D4C4] flex items-center justify-between">
          <h3 className="font-serif text-lg text-[#0a0a0a]">Filter</h3>
          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#6B5E55] hover:text-[#0a0a0a] text-xl leading-none -mr-2"
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
  const searchQuery = params.get('search')

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
    if (params.get('search')) query.search = params.get('search')!

    productsApi.getAll(query)
      .then(res => { setProducts(res.data || []); setTotal(res.meta?.total || 0) })
      .catch(() => { setProducts([]); setTotal(0) })
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-serif text-3xl md:text-4xl text-[#0A0908] mb-1 font-light">
          {searchQuery
            ? `Results for "${searchQuery}"`
            : category
              ? category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
              : 'All Products'}
        </h1>
        <p className="text-[10px] font-sans text-[#9B8F87] tracking-widest uppercase mt-1">
          {total} {total === 1 ? 'product' : 'products'}
        </p>
      </div>

      {/* Active filter chips */}
      <Suspense fallback={null}><ActiveFilters /></Suspense>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <Suspense fallback={null}><FilterSidebar /></Suspense>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Sort + mobile filter button */}
          <div className="flex items-center justify-between mb-6 gap-3">
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 min-h-[44px] border border-[#E0D4C4] text-[11px] uppercase tracking-widest text-[#0A0908] hover:bg-[#F2EAE0] transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="20" y2="12" />
                <line x1="12" y1="18" x2="20" y2="18" />
              </svg>
              Filter
            </button>

            <div className="ml-auto">
              <Suspense fallback={null}><SortDropdown /></Suspense>
            </div>
          </div>

          {/* Product grid */}
          <ProductGrid products={products} loading={loading} />

          {/* Pagination */}
          {!loading && total > limit && (
            <Suspense fallback={null}>
              <Pagination total={total} page={page} limit={limit} />
            </Suspense>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <MobileFilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}

// ── Page export ─────────────────────────────────────────────────────────────

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-[#FDFAF6]">
      <Suspense fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="h-10 w-48 bg-[#E0D4C4] animate-pulse mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-[#E0D4C4] mb-3" />
                <div className="h-3 bg-[#E0D4C4] w-3/4 mb-2" />
                <div className="h-3 bg-[#E0D4C4] w-1/2" />
              </div>
            ))}
          </div>
        </div>
      }>
        <ShopContent />
      </Suspense>
    </main>
  )
}
            <div className="ml-auto">
              <Suspense fallback={null}><SortDropdown /></Suspense>
            </div>
          </div>

          {/* Product grid */}
          <ProductGrid products={products} loading={loading} />

          {/* Pagination */}
          {!loading && total > limit && (
            <Suspense fallback={null}>
              <Pagination total={total} page={page} limit={limit} />
            </Suspense>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <MobileFilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </div>
  )
}

// ── Page export ─────────────────────────────────────────────────────────────

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-[#FDFAF6]">
      <Suspense fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="h-10 w-48 bg-[#E0D4C4] animate-pulse mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-[#E0D4C4] mb-3" />
                <div className="h-3 bg-[#E0D4C4] w-3/4 mb-2" />
                <div className="h-3 bg-[#E0D4C4] w-1/2" />
              </div>
            ))}
          </div>
        </div>
      }>
        <ShopContent />
      </Suspense>
    </main>
  )
}
