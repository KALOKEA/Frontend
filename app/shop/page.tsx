'use client'
import { X } from 'lucide-react'
import { useEffect, useRef, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { productsApi, type Product } from '@/lib/api/products'
import ProductGrid from '@/components/shop/ProductGrid'
import FilterSidebar, { FilterPanel, PRICE_RANGES } from '@/components/shop/FilterSidebar'
import SortDropdown from '@/components/shop/SortDropdown'
import Pagination from '@/components/shop/Pagination'
import ShopSEOContent from '@/components/seo/ShopSEOContent'
import CategorySEOContent from '@/components/seo/CategorySEOContent'

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
    router.push(`/shop/?${p.toString()}`)
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
          aria-label={`Remove ${c.label} filter`}
          className="flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase tracking-widest bg-[#0a0a0a] text-white hover:bg-[#333] transition-colors"
        >
          {c.label}
          <X size={9} className="text-[#C4A882]" aria-hidden={true} />
        </button>
      ))}
      <button
        onClick={() => router.push('/shop/')}
        className="text-[10px] uppercase tracking-widest text-[#7C4A2D] hover:underline ml-1"
      >
        Clear all
      </button>
    </div>
  )
}

// ── Mobile filter drawer ────────────────────────────────────────────────────

function MobileFilterDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  // Escape key closes drawer
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Move focus into drawer when opened; body scroll lock
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => closeRef.current?.focus(), 30)
    return () => { document.body.style.overflow = ''; clearTimeout(t) }
  }, [open])

  if (!open) return null
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Drawer */}
      <div
        id="mobile-filter-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Product filters"
        className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto lg:hidden"
      >
        <div className="sticky top-0 bg-white px-5 pt-5 pb-3 border-b border-[#E0D4C4] flex items-center justify-between">
          <h3 className="font-serif text-lg text-[#0a0a0a]">Filter</h3>
          <button
            ref={closeRef}
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#6B5E55] hover:text-[#0a0a0a] -mr-2"
            aria-label="Close filters"
          >
            <X size={18} aria-hidden={true} />
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

  const rawPage = Number(params.get('page'))
  const page = rawPage >= 1 ? rawPage : 1
  const limit = 20
  const category = params.get('category')
  const searchQuery = params.get('search')

  useEffect(() => {
    let active = true
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
      .then(res => { if (active) { setProducts(res.data || []); setTotal(res.meta?.total || 0) } })
      .catch(() => { if (active) { setProducts([]); setTotal(0) } })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
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
        <p className="text-[10px] font-sans text-[#6b5c55] tracking-widest uppercase mt-1">
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
              aria-expanded={drawerOpen}
              aria-controls="mobile-filter-drawer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
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

// ── Static structured data for the /shop root ────────────────────────────────

const SHOP_BREADCRUMB = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://kalokea.in/' },
    { '@type': 'ListItem', position: 2, name: 'Shop', item: 'https://kalokea.in/shop/' },
  ],
})

const ORGANIZATION_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Kalokea',
  url: 'https://kalokea.in',
  logo: 'https://kalokea.in/logo.png',
  description: 'Premium women\'s fashion brand offering dresses, tops, bottoms, co-ord sets, and bags. Fast pan-India delivery, easy 7-day returns, COD available.',
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    availableLanguage: ['English', 'Hindi'],
  },
  sameAs: [
    'https://www.instagram.com/kalokea',
  ],
})

const FAQ_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'What types of women\'s clothing does Kalokea sell?', acceptedAnswer: { '@type': 'Answer', text: 'Kalokea offers a wide range of women\'s fashion including dresses (maxi, midi, mini, bodycon, wrap, and A-line styles), tops (crop tops, blouses, corsets, mesh panel tops), co-ord sets, bottoms (trousers, palazzos, skirts, shorts), jumpsuits, and fashion bags.' } },
    { '@type': 'Question', name: 'Does Kalokea offer free shipping?', acceptedAnswer: { '@type': 'Answer', text: 'Yes! Kalokea offers free shipping on all orders above ₹999. Most orders are delivered within 4–7 business days. Metro cities typically receive orders in 3–5 days.' } },
    { '@type': 'Question', name: 'What is Kalokea\'s return and exchange policy?', acceptedAnswer: { '@type': 'Answer', text: 'Kalokea offers a 7-day hassle-free return and exchange policy. Items must be unworn, unwashed, and in original condition with all tags attached. Refunds are processed within 5–7 business days of receiving the returned item.' } },
    { '@type': 'Question', name: 'How do I find the right size at Kalokea?', acceptedAnswer: { '@type': 'Answer', text: 'Each product page includes a detailed size guide with measurements in centimetres and inches. Measure your bust, waist, and hips and compare to our size chart. If you are between sizes, we suggest sizing up.' } },
    { '@type': 'Question', name: 'What payment methods does Kalokea accept?', acceptedAnswer: { '@type': 'Answer', text: 'Kalokea accepts UPI (Google Pay, PhonePe, Paytm), Credit and Debit Cards (Visa, Mastercard, Rupay), Net Banking, and Cash on Delivery (COD) for eligible pin codes. All online payments are secured through Razorpay.' } },
    { '@type': 'Question', name: 'Is Cash on Delivery available?', acceptedAnswer: { '@type': 'Answer', text: 'Yes, Cash on Delivery is available on most products across India. COD availability is shown based on your delivery pin code during checkout.' } },
    { '@type': 'Question', name: 'How can I track my Kalokea order?', acceptedAnswer: { '@type': 'Answer', text: 'Once your order is dispatched, you will receive an SMS and email with your tracking number. You can also track your order from the My Orders section in your Kalokea account.' } },
    { '@type': 'Question', name: 'Does Kalokea ship internationally?', acceptedAnswer: { '@type': 'Answer', text: 'Currently, Kalokea ships only within India. We are working on expanding international shipping to UAE, USA, UK, Canada, and Australia.' } },
    { '@type': 'Question', name: 'Are Kalokea clothes true to size?', acceptedAnswer: { '@type': 'Answer', text: 'Most Kalokea garments are true to standard Indian sizing. We recommend checking the specific size chart on each product page as fits can vary by style and fabric. Customer reviews often mention fit details.' } },
    { '@type': 'Question', name: 'Does Kalokea restock sold-out items?', acceptedAnswer: { '@type': 'Answer', text: 'Popular items are regularly restocked. Use the Notify Me feature on the product page to receive an email alert when a sold-out item is back in stock.' } },
  ],
})

// ── Page export ─────────────────────────────────────────────────────────────

export default function ShopPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: SHOP_BREADCRUMB }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ORGANIZATION_LD }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: FAQ_LD }} />
      <div className="min-h-screen bg-[#FDFAF6]">
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
        <Suspense fallback={null}><CategorySEOContent /></Suspense>
        <ShopSEOContent />
      </div>
    </>
  )
}
