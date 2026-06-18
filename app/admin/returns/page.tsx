'use client'
import { useEffect, useState } from 'react'
import { adminApi, type ReturnRequest } from '@/lib/api/admin'
import { paymentsApi } from '@/lib/api/payments'
import { useToast } from '@/components/ui/Toast'
import Spinner from '@/components/ui/Spinner'

const STATUSES = ['requested', 'approved', 'rejected', 'received', 'refunded', 'completed']

const statusColor: Record<string, string> = {
  requested: 'bg-amber-100 text-amber-800',
  approved: 'bg-blue-100 text-blue-800',
  rejected: 'bg-red-100 text-red-700',
  received: 'bg-indigo-100 text-indigo-800',
  refunded: 'bg-green-100 text-green-800',
  completed: 'bg-green-100 text-green-800',
}

/** Generate Return ID: #RET-{orderNum}-01 */
function returnId(r: ReturnRequest) {
  const orderNum = (r.orders as any)?.order_number || r.order_id.slice(-6).toUpperCase()
  return `#RET-${orderNum}-01`
}

/** Extract product name + SKU from the joined order_item */
function productInfo(r: ReturnRequest) {
  const item = (r as any).order_items
  if (!item) return { name: '—', sku: '—', variant: '—' }
  const name = item.snapshot_name || '—'
  const sku = item.snapshot_sku || '—'
  const variant = [item.snapshot_size, item.snapshot_colour].filter(Boolean).join(' / ') || 'One Size'
  return { name, sku, variant }
}

export default function AdminReturnsPage() {
  const { toast } = useToast()
  const [returns, setReturns] = useState<ReturnRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<ReturnRequest | null>(null)
  const [status, setStatus] = useState('requested')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [refunding, setRefunding] = useState(false)
  const [quickBusy, setQuickBusy] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState('')

  function load() {
    setLoading(true)
    adminApi.listReturns().then(setReturns).catch(() => setReturns([])).finally(() => setLoading(false))
  }
  useEffect(load, [])

  function openEdit(r: ReturnRequest) {
    setEditing(r); setStatus(r.status); setNotes(r.admin_notes || ''); setMsg(null)
  }

  async function save() {
    if (!editing) return
    setSaving(true); setMsg(null)
    try {
      await adminApi.updateReturnStatus(editing.id, { status, admin_notes: notes || undefined })
      toast('Return updated'); setEditing(null); load()
    } catch (e: any) {
      setMsg(e?.message || 'Failed to update')
    } finally { setSaving(false) }
  }

  /** Quick-action: approve or reject directly from row */
  async function quickAction(r: ReturnRequest, newStatus: 'approved' | 'rejected') {
    if (newStatus === 'rejected' && !confirm(`Reject return ${returnId(r)}?`)) return
    setQuickBusy(r.id)
    try {
      await adminApi.updateReturnStatus(r.id, { status: newStatus })
      toast(`Return ${newStatus}`)
      load()
    } catch (e: any) {
      toast(e?.message || 'Action failed')
    } finally { setQuickBusy(null) }
  }

  async function processRefund() {
    if (!editing) return
    if (!confirm('Process the refund? Prepaid orders are refunded via Razorpay immediately.')) return
    setRefunding(true); setMsg(null)
    try {
      const r = await paymentsApi.refund({ order_id: editing.order_id, return_id: editing.id })
      await adminApi.updateReturnStatus(editing.id, { status: 'refunded', admin_notes: notes || undefined })
      toast(`Refund processed${r.amount ? ` — ₹${(r.amount / 100).toFixed(2)}` : ''}`)
      setEditing(null); load()
    } catch (e: any) { setMsg(e?.message || 'Refund failed')
    } finally { setRefunding(false) }
  }

  const filtered = filterStatus ? returns.filter(r => r.status === filterStatus) : returns

  // Stats
  const totalReturns = returns.length
  const pendingCount = returns.filter(r => r.status === 'requested').length
  const approvedCount = returns.filter(r => r.status === 'approved').length
  const completedCount = returns.filter(r => ['refunded', 'completed'].includes(r.status)).length

  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-[#0a0a0a]">Returns Management</h1>
          <p className="text-sm text-[#6b6b6b] mt-1">{totalReturns} total return requests</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Returns', value: totalReturns, color: 'bg-gray-50 text-gray-700' },
          { label: 'Pending Review', value: pendingCount, color: 'bg-amber-50 text-amber-700' },
          { label: 'Approved', value: approvedCount, color: 'bg-blue-50 text-blue-700' },
          { label: 'Completed', value: completedCount, color: 'bg-green-50 text-green-700' },
        ].map(({ label, value, color }) => (
          <div key={label} className={`${color} rounded-lg p-4 border border-current/10`}>
            <p className="text-xs font-sans opacity-70 mb-1">{label}</p>
            <p className="text-2xl font-serif font-semibold">{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="text-sm border border-[#e8e4e0] px-3 py-2 bg-white text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a]"
        >
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="bg-white border border-[#e8e4e0] overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm font-sans">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-widest text-[#6b6b6b] border-b border-[#e8e4e0] bg-[#faf8f5]">
                <th className="px-4 py-3">Return ID</th>
                <th className="px-4 py-3">Order #</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const { name, sku, variant } = productInfo(r)
                const rid = returnId(r)
                const isRequested = r.status === 'requested'
                return (
                  <tr key={r.id} className="border-b border-[#f0ece8] last:border-0 hover:bg-[#faf8f5] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-[#0a0a0a] whitespace-nowrap">{rid}</td>
                    <td className="px-4 py-3 text-[#6b6b6b] whitespace-nowrap">{(r.orders as any)?.order_number || '—'}</td>
                    <td className="px-4 py-3 text-[#6b6b6b] whitespace-nowrap">{(r.users as any)?.name || (r.users as any)?.email || '—'}</td>
                    <td className="px-4 py-3 text-[#0a0a0a] max-w-[160px]">
                      <p className="truncate">{name}</p>
                      <p className="text-[10px] text-[#9a9a9a]">{variant}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-[#6b6b6b]">{sku}</td>
                    <td className="px-4 py-3 text-[#6b6b6b] max-w-[120px] truncate">{r.reason || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${statusColor[r.status] || 'bg-gray-100 text-gray-700'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#6b6b6b] whitespace-nowrap">{new Date(r.created_at).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isRequested && (
                          <>
                            <button
                              onClick={() => quickAction(r, 'approved')}
                              disabled={quickBusy === r.id}
                              className="text-[10px] uppercase tracking-widest px-2.5 py-1.5 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 whitespace-nowrap"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => quickAction(r, 'rejected')}
                              disabled={quickBusy === r.id}
                              className="text-[10px] uppercase tracking-widest px-2.5 py-1.5 bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 whitespace-nowrap"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => openEdit(r)}
                          className="text-[10px] uppercase tracking-widest px-2.5 py-1.5 border border-[#e8e4e0] text-[#0a0a0a] hover:border-[#0a0a0a] whitespace-nowrap"
                        >
                          Manage
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {!filtered.length && (
                <tr><td colSpan={9} className="px-4 py-10 text-center text-[#6b6b6b]">No return requests</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div aria-hidden="true" className="absolute inset-0 bg-black/40" onClick={() => setEditing(null)} />
          <div className="relative bg-white w-full max-w-md p-6" role="dialog" aria-modal="true" aria-label="Update return status" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-serif text-xl mb-0.5">Return · {returnId(editing)}</h2>
            <p className="text-xs text-[#6b6b6b] mb-4">Order: {(editing.orders as any)?.order_number || editing.order_id}</p>
            {editing.reason && (
              <div className="bg-[#faf8f5] border border-[#e8e4e0] px-3 py-2 mb-4 text-sm text-[#6b6b6b]">
                <span className="text-[10px] uppercase tracking-widest text-[#0a0a0a] block mb-0.5">Reason</span>
                {editing.reason}
              </div>
            )}
            <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border border-[#e8e4e0] px-3 py-2 mb-4 text-sm focus:outline-none">
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Admin notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full border border-[#e8e4e0] px-3 py-2 mb-3 text-sm focus:outline-none" />
            {msg && <p className="text-sm text-red-600 mb-3">{msg}</p>}
            {editing.status !== 'refunded' && editing.status !== 'rejected' && (
              <div className="mb-3 border border-[#e8e4e0] bg-[#faf8f5] p-3">
                <p className="text-[11px] text-[#6b6b6b] mb-2">Refunding restocks the item and posts a GST credit note automatically.</p>
                <button onClick={processRefund} disabled={refunding} className="px-4 py-2 text-sm bg-[#c0392b] text-white disabled:opacity-50 w-full">
                  {refunding ? 'Processing refund…' : 'Process Refund'}
                </button>
              </div>
            )}
            <div className="flex gap-2 justify-end mt-4">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm border border-[#e8e4e0]">Cancel</button>
              <button onClick={save} disabled={saving} className="px-4 py-2 text-sm bg-[#0a0a0a] text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
