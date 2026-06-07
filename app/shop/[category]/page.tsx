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
    description:
      "Complete your look with Kalokea's women's shoe collection. Heels, flats, sandals, wedges and more — crafted for style and all-day comfort.",
    keywords: [
      "women's shoes online india", 'buy heels online india',
      "women's sandals india", "women's flats online india",
      "women's wedges india", "women's block heels india",
      'stiletto heels india', "women's slip-ons india",
      "women's mules india", "women's ankle strap heels india",
      "women's casual shoes india", "women's formal shoes india",
      "women's party heels india", "women's embellished sandals india",
      "women's ethnic footwear india", "women's sneakers india",
      "women's loafers india", "women's kitten heels india",
      "women's platform shoes india", "women's comfortable heels india",
      "buy women's footwear india", 'stylish women shoes india',
      "women's ballerina flats india", "affordable women's shoes india",
      "designer women's shoes india",
    ],
  },
  bags: {
    name: 'Bags',
    title: "Women's Bags & Handbags Online India — Totes, Clutches & More | Kalokea",
    description:
      "Shop Kalokea's handbag collection — totes, clutches, crossbody bags, sling bags and more. The perfect finishing touch to complete any outfit.",
    keywords: [
      "women's bags online india", 'handbags for women india',
      "women's tote bags india", "women's clutch bags india",
      "women's crossbody bags india", "women's sling bags india",
      "women's shoulder bags india", "women's potli bags india",
      "women's backpacks india", "women's wallets india",
      "women's party clutch india", "women's office bags india",
      "women's ethnic bags india", "women's embroidered bags india",
      "women's vegan leather bags india", "women's jute bags india",
      "women's beaded bags india", 'buy handbags online india',
      "women's structured handbags india", "affordable women's bags india",
      "designer bags for women india", "women's mini bags india",
      "women's bucket bags india", "women's fashion bags india",
      'stylish women bags india',
    ],
  },
  accessories: {
    name: 'Accessories',
    title: "Women's Accessories Online India — Jewellery, Scarves & More | Kalokea",
    description:
      "Browse Kalokea's women's accessories — fashion jewellery, scarves, belts, hair accessories and more. Elevate every look with the perfect finishing detail.",
    keywords: [
      "women's accessories online india", 'fashion jewellery india',
      "women's scarves india", "women's belts online india",
      "women's hair accessories india", "women's sunglasses india",
      "women's bangles india", "women's earrings online india",
      "women's necklaces india", "women's bracelets india",
      "women's anklets india", "women's rings collection india",
      'artificial jewellery women india', "women's dupatta india",
      "women's stoles india", "women's headbands india",
      "women's statement earrings india", "women's ethnic jewellery india",
      "women's pearl jewellery india", "women's boho jewellery india",
      "buy accessories for women india", "women's fashion accessories online",
      "trendy accessories women india", "affordable jewellery women india",
      "women's imitation jewellery india",
    ],
  },
  sale: {
    name: 'Sale',
    title: "Women's Fashion Sale India — Up to 50% Off | Kalokea",
    description:
      "Shop Kalokea's sale for the best deals on women's fashion. Dresses, tops, shoes, bags and accessories at unbeatable prices. Limited time offers — shop now.",
    keywords: [
      "women's fashion sale india", "discounted women's clothes india",
      "cheap women's clothing india", "women's clothing deals india",
      'fashion sale online india', "women's dresses on sale india",
      "buy women's clothes at discount india", 'fashion clearance sale india',
      "end of season sale women's india", "affordable women's fashion india",
      "women's tops on sale india", "women's shoes sale india",
      "women's bags sale india", 'fashion deals women india',
      "discount women's wear india", "women's sale collection india",
      'up to 50 off women fashion india', 'fashion outlet india',
      "women's clearance sale india", "cheap dresses online india",
      "women's best deals fashion", 'branded clothes on sale india',
      "women's discounted fashion online", "sale shopping women india",
      "women's fashion bargains india",
    ],
  },
  everything: {
    name: 'Everything',
    title: "Shop All Women's Fashion Online India | Kalokea",
    description:
      "Browse Kalokea's complete women's fashion collection — dresses, tops, bottoms, shoes, bags, accessories and more. All styles, all occasions, all in one place.",
    keywords: [
      "shop all women's fashion india", "women's full collection india",
      "all women's clothing online india", "women's fashion everything india",
      "complete women's wardrobe india", "all styles women's fashion india",
      "women's all-in-one fashion shop india", "browse all women's clothes india",
      "women's clothing all categories india", "full range women's fashion",
      "shop everything women's india", "women's fashion all products india",
      "all women's wear india", "women's collection india",
      "women's clothing store india", "everything women's fashion",
      "all women's styles india", "women's fashion all occasions india",
      "women's entire collection india", "women's complete range india",
      "one stop women's fashion india", "women's all-season clothing india",
      "women's fashion hub india", "all women's apparel india",
      "browse all fashion women india",
    ],
  },
}

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
  const title = meta?.title ?? `${name} — Women's Fashion India | Kalokea`
  const description = meta?.description ?? `Shop Kalokea's ${name} collection — curated women's fashion online India.`
  const keywords = meta?.keywords?.join(', ') ?? `${name} online india, buy ${name} india, women's ${name} india`
  const canonical = `${SITE_URL}/shop/${params.category}/`

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'Kalokea',
      url: canonical,
      images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: `${name} — Kalokea Women's Fashion` }],
    },
    twitter: { card: 'summary_large_image', title, description },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CategoryPage({ params }: Props) {
  const meta = CATEGORY_META[params.category]
  const displayName = meta?.name ?? params.category.replace(/-/g, ' ')

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Shop', item: `${SITE_URL}/shop/` },
      { '@type': 'ListItem', position: 3, name: displayName, item: `${SITE_URL}/shop/${params.category}/` },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CategoryShopClient category={params.category} displayName={displayName} />
    </>
  )
}
