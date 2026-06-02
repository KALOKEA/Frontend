import api from './client'

export const RETURN_REASONS = [
  'Wrong size',
  'Damaged',
  'Wrong item',
  'Quality issue',
  'Changed mind',
  'Other',
] as const

export interface ReturnRequest {
  id: string
  order_id: string
  reason: string
  status: string
  admin_notes?: string
  created_at: string
}

export const returnsApi = {
  create: (data: { order_id: string; order_item_id?: string; reason: string }) =>
    api.post<ReturnRequest>('/returns', data),
  getMy: () => api.get<ReturnRequest[]>('/returns/my'),
}
