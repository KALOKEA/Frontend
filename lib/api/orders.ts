import api from './client'

export interface Order {
  id: string
  order_number: string
  status: string
  subtotal: number
  discount: number
  shipping: number
  taxable_value?: number
  cgst?: number
  sgst?: number
  igst?: number
  total_gst?: number
  is_intra_state?: boolean
  place_of_supply?: string
  gstin?: string
  company_name?: string
  total: number
  payment_method?: string
  payment_status: string
  created_at: string
  address_snapshot: {
    name: string; phone: string; line1: string; line2?: string
    city: string; state: string; pincode: string
  }
  order_items?: {
    id: string; snapshot_name: string; snapshot_price: number
    snapshot_size?: string; snapshot_colour?: string
    snapshot_image_url?: string; quantity: number
  }[]
}

export interface OrderQuote {
  subtotal: number
  discount: number
  taxable_value: number
  total_gst: number
  cgst: number
  sgst: number
  igst: number
  intra_state: boolean
  place_of_supply?: string
  shipping: number
  cod_fee: number
  total: number
  coupon_error?: string | null
}

export const ordersApi = {
  create: (data: {
    address_id: string
    coupon_code?: string
    payment_method: string
    gst_invoice?: boolean
    company_name?: string
    gstin?: string
  }) => api.post<Order>('/orders', data),

  // Authoritative price + GST preview for the checkout summary.
  quote: (data: {
    address_id?: string
    coupon_code?: string
    payment_method: string
  }) => api.post<OrderQuote>('/orders/quote', data),

  getMyOrders: () => api.get<Order[]>('/orders/my'),
  getById: (id: string) => api.get<Order>(`/orders/${id}`),
  getInvoice: (id: string) => api.get<string>(`/orders/${id}/invoice`),
}
