'use client'
import { useEffect, useState } from 'react'
import { exchangesApi, type ExchangeRequest } from '@/lib/api/exchanges'
import { useToast } from '@/components/ui/Toast'
import Spinner from '@/components/ui/Spinner'
import { formatPrice } from '@/lib/utils/formatPrice'

const STATUSES = ['requested', 'approved', 'rejected', 'completed']

const statusColor: Record<string, string> = {
  requested: 'bg-amber-100 text-amber-800',
  approved: 'bg-blue-100 text-blue-800',
  rejected: 'bg-red-100 text-red-700',
  completed: 'bg-green-100 text-green-800',
}

/** Generate Exchange ID: #EXC-{orderNum}-01 */
function exchangeId(e: ExchangeRequest) {
  const orderNum = e.orders?.order_number || e.order_id.slice(-6).toUpperCase()
  return `#EXC-${orderNum}-01`
}

export default function AdminExchangesPage() {
  const { toast } = useToast()
  const [list, setList] = useState<ExchangeRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<ExchangeRequest | null>(null)
  const [status, setStatus] = useState('requested')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [quickBusy, setQuickBusy] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState('')

  function load() {
    setLoading(true)
    exchangesApi.listAll().then(setList).catch(() => setList([])).finally(() => setLoading(false))
  }
  useEffect(load, [])

  function openEdit(e: ExchangeRequest) {
    setEditing(e); setStatus(e.status); setNotes(e.admin_notes || ''); setMsg(null)
  }

  async function save() {
    if (!editing) return
    setSaving(true); setMsg(null)
    try {
      await exchangesApi.updateStatus(editing.id, { status, admin_notes: notes || undefined })
      toast('Exchange updated'); setEditing(null); load()
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : 'Failed to update')
    } finally { setSaving(false) }
  }

  async function quickAction(e: ExchangeRequest, newStatus: 'approved' | 'rejected') {
    if (newStatus === 'rejected' && !confirm(`Reject exchange ${exchangeId(e)}?`)) return
    setQuickBusy(e.id)
    try {
      await exchangesApi.updateStatus(e.id, { status: newStatus })
      toast(`Exchange ${newStatus}`)
      load()
    } catch (err: unknown) {
      toast(err instanceof Error ? err.message : 'Action failed')
    } finally { setQuickBusy(null) }
  }

  const filtered = filterStatus ? list.filter(e => e.status === filterStatus) : list

  const totalExchanges = list.length
  const pendingCount = list.filter(e => e.status === 'requested').length
  const approvedCount = list.filter(e => e.status === 'approved').length
  const completedCount = list.filter(e => e.status === 'completed').length

  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-[#0a0a0a]">Exchanges</h1>
          <p className="text-sm text-[#6b6b6b] mt-1">
            Marking an exchange <strong>completed</strong> restocks the original item and reduces the new variant&rsquo;s stock.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Exchanges', value: totalExchanges, color: 'bg-gray-50 text-gray-700' },
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

      {/* Filter */}
      <div className="flex flex-wrap gap-3 mb-5">
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          aria-label="Filter by status"
          className="text-sm border border-[#e8e4e0] px-3 py-2 bg-white text-[#0a0a0a] focus:outline-none"
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
                <th className="px-4 py-3">Exchange ID</th>
                <th className="px-4 py-3">Order #</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">New Variant</th>
                <th className="px-4 py-3 text-right">Price Diff</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => {
                const eid = exchangeId(e)
                const isRequested = e.status === 'requested'
                return (
                  <tr key={e.id} className="border-b border-[#f0ece8] last:border-0 hover:bg-[#faf8f5] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-medium text-[#0a0a0a] whitespace-nowrap">{eid}</td>
                    <td className="px-4 py-3 text-[#6b6b6b] whitespace-nowrap">{e.orders?.order_number || '—'}</td>
                    <td className="px-4 py-3 text-[#6b6b6b] whitespace-nowrap">{e.users?.name || e.users?.email || '—'}</td>
                    <td className="px-4 py-3 text-[#6b6b6b] max-w-[120px] truncate">{e.reason}</td>
                    <td className="px-4 py-3 text-[#6b6b6b] max-w-[160px] truncate">
                      {[e.new_snapshot_name, e.new_snapshot_colour, e.new_snapshot_size].filter(Boolean).join(' · ')}
                    </td>
                    <td className="px-4 py-3 text-right text-[#6b6b6b] whitespace-nowrap">
                      {e.price_difference >= 0 ? '+' : ''}{formatPrice(e.price_difference)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${statusColor[e.status] || 'bg-gray-100 text-gray-700'}`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isRequested && (
                          <>
                            <button
                              onClick={() => quickAction(e, 'approved')}
                              disabled={quickBusy === e.id}
                              className="text-[10px] uppercase tracking-widest px-2.5 py-1.5 bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 whitespace-nowrap"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => quickAction(e, 'rejected')}
                              disabled={quickBusy === e.id}
                              className="text-[10px] uppercase tracking-widest px-2.5 py-1.5 bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 whitespace-nowrap"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => openEdit(e)}
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
                <tr><td colSpan={8} className="px-4 py-10 text-center text-[#6b6b6b]">No exchange requests</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div aria-hidden="true" className="absolute inset-0 bg-black/40" onClick={() => setEditing(null)} />
          <div className="relative bg-white w-full max-w-md p-6" role="dialog" aria-modal="true" aria-label="Update exchange status" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-serif text-xl mb-0.5">Exchange · {exchangeId(editing)}</h2>
            <p className="text-sm text-[#6b6b6b] mb-1">{editing.reason}</p>
            <p className="text-xs text-[#6b6b6b] mb-4">
              New: {[editing.new_snapshot_name, editing.new_snapshot_colour, editing.new_snapshot_size].filter(Boolean).join(' · ')} ·
              Price diff {formatPrice(editing.price_difference)} · GST diff {formatPrice(editing.gst_difference)}
            </p>
            <label className="block mb-4">
              <span className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Status</span>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:outline-none">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="block mb-3">
              <span className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Admin notes</span>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:outline-none" />
            </label>
            {msg && <p className="text-sm text-red-600 mb-3">{msg}</p>}
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
