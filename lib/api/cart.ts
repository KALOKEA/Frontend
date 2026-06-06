import api, { invalidateCache } from './client'

function bustCart() { invalidateCache('/cart') }

// Shape returned by the backend GET /cart (cart.service.getCart)
export interface ServerCartItem {
  id: string // cart_item id (needed to update/remove server-side)
  quantity: number
  product_variants: {
    id: string
    size?: string
    colour?: string
    price: number
    stock: number
    sku: string
    products: {
      id: string
      name: string
      slug: string
      product_images: { url: string; is_primary: boolean }[]
    }
  }
}

const qs = (s?: string) => (s ? `?session_id=${encodeURIComponent(s)}` : '')

export const cartApi = {
  /** Get cart — pass session_id for guest carts, omit for logged-in users. */
  get: (session_id?: string) =>
    api.get<{ cart_id: string; items: ServerCartItem[] }>(`/cart${qs(session_id)}`),

  /** Add item — pass session_id to persist guest cart on the server. */
  add: (variant_id: string, quantity: number, session_id?: string) => {
    bustCart()
    return api.post<{ cart_id: string; items: ServerCartItem[] }>(
      '/cart/items',
      { variant_id, quantity, ...(session_id ? { session_id } : {}) },
    )
  },

  /** Update quantity — pass session_id for guest items. */
  update: (item_id: string, quantity: number, session_id?: string) => {
    bustCart()
    return api.patch<{ cart_id: string; items: ServerCartItem[] }>(
      `/cart/items/${item_id}${qs(session_id)}`,
      { quantity },
    )
  },

  /** Remove item — pass session_id for guest items. */
  remove: (item_id: string, session_id?: string) => {
    bustCart()
    return api.delete(`/cart/items/${item_id}${qs(session_id)}`)
  },

  /** Clear entire cart. */
  clear: (session_id?: string) => {
    bustCart()
    return api.delete(`/cart${qs(session_id)}`)
  },

  /**
   * Server-side merge: moves all items from the guest session cart into the
   * logged-in user's cart, then deletes the guest cart.
   * Called on login — ensures server guest cart survives the transition.
   */
  merge: (session_id: string) =>
    api.post('/cart/merge', { session_id }),
}
