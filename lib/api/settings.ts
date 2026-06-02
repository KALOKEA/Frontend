import api from './client'

export interface StoreSettings {
  seller_name: string
  seller_address: string
  seller_gstin: string
  seller_state: string
  gst_rate: number
  admin_email: string
}

export interface GstReport {
  period: string
  gst_rate: number
  orders: number
  gross_sales: number
  net_value: number
  total_gst: number
  cgst: number
  sgst: number
  igst: number
}

export const settingsApi = {
  get: () => api.get<StoreSettings>('/settings'),
  update: (data: Partial<StoreSettings>) => api.put<StoreSettings>('/settings', data),
  gstReport: (month?: string) =>
    api.get<GstReport>(`/settings/gst-report${month ? `?month=${month}` : ''}`),
}

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir',
  'Ladakh', 'Puducherry', 'Chandigarh', 'Andaman and Nicobar Islands',
  'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep',
] as const
