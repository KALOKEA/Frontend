import api, { getAccessToken } from './client'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-73aa.up.railway.app'

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
  max_per_user?: number
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

export interface CustomerDetail {
  user: AdminCustomer
  orders: { id: string; order_number: string; status: string; payment_status: string; total: number; created_at: string }[]
  stats: { total_orders: number; total_spent: number; last_order_at: string | null }
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

export interface MonthlyStats {
  month: string   // YYYY-MM
  revenue: number // paise
  orders: number
}

export interface AllReview {
  id: string
  rating: number
  title?: string
  comment?: string
  is_approved: boolean
  flagged?: boolean
  flag_reason?: string
  admin_reply?: string
  admin_replied_at?: string
  created_at: string
  users?: { name?: string }
  products?: { name?: string; slug?: string }
}

export interface ActivityLogEntry {
  id: string
  action: string
  entity_type: string
  entity_id?: string
  details?: { method: string; path: string; body_keys: string[] }
  created_at: string
  users?: { name?: string; email?: string }
}

export const adminApi = {
  // dashboard
  getDashboard: () => api.get<DashboardStats>('/admin/dashboard'),
  getRecentOrders: () => api.get<AdminOrder[]>('/admin/orders/recent'),
  getTopProducts: () => api.get<TopProduct[]>('/admin/products/top'),

  // orders
  listOrders: (page = 1, limit = 20, status?: string, search?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (status) params.set('status', status)
    if (search) params.set('search', search)
    return api.get<{ data: AdminOrder[]; meta: { total: number; page: number; limit: number } }>(
      `/orders?${params.toString()}`,
    )
  },
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

  // customers / user management
  listCustomers: (page = 1, limit = 20) =>
    api.get<{ data: AdminCustomer[]; meta: { total: number; page: number; limit: number } }>(
      `/users?page=${page}&limit=${limit}`,
    ),
  searchCustomers: (q: string) => api.get<AdminCustomer[]>(`/users/search?q=${encodeURIComponent(q)}`),
  getCustomerDetail: (id: string) => api.get<CustomerDetail>(`/users/${id}/detail`),
  createUser: (body: { name?: string; email?: string; phone?: string; role?: string }) =>
    api.post<AdminCustomer>('/users', body),
  updateUser: (id: string, body: { name?: string; email?: string; phone?: string; role?: string }) =>
    api.patch<AdminCustomer>(`/users/${id}`, body),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
  // 1-click download of ALL customer data as CSV
  exportCustomers: async () => {
    const res = await fetch(`${BASE_URL}/users/export`, {
      headers: getAccessToken() ? { Authorization: `Bearer ${getAccessToken()}` } : {},
      credentials: 'include',
    })
    if (!res.ok) throw new Error(`Export failed (${res.status})`)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kalokea-customers-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  },

  // orders CSV export
  exportOrders: async (filters: { status?: string; from?: string; to?: string } = {}) => {
    const params = new URLSearchParams()
    if (filters.status) params.set('status', filters.status)
    if (filters.from)   params.set('from', filters.from)
    if (filters.to)     params.set('to', filters.to)
    const res = await fetch(
      `${BASE_URL}/orders/export${params.toString() ? '?' + params : ''}`,
      { headers: getAccessToken() ? { Authorization: `Bearer ${getAccessToken()}` } : {}, credentials: 'include' }
    )
    if (!res.ok) throw new Error(`Export failed (${res.status})`)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kalokea-orders-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(url)
  },

  // monthly stats
  getMonthlyStats: (months = 6) => api.get<MonthlyStats[]>(`/admin/monthly-stats?months=${months}`),

  // coupons
  updateCoupon: (id: string, body: Partial<Coupon>) => api.patch(`/coupons/${id}`, body),

  // reviews
  listPendingReviews: () => api.get<PendingReview[]>('/reviews/pending'),
  listAllReviews: (page = 1, limit = 30, rating?: number, sort?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (rating) params.set('rating', String(rating))
    if (sort) params.set('sort', sort)
    return api.get<{ data: AllReview[]; meta: { total: number; page: number; limit: number; total_pages: number } }>(
      `/reviews/admin/all?${params}`,
    )
  },
  approveReview: (id: string) => api.patch(`/reviews/${id}/approve`),
  rejectReview: (id: string) => api.delete(`/reviews/${id}/reject`),
  replyToReview: (id: string, reply: string) => api.post(`/reviews/${id}/reply`, { reply }),
  flagReview: (id: string, flagged: boolean, flagReason?: string) =>
    api.post(`/reviews/${id}/flag`, { flagged, flag_reason: flagReason }),

  // returns
  listReturns: () => api.get<ReturnRequest[]>('/returns'),
  updateReturnStatus: (id: string, body: { status: string; admin_notes?: string }) =>
    api.patch(`/returns/${id}/status`, body),

  // activity log
  listActivityLog: (page = 1, limit = 50, action?: string, entityType?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (action) params.set('action', action)
    if (entityType) params.set('entity_type', entityType)
    return api.get<{ data: ActivityLogEntry[]; meta: { total: number; page: number; limit: number; total_pages: number } }>(
      `/admin/activity-log?${params}`,
    )
  },

  // newsletter
  getNewsletterStats: () => api.get<{ total_subscribers: number; active_subscribers: number; unsubscribed: number; total_campaigns: number }>('/newsletter/admin/stats'),
  sendNewsletterCampaign: (subject: string, body: string, preview_text?: string) =>
    api.post<{ sent: number; failed: number; message: string }>('/newsletter/admin/send-campaign', { subject, body, preview_text }),
  listNewsletterCampaigns: (page = 1, limit = 20) =>
    api.get<{ data: any[]; meta: { total: number; page: number; limit: number; total_pages: number } }>(
      `/newsletter/admin/campaigns?page=${page}&limit=${limit}`,
    ),
  listNewsletterSubscribers: (page = 1, limit = 50, active?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (active !== undefined) params.set('active', active)
    return api.get<{ data: any[]; meta: { total: number; page: number; limit: number; total_pages: number } }>(
      `/newsletter/admin/subscribers?${params}`,
    )
  },
  exportNewsletterSubscribers: async () => {
    const res = await fetch(`${BASE_URL}/newsletter/admin/export`, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        ...(getAccessToken() ? { Authorization: `Bearer ${getAccessToken()}` } : {}),
      },
      credentials: 'include',
    })
    if (!res.ok) throw new Error(`Export failed (${res.status})`)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kalokea-subscribers-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a); a.click(); a.remove()
    URL.revokeObjectURL(url)
  },

  // email log
  getEmailLog: (page = 1, limit = 50, status?: string, emailType?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (status) params.set('status', status)
    if (emailType) params.set('email_type', emailType)
    return api.get<{ data: any[]; meta: { total: number; page: number; limit: number; total_pages: number } }>(
      `/admin/email-log?${params}`,
    )
  },
  getEmailLogEntry: (id: string) => api.get<any>(`/admin/email-log/${id}`),
  resendEmail: (id: string) => api.post<{ message: string }>(`/admin/email-log/${id}/resend`, {}),

  // analytics extended
  getClv: () => api.get<{ avg_clv: number; total_paying_customers: number; total_revenue: number }>('/admin/analytics/clv'),
  getConversionRate: () => api.get<{ conversion_rate: number; total_users: number; unique_buyers: number }>('/admin/analytics/conversion-rate'),
  getSalesByCategory: () => api.get<{ category: string; revenue: number; units: number }[]>('/admin/analytics/sales-by-category'),

  // order detail
  getOrderDetail: (id: string) =>
    api.get<any>(`/orders/${id}`),
  refundOrder: (orderId: string, body: { amount?: number; reason?: string }) =>
    api.post<any>(`/payments/refund`, { order_id: orderId, ...body }),

  // shiprocket
  pushToShiprocket: (orderId: string, body: { weight?: number; length?: number; breadth?: number; height?: number; courier_id?: number }) =>
    api.post<{ shiprocket_order_id: number; shiprocket_shipment_id: number; awb_code: string | null; courier_name: string | null }>(
      `/shiprocket/orders/${orderId}/push`, body
    ),
  assignAwb: (orderId: string, courierId?: number) =>
    api.post<{ awb_code: string; courier_name: string }>(`/shiprocket/orders/${orderId}/awb`, { courier_id: courierId }),
  generateLabel: (orderId: string) =>
    api.post<{ label_url: string }>(`/shiprocket/orders/${orderId}/label`, {}),
  schedulePickup: (orderId: string) =>
    api.post<any>(`/shiprocket/orders/${orderId}/pickup`, {}),
  trackShipment: (orderId: string) =>
    api.get<any>(`/shiprocket/orders/${orderId}/track`),
  cancelShipment: (orderId: string) =>
    api.post<any>(`/shiprocket/orders/${orderId}/cancel`, {}),
  getServiceability: (pincode: string) =>
    api.get<any>(`/shiprocket/serviceability/${pincode}`),
  generateManifest: (shipmentIds: number[]) =>
    api.post<{ manifest_url: string | null }>(`/shiprocket/manifest`, { shipment_ids: shipmentIds }),
  syncTracking: () =>
    api.post<{ updated: number }>(`/shiprocket/sync-tracking`, {}),
  getNdrs: () =>
    api.get<any>(`/shiprocket/ndrs`),
  ndrAction: (shipmentId: string, action: 'reAttempt' | 'return', comment?: string) =>
    api.post<any>(`/shiprocket/ndrs/${shipmentId}/action`, { action, comment }),
  createReturnPickup: (orderId: string) =>
    api.post<any>(`/shiprocket/orders/${orderId}/return`, {}),
  getCodRemittance: () =>
    api.get<any>(`/shiprocket/remittance`),
  getPackagingProfiles: () =>
    api.get<any[]>(`/shiprocket/packaging-profiles`),
  createPackagingProfile: (body: { name: string; weight: number; length: number; breadth: number; height: number; is_default?: boolean }) =>
    api.post<any>(`/shiprocket/packaging-profiles`, body),
  deletePackagingProfile: (id: string) =>
    api.delete<any>(`/shiprocket/packaging-profiles/${id}`),
  setDefaultPackagingProfile: (id: string) =>
    api.patch<any>(`/shiprocket/packaging-profiles/${id}/default`, {}),
}
