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

  /**
   * Load the logged-in user's server cart and replace local state.
   * Called by AuthBootstrap after every successful token refresh.
   */
  hydrate: () => Promise<void>

  /**
   * Load the guest server cart using the stored session ID.
   * Only updates local state if the server cart has items (so stale localStorage
   * items aren't wiped on a brand-new session with an empty server cart).
   */
  guestHydrate: () => Promise<void>

  /**
   * Called immediately after OTP login / signup.
   * 1. Server-side merge of the guest session cart into the user's cart.
   * 2. Pushes any localStorage-only items (old behavior, no server sync yet).
   * 3. Loads the authoritative server cart via hydrate().
   * 4. Regenerates guestSessionId so the old guest cart can't be replayed.
   */
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

      // ─── Mutations ────────────────────────────────────────────────────────

      addItem: (newItem) => {
        // 1. Optimistic local update first (instant UI feedback).
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
          return { items: [...state.items, { ...newItem, id: newItem.variant_id }] }
        })

        // 2. Mirror to server.
        if (isLoggedIn()) {
          // Logged-in: add to user cart, then resync (server assigns real item ids).
          cartApi
            .add(newItem.variant_id, newItem.quantity)
            .then(() => get().hydrate())
            .catch(() => get().hydrate())
        } else {
          // Guest: push to server with session_id so items survive localStorage clear,
          // device switches, and browser restarts.
          const sid = get().guestSessionId
          cartApi
            .add(newItem.variant_id, newItem.quantity, sid)
            .then(() => get().guestHydrate())
            .catch(() => {}) // keep optimistic local state if server is unreachable
        }
      },

      removeItem: (variant_id) => {
        const item = get().items.find((i) => i.variant_id === variant_id)
        set((state) => ({ items: state.items.filter((i) => i.variant_id !== variant_id) }))
        if (!item) return

        if (isLoggedIn()) {
          cartApi.remove(item.id).catch(() => {})
        } else {
          // item.id is either a server cart_item id or the variant_id (unsynced).
          // Pass session_id so the backend can find the correct guest cart.
          cartApi.remove(item.id, get().guestSessionId).catch(() => {})
        }
      },

      updateQuantity: (variant_id, quantity) => {
        if (quantity <= 0) { get().removeItem(variant_id); return }
        const item = get().items.find((i) => i.variant_id === variant_id)
        set((state) => ({
          items: state.items.map((i) => i.variant_id === variant_id ? { ...i, quantity } : i),
        }))
        if (!item) return

        if (isLoggedIn()) {
          cartApi.update(item.id, quantity)
            .then(() => get().hydrate())
            .catch(() => get().hydrate())
        } else {
          cartApi.update(item.id, quantity, get().guestSessionId)
            .then(() => get().guestHydrate())
            .catch(() => {})
        }
      },

      clearCart: () => {
        set({ items: [] })
        if (isLoggedIn()) {
          cartApi.clear().catch(() => {})
        } else {
          cartApi.clear(get().guestSessionId).catch(() => {})
        }
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      // ─── Sync ─────────────────────────────────────────────────────────────

      hydrate: async () => {
        if (!isLoggedIn()) return
        try {
          const res = await cartApi.get()
          set({ items: (res.items || []).map(mapServerItem) })
        } catch {
          // keep local state if the fetch fails
        }
      },

      guestHydrate: async () => {
        if (isLoggedIn()) return
        const sid = get().guestSessionId
        if (!sid) return
        try {
          const res = await cartApi.get(sid)
          const serverItems = (res.items || []).map(mapServerItem)
          if (serverItems.length > 0) {
            // Server cart wins — it is the source of truth.
            set({ items: serverItems })
          }
          // If server cart is empty, keep localStorage state (migration: user had
          // items before server-side guest carts were added, they'll be pushed on
          // next add/merge).
        } catch {
          // keep local state
        }
      },

      mergeOnLogin: async () => {
        const sid = get().guestSessionId

        // Step 1: Server-side merge of any server guest cart into the user's cart.
        // If no guest cart exists on server this is a no-op (returns a message, not error).
        await cartApi.merge(sid).catch(() => {})

        // Step 2: Push any localStorage-only guest items that were never synced to
        // the server (items where id === variant_id — old behavior pre-server-sync).
        const localOnlyItems = get().items.filter((i) => i.id === i.variant_id)
        for (const it of localOnlyItems) {
          await cartApi.add(it.variant_id, it.quantity).catch(() => {})
        }

        // Step 3: Load the authoritative merged server cart.
        await get().hydrate()

        // Step 4: Regenerate guest session ID so the old guest cart can't be replayed.
        set({ guestSessionId: generateId() })
      },

      // ─── Derived ──────────────────────────────────────────────────────────

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
