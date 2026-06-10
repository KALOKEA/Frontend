'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { productsApi, type Product } from '@/lib/api/products'
import ProductCard from '@/components/shop/ProductCard'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'

/*
 * Matches reference #home .new-arrivals exactly:
 * — padding: 80px 0, default ivory bg (var(--ivory))
 * — .section-head: flex, align-items:flex-end, justify-content:space-between
 * — .section-label: .7rem, weight:600, tracking:.2em, color:var(--brown)
 * — .section-title: serif clamp(1.8rem,3.5vw,2.8rem) weight:300 color:var(--ink)
 * — .btn-ghost: .78rem weight:500 tracking:.12em uppercase, ::after content:'→'
 * — .grid-4: repeat(4,1fr) gap:24px
 */
export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productsApi.getAll({ sort: 'newest', limit: '8' })
      .then((res) => setProducts(res.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && products.length === 0) return null

  return (
    <section style={{ padding: '80px 0' }}>
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
              Just In
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
              New <em style={{ fontStyle: 'italic', color: '#7C4A2D' }}>Arrivals</em>
            </h2>
          </div>

          {/* .btn-ghost — arrow via inline since no global CSS ::after here */}
          <Link
            href="/shop/"
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
            View All →
          </Link>
        </div>

        {/* .grid-4 — 4 cols desktop / 2 cols mobile */}
        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gap: 24 }}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
