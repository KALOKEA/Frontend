'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { cartApi, type ServerCartItem } from '@/lib/api/cart'
import { useAuthStore } from './useAuthStore'

export interface CartItem {
  id: string // server cart_item id once synced; equals variant_id for unsynced guest items
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

  // Backend sync (no-ops for guests; logged-in users mirror to the server)
  hydrate: () => Promise<void>
  mergeOnLogin: () => Promise<void>

  itemCount: number
  subtotal: number
}

const generateId = () => Math.random().toString(36).slice(2)

const isLoggedIn = () => useAuthStore.getState().isLoggedIn

function mapServerItem(it: ServerCartItem): CartItem {
  const pv = it.product_variants
  const p = pv.products
  const img =
    p.product_images?.find((i) => i.is_primary)?.url ||
    p.product_images?.[0]?.url ||
    ''
  return {
    id: it.id,
    variant_id: pv.id,
    product_id: p.id,
    name: p.name,
    slug: p.slug,
    image_url: img,
    size: pv.size,
    colour: pv.colour,
    price: pv.price,
    quantity: it.quantity,
    max_stock: pv.stock ?? 99,
  }
}

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
        // Mirror to the server for logged-in users, then resync (server validates stock + assigns ids).
        if (isLoggedIn()) {
          cartApi
            .add(newItem.variant_id, newItem.quantity)
            .then(() => get().hydrate())
            .catch(() => get().hydrate())
        }
      },

      removeItem: (variant_id) => {
        const item = get().items.find((i) => i.variant_id === variant_id)
        set((state) => ({ items: state.items.filter((i) => i.variant_id !== variant_id) }))
        if (isLoggedIn() && item) {
          cartApi.remove(item.id).catch(() => {})
        }
      },

      updateQuantity: (variant_id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variant_id)
          return
        }
        const item = get().items.find((i) => i.variant_id === variant_id)
        set((state) => ({
          items: state.items.map((i) =>
            i.variant_id === variant_id ? { ...i, quantity } : i
          ),
        }))
        if (isLoggedIn() && item) {
          cartApi
            .update(item.id, quantity)
            .then(() => get().hydrate())
            .catch(() => get().hydrate())
        }
      },

      clearCart: () => {
        set({ items: [] })
        if (isLoggedIn()) {
          cartApi.clear().catch(() => {})
        }
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      // Load the authoritative server cart (logged-in only).
      hydrate: async () => {
        if (!isLoggedIn()) return
        try {
          const res = await cartApi.get()
          set({ items: (res.items || []).map(mapServerItem) })
        } catch {
          // keep local state if the fetch fails
        }
      },

      // On login: push genuine guest items (id === variant_id) into the user's
      // server cart, then load the merged server cart. Items already synced from a
      // previous session are skipped so quantities never double-count.
      mergeOnLogin: async () => {
        const guestItems = get().items.filter((i) => i.id === i.variant_id)
        for (const it of guestItems) {
          try {
            await cartApi.add(it.variant_id, it.quantity)
          } catch {
            // ignore individual failures (e.g. out of stock); hydrate reflects truth
          }
        }
        await get().hydrate()
      },

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
