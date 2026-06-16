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

  /** Coupon applied in cart or checkout — persisted so it survives navigation. */
  appliedCoupon: { code: string; discount: number } | null

  /**
   * True once Zustand has finished reading items from localStorage.
   * Use this to guard redirects that depend on the cart being empty — without
   * it, the checkout page would redirect to /cart/ on every hard refresh
   * because items start as [] before persist rehydrates.
   */
  _hasHydrated: boolean
  setHasHydrated: (val: boolean) => void

  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (variant_id: string) => void
  updateQuantity: (variant_id: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  setAppliedCoupon: (code: string, discount: number) => void
  clearAppliedCoupon: () => void

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
      appliedCoupon: null,
      _hasHydrated: false,
      setHasHydrated: (val) => set({ _hasHydrated: val }),

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

        // 2. Mirror to server — use the response to update item IDs.
        //    NEVER call hydrate() here: if the server returns empty (schema issue,
        //    stock error, etc.) it would wipe the optimistic local state.
        if (isLoggedIn()) {
          cartApi
            .add(newItem.variant_id, newItem.quantity)
            .then((res) => {
              if (res?.items?.length) set({ items: res.items.map(mapServerItem) })
              // If server returned empty, keep optimistic state — don't wipe it.
            })
            .catch(() => {}) // keep optimistic state on any error
        } else {
          const sid = get().guestSessionId
          cartApi
            .add(newItem.variant_id, newItem.quantity, sid)
            .then((res) => {
              // If the user logged in while this request was in-flight, their
              // mergeOnLogin will handle moving these items. Just update local state.
              if (res?.items?.length) set({ items: res.items.map(mapServerItem) })
            })
            .catch(() => {})
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
            .then((res) => {
              if (res?.items?.length) set({ items: res.items.map(mapServerItem) })
            })
            .catch(() => {})
        } else {
          cartApi.update(item.id, quantity, get().guestSessionId)
            .then((res) => {
              if (res?.items?.length) set({ items: res.items.map(mapServerItem) })
            })
            .catch(() => {})
        }
      },

      clearCart: () => {
        set({ items: [], appliedCoupon: null })
        if (isLoggedIn()) {
          cartApi.clear().catch(() => {})
        } else {
          cartApi.clear(get().guestSessionId).catch(() => {})
        }
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      setAppliedCoupon: (code, discount) => set({ appliedCoupon: { code, discount } }),
      clearAppliedCoupon: () => set({ appliedCoupon: null }),

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
            // Server cart wins for items it knows about.
            // Also preserve any optimistic local items not yet on server
            // (id === variant_id means the server hasn't confirmed them yet).
            const localOnly = get().items.filter(
              (li) =>
                li.id === li.variant_id &&
                !serverItems.some((si) => si.variant_id === li.variant_id),
            )
            set({ items: [...serverItems, ...localOnly] })
          }
          // If server cart is empty, keep localStorage state (items may be
          // in-flight or were added before server-side guest carts were added).
        } catch {
          // keep local state
        }
      },

      mergeOnLogin: async () => {
        const sid = get().guestSessionId

        // Snapshot local items BEFORE any async operations so we have a
        // reference even if state changes while awaits are in-flight.
        const localItemsSnapshot = [...get().items]

        // Step 1: Server-side merge of any server guest cart into the user's cart.
        // If no guest cart exists this is a no-op (returns a message, never throws).
        await cartApi.merge(sid).catch(() => {})

        // Step 2: Push any localStorage-only items that were never synced to the
        // server (id === variant_id — assigned optimistically before the first server
        // response). This covers items added before login while the add was in-flight.
        const localOnlyItems = localItemsSnapshot.filter((i) => i.id === i.variant_id)
        for (const it of localOnlyItems) {
          await cartApi.add(it.variant_id, it.quantity).catch(() => {})
        }

        // Step 3: Load the authoritative merged server cart.
        await get().hydrate()

        // Step 4: Safety net — if server returned empty but we had local items,
        // the merge may have silently failed or there was a race condition (e.g.
        // the guest add was still in-flight when merge ran). Push all snapshot
        // items to the user cart and re-sync. Server handles duplicate quantities
        // gracefully (won't run if server already has items from step 3).
        if (get().items.length === 0 && localItemsSnapshot.length > 0) {
          for (const it of localItemsSnapshot) {
            await cartApi.add(it.variant_id, it.quantity).catch(() => {})
          }
          await get().hydrate()
        }

        // Step 5: Regenerate guest session ID so the old guest cart can't be replayed.
        set({ guestSessionId: generateId() })
      },

      // ─── Derived ───────────────────────────────────────────────────�────────────────────────────────────

      get itemCount() {
        return get().items.reduce((sum, i) => sum + i.quantity, 0)
      },

      get subtotal() {
        return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
      },
    }),
    {
      name: 'kalokea-cart',
      partialize: (state) => ({
        items: state.items,
        guestSessionId: state.guestSessionId,
        appliedCoupon: state.appliedCoupon,
      }),
      onRehydrateStorage: () => (state) => {
        // Called after localStorage is read and state is updated.
        // Signals that items are now reliably available.
        state?.setHasHydrated(true)
      },
    }
  )
)
