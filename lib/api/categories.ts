import api from './client'

export interface Category {
  id: string
  name: string
  slug: string
  image_url?: string
  sort_order: number
  is_active: boolean
}

export const categoriesApi = {
  getAll: () => api.get<Category[]>('/categories'),
  getBySlug: (slug: string) => api.get<Category>(`/categories/${slug}`),
}
