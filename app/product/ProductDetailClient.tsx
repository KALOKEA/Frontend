'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { productsApi, type Product, type ProductVariant } from '@/lib/api/products'
import ImageGallery from '@/components/product/ImageGallery'
import VariantPicker from '@/components/product/VariantPicker'
import AddToCartButton from '@/components/product/AddToCartButton'
import BackInStockNotify from '@/components/product/BackInStockNotify'
import SizeGuidePopup from '@/components/product/SizeGuidePopup'
import Spinner from '@/components/ui/Spinner'
import { formatPrice, formatDiscount } from '@/lib/utils/formatPrice'
import CouponOfferBadge from '@/components/product/CouponOfferBadge'
import { youTubeId, youTubeEmbed } from '@/lib/utils/youtube'
import { useWishlistStore } from '@/lib/store/useWishlistStore'
import { trackViewItem, metaViewContent } from '@/lib/analytics'
import { addRecentlyViewed } from '@/lib/hooks/useRecentlyViewed'

// ─── Description renderer ────────────────────────────────────────────────────
// Parses product descriptions that contain inline section headers + • bullets.
// Format: "Intro prose. Section Title • item1 • item2 Next Section • item1"
const SECTION_HEADERS = [
  'Fit & Style', 'Fit and Style',
  'Ideal For', 'Ideal for',
  'Wash & Care Instructions', 'Wash and Care Instructions',
  'Care Instructions', 'Key Features', 'Features',
  'How to Wear', 'Styling Tips', 'Occasion', 'Occasions',
]

function DescriptionRenderer({ text }: { text: string }) {
  if (!text) return <p>A beautifully crafted piece made with care and attention to detail.</p>

  const cleaned = text.replace(/^Product\s*Description\s*/i, '').trim()
  if (!cleaned.includes('•')) return <p className="leading-relaxed">{cleaned}</p>

  type Section = { title: string; items: string[] }
  let intro = ''
  const sections: Section[] = []
  let cur: Section | null = null

  const tokens = cleaned.split('•').map(t => t.trim()).filter(Boolean)

  for (const token of tokens) {
    // Check if this token ends with a known section header
    const hdr = SECTION_HEADERS.find(h => {
      const idx = token.lastIndexOf(h)
      if (idx === -1) return false
      return token.slice(idx + h.length).trim() === ''
    })

    if (hdr) {
      const before = token.slice(0, token.lastIndexOf(hdr)).trim()
      if (before) cur ? cur.items.push(before) : (intro = (intro + ' ' + before).trim())
      cur = { title: hdr, items: [] }
      sections.push(cur)
    } else {
      cur ? cur.items.push(token) : (intro = (intro + ' ' + token).trim())
    }
  }

  return (
    <div className="space-y-4">
      {intro && <p className="leading-relaxed">{intro.trim()}</p>}
      {sections.map((s, i) => (
        <div key={i} className="space-y-1.5">
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#0A0908] font-semibold">{s.title}</p>
          <ul className="space-y-1">
            {s.items.map((item, j) => (
              <li key={j} className="flex items-start gap-2.5">
                <span className="text-[#7C4A2D] shrink-0 mt-[1px]">—</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

// ─── Fabric & Care renderer ───────────────────────────────────────────────────
// Splits on • · or newlines and renders a clean bullet list.
function FabricRenderer({ text }: { text: string }) {
  const DEFAULT = ['Premium quality fabric', 'Gentle machine wash or dry clean', 'Do not bleach', 'Do not tumble dry']
  const lines = text
    ? text.split(/[•·\n]+/).map(l => l.trim()).filter(Boolean)
    : DEFAULT

  if (lines.length <= 1 && text) return <p className="leading-relaxed">{text}</p>

  return (
    <ul className="space-y-1.5">
      {lines.map((line, i) => (
        <li key={i} className="flex items-start gap-2.5">
          <span className="text-[#7C4A2D] shrink-0 mt-[1px]">—</span>
          <span>{line}</span>
        </li>
      ))}
    </ul>
  )
}

// ─── Delivery ETA calculator ─────────────────────────────────────────────────
// Returns a human-readable delivery window like "Tue, 17 Jun – Fri, 20 Jun".
// Skips Sundays (India logistics). Orders cut-off at 18:00 IST — after that,
// dispatch starts the next business day.
function getDeliveryEta(): string {
  // Create a Date object that reflects the current time in IST regardless of
  // where the user's browser is. Using toLocaleString with en-US + IST timezone
  // gives a parseable string that new Date() handles reliably in modern browsers.
  const istNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  const cutoff = istNow.getHours() < 18 // dispatch same day if before 6 PM IST

  // Add N business days skipping Sundays
  function addBizDays(base: Date, days: number): Date {
    const d = new Date(base)
    let added = 0
    while (added < days) {
      d.setDate(d.getDate() + 1)
      if (d.getDay() !== 0) added++ // 0 = Sunday
    }
    return d
  }

  const fmt = (d: Date) =>
    d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' })

  // Metro cities: 2–3 business days from dispatch; non-metro: 4–6
  // We show the metro range (most customers) as the default.
  const dispatchStart = cutoff ? istNow : addBizDays(istNow, 1)
  const earliest = addBizDays(dispatchStart, 2)
  const latest   = addBizDays(dispatchStart, 5)

  return `${fmt(earliest)} – ${fmt(latest)}`
}

const ProductReviews = dynamic(() => import('@/components/product/ProductReviews'), { ssr: false })
const RelatedProducts = dynamic(() => import('@/components/product/RelatedProducts'), { ssr: false })
const RecentlyViewed = dynamic(() => import('@/components/product/RecentlyViewed'), { ssr: false })

export default function ProductDetailClient({ slug, initialProduct }: { slug: string; initialProduct?: Product }) {
  const [product, setProduct] = useState<Product | null>(initialProduct ?? null)
  const [loading, setLoading] = useState(!initialProduct)
  const [selectedColour, setSelectedColour] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [tab, setTab] = useState('description')
  const [shareCopied, setShareCopied] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const { toggle, isWishlisted } = useWishlistStore()

  // Sticky ATC bar: show only when main ATC button has scrolled out of view
  const [showStickyBar, setShowStickyBar] = useState(false)
  const atcBtnRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = atcBtnRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setShowStickyBar(!entry.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [product])

  useEffect(() => {
    if (initialProduct) return
    productsApi.getBySlug(slug)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [slug, initialProduct])

  // Background refresh — picks up admin changes (fabric_care, description, etc.)
  // without requiring a full redeploy of the statically-exported pages.
  useEffect(() => {
    if (!initialProduct || !slug) return
    productsApi.getBySlug(slug)
      .then(fresh => { if (fresh) setProduct(fresh) })
      .catch(() => {}) // fail silently — initialProduct is already displayed
  }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!product) return
    trackViewItem({
      product_id: product.id,
      name: product.name,
      price: product.base_price,
      category: product.categories?.name,
    })
    metaViewContent({
      product_id: product.id,
      name: product.name,
      price: product.base_price,
      category: product.categories?.name,
    })
    // Track for Recently Viewed ring-buffer (localStorage)
    const primaryImage =
      product.product_images?.find((i) => i.is_primary)?.url ||
      product.product_images?.[0]?.url
    addRecentlyViewed({
      id: product.id,
      slug: product.slug,
      name: product.name,
      base_price: product.base_price,
      image: primaryImage,
    })
  }, [product?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Spinner size="lg" />
    </div>
  )

  if (!product) return (
    <div className="text-center py-20">
      <h1 className="font-serif text-3xl text-[#0a0a0a] mb-2">Product not found</h1>
    </div>
  )

  // Derive available options from active variants
  const activeVariants = product.product_variants?.filter(v => v.is_active) || []
  const uniqueColours  = Array.from(new Set(activeVariants.map(v => v.colour).filter(Boolean)))
  const uniqueSizes    = Array.from(new Set(activeVariants.map(v => v.size).filter(Boolean)))
  // Require colour selection only when multiple colour options exist
  const needsColour    = uniqueColours.length > 1
  // Always require size selection when any size options exist
  const needsSize      = uniqueSizes.length > 0
  // Gate: both required selections must be made before we compute a variant
  const selectionReady = (!needsColour || !!selectedColour) && (!needsSize || !!selectedSize)

  const selectedVariant: ProductVariant | null = selectionReady
    ? (activeVariants.find(v => {
        const colourMatch = !selectedColour || v.colour === selectedColour
        const sizeMatch   = !selectedSize   || v.size   === selectedSize
        return colourMatch && sizeMatch
      }) ?? null)
    : null

  const discount = formatDiscount(product.compare_price || 0, product.base_price)
  const stock = selectedVariant?.stock || 0
  const wishlisted = isWishlisted(product.id)
  const TABS = ['description', 'fabric', 'shipping', 'returns', 'reviews']
  const hasVariants = (product.product_variants?.length ?? 0) > 0
  const isOOS = hasVariants && selectedVariant !== null && selectedVariant.stock === 0

  // Prompt text for unselected state
  const selectionPrompt = needsColour && !selectedColour && needsSize && !selectedSize
    ? '— Select Colour & Size —'
    : needsColour && !selectedColour
    ? '— Select a Colour —'
    : '— Select a Size —'

  // Share handler: Web Share API with clipboard fallback
  async function handleShare() {
    if (!product) return
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (typeof navigator !== 'undefined' && navigator.share) {
      try { await navigator.share({ title: product.name, text: `Check out ${product.name} on Kalokea`, url }) } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url)
        setShareCopied(true)
        setTimeout(() => setShareCopied(false), 2000)
      } catch {}
    }
  }

  return (
    <>
      {/* Sticky mobile Add-to-Cart bar — slides up when main ATC scrolls out of view */}
      <div
        className={`k-mobile-cta-bar fixed bottom-0 left-0 right-0 z-[90] lg:hidden bg-white border-t border-[#e8e4e0] px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] transition-transform duration-300 ${
          showStickyBar ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-sans text-[#0a0a0a] font-medium truncate leading-tight">{product.name}</p>
            <p className="text-sm font-sans font-medium text-[#0a0a0a]">{formatPrice(product.base_price)}</p>
          </div>
          <button
            onClick={() => {
              if (hasVariants && !selectedVariant) {
                document.getElementById('variant-picker')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                return
              }
              const inner = document.querySelector<HTMLButtonElement>('#add-to-cart-btn button')
              inner?.click()
            }}
            disabled={isOOS}
            className="shrink-0 bg-[#0a0a0a] text-white text-[11px] font-sans tracking-widest uppercase px-5 py-3 hover:bg-[#2a2a2a] disabled:opacity-50 transition-colors"
          >
            {isOOS ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {/* Main page — pb-24 on mobile so sticky bar does not overlap */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 lg:pb-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-8 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-[#0a0a0a] transition-colors shrink-0">Home</Link>
          <span className="shrink-0">/</span>
          <Link href="/shop/" className="hover:text-[#0a0a0a] transition-colors shrink-0">Shop</Link>
          {product.categories && (
            <>
              <span className="shrink-0">/</span>
              <Link href={`/shop/${product.categories.slug}/`} className="hover:text-[#0a0a0a] transition-colors shrink-0">
                {product.categories.name}
              </Link>
            </>
          )}
          <span className="shrink-0">/</span>
          <span className="text-[#6b6b6b] truncate" aria-current="page">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <ImageGallery
            images={product.product_images || []}
            productName={product.name}
            videoUrl={product.video_url}
          />

          <div className="space-y-5">
            {product.categories && (
              <p className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b]">
                {product.categories.name}
              </p>
            )}

            <div className="flex items-start gap-3">
              <h1 className="font-serif text-3xl md:text-4xl text-[#0a0a0a] leading-tight flex-1">{product.name}</h1>
              {/* Share button — Web Share API on mobile, clipboard copy on desktop */}
              <button
                type="button"
                onClick={handleShare}
                className="shrink-0 mt-1.5 w-9 h-9 flex items-center justify-center rounded-full border border-[#e8e4e0] hover:border-[#7C4A2D] text-[#6b6b6b] hover:text-[#7C4A2D] transition-colors"
                aria-label={shareCopied ? 'Link copied!' : 'Share product'}
                title={shareCopied ? 'Link copied!' : 'Share'}
              >
                {shareCopied ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
                  </svg>
                )}
              </button>
            </div>

            {/* Price + star rating on same row — price left, rating right */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-baseline gap-3">
                {/* Price in Cormorant display size */}
                <span className="price-display text-[#0a0a0a]">{formatPrice(product.base_price)}</span>
                {product.compare_price && product.compare_price > product.base_price && (
                  <>
                    <span className="font-sans text-[14px] text-[#6b6b6b] line-through">{formatPrice(product.compare_price)}</span>
                    <span className="bg-[#7C4A2D] text-white text-[9px] font-sans font-semibold tracking-widest uppercase px-2.5 py-1">
                      -{discount}% OFF
                    </span>
                  </>
                )}
              </div>
              {/* Star rating pill — always visible; click scrolls to Reviews tab */}
              <button
                type="button"
                onClick={() => { setTab('reviews'); document.getElementById('tab-panel-reviews')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#e8e4e0] bg-white px-2.5 py-1 hover:border-[#F59E0B] transition-colors group"
                aria-label={`Rating: ${Number(product.avg_rating ?? 0).toFixed(1)} out of 5, ${product.review_count ?? 0} reviews`}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B" aria-hidden="true">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
                <span className="text-[12px] font-sans font-semibold text-[#0a0a0a]">
                  {Number(product.avg_rating ?? 0).toFixed(1)}
                </span>
                <span className="text-[11px] font-sans text-[#6b6b6b]">
                  ({product.review_count ?? 0})
                </span>
                {(product.review_count ?? 0) === 0 && (
                  <span className="text-[10px] font-sans text-[#7C4A2D] group-hover:underline">Be first to review</span>
                )}
              </button>
            </div>
            <CouponOfferBadge price={product.base_price} />
            <p className="text-[10px] font-sans text-[#6b6b6b] tracking-wide">Free shipping above ₹999 · GST calculated at checkout</p>

            {/* Delivery estimate — computed client-side from current IST date.
                One of the highest-impact conversion elements for Indian shoppers. */}
            <div className="flex items-center gap-2 text-[11px] font-sans text-[#0A0908]">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>Estimated delivery: <strong>{getDeliveryEta()}</strong></span>
            </div>

            {product.product_variants && product.product_variants.length > 0 && (
              <div id="variant-picker">
                <VariantPicker
                  variants={product.product_variants}
                  selectedColour={selectedColour}
                  selectedSize={selectedSize}
                  onColourChange={setSelectedColour}
                  onSizeChange={setSelectedSize}
                />
              </div>
            )}

            <SizeGuidePopup />

            {stock > 0 && stock <= 5 && (
              <p className="text-[11px] font-sans text-[#7C4A2D]">Only {stock} left — hurry!</p>
            )}

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[#e8e4e0]" role="group" aria-label="Quantity">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-11 h-11 flex items-center justify-center text-[#6b6b6b] hover:text-[#0a0a0a] text-lg" aria-label="Decrease quantity">-</button>
                <span className="w-10 text-center text-sm font-sans text-[#0a0a0a]" aria-live="polite" aria-label={`Quantity: ${quantity}`}>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(stock || 10, quantity + 1))} className="w-11 h-11 flex items-center justify-center text-[#6b6b6b] hover:text-[#0a0a0a] text-lg" aria-label="Increase quantity">+</button>
              </div>
              <button
                onClick={() => toggle(product.id)}
                className={`w-11 h-11 border flex items-center justify-center transition-all duration-200 hover:scale-105 ${wishlisted ? 'border-[#7C4A2D] bg-[#7C4A2D]/10' : 'border-[#e8e4e0] hover:border-[#7C4A2D]'}`}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? '#7C4A2D' : 'none'} stroke={wishlisted ? '#7C4A2D' : '#0a0a0a'} strokeWidth="1.5" aria-hidden="true">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </button>
            </div>

            <div id="add-to-cart-btn" ref={atcBtnRef}>
              {hasVariants && !selectionReady ? (
                <button
                  onClick={() => document.getElementById('variant-picker')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
                  className="w-full py-4 text-[11px] font-sans tracking-widest uppercase bg-[#faf8f5] text-[#6b6b6b] border border-dashed border-[#7C4A2D] hover:bg-[#f0ece8] hover:text-[#6b6b6b] transition-colors"
                >
                  {selectionPrompt}
                </button>
              ) : isOOS && selectedVariant ? (
                <BackInStockNotify
                  variantId={selectedVariant.id}
                  productName={product.name}
                  variantLabel={[selectedVariant.size, selectedVariant.colour].filter(Boolean).join(' / ') || 'One Size'}
                />
              ) : (
                <AddToCartButton product={product} selectedVariant={selectedVariant} quantity={quantity} />
              )}
            </div>

            {/* Feature strip */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#e8e4e0]">
              {[
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v4h-7V8z"/>
                      <circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                    </svg>
                  ),
                  label: 'Free Shipping',
                  sub: 'Orders above ₹999',
                },
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                    </svg>
                  ),
                  label: '7-Day Returns',
                  sub: 'Free pickup',
                },
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  ),
                  label: 'Secure Checkout',
                  sub: 'UPI · Cards · COD',
                },
              ].map(({ icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1.5 py-3">
                  <div className="text-[#7C4A2D]" aria-hidden="true">{icon}</div>
                  <p className="text-[10px] font-sans font-medium tracking-widest uppercase text-[#0A0908] leading-tight">{label}</p>
                  <p className="text-[10px] font-sans text-[#6b5c55]">{sub}</p>
                </div>
              ))}
            </div>

            {/* Tabs — Description / Fabric / Shipping / Returns / Reviews */}
            <div className="pt-4 border-t border-[#e8e4e0]">
              <div role="tablist" aria-label="Product details" className="flex gap-0 border-b border-[#E0D4C4] overflow-x-auto">
                {TABS.map((t) => (
                  <button
                    key={t}
                    role="tab"
                    aria-selected={t === tab}
                    aria-controls={`tab-panel-${t}`}
                    id={`tab-${t}`}
                    onClick={() => setTab(t)}
                    className={`relative px-4 py-2.5 text-[9.5px] font-sans tracking-[0.18em] uppercase whitespace-nowrap transition-colors ${
                      t === tab ? 'text-[#0A0908] font-medium' : 'text-[#6b5c55] hover:text-[#0A0908]'
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                    <span aria-hidden="true" className={`absolute bottom-0 left-0 right-0 h-[2px] bg-[#7C4A2D] transition-opacity ${t === tab ? 'opacity-100' : 'opacity-0'}`} />
                  </button>
                ))}
              </div>

              <div
                role="tabpanel"
                id={`tab-panel-${tab}`}
                aria-labelledby={`tab-${tab}`}
                className="pt-5 text-[13px] font-sans text-[#6B5E55] leading-relaxed"
              >
                {tab === 'description' && (
                  <DescriptionRenderer text={product.description || ''} />
                )}
                {tab === 'fabric' && (
                  <FabricRenderer text={product.fabric_care || ''} />
                )}
                {tab === 'shipping' && (
                  <div className="space-y-2">
                    <p>Metro cities: 2–3 business days</p>
                    <p>Pan India: 5–7 business days</p>
                    <p>Free shipping on orders above ₹999. Cash on Delivery available.</p>
                  </div>
                )}
                {tab === 'returns' && (
                  <div className="space-y-2">
                    <p>7-day hassle-free return window from date of delivery.</p>
                    <p>Item must be unworn, unwashed, and in original packaging with tags attached.</p>
                    <p>Free return pickup. Refund processed in 5–7 business days.</p>
                  </div>
                )}
                {tab === 'reviews' && (
                  <ProductReviews product_id={product.id} />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Video Section */}
        {(() => {
          // Show a product video from EITHER a YouTube link (any format incl.
          // Shorts) OR a directly-uploaded file.
          const ytId = youTubeId(product.youtube_url)
          const rawMp4 = product.video_url

          // Build a Cloudinary-transcoded URL (H.264 MP4) as a reliable fallback
          // for formats the browser can't decode (HEVC, AVI, WMV, etc.).
          // We inject f_mp4,vc_h264,ac_aac transformation ONLY for Cloudinary URLs
          // that don't already have it. This is lazy-transcoded by Cloudinary on
          // first request; the rawMp4 URL is used as primary since it's confirmed
          // to be accessible and often plays fine (H.264 MOV, standard MP4).
          const transcodedMp4 = rawMp4 && rawMp4.includes('res.cloudinary.com') && rawMp4.includes('/video/upload/')
            ? rawMp4.includes('vc_h264')
              ? rawMp4
              : rawMp4.replace('/video/upload/', '/video/upload/f_mp4,vc_h264,ac_aac/')
            : rawMp4

          if (!ytId && !rawMp4) return null
          return (
            <div className="mt-16 pt-12 border-t border-[#E0D4C4]">
              {/* Section heading — editorial style with accent line */}
              <div className="flex items-center gap-4 mb-6" style={{ maxWidth: '860px', margin: '0 auto 24px' }}>
                <span style={{ display: 'block', width: 28, height: 1, background: '#C49070', flexShrink: 0 }} />
                <h2 className="font-serif text-2xl text-[#0a0a0a] tracking-tight">Watch the Video</h2>
              </div>
              {/* 16:9 video player — max 860px wide, centred, with rounded corners + shadow */}
              <div style={{ maxWidth: '860px', margin: '0 auto' }}>
                <div
                  style={{
                    position: 'relative',
                    paddingBottom: '56.25%', // 16:9
                    height: 0,
                    overflow: 'hidden',
                    borderRadius: 10,
                    background: '#0e0e0e',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                  }}
                >
                  {ytId ? (
                    <iframe
                      src={youTubeEmbed(ytId)}
                      title={`${product.name} — video`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0, borderRadius: 10 }}
                    />
                  ) : videoError ? (
                    /* Compact error state — not a giant black void */
                    <div style={{
                      position: 'absolute', inset: 0,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
                      background: 'linear-gradient(135deg, #111 0%, #1a1208 100%)',
                    }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" aria-hidden="true">
                        <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                      </svg>
                      <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'sans-serif', letterSpacing: '0.05em' }}>Video coming soon</span>
                      <a
                        href={rawMp4!}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: '0.72rem', color: '#C49070', textDecoration: 'underline', fontFamily: 'sans-serif' }}
                      >
                        Open file directly ↗
                      </a>
                    </div>
                  ) : (
                    // Use rawMp4 as primary source — this is the URL that works
                    // when opened directly. transcodedMp4 is offered as a <source>
                    // fallback so the browser picks whichever it can decode.
                    <video
                      controls
                      playsInline
                      preload="metadata"
                      onError={() => setVideoError(true)}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0, objectFit: 'contain', background: '#0e0e0e', borderRadius: 10 }}
                    >
                      {/* Primary: Cloudinary H.264 transcoded (universally supported) */}
                      {transcodedMp4 && transcodedMp4 !== rawMp4 && (
                        <source src={transcodedMp4} type="video/mp4" />
                      )}
                      {/* Fallback: original uploaded URL (confirmed accessible) */}
                      <source src={rawMp4!} />
                    </video>
                  )}
                </div>
              </div>
            </div>
          )
        })()}

        {/* Related Products */}
        <div className="mt-16 pt-10 border-t border-[#E0D4C4]">
          <RelatedProducts exclude_id={product.id} category_id={product.categories?.id} />
        </div>

        {/* Recently Viewed */}
        <div className="mt-10 pt-10 border-t border-[#E0D4C4]">
          <RecentlyViewed excludeId={product.id} />
        </div>
      </div>
    </>
  )
}
