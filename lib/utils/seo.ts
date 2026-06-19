import type { Product } from '@/lib/api/products'
import type { Category } from '@/lib/api/categories'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kalokea.in'

export function productMeta(product: Product) {
  const img = product.product_images?.find((i) => i.is_primary)?.url
  const catName = product.categories?.name || ''
  const desc = (product.description || `Shop ${product.name} at Kalokea`).slice(0, 155)

  // Per-product keywords: name + category + buying intent
  const baseKw = product.name.toLowerCase()
  const keywords = [
    baseKw,
    catName ? `${baseKw} ${catName.toLowerCase()}` : '',
    catName ? `buy ${catName.toLowerCase()} india` : '',
    `${baseKw} online india`,
    `${baseKw} kalokea`,
    catName ? `women's ${catName.toLowerCase()} india` : '',
    catName ? `${catName.toLowerCase()} for women india` : '',
    "women's fashion india",
    'kalokea fashion',
    `${baseKw} price india`,
    `buy ${baseKw} online`,
  ].filter(Boolean).join(', ')

  const priceRupees = (product.base_price / 100).toFixed(2)

  return {
    title: `${product.name} — ${catName || 'Kalokea'} | KALOKEA`,
    description: desc,
    keywords,
    openGraph: {
      title: product.name,
      description: desc,
      type: 'website' as const,
      images: img
        ? [{ url: img, width: 800, height: 1067, alt: `${product.name} — Kalokea` }]
        : [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: 'Kalokea Fashion' }],
    },
    // Pinterest Product Rich Pins — price + availability signals
    other: {
      'product:price:amount': priceRupees,
      'product:price:currency': 'INR',
      ...(catName ? { 'product:category': catName } : {}),
    },
  }
}

export function categoryMeta(category: Category) {
  return {
    title: `${category.name} | Women's Fashion India | KALOKEA`,
    description: `Shop the latest women's ${category.name.toLowerCase()} at Kalokea. Curated collection, premium quality. Free shipping above ₹999.`,
  }
}
