import Link from 'next/link'
import Image from 'next/image'
import type { BlogPost } from '@/lib/api/blog'
import { sanitiseHtml } from '@/lib/server/blogServer'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kalokea.com'

function formatDate(iso?: string | null): string {
  if (!iso) return ''
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

interface Props {
  post: BlogPost
  related?: BlogPost[]
}

/** Renders an admin-authored (DB) blog post with the Journal styling + JSON-LD. */
export default function DbArticleLayout({ post, related = [] }: Props) {
  const url = `${SITE_URL}/blog/${post.slug}/`
  const heading = post.heading || post.title
  const published = post.published_at || post.updated_at || post.created_at
  const modified = post.updated_at || published

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.title,
    name: post.title,
    description: post.description || post.excerpt || '',
    datePublished: published,
    dateModified: modified,
    image: {
      '@type': 'ImageObject',
      url: post.cover_image || `${SITE_URL}/og-image.jpg`,
      width: 1200,
      height: 630,
    },
    author: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: post.author || 'Kalokea', url: SITE_URL },
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Kalokea',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png`, width: 200, height: 60 },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url, isPartOf: { '@id': `${SITE_URL}/#website` } },
    keywords: Array.isArray(post.keywords) ? post.keywords.join(', ') : undefined,
    inLanguage: 'en-IN',
    url,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Journal', item: `${SITE_URL}/blog/` },
      { '@type': 'ListItem', position: 3, name: heading, item: url },
    ],
  }

  return (
    <article className="bg-[#FDFAF6] pb-28 lg:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="px-4 sm:px-6 pt-14 pb-10 md:pt-20 md:pb-14">
        <div className="max-w-3xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-[11px] font-sans tracking-wide text-[#7A6E68]">
              <li><Link href="/" className="hover:text-[#7C4A2D]">Home</Link></li>
              <li aria-hidden="true">/</li>
              <li><Link href="/blog/" className="hover:text-[#7C4A2D]">Journal</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-[#160F09]" aria-current="page">{heading}</li>
            </ol>
          </nav>

          {post.eyebrow && (
            <p className="text-[9.5px] font-sans tracking-[0.35em] uppercase text-[#7C4A2D] mb-5">{post.eyebrow}</p>
          )}
          <h1 className="font-serif font-light text-[#0A0908] leading-[1.08] mb-6" style={{ fontSize: 'clamp(2.1rem, 5vw, 3.4rem)' }}>
            {heading}{' '}
            {post.heading_italic && <em className="italic" style={{ color: '#7C4A2D' }}>{post.heading_italic}</em>}
          </h1>
          <div className="flex items-center gap-3 text-[12px] font-sans text-[#7A6E68]">
            {published && <time dateTime={published}>{formatDate(published)}</time>}
            {post.reading_time && (
              <>
                <span aria-hidden="true" className="w-1 h-1 rounded-full bg-[#C4A882]" />
                <span>{post.reading_time}</span>
              </>
            )}
          </div>
          <div className="w-12 h-px bg-[#7C4A2D] mt-8" aria-hidden="true" />
        </div>
      </header>

      {/* ── Cover image ──────────────────────────────────────────────────── */}
      {post.cover_image && (
        <div className="px-4 sm:px-6 mb-10">
          <div className="max-w-3xl mx-auto relative w-full aspect-[16/8] overflow-hidden bg-[#F0EAE1]">
            <Image src={post.cover_image} alt={heading} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" priority />
          </div>
        </div>
      )}

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="px-4 sm:px-6 pb-4">
        <div
          className="max-w-3xl mx-auto blog-prose"
          dangerouslySetInnerHTML={{ __html: sanitiseHtml(post.content) }}
        />
      </div>

      {/* ── Shop CTA ─────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 py-14" style={{ background: '#1E1208' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[9.5px] font-sans tracking-[0.35em] uppercase text-[#C4A882] mb-4">Shop the Story</p>
          <h2 className="font-serif font-light text-[#FDFAF6] mb-6" style={{ fontSize: 'clamp(1.7rem, 3.6vw, 2.4rem)' }}>
            Bring the look <em className="italic" style={{ color: '#C4A882' }}>home</em>
          </h2>
          <p className="font-sans text-[14px] leading-relaxed text-white/55 max-w-md mx-auto mb-8">
            Explore the latest edit of dresses, tops, co-ords and accessories — thoughtfully made, fairly priced, delivered across India.
          </p>
          <Link href="/shop/" className="inline-block font-sans text-[12px] tracking-[0.18em] uppercase px-9 py-4 bg-[#7C4A2D] text-[#FDFAF6] hover:bg-[#6A3D25] transition-colors">
            Shop the collection
          </Link>
        </div>
      </section>

      {/* ── Keep reading ─────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="px-4 sm:px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <p className="text-[9.5px] font-sans tracking-[0.35em] uppercase text-[#7C4A2D] mb-3 text-center">More from the Journal</p>
            <h2 className="font-serif font-light text-[#0A0908] text-center mb-12" style={{ fontSize: 'clamp(1.7rem, 3.4vw, 2.2rem)' }}>
              Keep <em className="italic" style={{ color: '#7C4A2D' }}>reading</em>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {related.map((r) => (
                <Link key={r.slug} href={`/blog/${r.slug}/`} className="group block">
                  <div className="bg-white h-full p-7 transition-shadow hover:shadow-[0_8px_30px_rgba(124,74,45,0.08)]" style={{ borderTop: '3px solid #7C4A2D' }}>
                    {r.eyebrow && <p className="text-[9px] font-sans tracking-[0.28em] uppercase text-[#7C4A2D] mb-3">{r.eyebrow}</p>}
                    <h3 className="font-serif text-[1.25rem] leading-snug text-[#0A0908] mb-3 group-hover:text-[#7C4A2D] transition-colors">{r.heading || r.title} {r.heading_italic || ''}</h3>
                    {r.excerpt && <p className="font-sans text-[13px] leading-relaxed text-[#6B5E55]">{r.excerpt}</p>}
                    <span className="inline-block mt-4 font-sans text-[11px] tracking-[0.18em] uppercase text-[#7C4A2D]">Read article →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
