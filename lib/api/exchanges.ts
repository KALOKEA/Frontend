import api from './client'

export const EXCHANGE_REASONS = [
  'Wrong size',
  'Wrong colour',
  'Damaged',
  'Wrong item',
  'Quality issue',
  'Other',
] as const

export interface ExchangeVariantOption {
  id: string
  size?: string
  colour?: string
  price: number
  stock: number
}

export interface ExchangeOptions {
  product_name: string
  variants: ExchangeVariantOption[]
}

export interface ExchangeRequest {
  id: string
  order_id: string
  order_item_id: string
  status: string
  reason: string
  original_price: number
  new_price: number
  price_difference: number
  gst_difference: number
  new_snapshot_name?: string
  new_snapshot_size?: string
  new_snapshot_colour?: string
  admin_notes?: string
  created_at: string
  orders?: { order_number: string }
  users?: { name?: string; email?: string }
}

export const exchangesApi = {
  create: (data: { order_id: string; order_item_id: string; new_variant_id: string; reason: string }) =>
    api.post<ExchangeRequest>('/exchanges', data),
  getMy: () => api.get<ExchangeRequest[]>('/exchanges/my'),
  getOptions: (orderItemId: string) => api.get<ExchangeOptions>(`/exchanges/options/${orderItemId}`),

  // Admin
  listAll: () => api.get<ExchangeRequest[]>('/exchanges'),
  updateStatus: (id: string, data: { status: string; admin_notes?: string }) =>
    api.patch<ExchangeRequest>(`/exchanges/${id}/status`, data),
}
