import api from './client'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-73aa.up.railway.app'

// ─── Aggregated homepage data ────────────────────────────────────────────────
// Stale-while-revalidate singleton backed by ONE aggregated endpoint (/homepage
// returns cms + categories + featured + bestsellers server-side, in parallel):
//  - Cold load  : single request → cached result
//  - Warm load  : returns stale data instantly, revalidates in background
//  - Every component calls getHomepageData() — one network request per TTL window
// TTL: 5 min (CMS content rarely changes; products update on publish)

export interface HomepageData {
  cms: HomepageContent
  categories: any[]
  featured_products: any[]  // newest products (Featured section)
  bestsellers: any[]        // bestseller-tagged products
}

const HOMEPAGE_TTL = 5 * 60_000  // 5 minutes

let _homepagePromise: Promise<HomepageData> | null = null
let _homepageTs = 0
let _homepageStale: HomepageData | null = null  // last resolved value

// Track in-flight fetches to deduplicate concurrent callers
const _inFlight = new Map<string, Promise<any>>()

function parallelFetch(url: string): Promise<any> {
  if (_inFlight.has(url)) return _inFlight.get(url)!
  const p = fetch(url, {
    cache: 'default',
    // Hint: honour server-sent Cache-Control (CDN/browser) but fall back to our TTL
  })
    .then(r => r.ok ? r.json() : null)
    .catch(() => null)
    .finally(() => _inFlight.delete(url))
  _inFlight.set(url, p)
  return p
}

function _doFetch(): Promise<HomepageData> {
  // Single aggregated request — /homepage returns cms + categories + featured +
  // bestsellers in one round-trip (previously 3 separate calls).
  return parallelFetch(`${BASE_URL}/homepage`).then((homepageJson) => {
    const raw = homepageJson?.data ?? homepageJson
    const result: HomepageData = {
      cms: { ...HERO_DEFAULTS, ...(raw?.cms ?? {}) } as HomepageContent,
      categories: raw?.categories ?? [],
      featured_products: raw?.featured_products ?? [],
      bestsellers: raw?.bestsellers ?? [],
    }
    _homepageStale = result
    return result
  }).catch(() => {
    // On network error return stale if available, otherwise empty defaults
    if (_homepageStale) return _homepageStale
    return { cms: HERO_DEFAULTS, categories: [], featured_products: [], bestsellers: [] }
  })
}

export function getHomepageData(): Promise<HomepageData> {
  const now = Date.now()

  // Fresh cache — return same promise (may still be in-flight on very first call)
  if (_homepagePromise && now - _homepageTs < HOMEPAGE_TTL) {
    return _homepagePromise
  }

  // Stale-while-revalidate: we have old data → return it instantly, refresh in background
  if (_homepageStale) {
    _homepageTs = now
    _homepagePromise = _doFetch()  // background revalidation (no await)
    return Promise.resolve(_homepageStale)  // immediate response
  }

  // Cold load — no data yet, must wait for network
  _homepageTs = now
  _homepagePromise = _doFetch()
  return _homepagePromise
}

// Pre-warm: kick off the fetch as soon as this module is imported in the browser.
// By the time React renders, data is already in-flight (or resolved from SW cache).
if (typeof window !== 'undefined') {
  getHomepageData()
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
  trust_1_title: string
  trust_1_sub: string
  trust_2_title: string
  trust_2_sub: string
  trust_3_title: string
  trust_3_sub: string
  trust_4_title: string
  trust_4_sub: string
  newsletter_heading: string
  newsletter_subtext: string
  featured_section_heading: string
  category_heading: string
  category_eyebrow: string
  quote_text: string
  quote_author: string
  editorial_eyebrow: string
  editorial_heading: string
  editorial_subtext: string
  editorial_cta_label: string
  editorial_cta_link: string
  editorial_image_url: string
  editorial_video_url: string
  editorial_mode: 'image' | 'video'
  stl_looks: string
  bestseller_heading: string
  bestseller_eyebrow: string
  testimonials_heading: string
  testimonials_eyebrow: string
  press_logos: string
  announcement_items: string
  hero_slides: string
  editorial_slides: string
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
  quote_text: '“Wear what makes you feel alive.”',
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
  announcement_items: JSON.stringify([
    'Free Shipping on Orders Above ₹999',
    'New Arrivals Every Friday',
    'Easy 7-Day Returns',
    'Ethically Sourced Fabrics',
    'COD Available Pan India',
  ]),
  hero_slides: JSON.stringify([]),
  editorial_slides: JSON.stringify([]),
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
