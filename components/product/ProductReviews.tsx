'use client'
import { useEffect, useState } from 'react'
import DOMPurify from 'dompurify'
import { reviewsApi, type ReviewItem } from '@/lib/api/reviews'
import { useAuthStore } from '@/lib/store/useAuthStore'
import Link from 'next/link'

function Stars({ rating, interactive = false, onRate }: {
  rating: number
  interactive?: boolean
  onRate?: (n: number) => void
}) {
  const [hover, setHover] = useState(0)
  return (
    <div className={`flex gap-0.5 ${interactive ? 'cursor-pointer' : ''}`}>
      {[1, 2, 3, 4, 5].map(s => (
        <svg
          key={s}
          width={interactive ? 22 : 13}
          height={interactive ? 22 : 13}
          viewBox="0 0 24 24"
          fill={(interactive ? (hover || rating) : rating) >= s ? '#c8a4a5' : 'none'}
          stroke="#c8a4a5"
          strokeWidth="1.5"
          onMouseEnter={() => interactive && setHover(s)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => onRate && onRate(s)}
          className={interactive ? 'transition-transform hover:scale-110' : ''}
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  )
}

function SafeText({ text }: { text: string }) {
  const clean = typeof window !== 'undefined'
    ? DOMPurify.sanitize(text, { ALLOWED_TAGS: [] })
    : text.replace(/<[^>]*>/g, '')
  return <>{clean}</>
}

export default function ProductReviews({ product_id }: { product_id: string }) {
  const { isLoggedIn } = useAuthStore()
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(true)

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg, setSubmitMsg] = useState<{ text: string; ok: boolean } | null>(null)

  function loadReviews() {
    setLoading(true)
    reviewsApi.getByProduct(product_id)
      .then(data => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadReviews() }, [product_id]) // eslint-disable-line react-hooks/exhaustive-deps

  async function submitReview() {
    if (!rating) { setSubmitMsg({ text: 'Please select a star rating.', ok: false }); return }
    if (!body.trim()) { setSubmitMsg({ text: 'Please write something about the product.', ok: false }); return }
    setSubmitting(true); setSubmitMsg(null)
    try {
      await reviewsApi.create({ product_id, rating, title: title.trim() || undefined, body: body.trim() })
      setSubmitMsg({ text: 'Thank you! Your review is pending approval and will appear shortly.', ok: true })
      setRating(0); setTitle(''); setBody('')
      setShowForm(false)
    } catch (e: any) {
      setSubmitMsg({ text: e?.message || 'Could not submit review. Try again.', ok: false })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className="text-xs text-[#9b9b9b] py-4">Loading reviews…</p>

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

  return (
    <div>
      {/* Summary row */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-4 mb-5 pb-4 border-b border-[#e8e4e0]">
          <div className="flex items-center gap-2">
            <span className="font-serif text-3xl text-[#0a0a0a]">{avg.toFixed(1)}</span>
            <div>
              <Stars rating={Math.round(avg)} />
              <p className="text-[11px] text-[#6b6b6b] mt-0.5">
                {reviews.length} review{reviews.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Review list */}
      {reviews.length > 0 ? (
        <div className="space-y-5 mb-6">
          {reviews.map(r => {
            const text = r.body || (r as any).comment || ''
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
      ) : (
        <p className="text-sm font-sans text-[#6b6b6b] mb-5 text-center py-4">
          No reviews yet — be the first!
        </p>
      )}

      {/* Submit success message */}
      {submitMsg?.ok && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 mb-4">
          {submitMsg.text}
        </p>
      )}

      {/* Write a review */}
      {isLoggedIn ? (
        !showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="text-[11px] uppercase tracking-widest text-[#c8a4a5] hover:underline"
          >
            + Write a review
          </button>
        ) : (
          <div className="border border-[#e8e4e0] p-4 bg-[#faf8f5]">
            <h4 className="text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-4">Your review</h4>

            {/* Star picker */}
            <div className="mb-4">
              <p className="text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-2">Rating *</p>
              <Stars rating={rating} interactive onRate={setRating} />
            </div>

            <div className="mb-3">
              <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Title (optional)</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Summarise your experience"
                maxLength={120}
                className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none bg-white"
              />
            </div>

            <div className="mb-4">
              <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Review *</label>
              <textarea
                value={body}
                onChange={e => setBody(e.target.value)}
                rows={4}
                placeholder="What did you like or dislike? How does it fit?"
                maxLength={1000}
                className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none bg-white resize-none"
              />
              <p className="text-[10px] text-[#9b9b9b] mt-0.5 text-right">{body.length}/1000</p>
            </div>

            {submitMsg && !submitMsg.ok && (
              <p className="text-sm text-red-600 mb-3">{submitMsg.text}</p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => { setShowForm(false); setSubmitMsg(null) }}
                className="px-4 py-2 text-sm border border-[#e8e4e0] hover:bg-white"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                disabled={submitting}
                className="px-4 py-2 text-sm bg-[#0a0a0a] text-white hover:bg-[#333] disabled:opacity-50"
              >
                {submitting ? 'Submitting…' : 'Submit review'}
              </button>
            </div>
          </div>
        )
      ) : (
        <p className="text-xs text-[#6b6b6b]">
          <Link href="/login" className="underline hover:text-[#0a0a0a]">Sign in</Link> to write a review.
        </p>
      )}
    </div>
  )
}
