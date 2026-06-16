import api from './client'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-73aa.up.railway.app'

// ─── Aggregated homepage data ───────────────────────────────────────────────
// Singleton promise — all homepage components (HeroBanner, TrustStrip,
// FeaturedProducts, CategoryGrid, Newsletter) share one fetch per page load.
// TTL: 60 s, then a fresh fetch on next access.

export interface HomepageData {
  cms: HomepageContent
  categories: any[]
  featured_products: any[]
}

let _homepagePromise: Promise<HomepageData> | null = null
let _homepageTs = 0
const HOMEPAGE_TTL = 60_000

export function getHomepageData(): Promise<HomepageData> {
  if (_homepagePromise && Date.now() - _homepageTs < HOMEPAGE_TTL) {
    return _homepagePromise
  }
  _homepageTs = Date.now()
  _homepagePromise = fetch(`${BASE_URL}/homepage`, { cache: 'default' })
    .then((r) => r.ok ? r.json() : null)
    .then((json) => {
      const raw = json?.data ?? json
      return {
        cms: { ...HERO_DEFAULTS, ...(raw?.cms ?? {}) } as HomepageContent,
        categories: raw?.categories ?? [],
        featured_products: raw?.featured_products ?? [],
      }
    })
    .catch(() => ({
      cms: HERO_DEFAULTS,
      categories: [],
      featured_products: [],
    }))
  return _homepagePromise
}

export interface HomepageContent {
  hero_eyebrow: string
  hero_headline_1: string
  hero_headline_2: string
  hero_subtext: string
  hero_cta1_label: string
  hero_cta1_link: string
  hero_cta2_label: string
  hero_cta2_link: string
  hero_image_url: string
  hero_video_url: string
  hero_mode: 'image' | 'video'
  // Trust strip
  trust_1_title: string
  trust_1_sub: string
  trust_2_title: string
  trust_2_sub: string
  trust_3_title: string
  trust_3_sub: string
  trust_4_title: string
  trust_4_sub: string
  // Newsletter
  newsletter_heading: string
  newsletter_subtext: string
  // Featured section
  featured_section_heading: string
  // Category grid
  category_heading: string
  category_eyebrow: string
  // Quote strip
  quote_text: string
  quote_author: string
  // Editorial banner
  editorial_eyebrow: string
  editorial_heading: string
  editorial_subtext: string
  editorial_cta_label: string
  editorial_cta_link: string
  editorial_image_url: string
  editorial_video_url: string
  editorial_mode: 'image' | 'video'
  // Shop the Look — JSON array of looks
  stl_looks: string
  // Best sellers
  bestseller_heading: string
  bestseller_eyebrow: string
  // Testimonials
  testimonials_heading: string
  testimonials_eyebrow: string
  // Press / As Seen In — JSON array of {name, url}
  press_logos: string
  [key: string]: string
}

export const HERO_DEFAULTS: HomepageContent = {
  hero_eyebrow: 'SS 2025 Collection',
  hero_headline_1: 'Dressed for',
  hero_headline_2: 'Every Chapter',
  hero_subtext:
    'Refined silhouettes, conscious fabrics, and designs that move with you — from morning coffee to midnight celebrations.',
  hero_cta1_label: 'Shop the Collection',
  hero_cta1_link: '/shop/',
  hero_cta2_label: 'New Arrivals',
  hero_cta2_link: '/shop/?tag=new-arrivals',
  hero_image_url:
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1400&q=90&fit=crop&crop=top',
  hero_video_url: '',
  hero_mode: 'image',
  trust_1_title: 'Free Delivery',
  trust_1_sub: 'On orders above ₹999',
  trust_2_title: 'Easy Returns',
  trust_2_sub: '7-day hassle-free returns',
  trust_3_title: 'Secure Payments',
  trust_3_sub: 'Razorpay 256-bit encrypted',
  trust_4_title: 'Made in India',
  trust_4_sub: 'Proudly designed & sourced',
  newsletter_heading: 'Join the KALOKEA Circle',
  newsletter_subtext: 'Be the first to know about new arrivals, exclusive offers, and style tips curated just for you.',
  featured_section_heading: 'Featured Pieces',
  category_heading: 'Find Your Signature',
  category_eyebrow: 'Shop by Category',
  quote_text: '"Wear what makes you feel alive."',
  quote_author: '— KALOKEA',
  editorial_eyebrow: 'The Edit',
  editorial_heading: "Season's New Chapter",
  editorial_subtext: 'Explore our curated editorial selection — pieces chosen for their craft, their story, and the way they make you feel.',
  editorial_cta_label: 'Explore the Edit',
  editorial_cta_link: '/shop/?tag=editorial',
  editorial_image_url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=85&fit=crop',
  editorial_video_url: '',
  editorial_mode: 'image',
  stl_looks: JSON.stringify([
    { title: 'The Golden Hour', tags: ['Aurelia Dress', 'Chain Bag'], image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=700&q=80', href: '/shop/' },
    { title: 'Power Dressing',  tags: ['Elara Blazer', 'Wrap Skirt'], image: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=700&q=80', href: '/shop/' },
    { title: 'Weekend Edit',    tags: ['Linen Co-ord', 'Rhea Tote'],  image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&q=80', href: '/shop/' },
  ]),
  bestseller_heading: 'Best Sellers',
  bestseller_eyebrow: 'Most Loved',
  testimonials_heading: 'What Our Customers Say',
  testimonials_eyebrow: 'Reviews',
  press_logos: JSON.stringify([
    { name: 'Vogue India',     url: 'https://www.vogue.in/' },
    { name: 'Elle',            url: 'https://elle.in/' },
    { name: "Harper's Bazaar", url: 'https://harpersbazaar.in/' },
    { name: 'Femina',          url: 'https://www.femina.in/' },
    { name: 'Grazia',          url: 'https://www.grazia.co.in/' },
  ]),
}

export const homepageContentApi = {
  /** Fetch all keys — no auth required. Falls back gracefully on network error. */
  getAll: (): Promise<HomepageContent> =>
    fetch(`${BASE_URL}/homepage-content`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => json ? ({ ...HERO_DEFAULTS, ...(json?.data ?? json) }) : HERO_DEFAULTS)
      .catch(() => HERO_DEFAULTS),

  /** Admin: update a single key. */
  update: (key: string, value: string) =>
    api.patch<{ key: string; value: string }>('/admin/homepage-content', { key, value }),
}
