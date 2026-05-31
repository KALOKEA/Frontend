'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string // variant_id for guest cart
  variant_id: string
  product_id: string
  name: string
  slug: string
  image_url: string
  size?: string
  colour?: string
  price: number
  quantity: number
  max_stock: number
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  guestSessionId: string

  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (variant_id: string) => void
  updateQuantity: (variant_id: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void

  itemCount: number
  subtotal: number
}

const generateId = () => Math.random().toString(36).slice(2)

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      guestSessionId: generateId(),

      addItem: (newItem) => {
        set((state) => {
          const existing = state.items.find((i) => i.variant_id === newItem.variant_id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.variant_id === newItem.variant_id
                  ? { ...i, quantity: Math.min(i.quantity + newItem.quantity, i.max_stock) }
                  : i
              ),
            }
          }
          return {
            items: [...state.items, { ...newItem, id: newItem.variant_id }],
          }
        })
      },

      removeItem: (variant_id) => {
        set((state) => ({ items: state.items.filter((i) => i.variant_id !== variant_id) }))
      },

      updateQuantity: (variant_id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variant_id)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.variant_id === variant_id ? { ...i, quantity } : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      get itemCount() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },

      get subtotal() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      },
    }),
    {
      name: 'kalokea-cart',
      partialize: (state) => ({ items: state.items, guestSessionId: state.guestSessionId }),
    }
  )
)
