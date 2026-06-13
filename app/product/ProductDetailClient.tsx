'use client'
import { useEffect, useState } from 'react'
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
  const now = new Date()
  const istOffset = 5.5 * 60 * 60 * 1000
  const ist = new Date(now.getTime() + istOffset)
  const cutoff = ist.getHours() < 18 // dispatch same day if before 6 PM IST

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
  const dispatchStart = cutoff ? ist : addBizDays(ist, 1)
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
  const { toggle, isWishlisted } = useWishlistStore()

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

  return (
    <>
      {/* Sticky mobile Add-to-Cart bar — k-mobile-cta-bar lifts it above MobileBottomNav */}
      <div className="k-mobile-cta-bar fixed bottom-0 left-0 right-0 z-[90] lg:hidden bg-white border-t border-[#e8e4e0] px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
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
        <nav className="flex items-center gap-1.5 text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-8 overflow-x-auto whitespace-nowrap">
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
          <span className="text-[#6b6b6b] truncate">{product.name}</span>
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

            <h1 className="font-serif text-3xl md:text-4xl text-[#0a0a0a] leading-tight">{product.name}</h1>

            {(product.review_count ?? 0) > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map(s => (
                    <svg key={s} width="13" height="13" viewBox="0 0 24 24"
                      fill={(product.avg_rating ?? 0) >= s - 0.5 ? '#F59E0B' : 'none'}
                      stroke="#F59E0B" strokeWidth="1.5">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                  ))}
                </div>
                <span className="text-[12px] font-sans text-[#6b6b6b]">
                  {Number(product.avg_rating ?? 0).toFixed(1)}/5 · {product.review_count} review{(product.review_count ?? 0) !== 1 ? 's' : ''}
                </span>
              </div>
            )}

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
                aria-label="Add to wishlist"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? '#7C4A2D' : 'none'} stroke={wishlisted ? '#7C4A2D' : '#0a0a0a'} strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </button>
            </div>

            <div id="add-to-cart-btn">
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
                  <div className="text-[#7C4A2D]">{icon}</div>
                  <p className="text-[10px] font-sans font-medium tracking-widest uppercase text-[#0A0908] leading-tight">{label}</p>
                  <p className="text-[10px] font-sans text-[#6b5c55]">{sub}</p>
                </div>
              ))}
            </div>

            {/* Tabs — Description / Fabric / Shipping / Returns / Reviews */}
            <div className="pt-4 border-t border-[#e8e4e0]">
              <div className="flex gap-0 border-b border-[#E0D4C4] overflow-x-auto">
                {TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`relative px-4 py-2.5 text-[9.5px] font-sans tracking-[0.18em] uppercase whitespace-nowrap transition-colors ${
                      t === tab ? 'text-[#0A0908] font-medium' : 'text-[#6b5c55] hover:text-[#0A0908]'
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                    <span className={`absolute bottom-0 left-0 right-0 h-[2px] bg-[#7C4A2D] transition-opacity ${t === tab ? 'opacity-100' : 'opacity-0'}`} />
                  </button>
                ))}
              </div>

              <div className="pt-5 text-[13px] font-sans text-[#6B5E55] leading-relaxed">
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
