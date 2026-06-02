'use client'
import { useEffect, useState } from 'react'
import { adminApi, type PendingReview } from '@/lib/api/admin'
import Spinner from '@/components/ui/Spinner'

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<PendingReview[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  function load() {
    setLoading(true)
    adminApi.listPendingReviews().then(setReviews).catch(() => setReviews([])).finally(() => setLoading(false))
  }
  useEffect(load, [])

  async function act(id: string, kind: 'approve' | 'reject') {
    setBusyId(id)
    try {
      if (kind === 'approve') await adminApi.approveReview(id)
      else await adminApi.rejectReview(id)
      setReviews((prev) => prev.filter((r) => r.id !== id))
    } catch { /* leave in list to retry */ } finally {
      setBusyId(null)
    }
  }

  return (
    <>
      <h1 className="font-serif text-3xl text-[#0a0a0a] mb-2">Reviews</h1>
      <p className="text-sm text-[#6b6b6b] mb-8">Pending moderation. Approved reviews appear on the product page.</p>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : reviews.length ? (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-white border border-[#e8e4e0] p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-[#0a0a0a]">{r.products?.name || 'Product'}</p>
                  <p className="text-[11px] text-[#6b6b6b]">by {r.users?.name || 'Customer'} · {new Date(r.created_at).toLocaleDateString('en-IN')}</p>
                </div>
                <div className="text-[#c8a4a5]">{'★'.repeat(r.rating)}<span className="text-[#e8e4e0]">{'★'.repeat(5 - r.rating)}</span></div>
              </div>
              {r.title && <p className="font-medium text-sm mb-1">{r.title}</p>}
              {r.comment && <p className="text-sm text-[#4b4b4b] mb-4">{r.comment}</p>}
              <div className="flex gap-2 justify-end text-[11px] uppercase tracking-widest">
                <button onClick={() => act(r.id, 'reject')} disabled={busyId === r.id} className="px-4 py-2 border border-[#e8e4e0] text-red-600 disabled:opacity-40">Reject</button>
                <button onClick={() => act(r.id, 'approve')} disabled={busyId === r.id} className="px-4 py-2 bg-[#0a0a0a] text-white disabled:opacity-40">Approve</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-[#6b6b6b]">No reviews awaiting moderation.</p>
      )}
    </>
  )
}
