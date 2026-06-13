'use client'
import { ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { productsApi, type Product } from '@/lib/api/products'
import { getHomepageData, HERO_DEFAULTS, type HomepageContent } from '@/lib/api/homepageContent'
import ProductCard from '@/components/shop/ProductCard'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'

/*
 * Matches reference #home .new-arrivals exactly.
 * CMS key: featured_section_heading
 */
export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cms, setCms] = useState<HomepageContent>(HERO_DEFAULTS)

  useEffect(() => {
    productsApi.getAll({ sort: 'newest', limit: '8' })
      .then((res) => setProducts(res.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
    getHomepageData().then(d => setCms(d.cms)).catch(() => {})
  }, [])

  if (!loading && products.length === 0) return null

  const heading = cms.featured_section_heading || 'Featured Pieces'

  return (
    <section className="k-section-py">
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
              Just In
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
            View All <ArrowRight size={12} className="inline ml-1" />
          </Link>
        </div>

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
