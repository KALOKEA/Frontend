import api from './client'

export interface Order {
  id: string
  order_number: string
  status: string
  subtotal: number
  discount: number
  shipping: number
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

export const ordersApi = {
  create: (data: {
    address_id: string
    coupon_code?: string
    payment_method: string
    gst_invoice?: boolean
    company_name?: string
    gstin?: string
  }) => api.post<Order>('/orders', data),

  getMyOrders: () => api.get<Order[]>('/orders/my'),
  getById: (id: string) => api.get<Order>(`/orders/${id}`),
}
