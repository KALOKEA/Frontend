// ─── Blog / Journal post registry ──────────────────────────────────────────
// Single source of truth for the Journal. Consumed by:
//   • app/blog/page.tsx       — index listing
//   • app/blog/[slug]/...     — per-article metadata + JSON-LD
//   • app/sitemap.ts          — sitemap URLs
// Article BODIES live in their own page.tsx files (static, server-rendered)
// so the full copy is in the HTML at build time — exactly what crawlers index.

import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kalokea.in'

export interface BlogPost {
  slug: string
  /** SEO <title> (brand suffix added per-page). */
  title: string
  /** On-page H1 (can differ slightly from the SEO title). */
  heading: string
  /** Italicised tail of the H1 — matches the brand's editorial headline style. */
  headingItalic: string
  /** Meta description — kept under ~158 chars for full SERP display. */
  description: string
  /** Card excerpt on the index page. */
  excerpt: string
  /** Small eyebrow / category label. */
  eyebrow: string
  /** ISO publish date. */
  date: string
  /** ISO last-modified date. */
  updated: string
  /** Human reading time. */
  readingTime: string
  /** Per-article keyword targets. */
  keywords: string[]
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'womens-fashion-trends-2026',
    title: "Women's Fashion Trends 2026: What to Wear This Year in India",
    heading: 'Women’s Fashion Trends 2026',
    headingItalic: 'What to Wear This Year',
    description:
      'The biggest women’s fashion trends for 2026 in India — colours, silhouettes, fabrics and the easy-to-wear pieces worth investing in this year.',
    excerpt:
      'From quiet-luxury neutrals to fluid co-ords and revived nineties tailoring — the silhouettes, colours and fabrics defining women’s wardrobes across India this year.',
    eyebrow: 'Trend Report',
    date: '2026-06-02',
    updated: '2026-06-18',
    readingTime: '8 min read',
    keywords: [
      'womens fashion trends 2026', 'fashion trends india 2026', 'what to wear 2026',
      'womens clothing trends india', 'summer fashion trends india', 'co-ord sets trend',
      'quiet luxury india', 'trending dresses 2026',
    ],
  },
  {
    slug: 'how-to-style-a-kurta-set',
    title: 'How to Style a Kurta Set: 10 Effortless Looks for Every Occasion',
    heading: 'How to Style a Kurta Set',
    headingItalic: '10 Effortless Looks',
    description:
      'Ten ways to style a kurta set — from office to festive to everyday — with practical tips on layering, footwear, jewellery and dupatta draping.',
    excerpt:
      'One kurta set, ten distinct looks. Practical styling for work, festivals, brunch and travel — plus the footwear, jewellery and layering that pull each one together.',
    eyebrow: 'Styling Guide',
    date: '2026-05-26',
    updated: '2026-06-18',
    readingTime: '9 min read',
    keywords: [
      'how to style a kurta set', 'kurta set styling', 'kurta set for women',
      'kurta styling ideas', 'festive kurta looks', 'office kurta set',
      'ethnic wear styling india', 'kurta with jeans',
    ],
  },
  {
    slug: 'dress-types-guide',
    title: 'The Complete Guide to Dress Types: Maxi, Midi, Bodycon & More',
    heading: 'The Complete Guide to',
    headingItalic: 'Dress Types',
    description:
      'A clear guide to every dress type — maxi, midi, bodycon, A-line, wrap, shift and more — with what suits each body shape and occasion.',
    excerpt:
      'Maxi, midi, bodycon, wrap, A-line, shift, slip — what each dress silhouette actually means, who it flatters, and when to wear it.',
    eyebrow: 'Wardrobe Guide',
    date: '2026-05-18',
    updated: '2026-06-18',
    readingTime: '8 min read',
    keywords: [
      'dress types', 'types of dresses for women', 'maxi dress vs midi dress',
      'bodycon dress', 'a-line dress', 'wrap dress', 'dress styles guide',
      'which dress suits my body type',
    ],
  },
  {
    slug: 'womens-clothing-size-guide-india',
    title: "Women's Clothing Size Guide for India: Find Your Perfect Fit",
    heading: "Women’s Clothing Size Guide",
    headingItalic: 'Find Your Perfect Fit',
    description:
      'How to measure yourself at home and convert Indian, UK, US and EU sizes — a practical women’s size guide to order the right fit the first time.',
    excerpt:
      'Measure once, order with confidence. How to take your bust, waist and hip measurements at home, read a size chart, and convert between Indian, UK, US and EU sizing.',
    eyebrow: 'Fit & Sizing',
    date: '2026-05-10',
    updated: '2026-06-18',
    readingTime: '7 min read',
    keywords: [
      'womens size guide india', 'how to measure dress size', 'indian size chart women',
      'size conversion india uk us', 'how to measure bust waist hips', 'clothing size chart women',
      'what is my dress size', 'online shopping size guide',
    ],
  },
  {
    slug: 'co-ord-sets-styling-guide',
    title: 'Co-ord Sets: The Easiest Way to Look Put-Together',
    heading: 'Co-ord Sets',
    headingItalic: 'The Easiest Way to Look Put-Together',
    description:
      'Why co-ord sets are the smartest pieces in a 2026 wardrobe — how to style them up or down, mix and match, and choose the right fabric for Indian weather.',
    excerpt:
      'Two pieces, zero effort, endless combinations. How to wear the co-ord set up or down, break it apart for double the wardrobe, and pick fabrics that work in Indian heat.',
    eyebrow: 'Styling Guide',
    date: '2026-05-02',
    updated: '2026-06-18',
    readingTime: '7 min read',
    keywords: [
      'co-ord sets women', 'co ord set styling', 'matching sets women india',
      'two piece sets', 'how to wear co-ord sets', 'co-ord set outfit ideas',
      'coordinated sets india', 'summer co-ords',
    ],
  },
  {
    slug: 'fabric-care-guide',
    title: 'Fabric Care Guide: How to Wash & Store Cotton, Linen, Silk & Rayon',
    heading: 'Fabric Care Guide',
    headingItalic: 'Make Your Clothes Last',
    description:
      'How to wash, dry and store cotton, linen, silk, rayon and more so your clothes keep their colour and shape for years — a fabric-by-fabric care guide.',
    excerpt:
      'The right way to wash, dry and store every fabric in your wardrobe — cotton, linen, silk, rayon and viscose — so colours stay bright and shapes hold for years.',
    eyebrow: 'Care Guide',
    date: '2026-04-24',
    updated: '2026-06-18',
    readingTime: '8 min read',
    keywords: [
      'fabric care guide', 'how to wash cotton clothes', 'how to wash silk',
      'linen care', 'rayon washing instructions', 'how to store clothes',
      'garment care india', 'how to keep clothes looking new',
    ],
  },
]

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}

/** Build the Next.js Metadata object for an article page from the registry. */
export function articleMetadata(slug: string): Metadata {
  const post = getPost(slug)
  if (!post) return {}
  const url = `${SITE_URL}/blog/${post.slug}/`
  return {
    title: `${post.title} | Kalokea Journal`,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updated,
      images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: post.heading }],
    },
  }
}

/** Posts other than the given slug — used for the "Keep reading" section. */
export function relatedPosts(slug: string, limit = 3): BlogPost[] {
  return BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, limit)
}
