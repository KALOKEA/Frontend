'use client'
import { useEffect, useState } from 'react'
import { adminApi, type AdminOrder } from '@/lib/api/admin'
import Spinner from '@/components/ui/Spinner'
import { formatPrice } from '@/lib/utils/formatPrice'

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

const statusColor: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-700',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [editing, setEditing] = useState<AdminOrder | null>(null)
  const [status, setStatus] = useState('pending')
  const [tracking, setTracking] = useState('')
  const [courier, setCourier] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const limit = 20

  function load() {
    setLoading(true)
    adminApi.listOrders(page, limit)
      .then((res) => { setOrders(res.data || []); setTotal(res.meta?.total || 0) })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }

  useEffect(load, [page])

  function openEdit(o: AdminOrder) {
    setEditing(o); setStatus(o.status); setTracking(''); setCourier(''); setMsg(null)
  }

  async function save() {
    if (!editing) return
    setSaving(true); setMsg(null)
    try {
      await adminApi.updateOrderStatus(editing.id, {
        status,
        ...(status === 'shipped' ? { tracking_number: tracking, courier_name: courier } : {}),
      })
      setEditing(null)
      load()
    } catch (e: any) {
      setMsg(e?.message || 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <h1 className="font-serif text-3xl text-[#0a0a0a] mb-8">Orders</h1>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="bg-white border border-[#e8e4e0]">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-widest text-[#6b6b6b] border-b border-[#e8e4e0]">
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-[#f0ece8] last:border-0">
                  <td className="px-4 py-3 font-medium text-[#0a0a0a]">{o.order_number}</td>
                  <td className="px-4 py-3 text-[#6b6b6b]">{o.users?.name || o.address_snapshot?.name || 'Guest'}</td>
                  <td className="px-4 py-3">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3 text-[#6b6b6b]">
                    {o.payment_method || '—'}
                    {o.payment_status ? <span className="block text-[10px] uppercase">{o.payment_status}</span> : null}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${statusColor[o.status] || 'bg-gray-100 text-gray-700'}`}>{o.status}</span>
                  </td>
                  <td className="px-4 py-3 text-[#6b6b6b]">{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(o)} className="text-[11px] uppercase tracking-widest text-[#c8a4a5] hover:underline">Update</button>
                  </td>
                </tr>
              ))}
              {!orders.length && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-[#6b6b6b]">No orders</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {total > limit && (
        <div className="flex gap-2 mt-4 items-center text-sm">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 border border-[#e8e4e0] disabled:opacity-40">Prev</button>
          <span className="text-[#6b6b6b]">Page {page} of {Math.ceil(total / limit)}</span>
          <button disabled={page >= Math.ceil(total / limit)} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 border border-[#e8e4e0] disabled:opacity-40">Next</button>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setEditing(null)}>
          <div className="bg-white w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-serif text-xl mb-4">Update {editing.order_number}</h2>
            <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full border border-[#e8e4e0] px-3 py-2 mb-4 text-sm">
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {status === 'shipped' && (
              <>
                <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Tracking number</label>
                <input value={tracking} onChange={(e) => setTracking(e.target.value)} className="w-full border border-[#e8e4e0] px-3 py-2 mb-3 text-sm" />
                <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Courier</label>
                <input value={courier} onChange={(e) => setCourier(e.target.value)} className="w-full border border-[#e8e4e0] px-3 py-2 mb-3 text-sm" />
                <p className="text-[11px] text-[#6b6b6b] mb-3">Marking as shipped emails the customer the tracking details.</p>
              </>
            )}
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
