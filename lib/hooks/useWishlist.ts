'use client'
import { useWishlistStore } from '@/lib/store/useWishlistStore'

export function useWishlist(product_id?: string) {
  const { items, toggle, isWishlisted } = useWishlistStore()
  return {
    items,
    toggle,
    isWishlisted,
    wishlisted: product_id ? isWishlisted(product_id) : false,
    toggleThis: product_id ? () => toggle(product_id) : undefined,
  }
}
