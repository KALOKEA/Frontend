import HeroBanner from '@/components/home/HeroBanner'
import TrustStrip from '@/components/home/TrustStrip'
import QuoteStrip from '@/components/home/QuoteStrip'
import CategoryGrid from '@/components/home/CategoryGrid'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import EditorialBanner from '@/components/home/EditorialBanner'
import BestSellers from '@/components/home/BestSellers'
import PressStrip from '@/components/home/PressStrip'
import ShopTheLook from '@/components/home/ShopTheLook'
import WhyKalokea from '@/components/home/WhyKalokea'
import Testimonials from '@/components/home/Testimonials'
import NewsletterSignup from '@/components/home/NewsletterSignup'
import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kalokea.in'
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-73aa.up.railway.app'

// Build-time homepage fetch. Because the site is `output: 'export'`, this runs
// ONCE during the build and the resulting hero content is baked into the static
// HTML — so the correct hero image is present on the very first paint, with no
// client-side API round-trip and no flash of the placeholder/stock image.
// Fails safe: if the backend is unreachable at build time it returns null and the
// component falls back to HERO_DEFAULTS, then the client revalidation fills in
// real data after mount.
async function getInitialCms(): Promise<Record<string, string> | null> {
  try {
    const res = await fetch(`${API_URL}/homepage`, { cache: 'force-cache' })
    if (!res.ok) return null
    const json = await res.json()
    const raw = json?.data ?? json
    return (raw?.cms as Record<string, string>) ?? null
  } catch {
    return null
  }
}

// SITE_URL is used for metadata alternates and OG URLs
export const metadata: Metadata = {
  title: "KALOKEA | Women's Fashion — Dresses, Tops, Shoes & Accessories India",
  description:
    "Shop Kalokea — India's curated women's fashion boutique. Dresses, tops, bottoms, shoes, bags and accessories. Exclusive designs, premium quality. Free shipping above ₹999. New arrivals every week.",
  keywords: [
    // Brand
    'kalokea', 'kalokea fashion', 'kalokea clothing', 'kalokea online store',
    "kalokea women's fashion", 'kalokea india', 'kalokea collection', 'kalokea boutique',
    'kalokea dresses', 'kalokea tops', 'kalokea co-ords', 'kalokea bags',
    'kalokea new arrivals', 'shop kalokea', 'kalokea sale',
    // Broad women's fashion India
    "women's fashion india", 'online shopping for women india', "women's clothing online india",
    "buy women's clothes india", "women's clothing brand india", "women's boutique online india",
    "women's fashion store india", "women's apparel india", "women's wear india",
    "ladies fashion india", "girls fashion online india", "women's dress shop india",
    // Dresses
    "buy dresses online india", "maxi dress india", "midi dress online", "mini dress india",
    "floral dress women india", "casual dress women", "party wear dress india",
    "summer dress india", "western dress india", "bodycon dress india",
    "a-line dress online india", "wrap dress women", "shift dress india",
    "printed dress india", "designer dress india", "ethnic dress online",
    "indo-western dress", "cotton dress women india", "linen dress india",
    "georgette dress india", "chiffon dress women", "silk dress india",
    // Tops
    "women's tops online india", "crop top india", "women top india",
    "flowy top women", "linen top india", "cotton top women",
    "printed top india", "embroidered top online", "designer top india",
    "formal top women india", "casual top women", "boho top india",
    "peplum top india", "off shoulder top india", "cold shoulder top",
    // Co-ords
    "co-ord set india", "matching set women india", "co-ord set online",
    "two piece set women india", "crop top skirt set", "loungewear set india",
    "linen co-ord set", "ethnic co-ord india", "printed co-ord set",
    // Bottoms
    "palazzo pants india", "wide leg pants women", "straight pants women india",
    "high waist pants india", "flared skirt online", "pencil skirt india",
    "wrap skirt india", "midi skirt online", "women trousers india",
    // Bags
    "women handbag india", "tote bag india", "shoulder bag women",
    "crossbody bag india", "clutch bag online india", "bucket bag women",
    "sling bag women india", "canvas bag women", "leather bag india",
    "designer bag women india", "party bag women",
    // Ethnic & fusion
    "kurta set online india", "kurti women india", "indo-western wear india",
    "ethnic wear online india", "fusion wear india", "desi fashion online",
    "indian fashion online", "salwar suit india", "anarkali suit india",
    // Occasion
    "women's party wear india", "women's office wear india", "women's casual wear india",
    "women's festive wear india", "women's everyday fashion", "women's evening wear india",
    "women's brunch outfits india", "wedding guest outfit india", "reception outfit women",
    "bridesmaid outfit india", "mehndi outfit women", "sangeet outfit india",
    "garba wear women", "navratri outfit india", "diwali fashion women",
    "eid outfit women", "college fashion india", "date night outfit india",
    // Style
    "trendy women's clothing india", "stylish women's wear", "contemporary women's fashion",
    "women's western wear india", "women's ethnic fusion wear", "women's premium fashion online",
    "women's wardrobe essentials", 'fashion for modern women', "women's designer wear india",
    "boho fashion india", "minimalist fashion women india", "capsule wardrobe india",
    "slow fashion india", "sustainable fashion india", "ethical fashion india",
    "made in india fashion", "indian women clothing brand",
    // Fabric
    "linen women's wear india", "cotton women's clothing", "georgette tops india",
    "rayon dress india", "silk blend women india",
    // City
    "women fashion mumbai", "women fashion delhi", "women fashion bangalore",
    "women fashion chennai", "women fashion hyderabad", "women fashion pune",
    "women fashion kolkata", "women fashion ahmedabad", "women fashion surat",
    // Value & services
    "affordable women's fashion india", "women's clothing deals india",
    "women's latest fashion 2025", 'new arrivals women fashion india',
    'free shipping women fashion india', "women's fashion free delivery india",
    "cod fashion india", "cash on delivery women clothes", "7 day return fashion india",
    "easy return women clothes india", "best price women fashion",
    "fashion under 999 india", "fashion under 1999 india",
    // Long-tail
    "shop women's clothes online india", "women's dress shopping india",
    "best women's fashion brand india", "women's style india",
    "women's fashion shopping india", "women's clothing collection india",
    "top women clothing store india", "women online boutique india",
    "best women boutique online india", "instagram fashion india women",
    "celebrity inspired fashion india", "bollywood fashion india",
    "ootd india women", "new friday fashion drop india",
    "ethically sourced women's clothing", "premium women's fashion india 2025",
  ].join(', '),
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    title: "KALOKEA | Women's Fashion — Dresses, Tops, Shoes & Accessories India",
    description:
      "Discover Kalokea's curated women's fashion. Dresses, tops, shoes, bags and accessories — free shipping above ₹999.",
    url: `${SITE_URL}/`,
    siteName: 'Kalokea',
    type: 'website',
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Kalokea — Women's Fashion India" }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "KALOKEA | Women's Fashion India",
    description: "Dresses, tops, shoes, bags and accessories for modern women. Free shipping above ₹999.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
}

export default async function HomePage() {
  const initialCms = await getInitialCms()
  return (
    <>
      <HeroBanner initialCms={initialCms} />
      <TrustStrip />
      <QuoteStrip />
      <CategoryGrid />
      <FeaturedProducts />
      <EditorialBanner initialCms={initialCms} />
      <BestSellers />
      <PressStrip />
      <ShopTheLook />
      <WhyKalokea />
      <Testimonials />
      <NewsletterSignup />
    </>
  )
}
