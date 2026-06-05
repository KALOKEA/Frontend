import type { Metadata } from 'next'
import CategoryShopClient from '@/components/shop/CategoryShopClient'

interface Props {
  params: { category: string }
}

// ── SEO metadata per category ─────────────────────────────────────────────────

const CATEGORY_META: Record<string, { name: string; title: string; description: string }> = {
  'new-arrivals': {
    name: 'New Arrivals',
    title: "New Arrivals — Latest Women's Fashion | Kalokea",
    description: "Shop the newest women's fashion at Kalokea. Fresh arrivals in dresses, tops, bottoms and more — discover your next favourite piece.",
  },
  dresses: {
    name: 'Dresses',
    title: "Women's Dresses — Casual to Formal | Kalokea",
    description: "Explore Kalokea's women's dress collection — everyday casuals to elegant evening wear. Timeless silhouettes in premium fabrics.",
  },
  tops: {
    name: 'Tops',
    title: "Women's Tops — Blouses, Shirts & Tees | Kalokea",
    description: "Shop women's tops at Kalokea. Curated blouses, shirts and tees in quality fabrics for every occasion.",
  },
  bottoms: {
    name: 'Bottoms',
    title: "Women's Bottoms — Skirts, Trousers & More | Kalokea",
    description: "Discover Kalokea's women's bottoms — skirts, trousers, palazzos and more. Effortless style with everyday comfort.",
  },
  shoes: {
    name: 'Shoes',
    title: "Women's Shoes — Heels, Flats & Sandals | Kalokea",
    description: "Complete your look with Kalokea's women's shoe collection. Heels, flats, sandals — crafted for style and comfort.",
  },
  bags: {
    name: 'Bags',
    title: "Women's Bags — Handbags & Clutches | Kalokea",
    description: "Shop Kalokea's handbag collection — totes, clutches, crossbody bags and more. The perfect finishing touch to any outfit.",
  },
  accessories: {
    name: 'Accessories',
    title: "Women's Accessories — Jewellery & More | Kalokea",
    description: "Browse Kalokea's accessories — jewellery, scarves, belts and more. Elevate every look with the right detail.",
  },
  sale: {
    name: 'Sale',
    title: "Women's Fashion Sale — Up to 50% Off | Kalokea",
    description: "Shop Kalokea's sale for the best deals on women's fashion. Dresses, tops, shoes and more at unbeatable prices.",
  },
  everything: {
    name: 'Everything',
    title: "Shop All Women's Fashion | Kalokea",
    description: "Browse Kalokea's complete women's fashion collection — dresses, tops, bottoms, shoes, bags and accessories.",
  },
}

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-73aa.up.railway.app'

// ── Static params (runs at build time on Cloudflare Pages) ────────────────────

export async function generateStaticParams(): Promise<{ category: string }[]> {
  try {
    const res = await fetch(`${BACKEND_URL}/categories`, { next: { revalidate: 3600 } })
    if (!res.ok) throw new Error('API unavailable')
    const data = await res.json()
    const cats: { slug: string }[] = Array.isArray(data) ? data : (data.data ?? data.categories ?? [])
    if (!cats.length) throw new Error('empty')
    return cats.map((c) => ({ category: c.slug }))
  } catch {
    // Fallback: hardcoded slugs so the build never fails if Railway is down
    return Object.keys(CATEGORY_META).map((category) => ({ category }))
  }
}

// ── Per-page metadata ─────────────────────────────────────────────────────────

export function generateMetadata({ params }: Props): Metadata {
  const meta = CATEGORY_META[params.category]
  const name = meta?.name ?? params.category.replace(/-/g, ' ')
  const title = meta?.title ?? `${name} — Women's Fashion | Kalokea`
  const description = meta?.description ?? `Shop Kalokea's ${name} collection.`

  return {
    title,
    description,
    openGraph: { title, description, type: 'website', siteName: 'Kalokea' },
    twitter: { card: 'summary_large_image', title, description },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CategoryPage({ params }: Props) {
  const meta = CATEGORY_META[params.category]
  const displayName = meta?.name ?? params.category.replace(/-/g, ' ')
  return <CategoryShopClient category={params.category} displayName={displayName} />
}
