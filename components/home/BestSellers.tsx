'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { productsApi, type Product } from '@/lib/api/products'
import ProductCard from '@/components/shop/ProductCard'

/*
 * Matches reference #home .bestsellers exactly:
 * — padding: 80px 0, background: var(--white) = #FFFFFF
 * — .section-head: flex align-items:flex-end justify-content:space-between gap:24
 * — .section-label "Most Loved", .section-title "Best Sellers"
 * — .btn-ghost "See All →"
 * — .grid-3: repeat(3,1fr) gap:28px
 * — .bs-rank above each card: serif 3.5rem weight:300 color:var(--ivory-3)=#E4DDD4
 * — rank displayed as "01", "02", "03"
 */
export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productsApi.getAll({ sort: 'bestseller', limit: '3' })
      .then((res) => setProducts(res.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && products.length === 0) return null

  return (
    <section style={{ padding: '80px 0', background: '#FFFFFF' }}>
      {/* .container */}
      <div style={{ maxWidth: 1380, margin: '0 auto', padding: '0 max(20px, min(52px, 4vw))' }}>

        {/* .section-head */}
        <div
          className="reveal"
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 24,
            marginBottom: 40,
          }}
        >
          <div>
            {/* .section-label */}
            <span style={{
              display: 'block',
              fontSize: '.7rem',
              fontWeight: 600,
              letterSpacing: '.2em',
              textTransform: 'uppercase' as const,
              color: '#7C4A2D',
              marginBottom: 8,
            }}>
              Most Loved
            </span>
            {/* .section-title */}
            <h2
              className="font-serif"
              style={{
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)',
                fontWeight: 300,
                lineHeight: 1.15,
                color: '#0A0806',
                margin: 0,
              }}
            >
              Best <em style={{ fontStyle: 'italic', color: '#7C4A2D' }}>Sellers</em>
            </h2>
          </div>

          {/* .btn-ghost */}
          <Link
            href="/shop/?sort=bestseller"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '.78rem',
              fontWeight: 500,
              letterSpacing: '.12em',
              textTransform: 'uppercase' as const,
              color: '#0A0806',
              textDecoration: 'none',
              whiteSpace: 'nowrap' as const,
              flexShrink: 0,
              transition: 'color .2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#7C4A2D' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#0A0806' }}
          >
            See All →
          </Link>
        </div>

        {/* .grid-3 with .bs-rank — 3 cols desktop / 2 cols mobile */}
        {loading ? (
          /* Skeleton */
          <div className="grid grid-cols-2 md:grid-cols-3" style={{ gap: 28 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div style={{ height: 32, width: 40, background: '#E4DDD4', marginBottom: 12 }} />
                <div style={{ aspectRatio: '3/4', background: '#E4DDD4', marginBottom: 12 }} />
                <div style={{ height: 12, background: '#E4DDD4', borderRadius: 2, width: '75%', marginBottom: 8 }} />
                <div style={{ height: 12, background: '#E4DDD4', borderRadius: 2, width: '50%' }} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3" style={{ gap: 28 }}>
            {products.map((p, i) => (
              <div key={p.id} className="reveal">
                {/* .bs-rank — "01" / "02" / "03" */}
                <div
                  className="font-serif"
                  style={{
                    fontSize: '3.5rem',
                    fontWeight: 300,
                    color: '#E4DDD4',
                    lineHeight: 1,
                    marginBottom: 12,
                  }}
                >
                  {`0${i + 1}`}
                </div>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
