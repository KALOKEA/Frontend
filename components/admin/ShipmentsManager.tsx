'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import api from '@/lib/api/client'
import { adminApi } from '@/lib/api/admin'
import { formatPrice } from '@/lib/utils/formatPrice'
import Spinner from '@/components/ui/Spinner'

type Filter = 'all' | 'not_pushed' | 'in_transit' | 'delivered' | 'cancelled'

const SR_STATUS_COLOR: Record<string, string> = {
  'not_pushed':  'bg-gray-100 text-gray-600',
  'Pending':     'bg-amber-100 text-amber-700',
  'Pickup Scheduled': 'bg-blue-100 text-blue-700',
  'In Transit':  'bg-indigo-100 text-indigo-700',
  'Out For Delivery': 'bg-purple-100 text-purple-700',
  'Delivered':   'bg-green-100 text-green-700',
  'Cancelled':   'bg-red-100 text-red-700',
  'RTO Initiated': 'bg-orange-100 text-orange-700',
  'RTO Delivered': 'bg-orange-200 text-orange-800',
}

const FILTER_LABELS: Record<Filter, string> = {
  all:        'All Orders',
  not_pushed: 'Not Pushed',
  in_transit: 'In Transit',
  delivered:  'Delivered',
  cancelled:  'Cancelled',
}

function PushForm({ orderId, onDone }: { orderId: string; onDone: () => void }) {
  const [weight, setWeight]   = useState('0.5')
  const [length, setLength]   = useState('20')
  const [breadth, setBreadth] = useState('15')
  const [height, setHeight]   = useState('5')
  const [loading, setLoading] = useState(false)
  const [err, setErr]         = useState('')

  async function submit() {
    setLoading(true); setErr('')
    try {
      await adminApi.pushToShiprocket(orderId, {
        weight: parseFloat(weight) || 0.5,
        length: parseFloat(length) || 20,
        breadth: parseFloat(breadth) || 15,
        height: parseFloat(height) || 5,
      })
      onDone()
    } catch (e: any) {
      setErr(e?.message || 'Failed to push')
      setLoading(false)
    }
  }

  return (
    <div className="mt-2 p-3 bg-[#faf8f5] border border-[#e8e4e0] text-[11px]">
      <p className="font-medium text-[#0a0a0a] mb-2 uppercase tracking-widest">Package Dimensions</p>
      <div className="grid grid-cols-4 gap-2 mb-2">
        {[
          ['Weight (kg)', weight, setWeight],
          ['Length (cm)', length, setLength],
          ['Breadth (cm)', breadth, setBreadth],
          ['Height (cm)', height, setHeight],
        ].map(([label, val, set]: any) => (
          <div key={label}>
            <label className="block text-[#6b6b6b] mb-0.5">{label}</label>
            <input
              type="number" step="0.1" value={val}
              onChange={e => set(e.target.value)}
              className="w-full border border-[#e8e4e0] px-2 py-1 text-[11px] outline-none focus:border-[#c8a4a5]"
            />
          </div>
        ))}
      </div>
      {err && <p className="text-red-600 mb-2">{err}</p>}
      <div className="flex gap-2">
        <button
          onClick={submit} disabled={loading}
          className="px-4 py-1.5 bg-[#0a0a0a] text-white text-[10px] uppercase tracking-widest hover:bg-[#2a2a2a] disabled:opacity-50"
        >
          {loading ? 'Pushing…' : 'Push to ShipRocket'}
        </button>
        <button onClick={onDone} className="px-4 py-1.5 border border-[#e8e4e0] text-[10px] uppercase tracking-widest text-[#6b6b6b] hover:text-[#0a0a0a]">
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function ShipmentsManager() {
  const [orders, setOrders]     = useState<any[]>([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState<Filter>('all')
  const [pushingId, setPushingId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [tracking, setTracking] = useState<Record<string, any>>({})
  const [msg, setMsg]           = useState<{ id: string; type: 'ok' | 'err'; text: string } | null>(null)

  const load = useCallback(async () => {
    try {
      const r = await api.get<any>('/orders/admin?limit=200')
      setOrders(r.orders || r || [])
    } catch { setOrders([]) }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = orders.filter(o => {
    if (filter === 'all') return true
    if (filter === 'not_pushed') return !o.shiprocket_order_id
    if (filter === 'in_transit') return ['Pending','Pickup Scheduled','In Transit','Out For Delivery'].includes(o.shiprocket_status)
    if (filter === 'delivered') return o.shiprocket_status === 'Delivered'
    if (filter === 'cancelled') return o.shiprocket_status === 'Cancelled'
    return true
  })

  async function doAction(orderId: string, action: () => Promise<any>, successMsg: string) {
    setActionLoading(orderId); setMsg(null)
    try {
      await action()
      setMsg({ id: orderId, type: 'ok', text: successMsg })
      await load()
    } catch (e: any) {
      setMsg({ id: orderId, type: 'err', text: e?.message || 'Action failed' })
    } finally { setActionLoading(null) }
  }

  async function handleTrack(orderId: string) {
    setActionLoading(orderId)
    try {
      const data = await adminApi.trackShipment(orderId)
      setTracking(prev => ({ ...prev, [orderId]: data }))
    } catch (e: any) {
      setMsg({ id: orderId, type: 'err', text: `Track failed: ${e?.message}` })
    } finally { setActionLoading(null) }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="font-serif text-2xl text-[#0a0a0a]">Shipments</h1>
        <button onClick={() => { setLoading(true); load() }} className="text-[11px] uppercase tracking-widest text-[#6b6b6b] hover:text-[#0a0a0a] border border-[#e8e4e0] px-3 py-1.5">
          ↻ Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1 mb-6">
        {(Object.keys(FILTER_LABELS) as Filter[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 text-[10px] uppercase tracking-widest border transition-colors ${
              filter === f
                ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]'
                : 'border-[#e8e4e0] text-[#6b6b6b] hover:text-[#0a0a0a] hover:border-[#0a0a0a]'
            }`}
          >
            {FILTER_LABELS[f]}
            {f === 'not_pushed' && orders.filter(o => !o.shiprocket_order_id).length > 0 && (
              <span className="ml-1.5 bg-amber-400 text-[#0a0a0a] rounded-full px-1.5 py-0 text-[9px]">
                {orders.filter(o => !o.shiprocket_order_id).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-[#6b6b6b] text-sm">No orders found for this filter.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => {
            const inSR   = !!order.shiprocket_order_id
            const hasAwb = !!order.awb_code
            const isAL   = actionLoading === order.id
            const srStatus = order.shiprocket_status || (inSR ? 'Pending' : 'not_pushed')
            const activities: any[] = tracking[order.id]?.tracking_data?.shipment_track_activities || []

            return (
              <div key={order.id} className="bg-white border border-[#e8e4e0] p-4">
                {/* Row header */}
                <div className="flex flex-wrap items-start gap-3 justify-between">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-[#0a0a0a] text-sm">#{order.order_number}</span>
                      <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded ${SR_STATUS_COLOR[srStatus] || 'bg-gray-100 text-gray-600'}`}>
                        {srStatus === 'not_pushed' ? 'Not Pushed' : srStatus}
                      </span>
                      {order.awb_code && (
                        <span className="text-[10px] text-[#6b6b6b]">AWB: <span className="font-mono text-[#0a0a0a]">{order.awb_code}</span></span>
                      )}
                      {order.courier_name && (
                        <span className="text-[10px] text-[#6b6b6b]">{order.courier_name}</span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#6b6b6b] mt-0.5">
                      {order.users?.name || order.guest_email || '—'} · {formatPrice(order.total)} · {new Date(order.created_at).toLocaleDateString('en-IN')}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-1.5 shrink-0">
                    {!inSR && (
                      <button
                        onClick={() => setPushingId(pushingId === order.id ? null : order.id)}
                        className="px-3 py-1.5 text-[10px] uppercase tracking-widest bg-[#0a0a0a] text-white hover:bg-[#2a2a2a]"
                      >
                        Push to SR
                      </button>
                    )}
                    {inSR && !hasAwb && (
                      <button
                        disabled={isAL}
                        onClick={() => doAction(order.id, () => adminApi.assignAwb(order.id), 'AWB assigned')}
                        className="px-3 py-1.5 text-[10px] uppercase tracking-widest border border-[#0a0a0a] text-[#0a0a0a] hover:bg-[#faf8f5] disabled:opacity-50"
                      >
                        Assign AWB
                      </button>
                    )}
                    {hasAwb && (
                      <>
                        <button
                          disabled={isAL}
                          onClick={() => doAction(order.id, () => adminApi.schedulePickup(order.id), 'Pickup scheduled')}
                          className="px-3 py-1.5 text-[10px] uppercase tracking-widest border border-[#e8e4e0] text-[#6b6b6b] hover:text-[#0a0a0a] hover:border-[#0a0a0a] disabled:opacity-50"
                        >
                          Schedule Pickup
                        </button>
                        <button
                          disabled={isAL}
                          onClick={() => doAction(order.id, () => adminApi.generateLabel(order.id), 'Label generated')}
                          className="px-3 py-1.5 text-[10px] uppercase tracking-widest border border-[#e8e4e0] text-[#6b6b6b] hover:text-[#0a0a0a] hover:border-[#0a0a0a] disabled:opacity-50"
                        >
                          Label
                        </button>
                        <button
                          disabled={isAL}
                          onClick={() => handleTrack(order.id)}
                          className="px-3 py-1.5 text-[10px] uppercase tracking-widest border border-[#e8e4e0] text-[#6b6b6b] hover:text-[#0a0a0a] hover:border-[#0a0a0a] disabled:opacity-50"
                        >
                          {isAL ? '…' : 'Track'}
                        </button>
                        <button
                          disabled={isAL}
                          onClick={() => doAction(order.id, () => adminApi.cancelShipment(order.id), 'Shipment cancelled')}
                          className="px-3 py-1.5 text-[10px] uppercase tracking-widest border border-[#e8e4e0] text-red-500 hover:border-red-400 disabled:opacity-50"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    <Link
                      href={`/admin/order-detail?id=${order.id}`}
                      className="px-3 py-1.5 text-[10px] uppercase tracking-widest border border-[#e8e4e0] text-[#6b6b6b] hover:text-[#0a0a0a] hover:border-[#0a0a0a]"
                    >
                      View
                    </Link>
                  </div>
                </div>

                {/* Feedback message */}
                {msg && msg.id === order.id && (
                  <div className={`mt-2 px-3 py-2 text-[11px] ${msg.type === 'ok' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {msg.text}
                  </div>
                )}

                {/* Push form */}
                {pushingId === order.id && (
                  <PushForm orderId={order.id} onDone={() => { setPushingId(null); load() }} />
                )}

                {/* Tracking timeline */}
                {activities.length > 0 && (
                  <div className="mt-3 border-t border-[#e8e4e0] pt-3">
                    <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-2">Tracking Timeline</p>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {activities.map((a: any, i: number) => (
                        <div key={i} className="flex gap-3 text-[11px]">
                          <span className="text-[#6b6b6b] shrink-0 w-32">{a.date ? new Date(a.date).toLocaleString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' }) : '—'}</span>
                          <span className="text-[#0a0a0a]">{a.activity}</span>
                          {a.location && <span className="text-[#6b6b6b]">· {a.location}</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
