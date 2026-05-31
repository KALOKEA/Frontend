import api from './client'

export interface CartItem {
  id: string
  variant_id: string
  quantity: number
  product_variants: {
    id: string
    size?: string
    colour?: string
    price: number
    sku: string
    products: { id: string; name: string; slug: string; product_images: { url: string; is_primary: boolean }[] }
  }
}

export const cartApi = {
  get: () => api.get<{ items: CartItem[] }>('/cart'),
  add: (variant_id: string, quantity: number) => api.post('/cart/add', { variant_id, quantity }),
  update: (item_id: string, quantity: number) => api.patch(`/cart/${item_id}`, { quantity }),
  remove: (item_id: string) => api.delete(`/cart/${item_id}`),
  clear: () => api.delete('/cart'),
  merge: (guest_session_id: string) => api.post('/cart/merge', { guest_session_id }),
}
