'use client'
import { useEffect, useState } from 'react'
import { reviewsApi } from '@/lib/api/reviews'

interface Review {
  id: string
  rating: number
  title?: string
  body?: string
  created_at: string
  users?: { name?: string }
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s <= rating ? '#c8a4a5' : 'none'} stroke="#c8a4a5" strokeWidth="1.5">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
        </svg>
      ))}
    </div>
  )
}

export default function ProductReviews({ product_id }: { product_id: string }) {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    reviewsApi.getByProduct(product_id)
      .then((data: Review[]) => setReviews(data))
      .catch(() => {})
  }, [product_id])

  if (!reviews.length) return (
    <div className="py-8 text-center">
      <p className="text-sm font-sans text-[#6b6b6b]">No reviews yet. Be the first to review!</p>
    </div>
  )

  return (
    <div className="space-y-6">
      {reviews.map((r) => (
        <div key={r.id} className="border-b border-[#e8e4e0] pb-6">
          <div className="flex items-center gap-3 mb-2">
            <Stars rating={r.rating} />
            <span className="text-xs font-sans text-[#6b6b6b]">
              {r.users?.name || 'Verified Customer'} · {new Date(r.created_at).toLocaleDateString('en-IN')}
            </span>
          </div>
          {r.title && <p className="text-sm font-sans font-medium text-[#0a0a0a] mb-1">{r.title}</p>}
          {r.body && <p className="text-sm font-sans text-[#6b6b6b] leading-relaxed">{r.body}</p>}
        </div>
      ))}
    </div>
  )
}
