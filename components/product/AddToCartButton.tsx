'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/useCartStore'
import { useToast } from '@/components/ui/Toast'
import { trackAddToCart, metaAddToCart } from '@/lib/analytics'
import type { Product, ProductVariant } from '@/lib/api/products'

interface AddToCartButtonProps {
  product: Product
  selectedVariant: ProductVariant | null
  quantity: number
}

export default function AddToCartButton({ product, selectedVariant, quantity }: AddToCartButtonProps) {
  const { addItem, openCart } = useCartStore()
  const { toast } = useToast()
  const router = useRouter()
  const [adding, setAdding] = useState(false)
  const [buyingNow, setBuyingNow] = useState(false)

  function buildCartItem() {
    if (!selectedVariant) { toast('Please select your size and colour', 'error'); return null }
    if (selectedVariant.stock === 0) { toast('This item is out of stock', 'error'); return null }
    const primaryImg = product.product_images?.find(i => i.is_primary)?.url || product.product_images?.[0]?.url || ''
    const unitPrice = selectedVariant.price || product.base_price
    return {
      variant_id: selectedVariant.id,
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      image_url: primaryImg,
      size: selectedVariant.size,
      colour: selectedVariant.colour,
      price: unitPrice,
      quantity,
      max_stock: selectedVariant.stock,
    }
  }

  const handleAdd = async () => {
    const item = buildCartItem()
    if (!item) return
    setAdding(true)
    addItem(item)
    trackAddToCart({
      product_id: product.id,
      variant_id: selectedVariant!.id,
      name: product.name,
      price: item.price,
      quantity,
      size: selectedVariant!.size,
      colour: selectedVariant!.colour,
      category: product.categories?.name,
    })
    metaAddToCart({
      product_id: product.id,
      name: product.name,
      price: item.price,
      quantity,
    })
    setTimeout(() => {
      setAdding(false)
      toast(`Added to cart`)
      openCart()
    }, 300)
  }

  const handleBuyNow = async () => {
    const item = buildCartItem()
    if (!item) return
    setBuyingNow(true)
    addItem(item)
    router.push('/checkout')
  }

  const isOOS = selectedVariant?.stock === 0

  if (isOOS) {
    return (
      <button disabled className="w-full py-4 text-[11px] font-sans tracking-widest uppercase bg-[#e8e4e0] text-[#6b6b6b] cursor-not-allowed">
        Out of Stock
      </button>
    )
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleAdd}
        disabled={adding || buyingNow}
        className="w-full py-4 text-[11px] font-sans tracking-widest uppercase bg-[#0a0a0a] text-white hover:bg-[#2a2a2a] disabled:opacity-60 transition-colors"
      >
        {adding ? 'Adding…' : 'Add to Cart'}
      </button>
      <button
        onClick={handleBuyNow}
        disabled={adding || buyingNow}
        className="w-full py-3.5 text-[11px] font-sans tracking-widest uppercase border border-[#0a0a0a] text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white disabled:opacity-60 transition-colors"
      >
        {buyingNow ? 'Going to checkout…' : 'Buy Now'}
      </button>
    </div>
  )
}
