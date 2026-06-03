import api from './client'

export const paymentsApi = {
  createOrder: (order_id: string) =>
    api.post<{ razorpay_order_id: string; amount: number; currency: string; key_id: string }>(
      '/payments/create-order',
      { order_id }
    ),

  // Admin: refund a paid (Razorpay) or COD order. Amount defaults to the
  // returned item's value when return_id is given, else the full order total.
  refund: (data: { order_id: string; return_id?: string; amount?: number; reason?: string }) =>
    api.post<{ refunded: boolean; amount: number; method?: string; already?: boolean }>(
      '/payments/refund',
      data,
    ),
}
