import type { Metadata } from 'next'
import Link from 'next/link'
import { BLOG_POSTS } from '@/lib/blog/posts'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kalokea.in'

export const metadata: Metadata = {
  title: 'The Kalokea Journal — Women’s Fashion Tips, Trends & Styling Guides',
  description:
    'Styling guides, trend reports and care tips from Kalokea — practical women’s fashion advice for India. Learn how to style kurtas, choose dresses, find your size and care for every fabric.',
  keywords: [
    'womens fashion blog india', 'fashion styling guide', 'how to style guides',
    'womens fashion tips', 'kalokea journal', 'indian fashion blog',
    'dress styling tips', 'kurta styling', 'fashion trends 2026',
  ],
  alternates: { canonical: `${SITE_URL}/blog/` },
  openGraph: {
    title: 'The Kalokea Journal — Women’s Fashion Tips, Trends & Styling Guides',
    description:
      'Styling guides, trend reports and care tips from Kalokea — practical women’s fashion advice for India.',
    url: `${SITE_URL}/blog/`,
    type: 'website',
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: 'The Kalokea Journal' }],
  },
}

const blogJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'The Kalokea Journal',
  url: `${SITE_URL}/blog/`,
  description:
    'Styling guides, trend reports and fabric-care tips from Kalokea — practical women’s fashion advice for India.',
  publisher: {
    '@type': 'Organization',
    name: 'Kalokea',
    logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png`, width: 200, height: 60 },
  },
  blogPost: BLOG_POSTS.map((p) => ({
    '@type': 'BlogPosting',
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    dateModified: p.updated,
    url: `${SITE_URL}/blog/${p.slug}/`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${p.slug}/` },
    author: { '@type': 'Organization', name: 'Kalokea' },
  })),
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Journal', item: `${SITE_URL}/blog/` },
  ],
}

function formatDate(iso: string): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const d = new Date(iso)
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

export default function BlogIndexPage() {
  const [featured, ...rest] = BLOG_POSTS

  return (
    <div className="bg-[#FDFAF6]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* ── Intro ────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 pt-16 pb-12 md:pt-24 md:pb-16 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-[9.5px] font-sans tracking-[0.35em] uppercase text-[#7C4A2D] mb-5">The Kalokea Journal</p>
          <h1 className="font-serif font-light text-[#0A0908] leading-[1.06] mb-6" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 3.8rem)' }}>
            Style notes,{' '}
            <em className="italic" style={{ color: '#7C4A2D' }}>thoughtfully written</em>
          </h1>
          <p className="font-sans text-[15px] leading-relaxed text-[#6B5E55]">
            Fashion is more enjoyable when you know the why behind the what. The Journal is where we share the
            practical side of dressing well — how to style the pieces you already own, choose the right silhouette
            for your body and your day, decode sizing before you order, and care for your clothes so they last for
            years. No gatekeeping, no jargon — just honest, useful guidance from the team behind Kalokea.
          </p>
          <div className="w-12 h-px bg-[#7C4A2D] mx-auto mt-9" aria-hidden="true" />
        </div>
      </section>

      {/* ── Featured post ────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 pb-4">
        <div className="max-w-6xl mx-auto">
          <Link href={`/blog/${featured.slug}/`} className="group block">
            <div className="bg-white p-8 md:p-14 transition-shadow hover:shadow-[0_12px_44px_rgba(124,74,45,0.10)]" style={{ borderLeft: '4px solid #7C4A2D' }}>
              <div className="flex items-center gap-3 text-[10px] font-sans tracking-[0.22em] uppercase text-[#7C4A2D] mb-5">
                <span>Latest</span>
                <span aria-hidden="true" className="w-1 h-1 rounded-full bg-[#C4A882]" />
                <span className="text-[#7A6E68]">{featured.eyebrow}</span>
              </div>
              <h2 className="font-serif font-light text-[#0A0908] leading-[1.1] mb-4 max-w-3xl group-hover:text-[#7C4A2D] transition-colors" style={{ fontSize: 'clamp(1.9rem, 4vw, 2.8rem)' }}>
                {featured.heading} {featured.headingItalic}
              </h2>
              <p className="font-sans text-[15px] leading-relaxed text-[#6B5E55] max-w-2xl mb-6">{featured.excerpt}</p>
              <div className="flex items-center gap-3 text-[12px] font-sans text-[#7A6E68]">
                <time dateTime={featured.date}>{formatDate(featured.date)}</time>
                <span aria-hidden="true" className="w-1 h-1 rounded-full bg-[#C4A882]" />
                <span>{featured.readingTime}</span>
                <span className="ml-auto font-sans text-[11px] tracking-[0.18em] uppercase text-[#7C4A2D]">Read article →</span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Post grid ────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-12 md:py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rest.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}/`} className="group block">
              <article className="bg-white h-full p-8 flex flex-col transition-shadow hover:shadow-[0_8px_30px_rgba(124,74,45,0.08)]" style={{ borderTop: '3px solid #7C4A2D' }}>
                <p className="text-[9px] font-sans tracking-[0.28em] uppercase text-[#7C4A2D] mb-4">{p.eyebrow}</p>
                <h3 className="font-serif text-[1.45rem] leading-snug text-[#0A0908] mb-3 group-hover:text-[#7C4A2D] transition-colors">
                  {p.heading} {p.headingItalic}
                </h3>
                <p className="font-sans text-[13.5px] leading-relaxed text-[#6B5E55] mb-6 flex-1">{p.excerpt}</p>
                <div className="flex items-center gap-3 text-[11px] font-sans text-[#7A6E68] mt-auto">
                  <time dateTime={p.date}>{formatDate(p.date)}</time>
                  <span aria-hidden="true" className="w-1 h-1 rounded-full bg-[#C4A882]" />
                  <span>{p.readingTime}</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Closing CTA ──────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 pb-20">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-sans text-[14px] leading-relaxed text-[#6B5E55] mb-7">
            Ready to put it into practice? Browse the latest arrivals and find the pieces these guides were written for.
          </p>
          <Link
            href="/shop/new-arrivals/"
            className="inline-block font-sans text-[12px] tracking-[0.18em] uppercase px-9 py-4 bg-[#7C4A2D] text-[#FDFAF6] hover:bg-[#6A3D25] transition-colors"
          >
            Shop new arrivals
          </Link>
        </div>
      </section>
    </div>
  )
}
