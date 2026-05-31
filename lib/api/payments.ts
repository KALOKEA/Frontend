import api from './client'

export const paymentsApi = {
  createOrder: (order_id: string) =>
    api.post<{ razorpay_order_id: string; amount: number; currency: string; key_id: string }>(
      '/payments/create-order',
      { order_id }
    ),
}
