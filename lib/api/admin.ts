import api from './client'

// ---- Dashboard / analytics ------------------------------------------------
export interface DashboardStats {
  revenue_this_month: number
  orders_this_month: number
  new_customers: number
  pending_orders: number
  low_stock_variants?: { id: string; sku: string; stock: number; products?: { name: string } }[]
  // legacy field kept for the existing dashboard card
  low_stock_count?: number
}

export interface AdminOrder {
  id: string
  order_number: string
  status: string
  payment_status?: string
  payment_method?: string
  total: number
  created_at: string
  address_snapshot?: any
  order_items?: any[]
  users?: { name?: string; email?: string }
}

export interface TopProduct {
  name: string
  revenue: number
  units: number
}

export interface Coupon {
  id: string
  code: string
  type: 'percent' | 'fixed'
  value: number
  min_order_value?: number
  max_uses?: number
  used_count?: number
  valid_until?: string
  is_active: boolean
}

export interface AdminCustomer {
  id: string
  name?: string
  email?: string
  phone?: string
  role: string
  created_at: string
}

export interface PendingReview {
  id: string
  rating: number
  title?: string
  comment?: string
  created_at: string
  users?: { name?: string }
  products?: { name?: string }
}

export interface ReturnRequest {
  id: string
  order_id: string
  reason?: string
  status: string
  admin_notes?: string
  created_at: string
  orders?: { order_number?: string }
  users?: { name?: string; email?: string }
}

export interface Banner {
  id: string
  title: string
  image_url: string
  link_url?: string
  position: 'hero' | 'mid' | 'footer'
  is_active: boolean
  sort_order?: number
}

export const adminApi = {
  // dashboard
  getDashboard: () => api.get<DashboardStats>('/admin/dashboard'),
  getRecentOrders: () => api.get<AdminOrder[]>('/admin/orders/recent'),
  getTopProducts: () => api.get<TopProduct[]>('/admin/products/top'),

  // orders
  listOrders: (page = 1, limit = 20) =>
    api.get<{ data: AdminOrder[]; meta: { total: number; page: number; limit: number } }>(
      `/orders?page=${page}&limit=${limit}`,
    ),
  updateOrderStatus: (id: string, body: { status: string; tracking_number?: string; courier_name?: string }) =>
    api.patch(`/orders/${id}/status`, body),

  // inventory (variants)
  updateVariant: (id: string, body: { stock?: number; price?: number; is_active?: boolean }) =>
    api.patch(`/variants/${id}`, body),

  // coupons
  listCoupons: () => api.get<Coupon[]>('/coupons'),
  createCoupon: (body: Partial<Coupon>) => api.post<Coupon>('/coupons', body),
  toggleCoupon: (id: string) => api.patch(`/coupons/${id}/toggle`),

  // banners
  listBanners: () => api.get<Banner[]>('/banners/admin'),
  createBanner: (body: Partial<Banner>) => api.post<Banner>('/banners', body),
  updateBanner: (id: string, body: Partial<Banner>) => api.patch(`/banners/${id}`, body),
  removeBanner: (id: string) => api.delete(`/banners/${id}`),

  // customers
  listCustomers: (page = 1, limit = 20) =>
    api.get<{ data: AdminCustomer[]; meta: { total: number; page: number; limit: number } }>(
      `/users?page=${page}&limit=${limit}`,
    ),

  // reviews
  listPendingReviews: () => api.get<PendingReview[]>('/reviews/pending'),
  approveReview: (id: string) => api.patch(`/reviews/${id}/approve`),
  rejectReview: (id: string) => api.delete(`/reviews/${id}/reject`),

  // returns
  listReturns: () => api.get<ReturnRequest[]>('/returns'),
  updateReturnStatus: (id: string, body: { status: string; admin_notes?: string }) =>
    api.patch(`/returns/${id}/status`, body),
}
