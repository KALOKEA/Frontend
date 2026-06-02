import type { Metadata } from 'next'
import ProductDetailClient from '../ProductDetailClient'
import { getAllProductSlugs, getProductBySlug } from '@/lib/server/productsServer'
import { productMeta } from '@/lib/utils/seo'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kalokea.pages.dev'

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs()
  // output:'export' requires at least one param to prerender this dynamic route.
  // If the catalog is empty (or the backend is unreachable at build time), emit
  // a single placeholder so the build still succeeds — it renders a graceful
  // "not found" page. Real products replace it on the next rebuild.
  if (slugs.length === 0) return [{ slug: 'coming-soon' }]
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  if (!product) return { title: 'Product not found | KALOKEA', robots: { index: false } }
  const meta = productMeta(product)
  const canonical = `${SITE_URL}/product/${product.slug}/`
  return {
    ...meta,
    alternates: { canonical },
    openGraph: { ...meta.openGraph, url: canonical, type: 'website' },
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug)

  // Graceful fallback (no notFound() — safer under static export).
  if (!product) {
    return (
      <div className="text-center py-24">
        <h1 className="font-serif text-3xl text-[#0a0a0a] mb-2">Product not found</h1>
        <p className="text-sm font-sans text-[#6b6b6b]">This product may no longer be available.</p>
      </div>
    )
  }

  const img =
    product.product_images?.find((i) => i.is_primary)?.url ||
    product.product_images?.[0]?.url
  const inStock = (product.product_variants || []).some((v) => v.is_active && v.stock > 0)

  // Product structured data so Google can show rich results (price, availability).
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description || `Shop ${product.name} at Kalokea`,
    image: img ? [img] : [],
    ...(product.categories ? { category: product.categories.name } : {}),
    brand: { '@type': 'Brand', name: 'KALOKEA' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      // base_price is paise; schema wants major currency units.
      price: (product.base_price / 100).toFixed(2),
      availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `${SITE_URL}/product/${product.slug}/`,
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* initialProduct => content is in the static HTML for SEO; the client
          component stays interactive (variants, cart, wishlist, reviews). */}
      <ProductDetailClient slug={product.slug} initialProduct={product} />
    </>
  )
}
