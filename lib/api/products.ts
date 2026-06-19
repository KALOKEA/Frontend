import api from './client'

export interface ProductImage {
  url: string
  alt_text?: string
  is_primary: boolean
  sort_order: number
}

export interface ProductVariant {
  id: string
  size?: string
  colour?: string
  price: number
  stock: number
  sku: string
  is_active: boolean
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  category_id?: string
  base_price: number
  compare_price?: number
  is_active: boolean
  is_featured: boolean
  tags?: string[]
  hsn_code?: string
  gst_rate?: number
  video_url?: string
  youtube_url?: string
  fabric_care?: string
  avg_rating?: number
  review_count?: number
  /** "Model is 5'6", 58 kg, wearing size S — Fits true to size" */
  model_info?: string
  created_at: string
  categories?: { id: string; name: string; slug: string }
  product_images?: ProductImage[]
  product_variants?: ProductVariant[]
}

export interface ProductsResponse {
  data: Product[]
  meta: { total: number; page: number; limit: number; total_pages: number }
}

export interface ProductImageRow {
  id: string
  url: string
  alt_text?: string
  is_primary: boolean
  sort_order: number
  public_id?: string
}

export const productsApi = {
  getAll: (params: Record<string, string | number> = {}) => {
    const q = new URLSearchParams(params as Record<string, string>).toString()
    return api.get<ProductsResponse>(`/products?${q}`)
  },
  getBySlug: (slug: string) => api.get<Product>(`/products/${slug}`),
  getByIds: (ids: string[]) =>
    ids.length ? api.get<Product[]>(`/products/by-ids?ids=${ids.join(',')}`) : Promise.resolve([]),
  create: (data: Partial<Product>) => api.post<Product>('/products', data),
  update: (id: string, data: Partial<Product>) => api.patch<Product>(`/products/${id}`, data),
  remove: (id: string) => api.delete(`/products/${id}`),
  hardDelete: (id: string) => api.delete(`/products/${id}/permanent`),

  // Images
  listImages: (productId: string) => api.get<ProductImageRow[]>(`/products/${productId}/images`),
  addImage: (productId: string, data: { url: string; public_id?: string; alt_text?: string; is_primary?: boolean; sort_order?: number }) =>
    api.post<ProductImageRow>(`/products/${productId}/images`, data),
  setPrimaryImage: (imageId: string) => api.patch<ProductImageRow>(`/products/images/${imageId}/primary`),
  updateImage: (imageId: string, data: { alt_text?: string; sort_order?: number }) =>
    api.patch<ProductImageRow>(`/products/images/${imageId}`, data),
  deleteImage: (imageId: string) => api.delete(`/products/images/${imageId}`),
}
