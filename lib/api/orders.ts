import api, { getText } from './client'

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
  tracking_number?: string
  courier_name?: string
  status_changed_at?: string
  address_snapshot: {
    name: string; phone: string; line1: string; line2?: string
    line?: string; street?: string
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

export interface AddressSnapshot {
  name: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
}

export const ordersApi = {
  create: (data: {
    address_id?: string
    address_snapshot?: AddressSnapshot
    coupon_code?: string
    payment_method: string
    guest_email?: string
    guest_phone?: string
    gst_invoice?: boolean
    company_name?: string
    gstin?: string
    cart_items?: { variant_id: string; quantity: number }[]
    session_id?: string // guest cart session — lets backend use the server cart for stock validation
  }) => api.post<Order>('/orders', data),

  quote: (data: {
    address_id?: string
    address_snapshot?: { state?: string }
    coupon_code?: string
    payment_method: string
    session_id?: string // guest cart session — required when user is not logged in
    cart_items?: { variant_id: string; quantity: number }[] // fallback if server cart is empty
  }) => api.post<OrderQuote>('/orders/quote', data),

  getMyOrders: async (): Promise<Order[]> => {
    const r = await api.get<unknown>('/orders/my')
    // Backend returns { data: Order[], meta: {...} } (paginated), but the client's
    // smart-unwrap keeps the full object when `meta` is present. Unwrap manually.
    return (Array.isArray(r) ? r : (r as any)?.data ?? []) as Order[]
  },
  getById: (id: string) => api.get<Order>(`/orders/${id}`),
  // Invoice returns text/html — use getText() not api.get() (which calls res.json())
  getInvoice: (id: string) => getText(`/orders/${id}/invoice`),
  cancel: (id: string) => api.post<{ message: string }>(`/orders/${id}/cancel`, {}),
}
