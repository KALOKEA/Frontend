'use client'
import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { adminApi, type ActivityLogEntry } from '@/lib/api/admin'
import Spinner from '@/components/ui/Spinner'

const ACTION_LABELS: Record<string, string> = {
  'product.create': 'Created product',
  'product.update': 'Updated product',
  'product.deactivate': 'Deactivated product',
  'order.status_change': 'Updated order status',
  'coupon.create': 'Created coupon',
  'coupon.toggle': 'Toggled coupon',
  'banner.create': 'Created banner',
  'banner.update': 'Updated banner',
  'banner.delete': 'Deleted banner',
  'review.approve': 'Approved review',
  'review.reject': 'Rejected review',
  'return.status_change': 'Updated return status',
}

const ACTION_COLORS: Record<string, string> = {
  'product.create': 'bg-[#e8f5e9] text-[#2e7d32]',
  'product.update': 'bg-[#e3f2fd] text-[#1565c0]',
  'product.deactivate': 'bg-[#fce4ec] text-[#c62828]',
  'order.status_change': 'bg-[#fff8e1] text-[#f57f17]',
  'coupon.create': 'bg-[#e8f5e9] text-[#2e7d32]',
  'coupon.toggle': 'bg-[#f3e5f5] text-[#6a1b9a]',
  'banner.create': 'bg-[#e8f5e9] text-[#2e7d32]',
  'banner.update': 'bg-[#e3f2fd] text-[#1565c0]',
  'banner.delete': 'bg-[#fce4ec] text-[#c62828]',
  'review.approve': 'bg-[#e8f5e9] text-[#2e7d32]',
  'review.reject': 'bg-[#fce4ec] text-[#c62828]',
  'return.status_change': 'bg-[#fff8e1] text-[#f57f17]',
}

const ENTITY_FILTERS = ['', 'product', 'order', 'coupon', 'banner', 'review', 'return']

export default function AdminActivityPage() {
  const [entries, setEntries] = useState<ActivityLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [entityFilter, setEntityFilter] = useState('')
  const limit = 50

  function load(p = page, ef = entityFilter) {
    setLoading(true)
    adminApi.listActivityLog(p, limit, undefined, ef || undefined)
      .then(res => {
        setEntries(res.data || [])
        setTotal(res.meta?.total || 0)
        setTotalPages(res.meta?.total_pages || 1)
      })
      .catch(() => setEntries([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load(1, entityFilter) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function applyFilter(ef: string) {
    setEntityFilter(ef)
    setPage(1)
    load(1, ef)
  }

  function changePage(p: number) {
    setPage(p)
    load(p, entityFilter)
  }

  function fmt(dateStr: string) {
    const d = new Date(dateStr)
    return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-8 gap-3">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-[#0a0a0a]">Activity Log</h1>
          <p className="text-sm text-[#6b6b6b] mt-1">Every admin mutation — who did what and when.</p>
        </div>
        {total > 0 && (
          <span className="text-sm text-[#6b6b6b]">{total.toLocaleString()} entries</span>
        )}
      </div>

      {/* Entity type filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {ENTITY_FILTERS.map(ef => (
          <button
            key={ef}
            onClick={() => applyFilter(ef)}
            className={`px-3 py-1.5 text-[11px] uppercase tracking-widest border transition-colors ${
              entityFilter === ef
                ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]'
                : 'border-[#e8e4e0] text-[#6b6b6b] hover:border-[#0a0a0a] hover:text-[#0a0a0a]'
            }`}
          >
            {ef || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : !entries.length ? (
        <div className="bg-white border border-[#e8e4e0] px-4 py-16 text-center">
          <p className="font-serif text-lg text-[#6b6b6b] mb-1">No activity yet</p>
          <p className="text-xs text-[#6b6b6b]">Admin actions will appear here once you start managing products, orders, and more.</p>
        </div>
      ) : (
        <div className="bg-white border border-[#e8e4e0] overflow-x-auto">
          <table className="w-full min-w-[540px] text-sm font-sans">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-widest text-[#6b6b6b] border-b border-[#e8e4e0]">
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Entity</th>
                <th className="px-4 py-3">Admin</th>
                <th className="px-4 py-3">When</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(e => (
                <tr key={e.id} className="border-b border-[#f0ece8] last:border-0 hover:bg-[#faf8f5] transition-colors">
                  <td className="px-4 py-3">
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 ${ACTION_COLORS[e.action] || 'bg-[#f0ece8] text-[#6b6b6b]'}`}>
                      {ACTION_LABELS[e.action] || e.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#6b6b6b]">
                    {e.entity_type && (
                      <span className="capitalize">{e.entity_type}</span>
                    )}
                    {e.entity_id && (
                      <span className="block text-[10px] text-[#6b6b6b] font-mono">{e.entity_id.slice(0, 8)}…</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#6b6b6b]">
                    {e.users?.name || e.users?.email || <span className="text-[#6b6b6b]">—</span>}
                  </td>
                  <td className="px-4 py-3 text-[#6b6b6b] whitespace-nowrap text-xs">{fmt(e.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex gap-2 mt-4 items-center text-sm">
          <button
            disabled={page <= 1}
            onClick={() => changePage(page - 1)}
            className="px-3 py-1 border border-[#e8e4e0] disabled:opacity-40 hover:bg-[#faf8f5] flex items-center gap-1"
          >
            <ChevronLeft size={14} aria-hidden="true" /> Prev
          </button>
          <span className="text-[#6b6b6b] px-2">Page {page} of {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => changePage(page + 1)}
            className="px-3 py-1 border border-[#e8e4e0] disabled:opacity-40 hover:bg-[#faf8f5] flex items-center gap-1"
          >
            Next <ChevronRight size={14} aria-hidden="true" />
          </button>
        </div>
      )}
    </>
  )
}
