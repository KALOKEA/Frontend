'use client'
import { useState } from 'react'
import { reviewsApi } from '@/lib/api/reviews'
import { useToast } from '@/components/ui/Toast'
import Button from '@/components/ui/Button'

export default function ReviewForm({ product_id, onSubmitted }: { product_id: string; onSubmitted?: () => void }) {
  const { toast } = useToast()
  const [rating, setRating] = useState(5)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await reviewsApi.create({ product_id, rating, title, body })
      toast('Review submitted — pending approval')
      onSubmitted?.()
    } catch {
      toast('Failed to submit review', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <p className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-2">Rating</p>
        <div className="flex gap-0.5">
          {[1,2,3,4,5].map((s) => (
            <button key={s} type="button" onClick={() => setRating(s)} className="w-10 h-10 flex items-center justify-center" aria-label={`Rate ${s} star${s !== 1 ? 's' : ''}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill={s <= rating ? '#7C4A2D' : 'none'} stroke="#7C4A2D" strokeWidth="1.5">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
              </svg>
            </button>
          ))}
        </div>
      </div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Review title" className="w-full border border-[#e8e4e0] px-4 py-3 text-base font-sans outline-none focus:border-[#0a0a0a] min-h-[44px]" />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your review..." rows={4} className="w-full border border-[#e8e4e0] px-4 py-3 text-base font-sans outline-none f
      <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write your review..." rows={4} className="w-full border border-[#e8e4e0] px-4 py-3 text-base font-sans outline-none focus:border-[#0a0a0a] transition-colors min-h-[44px]" />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Submitting...' : 'Submit Review'}
      </Button>
    </form>
  )
}