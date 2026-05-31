import api from './client'

export const wishlistsApi = {
  get: () => api.get<{ product_id: string; products: { id: string; name: string; slug: string; base_price: number; product_images: { url: string; is_primary: boolean }[] } }[]>('/wishlists'),
  add: (product_id: string) => api.post('/wishlists', { product_id }),
  remove: (product_id: string) => api.delete(`/wishlists/${product_id}`),
}
