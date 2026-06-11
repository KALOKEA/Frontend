import api from './client'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-73aa.up.railway.app'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface AboutHero {
  eyebrow: string
  headline: string
  headline_italic: string
  subtext: string
  image_url: string
}

export interface AboutValue {
  title: string
  desc: string
}

export interface AboutStat {
  num: string
  label: string
}

export interface TeamMember {
  name: string
  role: string
  bio: string
  image: string
}

export interface FooterLink {
  label: string
  href: string
}

export interface SiteContentMap {
  about_hero: AboutHero
  about_values: AboutValue[]
  about_stats: AboutStat[]
  about_team: TeamMember[]
  footer_shop_col: FooterLink[]
  footer_help_col: FooterLink[]
  footer_company_col: FooterLink[]
  footer_legal_links: FooterLink[]
  footer_copyright: string
}

// ─── Defaults ────────────────────────────────────────────────────────────────

export const ABOUT_HERO_DEFAULT: AboutHero = {
  eyebrow: 'Our Story',
  headline: 'Fashion That',
  headline_italic: 'Tells Your Story',
  subtext:
    'KALOKEA was born from a simple belief: every Indian woman deserves fashion that is both beautiful and accessible. We blend global trends with local sensibilities to create pieces that feel both timeless and distinctly yours.',
  image_url: '',
}

export const ABOUT_VALUES_DEFAULT: AboutValue[] = [
  { title: 'Inclusive Beauty', desc: 'We design for every body, every skin tone, every occasion. Fashion has no one-size-fits-all formula.' },
  { title: 'Ethical Sourcing', desc: 'Our fabrics are sourced from certified mills. Our artisans are paid fair wages. We believe fashion can be both beautiful and responsible.' },
  { title: 'Sustainable Future', desc: 'Packaging made from recycled materials. Carbon-neutral shipping by 2026. Fashion that respects the planet.' },
]

export const ABOUT_STATS_DEFAULT: AboutStat[] = [
  { num: '50K+', label: 'Happy Customers' },
  { num: '500+', label: 'Styles Available' },
  { num: '4.8★', label: 'Average Rating' },
  { num: '28',   label: 'States Delivered' },
]

export const FOOTER_SHOP_DEFAULT: FooterLink[] = [
  { label: 'New Arrivals',   href: '/shop/new-arrivals/' },
  { label: 'Dresses',        href: '/shop/dresses/' },
  { label: 'Tops & Blouses', href: '/shop/tops/' },
  { label: 'Skirts & Pants', href: '/shop/bottoms/' },
  { label: 'Shoes',          href: '/shop/shoes/' },
  { label: 'Bags',           href: '/shop/bags/' },
  { label: 'Accessories',    href: '/shop/accessories/' },
  { label: 'Sale',           href: '/shop/sale/' },
]

export const FOOTER_HELP_DEFAULT: FooterLink[] = [
  { label: 'Contact Us',        href: '/contact/' },
  { label: 'Size Guide',        href: '/size-guide/' },
  { label: 'Track Order',       href: '/track-order/' },
  { label: 'Shipping Info',     href: '/shipping-policy/' },
  { label: 'Returns & Refunds', href: '/refund-policy/' },
  { label: 'My Orders',         href: '/account/orders/' },
]

export const FOOTER_COMPANY_DEFAULT: FooterLink[] = [
  { label: 'About Us',       href: '/about/' },
  { label: 'Privacy Policy', href: '/privacy-policy/' },
  { label: 'Terms of Use',   href: '/terms/' },
  { label: 'Careers',        href: '/about/' },
  { label: 'Sustainability',  href: '/about/' },
  { label: 'Press',          href: '/about/' },
]

export const FOOTER_LEGAL_DEFAULT: FooterLink[] = [
  { label: 'Privacy',  href: '/privacy-policy/' },
  { label: 'Terms',    href: '/terms/' },
  { label: 'Refunds',  href: '/refund-policy/' },
  { label: 'Shipping', href: '/shipping-policy/' },
]

// ─── Helper: safely parse a JSON string ─────────────────────────────────────

function safeJson<T>(raw: string | undefined | null, fallback: T): T {
  if (!raw) return fallback
  try { return JSON.parse(raw) as T } catch { return fallback }
}

// ─── API client ──────────────────────────────────────────────────────────────

let _siteContentPromise: Promise<Record<string, string>> | null = null
let _siteContentTs = 0
const SITE_TTL = 120_000

function fetchAllRaw(): Promise<Record<string, string>> {
  if (_siteContentPromise && Date.now() - _siteContentTs < SITE_TTL) {
    return _siteContentPromise
  }
  _siteContentTs = Date.now()
  _siteContentPromise = fetch(`${BASE_URL}/site-content`, { cache: 'default' })
    .then((r) => (r.ok ? r.json() : null))
    .then((json) => (json?.data ?? json ?? {}) as Record<string, string>)
    .catch(() => ({} as Record<string, string>))
  return _siteContentPromise
}

export function invalidateSiteContentCache() {
  _siteContentPromise = null
  _siteContentTs = 0
}

export const siteContentApi = {
  /** Fetch all keys — no auth, cached 2 min. */
  getAll: (): Promise<Record<string, string>> => fetchAllRaw(),

  /** Fetch and parse typed site content map. */
  getParsed: async (): Promise<SiteContentMap> => {
    const raw = await fetchAllRaw()
    return {
      about_hero:        safeJson(raw.about_hero,        ABOUT_HERO_DEFAULT),
      about_values:      safeJson(raw.about_values,      ABOUT_VALUES_DEFAULT),
      about_stats:       safeJson(raw.about_stats,       ABOUT_STATS_DEFAULT),
      about_team:        safeJson(raw.about_team,        [] as TeamMember[]),
      footer_shop_col:   safeJson(raw.footer_shop_col,   FOOTER_SHOP_DEFAULT),
      footer_help_col:   safeJson(raw.footer_help_col,   FOOTER_HELP_DEFAULT),
      footer_company_col:safeJson(raw.footer_company_col,FOOTER_COMPANY_DEFAULT),
      footer_legal_links:safeJson(raw.footer_legal_links,FOOTER_LEGAL_DEFAULT),
      footer_copyright:  raw.footer_copyright ?? 'KALOKEA. All rights reserved.',
    }
  },

  /** Admin: update a single key (value must be a JSON string for array/object keys). */
  update: (key: string, value: string) =>
    api.patch<{ key: string; value: string }>('/admin/site-content', { key, value }),
}
