import api from './client'

export interface BestOffer {
  code: string
  type: 'percent' | 'fixed'
  value: number
  discount: number      // paise off this item
  final_price: number   // paise after the discount
}

export const couponsApi = {
  validate: (code: string, order_value: number) =>
    api.post<{ valid: boolean; type: string; value: number; discount_amount: number; message?: string }>(
      '/coupons/validate',
      { code, order_value }
    ),

  /** Best featured coupon applied to a single item at `price` (paise). */
  bestOffer: (price: number) =>
    api.get<{ best: BestOffer | null }>(`/coupons/best-offer?price=${price}`),
}
