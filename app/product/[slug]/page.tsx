import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductDetailClient from '../ProductDetailClient'
import { getAllProductSlugs, getProductBySlug } from '@/lib/server/productsServer'
import { productMeta } from '@/lib/utils/seo'

// Only slugs returned by generateStaticParams are built; anything else 404s
// (required for output:'export' — there is no server to render unknown slugs).
export const dynamicParams = false

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kalokea.pages.dev'

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)
  if (!product) return { title: 'Product not found | KALOKEA' }
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
  if (!product) notFound()

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
