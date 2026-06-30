import api from './client'

export interface BestOffer {
  code: string
  type: 'percent' | 'fixed'
  value: number
  discount: number      // paise off this item
  final_price: number   // paise after the discount
}

export const couponsApi = {
  /**
   * Validate a coupon code against an order value.
   * Pass user_id for logged-in users or guest_email for guests so the
   * backend can enforce per-user caps and new_users_only restrictions
   * at the preview step (not only at order placement).
   */
  validate: (
    code: string,
    order_value: number,
    userId?: string | null,
    guestEmail?: string | null,
  ) =>
    api.post<{ valid: boolean; type: string; value: number; discount_amount: number; message?: string }>(
      '/coupons/validate',
      {
        code,
        order_value,
        ...(userId ? { user_id: userId } : {}),
        ...(guestEmail ? { guest_email: guestEmail } : {}),
      }
    ),

  /** Best featured coupon applied to a single item at `price` (paise). */
  bestOffer: (price: number) =>
    api.get<{ best: BestOffer | null }>(`/coupons/best-offer?price=${price}`),
}
