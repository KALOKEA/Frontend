import api from './client'

export interface ReviewItem {
  id: string
  rating: number
  title?: string
  /** Backend GET /reviews/product/{id} returns 'comment'; POST /reviews sends 'body'.
   *  Both fields are documented here; components use `r.body || r.comment` to handle both. */
  comment?: string
  body?: string
  is_approved: boolean
  created_at: string
  media_urls?: string[]
  users?: { name?: string }
  /** Display name for admin-seeded reviews (no linked user). */
  guest_name?: string
  /** Backend may join products data on getMyReviews */
  products?: { name?: string; slug?: string }
}

export interface FeaturedReview {
  id: string
  rating: number
  text: string
  author: string
  product: string
  product_slug: string
}

export const reviewsApi = {
  getByProduct: (productId: string) =>
    api.get<ReviewItem[]>(`/reviews/product/${productId}`),

  /** Genuine approved reviews for the homepage social-proof section. */
  getFeatured: () =>
    api.get<FeaturedReview[]>(`/reviews/featured`),

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
