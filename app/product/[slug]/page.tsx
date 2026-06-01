import ProductDetailClient from './ProductDetailClient'

// Pre-render all product pages at build time by fetching slugs from the API.
// Falls back to empty array gracefully when no products exist yet.
export async function generateStaticParams() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-73aa.up.railway.app'
    const res = await fetch(`${apiUrl}/products?limit=200`, { cache: 'no-store' })
    if (!res.ok) return []
    const json = await res.json()
    const products: Array<{ slug: string }> = json.data?.data || []
    return products.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  return <ProductDetailClient slug={params.slug} />
}
