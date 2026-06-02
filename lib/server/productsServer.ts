/**
 * Build-time data fetching for static product pages.
 *
 * Used by app/product/[slug]/page.tsx (generateStaticParams / generateMetadata /
 * the page itself). Plain fetch against the Railway API — runs at `next build`,
 * so the backend must be reachable during the build. All helpers fail soft
 * (return [] / null) so a transient backend hiccup never aborts the whole build.
 *
 * NOTE: responses are wrapped by the backend TransformInterceptor as { data: ... }.
 */
import type { Product } from '@/lib/api/products'

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-73aa.up.railway.app'

async function unwrap<T>(res: Response): Promise<T | null> {
  if (!res.ok) return null
  const json = await res.json()
  return (json.data !== undefined ? json.data : json) as T
}

export async function getAllProductSlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${BASE_URL}/products?limit=1000`)
    const payload = await unwrap<{ data: Product[] }>(res)
    return (payload?.data || []).map((p) => p.slug).filter(Boolean)
  } catch {
    return []
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${BASE_URL}/products/${slug}`)
    return await unwrap<Product>(res)
  } catch {
    return null
  }
}
