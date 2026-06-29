import Link from 'next/link'
import { getMergedJournalItems } from '@/lib/server/blogServer'

// Homepage editorial strip — real owned content (the latest Journal posts, DB +
// static merged) in place of the old unverifiable "As Seen In" press logos.
// Server-rendered at build, so titles + links sit in the static HTML (good SEO).

function formatDate(iso: string): string {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const d = new Date(iso)
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

export default async function FromTheJournal() {
  const posts = (await getMergedJournalItems()).slice(0, 3)
  if (posts.length === 0) return null

  return (
    <section className="k-section-py" style={{ background: '#FFFFFF', borderTop: '1px solid #F0EAE1' }}>
      <div className="k-container">

        <div
          className="reveal"
          style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', marginBottom: 34 }}
        >
          <div>
            <span style={{ fontSize: '.7rem', fontWeight: 600, letterSpacing: '.25em', textTransform: 'uppercase', color: '#7C4A2D', display: 'block', marginBottom: 10 }}>
              The Journal
            </span>
            <h2 className="font-serif" style={{ fontSize: 'clamp(1.9rem, 3.4vw, 2.8rem)', fontWeight: 400, lineHeight: 1.12, color: '#0A0908' }}>
              Style notes, <em style={{ fontStyle: 'italic', color: '#7C4A2D' }}>thoughtfully written</em>
            </h2>
          </div>
          <Link
            href="/blog/"
            className="font-sans"
            style={{ fontSize: '12px', letterSpacing: '.18em', textTransform: 'uppercase', color: '#7C4A2D', textDecoration: 'none', whiteSpace: 'nowrap' }}
          >
            Read the Journal →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}/`} className="group block reveal">
              <article
                className="h-full p-7 flex flex-col transition-shadow hover:shadow-[0_8px_30px_rgba(124,74,45,0.08)]"
                style={{ background: '#FDFAF6', borderTop: '3px solid #7C4A2D' }}
              >
                <p className="font-sans" style={{ fontSize: '9px', letterSpacing: '.28em', textTransform: 'uppercase', color: '#7C4A2D', marginBottom: 14 }}>
                  {p.eyebrow}
                </p>
                <h3 className="font-serif group-hover:text-[#7C4A2D] transition-colors" style={{ fontSize: '1.35rem', lineHeight: 1.25, color: '#0A0908', marginBottom: 10 }}>
                  {p.heading} <span style={{ fontStyle: 'italic', color: '#7C4A2D' }}>{p.headingItalic}</span>
                </h3>
                <p className="font-sans" style={{ fontSize: '13.5px', lineHeight: 1.6, color: '#6B5E55', marginBottom: 18, flex: 1 }}>
                  {p.excerpt}
                </p>
                <div className="font-sans" style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '11px', color: '#7A6E68', marginTop: 'auto' }}>
                  <time dateTime={p.date}>{formatDate(p.date)}</time>
                  <span aria-hidden="true" style={{ width: 4, height: 4, borderRadius: '50%', background: '#C4A882' }} />
                  <span>{p.readingTime}</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
