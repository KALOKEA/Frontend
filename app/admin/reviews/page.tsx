'use client'
import { useEffect, useState } from 'react'
import { adminApi, type PendingReview, type AllReview } from '@/lib/api/admin'
import Spinner from '@/components/ui/Spinner'

type Tab = 'pending' | 'all'

const STARS = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n)

export default function AdminReviewsPage() {
  const [tab, setTab] = useState<Tab>('pending')
  const [pending, setPending] = useState<PendingReview[]>([])
  const [all, setAll] = useState<AllReview[]>([])
  const [allTotal, setAllTotal] = useState(0)
  const [allPage, setAllPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  function loadPending() {
    setLoading(true)
    adminApi.listPendingReviews()
      .then(setPending)
      .catch(() => setPending([]))
      .finally(() => setLoading(false))
  }

  function loadAll(p = allPage) {
    setLoading(true)
    adminApi.listAllReviews(p, 30)
      .then(res => {
        setAll((res as any).data || [])
        setAllTotal((res as any).meta?.total || 0)
      })
      .catch(() => setAll([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadPending() }, [])

  function switchTab(t: Tab) {
    setTab(t)
    if (t === 'pending') loadPending()
    else loadAll(1)
  }

  async function approve(id: string) {
    setBusyId(id)
    try {
      await adminApi.approveReview(id)
      if (tab === 'pending') setPending(prev => prev.filter(r => r.id !== id))
      else loadAll(allPage)
    } catch { /* keep in list */ } finally { setBusyId(null) }
  }

  async function reject(id: string) {
    if (!confirm('Reject and delete this review?')) return
    setBusyId(id)
    try {
      await adminApi.rejectReview(id)
      if (tab === 'pending') setPending(prev => prev.filter(r => r.id !== id))
      else loadAll(allPage)
    } catch { /* keep in list */ } finally { setBusyId(null) }
  }

  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <h1 className="font-serif text-2xl md:text-3xl text-[#0a0a0a]">Reviews</h1>
        {tab === 'pending' && pending.length > 0 && (
          <span className="text-sm text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1">
            {pending.length} awaiting moderation
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 mb-6 border-b border-[#e8e4e0]">
        {(['pending', 'all'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => switchTab(t)}
            className={`px-5 py-2.5 text-[11px] uppercase tracking-widest border-b-2 -mb-px transition-colors ${
              tab === t
                ? 'border-[#0a0a0a] text-[#0a0a0a] font-medium'
                : 'border-transparent text-[#6b6b6b] hover:text-[#0a0a0a]'
            }`}
          >
            {t === 'pending' ? `Pending${pending.length > 0 ? ` (${pending.length})` : ''}` : `All reviews${allTotal > 0 ? ` (${allTotal})` : ''}`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : tab === 'pending' ? (
        // ── Pending tab ────────────────────────────────────────────────────
        pending.length > 0 ? (
          <div className="space-y-4">
            {pending.map(r => (
              <ReviewCard
                key={r.id}
                id={r.id}
                rating={r.rating}
                title={r.title}
                comment={r.comment}
                customer={r.users?.name}
                product={r.products?.name}
                date={r.created_at}
                isApproved={false}
                busy={busyId === r.id}
                onApprove={approve}
                onReject={reject}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#e8e4e0] px-4 py-16 text-center">
            <p className="font-serif text-lg text-[#6b6b6b]">All caught up</p>
            <p className="text-xs text-[#9b9b9b] mt-1">No reviews awaiting moderation.</p>
          </div>
        )
      ) : (
        // ── All reviews tab ─────────────────────────────────────────────────
        <>
          {all.length > 0 ? (
            <div className="space-y-3">
              {all.map(r => (
                <ReviewCard
                  key={r.id}
                  id={r.id}
                  rating={r.rating}
                  title={r.title}
                  comment={r.comment}
                  customer={r.users?.name}
                  product={r.products?.name}
                  date={r.created_at}
                  isApproved={r.is_approved}
                  busy={busyId === r.id}
                  onApprove={r.is_approved ? undefined : approve}
                  onReject={reject}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#6b6b6b] py-10 text-center">No reviews yet.</p>
          )}
          {allTotal > 30 && (
            <div className="flex gap-2 mt-4 items-center text-sm">
              <button disabled={allPage <= 1} onClick={() => { setAllPage(p => p - 1); loadAll(allPage - 1) }}
                className="px-3 py-1 border border-[#e8e4e0] disabled:opacity-40 hover:bg-[#faf8f5]">← Prev</button>
              <span className="text-[#6b6b6b] px-2">Page {allPage} of {Math.ceil(allTotal / 30)}</span>
              <button disabled={allPage >= Math.ceil(allTotal / 30)} onClick={() => { setAllPage(p => p + 1); loadAll(allPage + 1) }}
                className="px-3 py-1 border border-[#e8e4e0] disabled:opacity-40 hover:bg-[#faf8f5]">Next →</button>
            </div>
          )}
        </>
      )}
    </>
  )
}

function ReviewCard({ id, rating, title, comment, customer, product, date, isApproved, busy, onApprove, onReject }: {
  id: string; rating: number; title?: string; comment?: string
  customer?: string; product?: string; date: string
  isApproved: boolean; busy: boolean
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
}) {
  return (
    <div className={`bg-white border p-5 ${isApproved ? 'border-[#e8e4e0]' : 'border-amber-200 bg-amber-50/20'}`}>
      <div className="flex justify-between items-start gap-4 mb-3">
        <div className="min-w-0">
          <p className="font-medium text-sm text-[#0a0a0a] truncate">{product || 'Unknown product'}</p>
          <p className="text-[11px] text-[#6b6b6b]">
            by {customer || 'Customer'} · {new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[#c8a4a5] text-sm">{STARS(rating)}</span>
          <span className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 ${isApproved ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-amber-100 text-amber-800'}`}>
            {isApproved ? 'Live' : 'Pending'}
          </span>
        </div>
      </div>
      {title && <p className="font-medium text-sm text-[#0a0a0a] mb-1">{title}</p>}
      {comment && <p className="text-sm text-[#4b4b4b] mb-4 line-clamp-3">{comment}</p>}
      <div className="flex gap-2 justify-end text-[11px] uppercase tracking-widest">
        {onReject && (
          <button onClick={() => onReject(id)} disabled={busy}
            className="px-4 py-1.5 border border-[#e8e4e0] text-red-600 hover:bg-red-50 disabled:opacity-40">
            Reject
          </button>
        )}
        {onApprove && (
          <button onClick={() => onApprove(id)} disabled={busy}
            className="px-4 py-1.5 bg-[#0a0a0a] text-white hover:bg-[#333] disabled:opacity-40">
            Approve
          </button>
        )}
      </div>
    </div>
  )
}
