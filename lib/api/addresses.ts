import api from './client'

export interface Address {
  id: string
  name: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  is_default: boolean
}

export const addressesApi = {
  getAll: () => api.get<Address[]>('/addresses'),
  create: (data: Omit<Address, 'id' | 'is_default'>) => api.post<Address>('/addresses', data),
  update: (id: string, data: Partial<Address>) => api.patch<Address>(`/addresses/${id}`, data),
  remove: (id: string) => api.delete(`/addresses/${id}`),
  setDefault: (id: string) => api.patch(`/addresses/${id}/default`, {}),
}
