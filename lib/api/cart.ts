import api from './client'

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

export const cartApi = {
  get: () => api.get<{ cart_id: string; items: ServerCartItem[] }>('/cart'),
  add: (variant_id: string, quantity: number) => api.post('/cart/items', { variant_id, quantity }),
  update: (item_id: string, quantity: number) => api.patch(`/cart/items/${item_id}`, { quantity }),
  remove: (item_id: string) => api.delete(`/cart/items/${item_id}`),
  clear: () => api.delete('/cart'),
  // Note: the local-first store replays guest items via add() on login rather than
  // calling this; kept for parity with the backend MergeCartDto (expects session_id).
  merge: (session_id: string) => api.post('/cart/merge', { session_id }),
}
