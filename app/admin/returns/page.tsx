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

export default function AdminReturnsPage() {
  const { toast } = useToast()
  const [returns, setReturns] = useState<ReturnRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<ReturnRequest | null>(null)
  const [status, setStatus] = useState('requested')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [refunding, setRefunding] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  // Process a refund: hit the payment gateway (Razorpay) or record a manual COD
  // refund, then move the return to 'refunded' (which restocks + posts the GST
  // credit note). The refund amount defaults to the returned item's value.
  async function processRefund() {
    if (!editing) return
    if (!confirm('Process the refund for this return? Prepaid orders are refunded via Razorpay immediately.')) return
    setRefunding(true); setMsg(null)
    try {
      const r = await paymentsApi.refund({ order_id: editing.order_id, return_id: editing.id })
      await adminApi.updateReturnStatus(editing.id, { status: 'refunded', admin_notes: notes || undefined })
      toast(`Refund processed${r.amount ? ` — ₹${(r.amount / 100).toFixed(2)}` : ''}`)
      setEditing(null); load()
    } catch (e: any) {
      setMsg(e?.message || 'Refund failed')
    } finally {
      setRefunding(false)
    }
  }

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
      setEditing(null); load()
    } catch (e: any) {
      setMsg(e?.message || 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <h1 className="font-serif text-3xl text-[#0a0a0a] mb-8">Returns</h1>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="bg-white border border-[#e8e4e0]">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-widest text-[#6b6b6b] border-b border-[#e8e4e0]">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {returns.map((r) => (
                <tr key={r.id} className="border-b border-[#f0ece8] last:border-0">
                  <td className="px-4 py-3 font-medium text-[#0a0a0a]">{r.orders?.order_number || r.order_id}</td>
                  <td className="px-4 py-3 text-[#6b6b6b]">{r.users?.name || r.users?.email || '—'}</td>
                  <td className="px-4 py-3 text-[#6b6b6b] max-w-xs truncate">{r.reason || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${statusColor[r.status] || 'bg-gray-100 text-gray-700'}`}>{r.status}</span>
                  </td>
                  <td className="px-4 py-3 text-[#6b6b6b]">{new Date(r.created_at).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(r)} className="text-[11px] uppercase tracking-widest text-[#c8a4a5] hover:underline">Manage</button>
                  </td>
                </tr>
              ))}
              {!returns.length && <tr><td colSpan={6} className="px-4 py-8 text-center text-[#6b6b6b]">No return requests</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setEditing(null)}>
          <div className="bg-white w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-serif text-xl mb-1">Return · {editing.orders?.order_number || editing.order_id}</h2>
            {editing.reason && <p className="text-sm text-[#6b6b6b] mb-4">{editing.reason}</p>}
            <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border border-[#e8e4e0] px-3 py-2 mb-4 text-sm">
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Admin notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full border border-[#e8e4e0] px-3 py-2 mb-3 text-sm" />
            {msg && <p className="text-sm text-red-600 mb-3">{msg}</p>}
            {editing.status !== 'refunded' && (
              <div className="mb-3 border border-[#e8e4e0] bg-[#faf8f5] p-3">
                <p className="text-[11px] text-[#6b6b6b] mb-2">Refunding restocks the item and posts a GST credit note automatically.</p>
                <button onClick={processRefund} disabled={refunding} className="px-4 py-2 text-sm bg-[#c0392b] text-white disabled:opacity-50 w-full">
                  {refunding ? 'Processing refund…' : 'Process refund'}
                </button>
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm border border-[#e8e4e0]">Cancel</button>
              <button onClick={save} disabled={saving} className="px-4 py-2 text-sm bg-[#0a0a0a] text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
