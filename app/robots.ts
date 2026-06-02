import type { MetadataRoute } from 'next'

// Generated to /robots.txt at build (works with output:'export').
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kalokea.pages.dev'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Keep transactional / private areas out of the index.
      disallow: ['/admin', '/account', '/checkout', '/cart', '/login'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
