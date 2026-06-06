'use client'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { productsApi, type Product, type ProductVariant } from '@/lib/api/products'
import ImageGallery from '@/components/product/ImageGallery'
import VariantPicker from '@/components/product/VariantPicker'
import AddToCartButton from '@/components/product/AddToCartButton'
import SizeGuidePopup from '@/components/product/SizeGuidePopup'
import Spinner from '@/components/ui/Spinner'
import { formatPrice, formatDiscount } from '@/lib/utils/formatPrice'
import { useWishlistStore } from '@/lib/store/useWishlistStore'
import { trackViewItem } from '@/lib/analytics'

const ProductReviews = dynamic(() => import('@/components/product/ProductReviews'), { ssr: false })
const RelatedProducts = dynamic(() => import('@/components/product/RelatedProducts'), { ssr: false })

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

  useEffect(() => {
    if (!product) return
    trackViewItem({
      product_id: product.id,
      name: product.name,
      price: product.base_price,
      category: product.categories?.name,
    })
  }, [product])

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

  const selectedVariant: ProductVariant | null = product.product_variants?.find((v) => {
    const colourMatch = !selectedColour || v.colour === selectedColour
    const sizeMatch = !selectedSize || v.size === selectedSize
    return colourMatch && sizeMatch && v.is_active
  }) || null

  const discount = formatDiscount(product.compare_price || 0, product.base_price)
  const stock = selectedVariant?.stock || 0
  const wishlisted = isWishlisted(product.id)
  const TABS = ['description', 'fabric', 'shipping', 'returns', 'reviews']
  const hasVariants = (product.product_variants?.length ?? 0) > 0
  const isOOS = hasVariants && selectedVariant !== null && selectedVariant.stock === 0

  return (
    <>
      {/* Sticky mobile Add-to-Cart bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-white border-t border-[#e8e4e0] px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)]">
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
        <nav className="flex items-center gap-1.5 text-[10px] font-sans tracking-widest uppercase text-[#9b9b9b] mb-8 overflow-x-auto whitespace-nowrap">
          <a href="/" className="hover:text-[#0a0a0a] transition-colors shrink-0">Home</a>
          <span className="shrink-0">/</span>
          <a href="/shop" className="hover:text-[#0a0a0a] transition-colors shrink-0">Shop</a>
          {product.categories && (
            <>
              <span className="shrink-0">/</span>
              <a href={`/shop?category=${product.categories.slug}`} className="hover:text-[#0a0a0a] transition-colors shrink-0">
                {product.categories.name}
              </a>
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

            <div className="flex items-center gap-3">
              <span className="font-sans text-xl text-[#0a0a0a]">{formatPrice(product.base_price)}</span>
              {product.compare_price && product.compare_price > product.base_price && (
                <>
                  <span className="font-sans text-sm text-[#9b9b9b] line-through">{formatPrice(product.compare_price)}</span>
                  <span className="bg-[#DC2626] text-white text-[9px] font-sans font-bold tracking-widest uppercase px-2 py-0.5 shadow-sm">
                    -{discount}%
                  </span>
                </>
              )}
            </div>
            <p className="text-[10px] font-sans text-[#6b6b6b]">+ GST calculated at checkout</p>

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
              <p className="text-[11px] font-sans text-[#c8a4a5]">Only {stock} left — hurry!</p>
            )}

            <div className="flex items-center gap-4">
              <div className="flex items-center border border-[#e8e4e0]">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-[#6b6b6b] hover:text-[#0a0a0a] text-lg">-</button>
                <span className="w-10 text-center text-sm font-sans text-[#0a0a0a]">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(stock || 10, quantity + 1))} className="w-10 h-10 flex items-center justify-center text-[#6b6b6b] hover:text-[#0a0a0a] text-lg">+</button>
              </div>
              <button
                onClick={() => toggle(product.id)}
                className="w-10 h-10 border border-[#e8e4e0] flex items-center justify-center hover:border-[#c8a4a5]"
                aria-label="Add to wishlist"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? '#c8a4a5' : 'none'} stroke={wishlisted ? '#c8a4a5' : '#0a0a0a'} strokeWidth="1.5">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </button>
            </div>

            <div id="add-to-cart-btn">
              <AddToCartButton product={product} selectedVariant={selectedVariant} quantity={quantity} />
            </div>

            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#e8e4e0]">
              {[
                { icon: '🚚', title: 'Free Delivery', sub: 'On orders Rs.999+' },
                { icon: 'return', title: '7-Day Returns', sub: 'Hassle-free' },
                { icon: 'lock', title: 'Secure Pay', sub: 'Razorpay encrypted' },
              ].map(b => (
                <div key={b.title} className="text-center bg-[#faf8f5] border border-[#f0ece8] py-3 px-1">
                  <p className="text-base mb-0.5">{b.icon === 'return' ? '↩' : b.icon === 'lock' ? '🔒' : b.icon}</p>
                  <p className="text-[9px] font-sans tracking-widest uppercase text-[#0a0a0a] font-medium">{b.title}</p>
                  <p className="text-[9px] font-sans text-[#9b9b9b]">{b.sub}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-[#e8e4e0] pt-4 space-y-0">
              {TABS.map((t) => (
                <div key={t} className="border-b border-[#e8e4e0]">
                  <button
                    onClick={() => setTab(tab === t ? '' : t)}
                    className="w-full flex items-center justify-between py-3 text-[10px] font-sans tracking-widest uppercase text-[#0a0a0a]"
                  >
                    {t}
                    <span>{tab === t ? '-' : '+'}</span>
                  </button>
                  {tab === t && (
                    <div className="pb-4 text-xs font-sans text-[#6b6b6b] leading-relaxed">
                      {t === 'description' && <p>{product.description || 'No description available.'}</p>}
                      {t === 'fabric' && <p>100% premium quality fabric. Machine washable. Do not bleach.</p>}
                      {t === 'shipping' && <p>Free shipping on orders above Rs.999. Standard delivery 3-5 business days.</p>}
                      {t === 'returns' && <p>Easy 7-day returns. Item must be unworn with original tags.</p>}
                      {t === 'reviews' && <ProductReviews product_id={product.id} />}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <RelatedProducts category_id={product.category_id} exclude_id={product.id} />
      </div>
    </>
  )
}
