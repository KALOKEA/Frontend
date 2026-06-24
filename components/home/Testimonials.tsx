'use client'
import { useEffect, useState } from 'react'
import { getHomepageData, HERO_DEFAULTS, type HomepageContent } from '@/lib/api/homepageContent'
import { reviewsApi, type FeaturedReview } from '@/lib/api/reviews'

// Social proof now comes from REAL approved customer reviews — not hardcoded
// testimonials. The whole section stays hidden until at least 2 genuine reviews
// exist, so the homepage never shows fabricated names or quotes.

function StarRow({ count }: { count: number }) {
  return (
    <div
      style={{ display: 'flex', gap: 3, marginBottom: 16 }}
      role="img"
      aria-label={`${count} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          style={{ width: 13, height: 13, fill: i < count ? '#C49070' : 'none', stroke: 'none' }}
          aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [cms, setCms] = useState<HomepageContent>(HERO_DEFAULTS)
  const [reviews, setReviews] = useState<FeaturedReview[] | null>(null)

  useEffect(() => {
    getHomepageData().then(d => setCms(d.cms)).catch(() => {})
    reviewsApi.getFeatured()
      .then(rows => setReviews(Array.isArray(rows) ? rows : []))
      .catch(() => setReviews([]))
  }, [])

  // Never render an empty grid or fabricated proof: hide until ≥2 real reviews.
  if (!reviews || reviews.length < 2) return null

  const eyebrow = cms.testimonials_eyebrow || 'Reviews'
  const heading = cms.testimonials_heading || 'What Our Customers Say'
  const shown = reviews.slice(0, 3)

  return (
    <section className="k-section-py" style={{ background: '#1E1208' }}>
      <div className="k-container">

        <div
          className="reveal"
          style={{
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            marginBottom: 40,
          }}
        >
          <span
            style={{
              fontSize: '.72rem',
              fontWeight: 600,
              letterSpacing: '.2em',
              textTransform: 'uppercase',
              color: '#C49070',
              display: 'block',
            }}
          >
            {eyebrow}
          </span>
          <h2
            className="font-serif"
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: '#FFFFFF',
            }}
          >
            {heading}
          </h2>
        </div>

        <div className="k-testi-grid">
          {shown.map(({ id, text, author, product, rating }) => (
            <div
              key={id}
              className="reveal"
              style={{
                background: 'rgba(255,255,255,.05)',
                border: '1px solid rgba(255,255,255,.08)',
                borderRadius: 6,
                padding: '32px 28px',
              }}
            >
              <StarRow count={rating} />
              <p
                className="font-serif"
                style={{
                  fontSize: '1rem',
                  fontWeight: 300,
                  color: 'rgba(255,255,255,.75)',
                  lineHeight: 1.7,
                  fontStyle: 'italic',
                  marginBottom: 20,
                }}
              >
                &ldquo;{text}&rdquo;
              </p>
              <div
                style={{
                  fontSize: '.78rem',
                  fontWeight: 600,
                  letterSpacing: '.08em',
                  textTransform: 'uppercase',
                  color: '#C49070',
                }}
              >
                {author}
              </div>
              <div
                style={{
                  fontSize: '.72rem',
                  color: 'rgba(255,255,255,.3)',
                  marginTop: 2,
                }}
              >
                {product ? `Verified purchase — ${product}` : 'Verified purchase'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
