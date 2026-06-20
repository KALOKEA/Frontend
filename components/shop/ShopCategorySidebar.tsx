'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { categoriesApi, type Category } from '@/lib/api/categories'

// ── Static fallback categories (shown while API loads or on error) ────────────
const STATIC_CATS = [
  { slug: 'new-arrivals', name: 'New Arrivals' },
  { slug: 'sale',         name: 'Sale' },
  { slug: 'dresses',      name: 'Dresses' },
  { slug: 'tops',         name: 'Tops' },
  { slug: 'bottoms',      name: 'Bottoms' },
  { slug: 'co-ords',      name: 'One-Pieces & Co-ords' },
  { slug: 'denim',        name: 'Denim' },
  { slug: 'bags',         name: 'Bags' },
  { slug: 'accessories',  name: 'Accessories' },
  { slug: 'everything',   name: 'Shop All' },
]

interface Props {
  /** slug of the currently active category, or undefined on /shop root */
  activeSlug?: string
}

export default function ShopCategorySidebar({ activeSlug }: Props) {
  const [cats, setCats] = useState(STATIC_CATS)

  // Replace static list with live DB categories when available
  useEffect(() => {
    categoriesApi.getAll()
      .then(data => {
        const list: Category[] = Array.isArray(data) ? data : ((data as any)?.data || [])
        const active = list.filter((c: Category) => c.is_active)
        if (active.length > 0) {
          // Prepend static-only slugs not in DB (new-arrivals, sale, everything)
          const dbSlugs = new Set(active.map((c: Category) => c.slug))
          const extras = STATIC_CATS.filter(s => !dbSlugs.has(s.slug))
          // new-arrivals / sale at top, everything at bottom
          const top = extras.filter(s => ['new-arrivals', 'sale'].includes(s.slug))
          const bottom = extras.filter(s => s.slug === 'everything')
          const middle = active.map((c: Category) => ({ slug: c.slug, name: c.name }))
          setCats([...top, ...middle, ...bottom])
        }
      })
      .catch(() => {}) // keep static fallback on error
  }, [])

  return (
    <aside className="hidden lg:block w-[168px] xl:w-[188px] shrink-0">
      <nav aria-label="Shop categories">
        <p className="text-[9px] tracking-[0.28em] uppercase text-[#9B8E85] font-sans mb-3 pl-1">
          Categories
        </p>
        <ul className="space-y-0.5">
          {cats.map(cat => {
            const isActive = cat.slug === activeSlug
            return (
              <li key={cat.slug}>
                <Link
                  href={`/shop/${cat.slug}/`}
                  className={`block w-full text-left px-3 py-2 text-[11px] font-sans tracking-[0.06em] uppercase transition-colors rounded-sm ${
                    isActive
                      ? 'bg-[#0A0806] text-white font-semibold'
                      : 'text-[#3B2E27] hover:bg-[#F2EAE0] hover:text-[#0A0806]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {cat.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
