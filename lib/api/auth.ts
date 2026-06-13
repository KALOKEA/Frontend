import api from './client'

export const authApi = {
  sendOtp: (data: { phone?: string; email?: string }) =>
    api.post<{ message: string }>('/auth/send-otp', data),

  verifyOtp: (data: { phone?: string; email?: string; otp: string; accepted_terms?: boolean; name?: string }) =>
    api.post<{ access_token: string; user: { id: string; name?: string; role: string } }>('/auth/verify-otp', data),

  refresh: () =>
    api.post<{ access_token: string }>('/auth/refresh'),

  logout: () => api.post('/auth/logout'),

  me: () => api.get<{ id: string; name?: string; email?: string; phone?: string; role: string }>('/auth/me'),
}

export const twoFactorApi = {
  status: () =>
    api.get<{ enabled: boolean }>('/auth/2fa/status'),

  setup: () =>
    api.post<{ qr_code: string; secret: string; backup_codes: string[] }>('/auth/2fa/setup', {}),

  enable: (token: string) =>
    api.post<{ message: string }>('/auth/2fa/enable', { token }),

  disable: (token: string) =>
    api.post<{ message: string }>('/auth/2fa/disable', { token }),
}
