import api from './client'

export interface StaffMember {
  id: string
  name?: string
  email?: string
  phone?: string
  role: 'admin' | 'staff'
  permissions: string[]
  created_at: string
}

export const staffApi = {
  list: () => api.get<StaffMember[]>('/users/staff/list'),

  create: (body: { name?: string; email?: string; phone?: string; permissions: string[] }) =>
    api.post<StaffMember>('/users/staff', body),

  update: (id: string, body: { name?: string; permissions?: string[] }) =>
    api.patch<StaffMember>(`/users/staff/${id}`, body),

  revoke: (id: string) => api.delete<{ message: string }>(`/users/staff/${id}`),
}
