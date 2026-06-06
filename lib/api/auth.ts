import api from './client'

export const authApi = {
  sendOtp: (data: { phone?: string; email?: string }) =>
    api.post<{ message: string }>('/auth/send-otp', data),

  verifyOtp: (data: { phone?: string; email?: string; otp: string; accepted_terms?: boolean }) =>
    api.post<{ access_token: string; user: { id: string; name?: string; role: string } }>('/auth/verify-otp', data),

  refresh: () =>
    api.post<{ access_token: string }>('/auth/refresh'),

  logout: () => api.post('/auth/logout'),

  me: () => api.get<{ id: string; name?: string; email?: string; phone?: string; role: string }>('/auth/me'),
}
