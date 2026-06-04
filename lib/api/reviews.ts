import api from './client'

export interface ReviewItem {
  id: string
  rating: number
  title?: string
  comment?: string
  body?: string   // legacy alias kept for compat
  is_approved: boolean
  created_at: string
  users?: { name?: string }
}

export const reviewsApi = {
  // Correct endpoint: GET /reviews/product/:productId
  getByProduct: (productId: string) =>
    api.get<ReviewItem[]>(`/reviews/product/${productId}`),

  create: (data: {
    product_id: string
    rating: number
    title?: string
    body?: string    // mapped to the DB `body` column
    order_id?: string
  }) => api.post('/reviews', data),

  getMyReviews: () => api.get<ReviewItem[]>('/reviews/my'),
}
