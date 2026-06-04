import api from './client'

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  parent_id?: string
  sort_order: number
  is_active: boolean
  created_at?: string
}

export const categoriesApi = {
  getAll: () => api.get<Category[]>('/categories'),
  getBySlug: (slug: string) => api.get<Category>(`/categories/${slug}`),
  // Admin
  getAllAdmin: () => api.get<Category[]>('/categories/admin/all'),
  create: (data: Partial<Category>) => api.post<Category>('/categories', data),
  update: (id: string, data: Partial<Category>) => api.patch<Category>(`/categories/${id}`, data),
  remove: (id: string) => api.delete(`/categories/${id}`),
}
