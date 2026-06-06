import api from './client'

export interface ReviewItem {
  id: string
  rating: number
  title?: string
  comment?: string
  body?: string
  is_approved: boolean
  created_at: string
  media_urls?: string[]
  users?: { name?: string }
}

export const reviewsApi = {
  getByProduct: (productId: string) =>
    api.get<ReviewItem[]>(`/reviews/product/${productId}`),

  create: (data: {
    product_id: string
    rating: number
    title?: string
    body?: string
    order_id?: string
    media_urls?: string[]
  }) => api.post('/reviews', data),

  getMyReviews: () => api.get<ReviewItem[]>('/reviews/my'),
}
