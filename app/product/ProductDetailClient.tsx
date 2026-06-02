'use client'
import { useEffect, useState } from 'react'
import { productsApi, type Product, type ProductVariant } from '@/lib/api/products'
import ImageGallery from '@/components/product/ImageGallery'
import VariantPicker from '@/components/product/VariantPicker'
import AddToCartButton from '@/components/product/AddToCartButton'
import SizeGuidePopup from '@/components/product/SizeGuidePopup'
import ProductReviews from '@/components/product/ProductReviews'
import RelatedProducts from '@/components/product/RelatedProducts'
import Spinner from '@/components/ui/Spinner'
import { formatPrice, formatDiscount } from '@/lib/utils/formatPrice'
import { useWishlistStore } from '@/lib/store/useWishlistStore'
import { trackViewItem } from '@/lib/analytics'

export default function ProductDetailClient({ slug, initialProduct }: { slug: string; initialProduct?: Product }) {
  // When rendered from the static product page we already have the product
  // (build-time fetch) — seed state with it so the content is in the SSG HTML
  // and there's no loading flash. The standalone /product?slug= path (if hit)
  // still fetches client-side.
  const [product, setProduct] = useState<Product | null>(initialProduct ?? null)
  const [loading, setLoading] = useState(!initialProduct)
  const [selectedColour, setSelectedColour] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [tab, setTab] = useState('description')
  const { toggle, isWishlisted } = useWishlistStore()

  useEffect(() => {
    if (initialProduct) return // already have fresh-at-build data
    productsApi.getBySlug(slug)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [slug, initialProduct])

  // GA4 view_item once the product is known.
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <ImageGallery images={product.product_images || []} productName={product.name} />

        <div className="space-y-5">
          {product.categories && (
            <p className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b]">
              {product.categories.name}
            </p>
          )}

          <h1 className="font-serif text-3xl md:text-4xl text-[#0a0a0a] leading-tight">{product.name}</h1>

          <div className="flex items-center gap-3">
            <span className="font-sans text-xl text-[#0a0a0a]">{formatPrice(product.base_price)}</span>
            {product.compare_price && product.compare_price > product.base_price && (
              <>
                <span className="font-sans text-sm text-[#6b6b6b] line-through">{formatPrice(product.compare_price)}</span>
                <span className="bg-[#c8a4a5] text-white text-[9px] font-sans tracking-widest uppercase px-2 py-0.5">
                  -{discount}%
                </span>
              </>
            )}
          </div>
          <p className="text-[10px] font-sans text-[#6b6b6b]">Inclusive of all taxes</p>

          {product.product_variants && product.product_variants.length > 0 && (
            <VariantPicker
              variants={product.product_variants}
              selectedColour={selectedColour}
              selectedSize={selectedSize}
              onColourChange={setSelectedColour}
              onSizeChange={setSelectedSize}
            />
          )}

          <SizeGuidePopup />

          {stock > 0 && stock <= 5 && (
            <p className="text-[11px] font-sans text-[#c8a4a5]">Only {stock} left — hurry!</p>
          )}

          <div className="flex items-center gap-4">
            <div className="flex items-center border border-[#e8e4e0]">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 flex items-center justify-center text-[#6b6b6b] hover:text-[#0a0a0a] text-lg">−</button>
              <span className="w-10 text-center text-sm font-sans text-[#0a0a0a]">{quantity}</span>
              <button onClick={() => setQuantity(Math.min(stock || 10, quantity + 1))} className="w-10 h-10 flex items-center justify-center text-[#6b6b6b] hover:text-[#0a0a0a] text-lg">+</button>
            </div>
            <button
              onClick={() => toggle(product.id)}
              className="w-10 h-10 border border-[#e8e4e0] flex items-center justify-center hover:border-[#c8a4a5]"
              aria-label="Wishlist"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? '#c8a4a5' : 'none'} stroke={wishlisted ? '#c8a4a5' : '#0a0a0a'} strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
            </button>
          </div>

          <AddToCartButton product={product} selectedVariant={selectedVariant} quantity={quantity} />

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#e8e4e0]">
            {[
              ['Free Returns', '7-day returns'],
              ['Secure Pay', 'Razorpay encrypted'],
              ['Fast Delivery', '3-5 business days'],
            ].map(([title, sub]) => (
              <div key={title} className="text-center">
                <p className="text-[10px] font-sans tracking-widest uppercase text-[#0a0a0a]">{title}</p>
                <p className="text-[10px] font-sans text-[#6b6b6b]">{sub}</p>
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
                  <span>{tab === t ? '−' : '+'}</span>
                </button>
                {tab === t && (
                  <div className="pb-4 text-xs font-sans text-[#6b6b6b] leading-relaxed">
                    {t === 'description' && <p>{product.description || 'No description available.'}</p>}
                    {t === 'fabric' && <p>100% premium quality fabric. Machine washable. Do not bleach.</p>}
                    {t === 'shipping' && <p>Free shipping on orders above ₹999. Standard delivery 3-5 business days.</p>}
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
  )
}
