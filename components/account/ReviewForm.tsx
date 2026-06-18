'use client'
import { useState } from 'react'
import { reviewsApi } from '@/lib/api/reviews'
import { useToast } from '@/components/ui/Toast'

export default function ReviewForm({ product_id, onSubmitted }: { product_id: string; onSubmitted?: () => void }) {
  const { toast } = useToast()
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await reviewsApi.create({ product_id, rating, title, body })
      toast('Review submitted — pending approval')
      onSubmitted?.()
    } catch {
      setError('Failed to submit review. Please try again.')
      toast('Failed to submit review', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <p className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-2">Rating</p>
        <div className="flex gap-0.5" role="group" aria-label="Select a rating">
          {[1,2,3,4,5].map((s) => (
            <button key={s} type="button" onClick={() => setRating(s)} aria-pressed={rating === s} className="w-10 h-10 flex items-center justify-center rounded transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#7C4A2D]" aria-label={`Rate ${s} star${s !== 1 ? 's' : ''}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill={s <= rating ? '#7C4A2D' : 'none'} stroke="#7C4A2D" strokeWidth="1.5" aria-hidden={true}>
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
            </button>
          ))}
        </div>
      </div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Review title" aria-label="Review title" className="w-full border border-[#e8e4e0] px-4 py-3 text-base font-sans outline-none focus:border-[#0a0a0a] min-h-[44px]" />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your review..." aria-label="Review body" rows={4} className="w-full border border-[#e8e4e0] px-4 py-3 text-base font-sans outline-none focus:border-[#0a0a0a] resize-none" />
      {error && <p role="alert" className="text-sm font-sans text-red-600">{error}</p>}
      <button type="submit" disabled={loading} className="bg-[#0A0908] text-white text-[10px] font-sans tracking-widest uppercase px-8 py-3 hover:bg-[#7C4A2D] transition-colors disabled:opacity-50">
        {loading ? 'Submitting…' : 'Submit Review'}
      </button>
    </form>
  )
}
