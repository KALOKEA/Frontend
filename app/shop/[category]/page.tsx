import type { Metadata } from 'next'
import CategoryShopClient from '@/components/shop/CategoryShopClient'

interface Props {
  params: { category: string }
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kalokea.in'
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-73aa.up.railway.app'

// ── SEO metadata per category ─────────────────────────────────────────────────

const CATEGORY_META: Record<string, {
  name: string
  title: string
  description: string
  keywords: string[]
}> = {
  'new-arrivals': {
    name: 'New Arrivals',
    title: "New Arrivals — Latest Women's Fashion 2025 | Kalokea",
    description:
      "Shop the newest women's fashion at Kalokea. Fresh arrivals in dresses, tops, bottoms, shoes and accessories — discover your next favourite piece. New styles added every week.",
    keywords: [
      "new arrivals women's fashion india", "latest women's fashion 2025",
      "new women's clothing online india", "fresh fashion arrivals india",
      "new dresses for women india", "latest tops for women india",
      "new women's collection 2025", "women's new arrivals online",
      "just in women's fashion india", "new women's styles india",
      "latest women's wear india", "shop new arrivals women india",
      "women's fashion new season india", "new in women's clothing",
      "new women's dresses 2025", "women's new collection india",
      "latest arrivals women's boutique india", "fashion new arrivals india",
      "women's trendy new arrivals", "new season fashion india",
      "women's newest styles india", "fresh women's fashion collection",
      "women's must-have new arrivals", "new women's fashion pieces india",
      "women's latest drops india",
    ],
  },
  dresses: {
    name: 'Dresses',
    title: "Women's Dresses Online India — Casual to Formal | Kalokea",
    description:
      "Explore Kalokea's women's dress collection — everyday casuals to elegant evening wear. Maxi dresses, midi dresses, wrap dresses and more in premium fabrics.",
    keywords: [
      "women's dresses online india", 'buy dresses online india',
      "women's dress collection india", 'casual dresses for women india',
      'party dresses for women india', 'evening dresses india',
      'maxi dresses india', 'midi dresses india', 'mini dresses india',
      'summer dresses women india', 'floral dresses for women india',
      'formal dresses women india', 'wrap dresses india',
      'printed dresses for women india', 'cotton dresses for women india',
      'georgette dresses india', 'bodycon dresses india',
      'linen dresses india', "women's festive dresses india",
      'occasion dresses india', 'women\'s a-line dresses online india',
      'shirt dresses for women india', 'boho dresses india',
      "women's sundresses india", "affordable women's dresses india",
      "designer dresses for women india",
    ],
  },
  tops: {
    name: 'Tops',
    title: "Women's Tops Online India — Blouses, Shirts & Tees | Kalokea",
    description:
      "Shop women's tops at Kalokea. Curated blouses, shirts, tees and kurtis in quality fabrics for every occasion — from casual everyday to office-ready.",
    keywords: [
      "women's tops online india", 'buy tops for women india',
      "women's blouses online india", "women's shirts india",
      "women's kurtis online", 'casual tops for women india',
      "women's t-shirts india", 'stylish tops women india',
      'western tops for women india', "women's tank tops india",
      'floral tops women india', "women's sleeveless tops india",
      'printed tops for women india', 'crop tops india',
      'office tops for women india', "women's linen tops india",
      "women's cotton tops india", "women's fashion tops 2025",
      'trendy tops for women india', "women's embroidered tops india",
      'chiffon tops india', "women's formal blouses india",
      "women's boho tops india", 'halter tops women india',
      "women's tunic tops india", 'affordable tops for women india',
    ],
  },
  bottoms: {
    name: 'Bottoms',
    title: "Women's Bottoms Online India — Skirts, Trousers & More | Kalokea",
    description:
      "Discover Kalokea's women's bottoms — skirts, trousers, palazzos, culottes and more. Effortless style with everyday comfort, from casual to formal.",
    keywords: [
      "women's bottoms online india", "women's skirts online india",
      "women's trousers india", "women's palazzos online india",
      "women's jeans india", "women's culottes india",
      'wide-leg pants women india', "women's shorts india",
      "women's leggings india", "women's skirts collection india",
      'midi skirts for women india', 'maxi skirts india',
      "women's formal trousers india", "women's casual pants india",
      "women's ethnic skirts india", 'printed skirts india',
      "women's linen trousers india", "women's joggers india",
      "women's co-ord sets india", "women's high-waist pants india",
      "buy women's skirts india", "women's flare pants india",
      "women's cigarette pants india", "affordable women's bottoms india",
      "women's bottoms collection india",
    ],
  },
  shoes: {
    name: 'Shoes',
    title: "Women's Shoes Online India — Heels, Flats & Sandals | Kalokea",
    description: "Shop women's shoes online in India — heels, flats, sandals & more. Premium quality footwear at Kalokea. Free shipping above ₹999.",
    keywords: [
      "women's shoes online india", "buy women's shoes india",
      "heels for women india", "flats for women india", "sandals for women india",
      "women's footwear india", "women's casual shoes india",
      "women's formal shoes india", "women's shoe collection india",
      "women's party heels india",
    ],
  },
  bags: {
    name: 'Bags',
    title: "Women's Bags & Handbags Online India | Kalokea",
    description:
      "Shop Kalokea's curated women's bag collection — totes, clutches, sling bags, chain bags and more in premium materials.",
    keywords: [
      "women's bags online india", "handbags for women india",
      "tote bags india", "clutch bags india", "sling bags india",
      "women's purse online india", "women's handbag collection india",
      "chain bags india", "women's bag brands india",
    ],
  },
  accessories: {
    name: 'Accessories',
    title: "Women's Accessories Online India — Jewellery, Scarves & More | Kalokea",
    description:
      "Complete your look with Kalokea's women's accessories — jewellery, scarves, belts, and more.",
    keywords: [
      "women's accessories online india", "jewellery for women india",
      "scarves india", "belts for women india", "women's accessories collection",
    ],
  },
  sale: {
    name: 'Sale',
    title: "Women's Fashion Sale — Up to 50% Off | Kalokea",
    description:
      "Shop Kalokea's sale — discounts on dresses, tops, bottoms, shoes and accessories. Limited time offers on premium women's fashion.",
    keywords: [
      "women's fashion sale india", "discounted women's clothing india",
      "women's dresses on sale india", "fashion sale india",
    ],
  },
  everything: {
    name: 'Shop All',
    title: "Shop All Women's Fashion | Kalokea",
    description:
      "Browse Kalokea's complete collection of women's fashion — dresses, tops, bottoms, shoes, bags and accessories.",
    keywords: [
      "shop all women's fashion india", "women's clothing collection india",
    ],
  },
}

// ── Metadata ──────────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  try {
    const res = await fetch(`${BACKEND_URL}/categories`, { next: { revalidate: 3600 } })
    if (!res.ok) return Object.keys(CATEGORY_META).map(category => ({ category }))
    const json = await res.json()
    const slugs: string[] = (json?.data || []).map((c: { slug: string }) => c.slug)
    return slugs.length ? slugs.map(category => ({ category })) : Object.keys(CATEGORY_META).map(category => ({ category }))
  } catch {
    return Object.keys(CATEGORY_META).map(category => ({ category }))
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = CATEGORY_META[params.category]
  if (!m) return { title: 'Shop | Kalokea' }
  const url = `${SITE_URL}/shop/${params.category}/`
  return {
    title: m.title,
    description: m.description,
    keywords: m.keywords.join(', '),
    alternates: { canonical: url },
    openGraph: {
      title: m.title,
      description: m.description,
      url,
      siteName: 'Kalokea',
      type: 'website',
    },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CategoryShopPage({ params }: Props) {
  const meta = CATEGORY_META[params.category]
  return (
    <CategoryShopClient
      category={params.category}
      displayName={meta?.name || params.category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
    />
  )
}
