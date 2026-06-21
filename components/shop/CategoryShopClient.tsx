'use client'
import { ChevronLeft, X, Search } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { productsApi, type Product } from '@/lib/api/products'
import ProductGrid from '@/components/shop/ProductGrid'
import ShopCategorySidebar from '@/components/shop/ShopCategorySidebar'
import { SIZES, COLOURS, PRICE_RANGES } from '@/components/shop/FilterSidebar'

// ── Types ─────────────────────────────────────────────────────────────────────

type SortOption = 'newest' | 'price_asc' | 'price_desc'

const SORT_LABELS: Record<SortOption, string> = {
  newest: 'Newest First',
  price_asc: 'Price: Low to High',
  price_desc: 'Price: High to Low',
}

interface Filters {
  search: string
  sort: SortOption
  minPrice: string
  maxPrice: string
  size: string
  colour: string
}
const EMPTY: Filters = { search: '', sort: 'newest', minPrice: '', maxPrice: '', size: '', colour: '' }

// ── Shared filter controls (used in desktop sidebar + mobile drawer) ────────────

function FilterControls({
  f, set, onApply,
}: {
  f: Filters
  set: (patch: Partial<Filters>) => void
  onApply?: () => void
}) {
  const apply = (patch: Partial<Filters>) => { set(patch); onApply?.() }
  const hasAny = f.minPrice || f.size || f.colour
  return (
    <div>
      {hasAny && (
        <button
          onClick={() => apply({ minPrice: '', maxPrice: '', size: '', colour: '' })}
          className="text-[10px] font-sans tracking-widest uppercase text-[#7C4A2D] hover:text-[#5C3520] mb-6 block"
        >
          Clear all filters
        </button>
      )}

      {/* Price */}
      <div className="mb-6">
        <h4 className="text-[10px] font-sans tracking-widest uppercase text-[#6B5E55] mb-3">Price</h4>
        <div className="space-y-2">
          {PRICE_RANGES.map(r => (
            <label key={r.label} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="cat-price"
                checked={f.minPrice === String(r.min)}
                onChange={() => apply({ minPrice: String(r.min), maxPrice: String(r.max) })}
                className="accent-[#7C4A2D]"
              />
              <span className="text-xs font-sans text-[#0A0908]">{r.label}</span>
            </label>
          ))}
          {f.minPrice && (
            <button
              onClick={() => apply({ minPrice: '', maxPrice: '' })}
              className="text-[10px] text-[#6b5c55] hover:text-[#7C4A2D]"
            >
              Clear price
            </button>
          )}
        </div>
      </div>

      {/* Size */}
      <div className="mb-6">
        <h4 className="text-[10px] font-sans tracking-widest uppercase text-[#6B5E55] mb-3">Size</h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map(s => (
            <button
              key={s}
              onClick={() => apply({ size: f.size === s ? '' : s })}
              className={`px-3 py-2.5 min-h-[44px] text-[10px] font-sans tracking-widest border transition-colors ${
                f.size === s
                  ? 'border-[#7C4A2D] bg-[#7C4A2D] text-white'
                  : 'border-[#E0D4C4] text-[#0A0908] hover:border-[#7C4A2D]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Colour */}
      <div className="mb-6">
        <h4 className="text-[10px] font-sans tracking-widest uppercase text-[#6B5E55] mb-3">Colour</h4>
        <div className="space-y-2">
          {COLOURS.map(c => (
            <label key={c} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={f.colour === c}
                onChange={() => apply({ colour: f.colour === c ? '' : c })}
                className="accent-[#7C4A2D]"
              />
              <span className="text-xs font-sans text-[#0A0908]">{c}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
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
  const [f, setF] = useState<Filters>(EMPTY)
  const [searchInput, setSearchInput] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const set = (patch: Partial<Filters>) => setF(prev => ({ ...prev, ...patch }))

  const fetchProducts = useCallback(() => {
    setLoading(true)
    setError(null)
    const q: Record<string, string> = { category_slug: category, sort: f.sort, limit: '48', page: '1' }
    if (f.search) q.search = f.search
    if (f.minPrice) q.min_price = f.minPrice
    if (f.maxPrice) q.max_price = f.maxPrice
    if (f.size) q.size = f.size
    if (f.colour) q.colour = f.colour
    productsApi
      .getAll(q)
      .then((res) => {
        setProducts(res.data || [])
        setTotal(res.meta?.total || 0)
      })
      .catch(() => setError('Failed to load products. Please refresh the page.'))
      .finally(() => setLoading(false))
  }, [category, f])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  // Debounce the search box into the active filter set.
  useEffect(() => {
    const t = setTimeout(() => {
      setF(prev => (prev.search === searchInput.trim() ? prev : { ...prev, search: searchInput.trim() }))
    }, 350)
    return () => clearTimeout(t)
  }, [searchInput])

  // Body scroll-lock + Escape for the mobile drawer.
  useEffect(() => {
    if (!drawerOpen) return
    document.body.style.overflow = 'hidden'
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawerOpen(false) }
    window.addEventListener('keydown', handler)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handler) }
  }, [drawerOpen])

  // Active filter chips
  const chips: { label: string; clear: () => void }[] = []
  if (f.search) chips.push({ label: `Search: "${f.search}"`, clear: () => { setSearchInput(''); set({ search: '' }) } })
  if (f.size) chips.push({ label: `Size: ${f.size}`, clear: () => set({ size: '' }) })
  if (f.colour) chips.push({ label: `Colour: ${f.colour}`, clear: () => set({ colour: '' }) })
  if (f.minPrice) {
    const r = PRICE_RANGES.find(r => String(r.min) === f.minPrice)
    if (r) chips.push({ label: r.label, clear: () => set({ minPrice: '', maxPrice: '' }) })
  }

  return (
    <div className="min-h-screen bg-[#fafaf8]">

      {/* ── Page Header ── */}
      <div className="border-b border-[#f0ece8] bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 md:py-14 text-center">
          <h1 className="font-serif text-3xl md:text-5xl text-[#0a0a0a] mb-2">
            {displayName}
          </h1>
          <p className="text-[11px] font-sans text-[#6b6b6b] tracking-[0.25em] uppercase">
            {loading ? ' ' : `${total} Style${total !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* ── Toolbar — search + back + sort ── */}
      <div className="sticky top-[94px] lg:top-[108px] z-10 bg-white border-b border-[#f0ece8] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-3 flex-wrap">
          <Link
            href="/shop/"
            className="text-[11px] font-sans tracking-[0.15em] uppercase text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors flex items-center gap-1.5 shrink-0"
          >
            <ChevronLeft size={14} aria-hidden="true" /> All Categories
          </Link>

          {/* Search box */}
          <div className="relative flex-1 min-w-[160px] max-w-md order-last w-full sm:order-none sm:w-auto">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a8d85]" aria-hidden="true" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder={`Search in ${displayName}…`}
              aria-label="Search products in this category"
              className="w-full border border-[#e8e4e0] pl-8 pr-8 py-2 min-h-[40px] text-sm font-sans text-[#0a0a0a] outline-none focus:border-[#0a0a0a] bg-white"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6b6b6b] hover:text-[#0a0a0a]"
              ><X size={14} aria-hidden="true" /></button>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto shrink-0">
            {/* Mobile filter button */}
            <button
              onClick={() => setDrawerOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 min-h-[40px] border border-[#E0D4C4] text-[11px] uppercase tracking-widest text-[#0A0908] hover:bg-[#F2EAE0] transition-colors"
              aria-expanded={drawerOpen}
              aria-controls="category-filter-drawer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="8" y1="12" x2="20" y2="12" />
                <line x1="12" y1="18" x2="20" y2="18" />
              </svg>
              Filter
            </button>
            <select
              value={f.sort}
              onChange={(e) => set({ sort: e.target.value as SortOption })}
              className="border border-[#e8e4e0] text-xs font-sans text-[#0a0a0a] px-3 py-1.5 min-h-[40px] outline-none focus:border-[#0a0a0a] bg-white cursor-pointer"
              aria-label="Sort products"
            >
              {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Products — with left category sidebar + filter sidebar on desktop ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex gap-6 xl:gap-8">

          {/* Left: category navigation sidebar (desktop only) */}
          <ShopCategorySidebar activeSlug={category} />

          {/* Desktop: filter sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <FilterControls f={f} set={set} />
          </aside>

          {/* Right: product grid */}
          <div className="flex-1 min-w-0">
            {/* Active filter chips */}
            {chips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {chips.map(c => (
                  <button
                    key={c.label}
                    onClick={c.clear}
                    aria-label={`Remove ${c.label} filter`}
                    className="flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase tracking-widest bg-[#0a0a0a] text-white hover:bg-[#333] transition-colors"
                  >
                    {c.label}
                    <X size={9} className="text-[#C4A882]" aria-hidden={true} />
                  </button>
                ))}
                <button
                  onClick={() => { setSearchInput(''); setF(EMPTY) }}
                  className="text-[10px] uppercase tracking-widest text-[#7C4A2D] hover:underline ml-1"
                >
                  Clear all
                </button>
              </div>
            )}

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

            {!error && (
              <ProductGrid
                products={products}
                loading={loading}
                emptyMessage={chips.length ? 'No products match your filters' : 'No products yet'}
                emptySubtext={chips.length ? 'Try clearing a filter or your search.' : 'Check back soon — new styles are on their way.'}
                emptyAction={
                  chips.length
                    ? <button onClick={() => { setSearchInput(''); setF(EMPTY) }} className="text-[11px] font-sans tracking-widest uppercase underline text-[#0a0a0a] hover:text-[#7C4A2D] transition-colors mt-6 inline-block">Clear all filters</button>
                    : <Link href="/shop/" className="text-[11px] font-sans tracking-widest uppercase underline text-[#0a0a0a] hover:text-[#7C4A2D] transition-colors mt-6 inline-block">Browse all collections</Link>
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter drawer ── */}
      {drawerOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
          <div
            id="category-filter-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Product filters"
            className="fixed top-0 left-0 bottom-0 z-50 bg-white overflow-y-auto lg:hidden"
            style={{ width: '85vw', maxWidth: 340, boxShadow: '4px 0 32px rgba(0,0,0,0.22)' }}
          >
            <div className="sticky top-0 bg-white px-5 pt-5 pb-3 border-b border-[#E0D4C4] flex items-center justify-between">
              <h3 className="font-serif text-lg text-[#0a0a0a]">Filter</h3>
              <button
                onClick={() => setDrawerOpen(false)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#6B5E55] hover:text-[#0a0a0a] -mr-2"
                aria-label="Close filters"
              >
                <X size={18} aria-hidden={true} />
              </button>
            </div>
            <div className="px-5 py-4">
              <FilterControls f={f} set={set} onApply={() => setDrawerOpen(false)} />
            </div>
          </div>
        </>
      )}

    </div>
  )
}
