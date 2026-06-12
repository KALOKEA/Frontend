'use client'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { adminApi, type PendingReview, type AllReview } from '@/lib/api/admin'
import { useToast } from '@/components/ui/Toast'
import Spinner from '@/components/ui/Spinner'

type Tab = 'pending' | 'all'

function StarRow({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12} fill={i <= n ? '#C49070' : 'none'} stroke="#C49070" />
      ))}
    </span>
  )
}

export default function AdminReviewsPage() {
  const { toast } = useToast()
  const [tab, setTab] = useState<Tab>('pending')
  const [pending, setPending] = useState<PendingReview[]>([])
  const [all, setAll] = useState<AllReview[]>([])
  const [allTotal, setAllTotal] = useState(0)
  const [allPage, setAllPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)
  // filter/sort
  const [filterRating, setFilterRating] = useState(0)  // 0 = all
  const [sortBy, setSortBy] = useState('newest')        // newest | oldest | highest | lowest
  // reply modal
  const [replyTarget, setReplyTarget] = useState<AllReview | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replySaving, setReplySaving] = useState(false)
  // flag modal
  const [flagTarget, setFlagTarget] = useState<AllReview | null>(null)
  const [flagReason, setFlagReason] = useState('')
  const [flagSaving, setFlagSaving] = useState(false)

  function loadPending() {
    setLoading(true)
    adminApi.listPendingReviews()
      .then(setPending)
      .catch(() => setPending([]))
      .finally(() => setLoading(false))
  }

  function loadAll(p = allPage, rating = filterRating, sort = sortBy) {
    setLoading(true)
    adminApi.listAllReviews(p, 30, rating || undefined, sort)
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

  // Apply client-side sort/filter since backend may not support them yet
  const displayAll = [...all]
    .filter(r => filterRating === 0 || r.rating === filterRating)
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      if (sortBy === 'oldest') return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      if (sortBy === 'highest') return b.rating - a.rating
      if (sortBy === 'lowest') return a.rating - b.rating
      return 0
    })

  async function approve(id: string) {
    setBusyId(id)
    try {
      await adminApi.approveReview(id)
      toast('Review approved')
      if (tab === 'pending') setPending(prev => prev.filter(r => r.id !== id))
      else loadAll(allPage)
    } catch { toast('Failed to approve') } finally { setBusyId(null) }
  }

  async function reject(id: string) {
    if (!confirm('Reject and delete this review?')) return
    setBusyId(id)
    try {
      await adminApi.rejectReview(id)
      toast('Review rejected')
      if (tab === 'pending') setPending(prev => prev.filter(r => r.id !== id))
      else loadAll(allPage)
    } catch { toast('Failed to reject') } finally { setBusyId(null) }
  }

  async function submitReply() {
    if (!replyTarget || !replyText.trim()) return
    setReplySaving(true)
    try {
      await adminApi.replyToReview(replyTarget.id, replyText.trim())
      toast('Reply posted')
      setReplyTarget(null)
      setReplyText('')
      if (tab === 'all') loadAll(allPage)
      else loadPending()
    } catch (e: any) {
      toast(e?.message || 'Failed to post reply')
    } finally { setReplySaving(false) }
  }

  async function submitFlag() {
    if (!flagTarget) return
    setFlagSaving(true)
    try {
      const isCurrentlyFlagged = flagTarget.flagged
      await adminApi.flagReview(flagTarget.id, !isCurrentlyFlagged, flagReason || undefined)
      toast(isCurrentlyFlagged ? 'Flag removed' : 'Review flagged')
      setFlagTarget(null)
      setFlagReason('')
      if (tab === 'all') loadAll(allPage)
      else loadPending()
    } catch (e: any) {
      toast(e?.message || 'Failed to flag review')
    } finally { setFlagSaving(false) }
  }

  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-[#0a0a0a]">Reviews</h1>
          {tab === 'pending' && pending.length > 0 && (
            <p className="text-sm text-amber-700 mt-0.5">{pending.length} awaiting moderation</p>
          )}
        </div>
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
            {t === 'pending'
              ? `Pending${pending.length > 0 ? ` (${pending.length})` : ''}`
              : `All Reviews${allTotal > 0 ? ` (${allTotal})` : ''}`
            }
          </button>
        ))}
      </div>

      {/* Filters — only on All tab */}
      {tab === 'all' && (
        <div className="flex flex-wrap gap-3 mb-5">
          <select
            value={filterRating}
            onChange={e => setFilterRating(Number(e.target.value))}
            className="text-sm border border-[#e8e4e0] px-3 py-2 bg-white text-[#0a0a0a] focus:outline-none"
          >
            <option value={0}>All Ratings</option>
            {[5, 4, 3, 2, 1].map(r => (
              <option key={r} value={r}>{r} Star{r !== 1 ? 's' : ''}</option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="text-sm border border-[#e8e4e0] px-3 py-2 bg-white text-[#0a0a0a] focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : tab === 'pending' ? (
        pending.length > 0 ? (
          <div className="space-y-4">
            {pending.map(r => (
              <ReviewCard
                key={r.id}
                review={{ ...r, is_approved: false }}
                busy={busyId === r.id}
                onApprove={approve}
                onReject={reject}
                onReply={rv => { setReplyTarget(rv as any); setReplyText((rv as any).admin_reply || '') }}
                onFlag={rv => { setFlagTarget(rv as any); setFlagReason((rv as any).flag_reason || '') }}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-[#e8e4e0] px-4 py-16 text-center">
            <p className="font-serif text-lg text-[#6b6b6b]">All caught up</p>
            <p className="text-xs text-[#6b6b6b] mt-1">No reviews awaiting moderation.</p>
          </div>
        )
      ) : (
        <>
          {displayAll.length > 0 ? (
            <div className="space-y-3">
              {displayAll.map(r => (
                <ReviewCard
                  key={r.id}
                  review={r}
                  busy={busyId === r.id}
                  onApprove={r.is_approved ? undefined : approve}
                  onReject={reject}
                  onReply={rv => { setReplyTarget(rv); setReplyText(rv.admin_reply || '') }}
                  onFlag={rv => { setFlagTarget(rv); setFlagReason(rv.flag_reason || '') }}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#6b6b6b] py-10 text-center">No reviews found.</p>
          )}
          {allTotal > 30 && (
            <div className="flex gap-2 mt-4 items-center text-sm">
              <button disabled={allPage <= 1} onClick={() => { setAllPage(p => p - 1); loadAll(allPage - 1) }}
                className="px-3 py-1 border border-[#e8e4e0] disabled:opacity-40 hover:bg-[#faf8f5] flex items-center gap-1"><ChevronLeft size={14} /> Prev</button>
              <span className="text-[#6b6b6b] px-2">Page {allPage} of {Math.ceil(allTotal / 30)}</span>
              <button disabled={allPage >= Math.ceil(allTotal / 30)} onClick={() => { setAllPage(p => p + 1); loadAll(allPage + 1) }}
                className="px-3 py-1 border border-[#e8e4e0] disabled:opacity-40 hover:bg-[#faf8f5] flex items-center gap-1">Next <ChevronRight size={14} /></button>
            </div>
          )}
        </>
      )}

      {/* Reply Modal */}
      {replyTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setReplyTarget(null)}>
          <div className="bg-white w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="font-serif text-xl mb-1">Reply to Review</h2>
            <p className="text-xs text-[#6b6b6b] mb-1">
              {replyTarget.products?.name} — by {(replyTarget as any).users?.name || 'Customer'}
            </p>
            {replyTarget.comment && (
              <div className="bg-[#faf8f5] border border-[#e8e4e0] px-3 py-2 text-sm text-[#4b4b4b] italic mb-4">
                "{replyTarget.comment}"
              </div>
            )}
            <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Your Reply</label>
            <textarea
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              rows={4}
              placeholder="Write a public reply visible to all customers…"
              className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:outline-none focus:border-[#0a0a0a] resize-none mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setReplyTarget(null)} className="px-4 py-2 text-sm border border-[#e8e4e0] hover:bg-[#faf8f5]">Cancel</button>
              <button onClick={submitReply} disabled={replySaving || !replyText.trim()}
                className="px-4 py-2 text-sm bg-[#0a0a0a] text-white disabled:opacity-50">
                {replySaving ? 'Saving…' : 'Post Reply'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flag Modal */}
      {flagTarget && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setFlagTarget(null)}>
          <div className="bg-white w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="font-serif text-xl mb-1">
              {flagTarget.flagged ? 'Remove Flag' : 'Flag Review'}
            </h2>
            <p className="text-xs text-[#6b6b6b] mb-4">
              {flagTarget.products?.name} — <StarRow n={flagTarget.rating} /> by {(flagTarget as any).users?.name || 'Customer'}
            </p>
            {!flagTarget.flagged && (
              <>
                <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Reason (optional)</label>
                <select
                  value={flagReason}
                  onChange={e => setFlagReason(e.target.value)}
                  className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:outline-none mb-4"
                >
                  <option value="">Select reason…</option>
                  <option value="spam">Spam</option>
                  <option value="inappropriate">Inappropriate Content</option>
                  <option value="fake">Suspected Fake Review</option>
                  <option value="off_topic">Off Topic</option>
                  <option value="other">Other</option>
                </select>
              </>
            )}
            {flagTarget.flagged && (
              <p className="text-sm text-[#4b4b4b] mb-4">
                Currently flagged{flagTarget.flag_reason ? ` for: ${flagTarget.flag_reason}` : ''}. Remove the flag?
              </p>
            )}
            <div className="flex gap-2 justify-end">
              <button onClick={() => setFlagTarget(null)} className="px-4 py-2 text-sm border border-[#e8e4e0] hover:bg-[#faf8f5]">Cancel</button>
              <button onClick={submitFlag} disabled={flagSaving}
                className={`px-4 py-2 text-sm text-white disabled:opacity-50 ${flagTarget.flagged ? 'bg-gray-700 hover:bg-gray-800' : 'bg-red-600 hover:bg-red-700'}`}>
                {flagSaving ? 'Saving…' : flagTarget.flagged ? 'Remove Flag' : 'Flag Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function ReviewCard({
  review, busy, onApprove, onReject, onReply, onFlag,
}: {
  review: AllReview
  busy: boolean
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  onReply: (r: AllReview) => void
  onFlag: (r: AllReview) => void
}) {
  const { id, rating, title, comment, is_approved, flagged, admin_reply, created_at } = review
  const customer = review.users?.name
  const product = review.products?.name

  return (
    <div className={`bg-white border p-5 ${
      flagged
        ? 'border-red-200 bg-red-50/10'
        : is_approved
        ? 'border-[#e8e4e0]'
        : 'border-amber-200 bg-amber-50/20'
    }`}>
      <div className="flex justify-between items-start gap-4 mb-3">
        <div className="min-w-0">
          <p className="font-medium text-sm text-[#0a0a0a] truncate">{product || 'Unknown product'}</p>
          <p className="text-[11px] text-[#6b6b6b]">
            by {customer || 'Customer'} · {new Date(created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[#c8a4a5] text-sm"><StarRow n={rating} /></span>
          {flagged && (
            <span className="text-[9px] uppercase tracking-widest px-1.5 py-0.5 bg-red-100 text-red-700">
              Flagged
            </span>
          )}
          <span className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 ${is_approved ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-amber-100 text-amber-800'}`}>
            {is_approved ? 'Live' : 'Pending'}
          </span>
        </div>
      </div>

      {title && <p className="font-medium text-sm text-[#0a0a0a] mb-1">{title}</p>}
      {comment && <p className="text-sm text-[#4b4b4b] mb-3 line-clamp-3">{comment}</p>}

      {/* Admin reply preview */}
      {admin_reply && (
        <div className="bg-[#faf8f5] border-l-2 border-[#0a0a0a] px-3 py-2 mb-3 text-xs text-[#4b4b4b]">
          <span className="text-[10px] uppercase tracking-widest text-[#0a0a0a] font-medium block mb-0.5">Admin Reply</span>
          {admin_reply}
        </div>
      )}

      <div className="flex flex-wrap gap-2 justify-end text-[11px] uppercase tracking-widest">
        <button
          onClick={() => onFlag(review)}
          disabled={busy}
          className={`px-3 py-1.5 border disabled:opacity-40 ${
            flagged
              ? 'border-red-200 text-red-600 hover:bg-red-50'
              : 'border-[#e8e4e0] text-[#6b6b6b] hover:bg-[#faf8f5]'
          }`}
        >
          {flagged ? 'Unflag' : 'Flag'}
        </button>
        <button
          onClick={() => onReply(review)}
          disabled={busy}
          className="px-3 py-1.5 border border-[#e8e4e0] text-[#0a0a0a] hover:bg-[#faf8f5] disabled:opacity-40"
        >
          {admin_reply ? 'Edit Reply' : 'Reply'}
        </button>
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
