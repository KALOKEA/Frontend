'use client'
import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import Link from 'next/link'
import { reviewsApi, type ReviewItem } from '@/lib/api/reviews'
import Spinner from '@/components/ui/Spinner'

const STARS = (n: number) => (
  <span role="img" className="inline-flex gap-0.5" aria-label={`${n} out of 5 stars`}>
    {[1,2,3,4,5].map(i => (
      <Star key={i} size={12} fill={i <= n ? '#7C4A2D' : '#e8e4e0'} stroke="none" aria-hidden="true" />
    ))}
  </span>
)

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState<(ReviewItem & { products?: { name?: string; slug?: string } })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reviewsApi.getMyReviews()
      .then(data => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h2 className="font-serif text-2xl text-[#0a0a0a] mb-6">My Reviews</h2>

      {loading ? (
        <div className="flex justify-center py-10"><Spinner size="lg" /></div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-10 border border-[#e8e4e0] bg-white">
          <p className="font-serif text-lg text-[#6b6b6b] mb-2">No reviews yet</p>
          <p className="text-sm text-[#6b6b6b] mb-4">
            After receiving your order, open the product page to leave a review.
          </p>
          <Link
            href="/account/orders/"
            className="inline-block text-[10px] uppercase tracking-widest text-[#0a0a0a] border border-[#0a0a0a] px-5 py-2.5 hover:bg-[#0a0a0a] hover:text-white transition-colors"
          >
            View My Orders
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(r => {
            const text = r.body || (r as any).comment || ''
            const productName = r.products?.name || 'Product'
            const productSlug = r.products?.slug

            return (
              <div key={r.id} className="bg-white border border-[#e8e4e0] p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    {productSlug ? (
                      <Link
                        href={`/product/${productSlug}/`}
                        className="font-medium text-[#0a0a0a] hover:text-[#7C4A2D] hover:underline"
                      >
                        {productName}
                      </Link>
                    ) : (
                      <p className="font-medium text-[#0a0a0a]">{productName}</p>
                    )}
                    <p className="text-[11px] text-[#6b6b6b] mt-0.5">
                      {new Date(r.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'long', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    {STARS(r.rating)}
                    <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 ${
                      r.is_approved
                        ? 'bg-[#e8f5e9] text-[#2e7d32]'
                        : 'bg-[#fff8e1] text-[#f57f17]'
                    }`}>
                      {r.is_approved ? 'Published' : 'Pending review'}
                    </span>
                  </div>
                </div>

                {r.title && (
                  <p className="text-sm font-medium text-[#0a0a0a] mb-1">{r.title}</p>
                )}
                {text && (
                  <p className="text-sm text-[#6b6b6b] leading-relaxed">{text}</p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
