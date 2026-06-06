import api from './client'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-73aa.up.railway.app'

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
  [key: string]: string
}

export const HERO_DEFAULTS: HomepageContent = {
  hero_eyebrow: 'NEW COLLECTION — 2026',
  hero_headline_1: 'Dressed for',
  hero_headline_2: 'Every Moment',
  hero_subtext:
    'Timeless silhouettes, curated fabrics — pieces that move with you, season after season.',
  hero_cta1_label: 'Shop Collection',
  hero_cta1_link: '/shop',
  hero_cta2_label: 'New Arrivals',
  hero_cta2_link: '/shop?tag=new-arrivals',
  hero_image_url:
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=90&fit=crop&crop=top',
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
  newsletter_heading: 'Join the Kalokea Family',
  newsletter_subtext: 'Get early access to new arrivals, exclusive offers, and style inspiration straight to your inbox.',
  featured_section_heading: 'Featured Pieces',
}

export const homepageContentApi = {
  /** Fetch all keys — no auth required. Falls back gracefully on network error. */
  getAll: (): Promise<HomepageContent> =>
    fetch(`${BASE_URL}/homepage-content`, { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : HERO_DEFAULTS))
      .catch(() => HERO_DEFAULTS),

  /** Admin: update a single key. */
  update: (key: string, value: string) =>
    api.patch<{ key: string; value: string }>('/admin/homepage-content', { key, value }),
}
