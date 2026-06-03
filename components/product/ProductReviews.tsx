'use client'
import { useEffect, useState } from 'react'
import DOMPurify from 'dompurify'
import { reviewsApi } from '@/lib/api/reviews'

interface Review {
  id: string
  rating: number
  title?: string
  comment?: string
  body?: string   // legacy alias
  created_at: string
  users?: { name?: string }
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} width="12" height="12" viewBox="0 0 24 24"
          fill={s <= rating ? '#c8a4a5' : 'none'} stroke="#c8a4a5" strokeWidth="1.5">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  )
}

/** Safe plain-text render — strips all HTML tags then renders as text. */
function SafeText({ text }: { text: string }) {
  const clean = typeof window !== 'undefined'
    ? DOMPurify.sanitize(text, { ALLOWED_TAGS: [] })
    : text.replace(/<[^>]*>/g, '')
  return <>{clean}</>
}

export default function ProductReviews({ product_id }: { product_id: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reviewsApi.getByProduct(product_id)
      .then((data: any) => setReviews(Array.isArray(data) ? data : data?.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [product_id])

  if (loading) return <p className="text-xs text-[#9b9b9b] py-4">Loading reviews…</p>

  if (!reviews.length) return (
    <div className="py-8 text-center">
      <p className="text-sm font-sans text-[#6b6b6b]">No reviews yet. Be the first to review!</p>
    </div>
  )

  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length

  return (
    <div>
      {/* Summary */}
      <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#e8e4e0]">
        <span className="font-serif text-3xl text-[#0a0a0a]">{avg.toFixed(1)}</span>
        <div>
          <Stars rating={Math.round(avg)} />
          <p className="text-[11px] text-[#6b6b6b] mt-0.5">{reviews.length} review{reviews.length > 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="space-y-5">
        {reviews.map(r => {
          const text = r.comment || r.body || ''
          return (
            <div key={r.id} className="border-b border-[#f0ece8] pb-5 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Stars rating={r.rating} />
                  <span className="text-xs font-sans font-medium text-[#0a0a0a]">
                    {r.users?.name || 'Verified Customer'}
                  </span>
                </div>
                <span className="text-[10px] text-[#9b9b9b]">
                  {new Date(r.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              </div>
              {r.title && (
                <p className="text-sm font-sans font-medium text-[#0a0a0a] mb-1">
                  <SafeText text={r.title} />
                </p>
              )}
              {text && (
                <p className="text-sm font-sans text-[#6b6b6b] leading-relaxed">
                  <SafeText text={text} />
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
