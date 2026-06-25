import api from './client'

export interface BlogPost {
  id: string
  slug: string
  title: string
  heading?: string
  heading_italic?: string
  eyebrow?: string
  excerpt?: string
  description?: string
  content?: string
  cover_image?: string
  keywords?: string[]
  reading_time?: string
  author?: string
  status?: 'draft' | 'published'
  published_at?: string | null
  created_at?: string
  updated_at?: string
}

export interface BlogPostInput {
  title: string
  slug?: string
  heading?: string
  heading_italic?: string
  eyebrow?: string
  excerpt?: string
  description?: string
  content?: string
  cover_image?: string
  keywords?: string[]
  reading_time?: string
  author?: string
  status?: 'draft' | 'published'
}

export const blogApi = {
  // Public (storefront)
  listPublished: () => api.get<BlogPost[]>('/blog'),
  getBySlug: (slug: string) => api.get<BlogPost>(`/blog/${slug}`),

  // Admin
  listAll: () => api.get<BlogPost[]>('/blog/admin/all'),
  getOne: (id: string) => api.get<BlogPost>(`/blog/admin/${id}`),
  create: (body: BlogPostInput) => api.post<BlogPost>('/blog', body),
  update: (id: string, body: Partial<BlogPostInput>) => api.patch<BlogPost>(`/blog/${id}`, body),
  remove: (id: string) => api.delete<{ message: string }>(`/blog/${id}`),
}
