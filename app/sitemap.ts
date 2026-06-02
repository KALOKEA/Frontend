import type { MetadataRoute } from 'next'
import { getAllProductSlugs, getAllCategorySlugs } from '@/lib/server/productsServer'

// Generated to /sitemap.xml at build (works with output:'export').
// Product + category URLs are fetched from the backend during `next build`.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kalokea.pages.dev'

// Required for output:'export' — sitemap must be fully static.
export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes = ['', 'shop', 'about', 'contact', 'shipping', 'returns', 'size-guide', 'privacy', 'terms']
    .map((path) => ({
      url: `${SITE_URL}/${path ? path + '/' : ''}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: path === '' ? 1 : 0.6,
    }))

  const [slugs, categories] = await Promise.all([getAllProductSlugs(), getAllCategorySlugs()])

  const productRoutes = slugs.map((slug) => ({
    url: `${SITE_URL}/product/${slug}/`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const categoryRoutes = categories.map((slug) => ({
    url: `${SITE_URL}/shop/?category=${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...categoryRoutes, ...productRoutes]
}
