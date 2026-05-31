import api from './client'

export const reviewsApi = {
  getByProduct: (product_id: string) =>
    api.get<{ id: string; rating: number; title?: string; body?: string; created_at: string; users: { name?: string } }[]>(
      `/reviews?product_id=${product_id}`
    ),
  create: (data: { product_id: string; rating: number; title?: string; body?: string }) =>
    api.post('/reviews', data),
}
