import type { MetadataRoute } from 'next'

// Generated to /robots.txt at build (works with output:'export').
// Note: public/robots.txt (static file) overrides this at runtime on Cloudflare Pages.
// Keep both in sync. This file is used by build tooling; public/robots.txt is served.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kalokea.com'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Keep transactional / private areas out of the index.
      // Trailing slashes ensure all sub-paths are matched correctly.
      disallow: ['/admin/', '/account/', '/checkout/', '/cart/', '/login/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
