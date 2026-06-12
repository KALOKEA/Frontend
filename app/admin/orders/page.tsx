'use client'
import { useEffect, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { adminApi, type AdminOrder } from '@/lib/api/admin'
import Spinner from '@/components/ui/Spinner'
import { formatPrice } from '@/lib/utils/formatPrice'

const ALL_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

const STATUS_COLOR: Record<string, string> = {
  pending:   'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped:   'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-700',
}

const PAY_COLOR: Record<string, string> = {
  paid:     'text-green-700',
  pending:  'text-amber-600',
  failed:   'text-red-600',
  refunded: 'text-purple-600',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState<AdminOrder | null>(null)
  const [detail, setDetail] = useState<AdminOrder | null>(null)
  const [newStatus, setNewStatus] = useState('pending')
  const [tracking, setTracking] = useState('')
  const [courier, setCourier] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  const limit = 20

  function load(p = page) {
    setLoading(true)
    adminApi.listOrders(p, limit)
      .then(res => {
        setOrders((res as any).data || [])
        setTotal((res as any).meta?.total || 0)
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load(page) }, [page]) // eslint-disable-line react-hooks/exhaustive-deps

  function openEdit(o: AdminOrder) {
    setEditing(o); setNewStatus(o.status); setTracking(''); setCourier(''); setMsg(null)
  }

  async function save() {
    if (!editing) return
    setSaving(true); setMsg(null)
    try {
      await adminApi.updateOrderStatus(editing.id, {
        status: newStatus,
        ...(newStatus === 'shipped' ? { tracking_number: tracking, courier_name: courier } : {}),
      })
      setEditing(null)
      load(page)
    } catch (e: any) {
      setMsg(e?.message || 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  const q = search.trim().toLowerCase()
  const visible = orders.filter(o => {
    const matchStatus = !statusFilter || o.status === statusFilter
    const matchSearch = !q || (
      o.order_number.toLowerCase().includes(q) ||
      (o.users?.name || '').toLowerCase().includes(q) ||
      (o.users?.email || '').toLowerCase().includes(q) ||
      (o.address_snapshot?.name || '').toLowerCase().includes(q)
    )
    return matchStatus && matchSearch
  })

  return (
    <>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-[#0a0a0a]">Orders</h1>
          <p className="text-sm text-[#6b6b6b] mt-1">{total} total</p>
        </div>
        <button
          onClick={async () => {
            setExporting(true)
            try { await adminApi.exportOrders({ status: statusFilter || undefined }) }
            catch (e: any) { alert(e?.message || 'Export failed') }
            finally { setExporting(false) }
          }}
          disabled={exporting}
          className="px-4 py-2 text-sm border border-[#e8e4e0] hover:bg-[#faf8f5] disabled:opacity-50 transition-colors"
        >
          {exporting ? 'Exporting…' : '↓ Export CSV'}
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by order number, customer name or email…"
          className="w-full border border-[#e8e4e0] px-4 py-2.5 text-sm focus:border-[#0a0a0a] outline-none pr-8"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b6b] hover:text-[#0a0a0a] text-xl leading-none"><X size={16} /></button>
        )}
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-0 mb-6 border-b border-[#e8e4e0] overflow-x-auto">
        {['', ...ALL_STATUSES].map(s => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2.5 text-[11px] uppercase tracking-widest border-b-2 -mb-px transition-colors whitespace-nowrap ${
              statusFilter === s
                ? 'border-[#0a0a0a] text-[#0a0a0a] font-medium'
                : 'border-transparent text-[#6b6b6b] hover:text-[#0a0a0a]'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="bg-white border border-[#e8e4e0] overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm font-sans">
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
              {visible.map(o => (
                <tr key={o.id} className="border-b border-[#f0ece8] last:border-0 hover:bg-[#faf8f5] transition-colors">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setDetail(o)}
                      className="font-medium text-[#0a0a0a] hover:text-[#c8a4a5] hover:underline text-left"
                    >
                      {o.order_number}
                    </button>
                    {o.order_items && o.order_items.length > 0 && (
                      <span className="block text-[10px] text-[#6b6b6b]">
                        {o.order_items.length} item{o.order_items.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[#0a0a0a]">{o.users?.name || o.address_snapshot?.name || 'Guest'}</span>
                    {o.users?.email && <span className="block text-[10px] text-[#6b6b6b]">{o.users.email}</span>}
                  </td>
                  <td className="px-4 py-3 font-medium">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3">
                    <span className="text-[#6b6b6b] capitalize text-xs">{o.payment_method || '—'}</span>
                    {o.payment_status && (
                      <span className={`block text-[10px] uppercase font-medium ${PAY_COLOR[o.payment_status] || 'text-[#6b6b6b]'}`}>
                        {o.payment_status}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-widest ${STATUS_COLOR[o.status] || 'bg-gray-100 text-gray-700'}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#6b6b6b] text-xs whitespace-nowrap">
                    {new Date(o.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(o)} className="text-[11px] uppercase tracking-widest text-[#c8a4a5] hover:underline">
                      Update
                    </button>
                  </td>
                </tr>
              ))}
              {!visible.length && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-[#6b6b6b]">
                    {statusFilter ? `No ${statusFilter} orders` : 'No orders yet'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {total > limit && (
        <div className="flex gap-2 mt-4 items-center text-sm">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border border-[#e8e4e0] disabled:opacity-40 hover:bg-[#faf8f5]"><span className="flex items-center gap-1"><ChevronLeft size={14} />Prev</span></button>
          <span className="text-[#6b6b6b]">Page {page} of {Math.ceil(total / limit)}</span>
          <button disabled={page >= Math.ceil(total / limit)} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border border-[#e8e4e0] disabled:opacity-40 hover:bg-[#faf8f5]"><span className="flex items-center gap-1">Next<ChevronRight size={14} /></span></button>
        </div>
      )}

      {/* ── Order detail modal ─────────────────────────────────────── */}
      {detail && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setDetail(null)}>
          <div className="bg-white w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-serif text-xl text-[#0a0a0a]">{detail.order_number}</h2>
                <p className="text-xs text-[#6b6b6b] mt-0.5">
                  {new Date(detail.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${STATUS_COLOR[detail.status] || ''}`}>
                {detail.status}
              </span>
            </div>

            {/* Customer & address */}
            <div className="mb-4 p-3 bg-[#faf8f5] border border-[#e8e4e0]">
              <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-1">Customer</p>
              <p className="text-sm font-medium">{detail.users?.name || detail.address_snapshot?.name || 'Guest'}</p>
              {detail.users?.email && <p className="text-xs text-[#6b6b6b]">{detail.users.email}</p>}
              {detail.address_snapshot && (
                <p className="text-xs text-[#6b6b6b] mt-1">
                  {[
                    detail.address_snapshot.line1,
                    detail.address_snapshot.city,
                    detail.address_snapshot.state,
                    detail.address_snapshot.pincode,
                  ].filter(Boolean).join(', ')}
                </p>
              )}
            </div>

            {/* Line items */}
            {detail.order_items && detail.order_items.length > 0 ? (
              <div className="mb-4">
                <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-2">Items</p>
                <div className="divide-y divide-[#f0ece8]">
                  {detail.order_items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center py-2.5">
                      <div className="min-w-0 pr-4">
                        <p className="text-sm text-[#0a0a0a] font-medium truncate">{item.snapshot_name}</p>
                        <p className="text-xs text-[#6b6b6b]">
                          {[item.snapshot_colour, item.snapshot_size].filter(Boolean).join(' / ')}
                          {' '}&times;{item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-medium shrink-0">{formatPrice(item.snapshot_price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs text-[#6b6b6b] mb-4 italic">No line items attached to this order record.</p>
            )}

            {/* Totals */}
            <div className="border-t border-[#e8e4e0] pt-3 space-y-1.5">
              <div className="flex justify-between text-sm font-medium">
                <span>Total</span>
                <span>{formatPrice(detail.total)}</span>
              </div>
              <div className="flex justify-between text-xs text-[#6b6b6b]">
                <span>Payment</span>
                <span className="capitalize">
                  {detail.payment_method} ·{' '}
                  <span className={PAY_COLOR[detail.payment_status || ''] || ''}>{detail.payment_status}</span>
                </span>
              </div>
            </div>

            <div className="flex justify-end mt-5 gap-2">
              <button onClick={() => setDetail(null)} className="px-4 py-2 text-sm border border-[#e8e4e0] hover:bg-[#faf8f5]">Close</button>
              <button
                onClick={() => { setDetail(null); openEdit(detail) }}
                className="px-4 py-2 text-sm border border-[#0a0a0a] hover:bg-[#faf8f5]"
              >
                Update Status
              </button>
              <Link
                href={`/admin/order-detail/?id=${detail.id}`}
                className="px-4 py-2 text-sm bg-[#ff6600] text-white hover:bg-[#e55a00] transition-colors"
              >
                Full Details / Ship ↗
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Update status modal ─────────────────────────────────────── */}
      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setEditing(null)}>
          <div className="bg-white w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="font-serif text-xl mb-1 text-[#0a0a0a]">Update {editing.order_number}</h2>
            <p className="text-xs text-[#6b6b6b] mb-4">
              Current:{' '}
              <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase ${STATUS_COLOR[editing.status] || ''}`}>
                {editing.status}
              </span>
            </p>

            <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">New status</label>
            <select
              value={newStatus}
              onChange={e => setNewStatus(e.target.value)}
              className="w-full border border-[#e8e4e0] px-3 py-2 mb-4 text-sm focus:border-[#0a0a0a] outline-none"
            >
              {ALL_STATUSES.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>

            {newStatus === 'shipped' && (
              <div className="bg-[#faf8f5] border border-[#e8e4e0] p-3 mb-4 space-y-3">
                <p className="text-[11px] text-[#6b6b6b]">
                  Marking as shipped emails the customer with tracking details.
                </p>
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Tracking number</label>
                  <input value={tracking} onChange={e => setTracking(e.target.value)} className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none" />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Courier</label>
                  <input value={courier} onChange={e => setCourier(e.target.value)} placeholder="Delhivery, BlueDart, DTDC…" className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none" />
                </div>
              </div>
            )}

            {msg && <p className="text-sm text-red-600 mb-3">{msg}</p>}

            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm border border-[#e8e4e0] hover:bg-[#faf8f5]">Cancel</button>
              <button onClick={save} disabled={saving} className="px-4 py-2 text-sm bg-[#0a0a0a] text-white hover:bg-[#333] disabled:opacity-50">
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
