'use client'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { productsApi, type Product } from '@/lib/api/products'
import { getHomepageData, HERO_DEFAULTS, type HomepageContent } from '@/lib/api/homepageContent'
import ProductCard from '@/components/shop/ProductCard'

/*
 * Matches reference #home .bestsellers exactly.
 * CMS keys: bestseller_heading, bestseller_eyebrow
 */
export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cms, setCms] = useState<HomepageContent>(HERO_DEFAULTS)

  useEffect(() => {
    productsApi.getAll({ sort: 'bestseller', limit: '3' })
      .then((res) => setProducts(res.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
    getHomepageData().then(d => setCms(d.cms)).catch(() => {})
  }, [])

  if (!loading && products.length === 0) return null

  const eyebrow = cms.bestseller_eyebrow || 'Most Loved'
  const heading = cms.bestseller_heading || 'Best Sellers'

  return (
    <section className="k-section-py" style={{ background: '#FFFFFF' }}>
      <div style={{ maxWidth: 1380, margin: '0 auto', padding: '0 max(20px, min(52px, 4vw))' }}>

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
            <span style={{
              display: 'block',
              fontSize: '.7rem',
              fontWeight: 600,
              letterSpacing: '.2em',
              textTransform: 'uppercase' as const,
              color: '#7C4A2D',
              marginBottom: 8,
            }}>
              {eyebrow}
            </span>
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
              {heading}
            </h2>
          </div>

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
            See All <ArrowRight size={12} className="inline ml-1" />
          </Link>
        </div>

        {loading ? (
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
                  {String(i + 1).padStart(2, '0')}
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
