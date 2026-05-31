'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistStore {
  items: string[] // product_ids
  toggle: (product_id: string) => void
  isWishlisted: (product_id: string) => boolean
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product_id) => {
        const current = get().items
        if (current.includes(product_id)) {
          set({ items: current.filter((id) => id !== product_id) })
        } else {
          set({ items: [...current, product_id] })
        }
      },
      isWishlisted: (product_id) => get().items.includes(product_id),
    }),
    { name: 'kalokea-wishlist' }
  )
)
