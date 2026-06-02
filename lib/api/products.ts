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
  created_at: string
  categories?: { id: string; name: string; slug: string }
  product_images?: ProductImage[]
  product_variants?: ProductVariant[]
}

export interface ProductsResponse {
  data: Product[]
  meta: { total: number; page: number; limit: number; total_pages: number }
}

export const productsApi = {
  getAll: (params: Record<string, string | number> = {}) => {
    const q = new URLSearchParams(params as Record<string, string>).toString()
    return api.get<ProductsResponse>(`/products?${q}`)
  },
  getBySlug: (slug: string) => api.get<Product>(`/products/${slug}`),
  create: (data: Partial<Product>) => api.post<Product>('/products', data),
  update: (id: string, data: Partial<Product>) => api.patch<Product>(`/products/${id}`, data),
  remove: (id: string) => api.delete(`/products/${id}`),
}
