'use client'
import { useEffect, useState } from 'react'
import { exchangesApi, type ExchangeRequest } from '@/lib/api/exchanges'
import Spinner from '@/components/ui/Spinner'
import { formatPrice } from '@/lib/utils/formatPrice'

const STATUSES = ['requested', 'approved', 'rejected', 'completed']

const statusColor: Record<string, string> = {
  requested: 'bg-amber-100 text-amber-800',
  approved: 'bg-blue-100 text-blue-800',
  rejected: 'bg-red-100 text-red-700',
  completed: 'bg-green-100 text-green-800',
}

export default function AdminExchangesPage() {
  const [list, setList] = useState<ExchangeRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<ExchangeRequest | null>(null)
  const [status, setStatus] = useState('requested')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

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
      setEditing(null); load()
    } catch (e: any) {
      setMsg(e?.message || 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <h1 className="font-serif text-3xl text-[#0a0a0a] mb-2">Exchanges</h1>
      <p className="text-sm text-[#6b6b6b] mb-8">
        Marking an exchange <strong>completed</strong> restocks the original item, reduces the new variant&rsquo;s stock, and posts the GST adjustment to the ledger.
      </p>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="bg-white border border-[#e8e4e0] overflow-x-auto">
          <table className="w-full text-sm font-sans whitespace-nowrap">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-widest text-[#6b6b6b] border-b border-[#e8e4e0]">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">New variant</th>
                <th className="px-4 py-3 text-right">Price diff</th>
                <th className="px-4 py-3 text-right">GST diff</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {list.map((e) => (
                <tr key={e.id} className="border-b border-[#f0ece8] last:border-0">
                  <td className="px-4 py-3 font-medium text-[#0a0a0a]">{e.orders?.order_number || e.order_id}</td>
                  <td className="px-4 py-3 text-[#6b6b6b]">{e.users?.name || e.users?.email || '—'}</td>
                  <td className="px-4 py-3 text-[#6b6b6b]">{e.reason}</td>
                  <td className="px-4 py-3 text-[#6b6b6b]">{[e.new_snapshot_name, e.new_snapshot_colour, e.new_snapshot_size].filter(Boolean).join(' · ')}</td>
                  <td className="px-4 py-3 text-right text-[#6b6b6b]">{e.price_difference >= 0 ? '+' : ''}{formatPrice(e.price_difference)}</td>
                  <td className="px-4 py-3 text-right text-[#6b6b6b]">{e.gst_difference >= 0 ? '+' : ''}{formatPrice(e.gst_difference)}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded text-[11px] ${statusColor[e.status] || 'bg-gray-100 text-gray-700'}`}>{e.status}</span></td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(e)} className="text-[11px] uppercase tracking-widest text-[#c8a4a5] hover:underline">Manage</button>
                  </td>
                </tr>
              ))}
              {!list.length && <tr><td colSpan={8} className="px-4 py-8 text-center text-[#6b6b6b]">No exchange requests</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setEditing(null)}>
          <div className="bg-white w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-serif text-xl mb-1">Exchange · {editing.orders?.order_number || editing.order_id}</h2>
            <p className="text-sm text-[#6b6b6b] mb-1">{editing.reason}</p>
            <p className="text-xs text-[#6b6b6b] mb-4">
              New: {[editing.new_snapshot_name, editing.new_snapshot_colour, editing.new_snapshot_size].filter(Boolean).join(' · ')} ·
              Price diff {formatPrice(editing.price_difference)} · GST diff {formatPrice(editing.gst_difference)}
            </p>
            <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border border-[#e8e4e0] px-3 py-2 mb-4 text-sm">
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Admin notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full border border-[#e8e4e0] px-3 py-2 mb-3 text-sm" />
            {msg && <p className="text-sm text-red-600 mb-3">{msg}</p>}
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
