import api from './client'

export const couponsApi = {
  validate: (code: string, order_value: number) =>
    api.post<{ valid: boolean; type: string; value: number; discount_amount: number; message?: string }>(
      '/coupons/validate',
      { code, order_value }
    ),
}
