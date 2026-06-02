'use client'
import { useState } from 'react'
import { useCartStore } from '@/lib/store/useCartStore'
import { useToast } from '@/components/ui/Toast'
import { trackAddToCart } from '@/lib/analytics'
import type { Product, ProductVariant } from '@/lib/api/products'

interface AddToCartButtonProps {
  product: Product
  selectedVariant: ProductVariant | null
  quantity: number
}

export default function AddToCartButton({ product, selectedVariant, quantity }: AddToCartButtonProps) {
  const { addItem, openCart } = useCartStore()
  const { toast } = useToast()
  const [adding, setAdding] = useState(false)

  const handleAdd = async () => {
    if (!selectedVariant) {
      toast('Please select a size', 'error')
      return
    }
    if (selectedVariant.stock === 0) {
      toast('This item is out of stock', 'error')
      return
    }

    setAdding(true)
    const primaryImg = product.product_images?.find((i) => i.is_primary)?.url || product.product_images?.[0]?.url || ''

    const unitPrice = selectedVariant.price || product.base_price

    addItem({
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
    })

    trackAddToCart({
      product_id: product.id,
      variant_id: selectedVariant.id,
      name: product.name,
      price: unitPrice,
      quantity,
      size: selectedVariant.size,
      colour: selectedVariant.colour,
      category: product.categories?.name,
    })

    setTimeout(() => {
      setAdding(false)
      toast(`${product.name} added to cart`)
      openCart()
    }, 300)
  }

  const isOOS = selectedVariant?.stock === 0

  return (
    <button
      onClick={handleAdd}
      disabled={isOOS || adding}
      className={`w-full py-4 text-[11px] font-sans tracking-widest uppercase transition-colors ${
        isOOS
          ? 'bg-[#e8e4e0] text-[#6b6b6b] cursor-not-allowed'
          : 'bg-[#0a0a0a] text-white hover:bg-[#2a2a2a]'
      }`}
    >
      {adding ? 'Adding...' : isOOS ? 'Out of Stock' : 'Add to Cart'}
    </button>
  )
}
