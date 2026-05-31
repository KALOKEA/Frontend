import api from './client'

export const adminApi = {
  getDashboard: () => api.get<{
    revenue_this_month: number
    orders_this_month: number
    new_customers: number
    pending_orders: number
    low_stock_count: number
  }>('/admin/dashboard'),
  getRecentOrders: () => api.get<{ id: string; order_number: string; status: string; total: number; created_at: string; users?: { name?: string } }[]>('/admin/orders/recent'),
  getTopProducts: () => api.get<{ product_id: string; total_revenue: number; products: { name: string } }[]>('/admin/products/top'),
}
