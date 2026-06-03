import api from './client'
import type { ProductVariant } from './products'

export const variantsApi = {
  listByProduct: (productId: string) =>
    api.get<ProductVariant[]>(`/variants/product/${productId}`),
  create: (data: {
    product_id: string
    size?: string
    colour?: string
    price: number
    stock: number
    sku?: string
    is_active?: boolean
  }) => api.post<ProductVariant>('/variants', data),
  update: (id: string, data: { size?: string; colour?: string; price?: number; stock?: number; sku?: string; is_active?: boolean }) =>
    api.patch<ProductVariant>(`/variants/${id}`, data),
  remove: (id: string) => api.delete(`/variants/${id}`),
}
