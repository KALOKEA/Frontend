'use client'
/**
 * QuickView modal — lightweight product preview overlay.
 *
 * Shows the primary product image, name, price, size/colour selector,
 * an Add to Bag button (adds to cart store and opens cart drawer),
 * and a View Full Details link. Fully accessible: focus trapped, Escape
 * closes, aria-modal + role="dialog".
 */
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { Product, ProductVariant } from '@/lib/api/products'
import { useCartStore } from '@/lib/store/useCartStore'
import { useToast } from '@/components/ui/Toast'
import { formatPrice, formatDiscount } from '@/lib/utils/formatPrice'

interface QuickViewProps {
  product: Product
  onClose: () => void
}

function getPrimaryImage(product: Product): string {
  const primary = product.product_images?.find((i) => i.is_primary)
  return primary?.url || product.product_images?.[0]?.url || '/placeholder.jpg'
}

export default function QuickView({ product, onClose }: QuickViewProps) {
  const dialogRef     = useRef<HTMLDivElement>(null)
  const closeBtnRef   = useRef<HTMLButtonElement>(null)
  const prevFocusRef  = useRef<HTMLElement | null>(null)

  const { addItem, openCart } = useCartStore()
  const { toast } = useToast()

  const imgUrl   = getPrimaryImage(product)
  const discount = formatDiscount(product.compare_price || 0, product.base_price)
  const isOutOfStock = !product.product_variants?.some((v) => v.is_active && v.stock > 0)

  // Unique sizes from active variants
  const uniqueSizes = Array.from(
    new Set(
      (product.product_variants ?? [])
        .filter((v) => v.is_active)
        .map((v) => v.size)
        .filter(Boolean),
    ),
  ) as string[]

  // Unique colours from active variants
  const uniqueColours = Array.from(
    new Set(
      (product.product_variants ?? [])
        .filter((v) => v.is_active)
        .map((v) => v.colour)
        .filter(Boolean),
    ),
  ) as string[]

  const [selectedSize,   setSelectedSize]   = useState<string | null>(uniqueSizes[0] ?? null)
  const [selectedColour, setSelectedColour] = useState<string | null>(uniqueColours[0] ?? null)
  const [adding, setAdding] = useState(false)

  // Find the best matching variant
  const selectedVariant: ProductVariant | null =
    (product.product_variants ?? []).find((v) => {
      const sizeOk   = !selectedSize   || v.size   === selectedSize
      const colourOk = !selectedColour || v.colour === selectedColour
      return v.is_active && sizeOk && colourOk
    }) ?? null

  const stockOk = (selectedVariant?.stock ?? 0) > 0
  const variantPrice = selectedVariant?.price ?? product.base_price

  // Check if a given size is in stock (any colour)
  function sizeHasStock(size: string): boolean {
    return (product.product_variants ?? []).some(
      (v) => v.is_active && v.size === size && v.stock > 0,
    )
  }

  // ── Accessibility ────────────────────────────────────────────────────────

  // Save & restore focus
  useEffect(() => {
    prevFocusRef.current = document.activeElement as HTMLElement
    closeBtnRef.current?.focus()
    return () => {
      prevFocusRef.current?.focus()
    }
  }, [])

  // Escape closes
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Tab focus trap
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const dialog = dialogRef.current
      if (!dialog) return
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute('disabled'))
      if (focusable.length === 0) return
      const first = focusable[0]
      const last  = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // ── Add to cart ──────────────────────────────────────────────────────────

  function handleAddToCart() {
    if (!selectedVariant || !stockOk || adding) return
    setAdding(true)
    addItem({
      variant_id: selectedVariant.id,
      product_id: product.id,
      name:       product.name,
      slug:       product.slug,
      image_url:  imgUrl,
      size:       selectedVariant.size,
      colour:     selectedVariant.colour,
      price:      variantPrice,
      quantity:   1,
      max_stock:  selectedVariant.stock,
    })
    toast('Added to bag', 'success')
    openCart()
    setTimeout(() => { setAdding(false); onClose() }, 400)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0A0908]/50 z-[60] backdrop-blur-[2px]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`Quick view: ${product.name}`}
        className="fixed inset-0 z-[61] flex items-center justify-center p-4 pointer-events-none"
      >
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-[720px] max-h-[90vh] overflow-y-auto pointer-events-auto relative">

          {/* Close button */}
          <button
            ref={closeBtnRef}
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-[#f4f0ec] hover:bg-[#e8e4e0] transition-colors text-[#6b5c55]"
            aria-label="Close quick view"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2">

            {/* ── Image ───────────────────────────────────────────── */}
            <div className="relative bg-[#F2EAE0] aspect-[3/4] sm:aspect-auto sm:min-h-[420px]">
              <Image
                src={imgUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 360px"
              />
              {discount > 0 && (
                <span className="absolute top-3 left-3 bg-[#7C4A2D] text-white text-[9px] font-sans font-semibold tracking-widest uppercase rounded-full px-2.5 py-1">
                  -{discount}%
                </span>
              )}
              {isOutOfStock && (
                <span className="absolute top-3 left-3 bg-[#5a5a5a]/90 text-white text-[9px] font-sans tracking-widest uppercase rounded-full px-2.5 py-1">
                  Sold Out
                </span>
              )}
            </div>

            {/* ── Info panel ──────────────────────────────────────── */}
            <div className="p-6 flex flex-col gap-4">

              {/* Name */}
              <h2 className="font-serif text-[1.25rem] leading-snug text-[#0A0908]">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="font-sans text-[15px] font-medium text-[#0A0908]">
                  {formatPrice(variantPrice)}
                </span>
                {product.compare_price && product.compare_price > product.base_price && (
                  <span className="font-sans text-[13px] text-[#6b5c55] line-through">
                    {formatPrice(product.compare_price)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="font-sans text-[11px] font-semibold text-[#7C4A2D] uppercase tracking-wider">
                    Save {discount}%
                  </span>
                )}
              </div>

              {/* Rating */}
              {(product.review_count ?? 0) > 0 && (
                <div className="flex items-center gap-1.5 text-[12px] font-sans text-[#6B5E55]">
                  <span>★ {(product.avg_rating ?? 0).toFixed(1)}</span>
                  <span className="text-[#c8c0b8]">({product.review_count} reviews)</span>
                </div>
              )}

              {/* Colour selector */}
              {uniqueColours.length > 1 && (
                <div>
                  <p className="text-[10px] font-sans uppercase tracking-[0.15em] text-[#6b6b6b] mb-2">
                    Colour: <span className="text-[#0a0a0a]">{selectedColour ?? '—'}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {uniqueColours.map((colour) => (
                      <button
                        key={colour}
                        onClick={() => setSelectedColour(colour)}
                        aria-label={colour}
                        aria-pressed={selectedColour === colour}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${
                          selectedColour === colour
                            ? 'border-[#0a0a0a] ring-1 ring-offset-1 ring-[#0a0a0a]'
                            : 'border-[#D8CFC5] hover:border-[#7C4A2D]'
                        }`}
                        style={{ backgroundColor: colour.toLowerCase() }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size selector */}
              {uniqueSizes.length > 0 && (
                <div>
                  <p className="text-[10px] font-sans uppercase tracking-[0.15em] text-[#6b6b6b] mb-2">
                    Size: <span className="text-[#0a0a0a]">{selectedSize ?? '—'}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {uniqueSizes.map((size) => {
                      const inStock = sizeHasStock(size)
                      const active  = selectedSize === size
                      return (
                        <button
                          key={size}
                          onClick={() => inStock && setSelectedSize(size)}
                          disabled={!inStock}
                          aria-label={`Size ${size}${!inStock ? ' — sold out' : ''}`}
                          aria-pressed={active}
                          className={`min-w-[42px] h-9 px-2.5 text-[11px] font-sans uppercase tracking-wider border rounded transition-all ${
                            active
                              ? 'border-[#0a0a0a] bg-[#0a0a0a] text-white'
                              : inStock
                              ? 'border-[#d8d0c8] text-[#0a0a0a] hover:border-[#0a0a0a]'
                              : 'border-[#e8e4e0] text-[#c0b8b0] line-through cursor-not-allowed'
                          }`}
                        >
                          {size}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Low stock warning */}
              {selectedVariant && selectedVariant.stock > 0 && selectedVariant.stock <= 5 && (
                <p className="text-[11px] font-sans text-[#7C4A2D] font-medium">
                  Only {selectedVariant.stock} left — hurry!
                </p>
              )}

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                disabled={!stockOk || adding || isOutOfStock}
                className={`w-full py-3.5 text-[11px] font-sans font-semibold tracking-[0.15em] uppercase rounded transition-all ${
                  stockOk && !isOutOfStock
                    ? 'bg-[#0A0908] text-white hover:bg-[#1a1208] active:scale-[0.98]'
                    : 'bg-[#e8e4e0] text-[#a0a0a0] cursor-not-allowed'
                }`}
              >
                {adding ? 'Adding…' : isOutOfStock ? 'Sold Out' : !stockOk ? 'Select a size' : 'Add to Bag'}
              </button>

              {/* View full details */}
              <Link
                href={`/product/${product.slug}/`}
                onClick={onClose}
                className="text-center text-[11px] font-sans uppercase tracking-[0.15em] text-[#6b5c55] hover:text-[#0a0a0a] underline underline-offset-4 transition-colors"
              >
                View Full Details
              </Link>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
