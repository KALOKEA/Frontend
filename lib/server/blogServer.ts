/**
 * Build-time data fetching for the admin-managed blog (static export).
 *
 * The storefront keeps its original hand-written articles (in lib/blog/posts.ts
 * + their own folders) AND renders any posts created in the admin panel, which
 * live in the `blog_posts` table and are fetched here at `next build`.
 *
 * All helpers fail soft (return [] / null) so a transient backend hiccup never
 * aborts the whole site build. Responses are wrapped by the backend
 * TransformInterceptor as { data: ... }.
 */
import type { BlogPost } from '@/lib/api/blog'
import { BASE_URL } from '@/lib/api/client'

async function unwrap<T>(res: Response): Promise<T | null> {
  if (!res.ok) return null
  const json = await res.json()
  return (json.data !== undefined && json.meta === undefined ? json.data : json) as T
}

/** All published posts authored in the admin panel (newest first). */
export async function getDbPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${BASE_URL}/blog`)
    const posts = await unwrap<BlogPost[]>(res)
    return Array.isArray(posts) ? posts : []
  } catch {
    return []
  }
}

/** A single published post by slug. */
export async function getDbPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${BASE_URL}/blog/${encodeURIComponent(slug)}`)
    return await unwrap<BlogPost>(res)
  } catch {
    return null
  }
}

/**
 * Sanitise admin-authored HTML before it is rendered into a static page.
 * Blog content can be created by staff with the 'blog' permission, so we strip
 * the obvious stored-XSS vectors (scripts, styles, iframes, inline event
 * handlers and javascript: URLs). Runs at build time on the server.
 */
export function sanitiseHtml(html: string | undefined | null): string {
  if (!html) return ''
  return html
    // Remove whole <script>/<style>/<iframe>/<object>/<embed> blocks.
    .replace(/<\s*(script|style|iframe|object|embed)\b[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, '')
    // Remove any stray self-closing/opening of those tags.
    .replace(/<\s*\/?\s*(script|style|iframe|object|embed)\b[^>]*>/gi, '')
    // Strip inline event handlers: on*="..." / on*='...' / on*=value
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/\son\w+\s*=\s*'[^']*'/gi, '')
    .replace(/\son\w+\s*=\s*[^\s>]+/gi, '')
    // Neutralise javascript: in href/src.
    .replace(/(href|src)\s*=\s*"\s*javascript:[^"]*"/gi, '$1="#"')
    .replace(/(href|src)\s*=\s*'\s*javascript:[^']*'/gi, "$1='#'")
}
