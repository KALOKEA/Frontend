'use client'
import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api/client'
import { adminApi } from '@/lib/api/admin'
import { formatPrice } from '@/lib/utils/formatPrice'
import Spinner from '@/components/ui/Spinner'

const STATUS_COLOR: Record<string, string> = {
  pending:   'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  shipped:   'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-700',
  refunded:  'bg-purple-100 text-purple-700',
}
const PAY_COLOR: Record<string, string> = {
  paid:     'text-green-700',
  pending:  'text-amber-600',
  failed:   'text-red-600',
  refunded: 'text-purple-600',
}

function Flash({ msg }: { msg: { type: 'ok' | 'err'; text: string } | null }) {
  if (!msg) return null
  return (
    <div className={`mb-4 px-4 py-3 text-sm border ${msg.type === 'ok' ? 'bg-[#e8f5e9] border-[#a5d6a7] text-[#2e7d32]' : 'bg-[#fdecea] border-[#ef9a9a] text-[#c62828]'}`}>
      {msg.text}
    </div>
  )
}

export default function AdminOrderDetailInner() {
  const params = useSearchParams()
  const id     = params.get('id') || ''
  const router = useRouter()

  const [order, setOrder]           = useState<any>(null)
  const [loading, setLoading]       = useState(true)

  const [refunding, setRefunding]   = useState(false)
  const [refundAmt, setRefundAmt]   = useState('')
  const [refundReason, setRefundReason] = useState('')
  const [refundMsg, setRefundMsg]   = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  const [srLoading, setSrLoading]   = useState(false)
  const [srMsg, setSrMsg]           = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [tracking, setTracking]     = useState<any>(null)
  const [trackLoading, setTrackLoading] = useState(false)
  const [showPushForm, setShowPushForm] = useState(false)
  const [pkgWeight, setPkgWeight]   = useState('0.5')
  const [pkgLength, setPkgLength]   = useState('20')
  const [pkgBreadth, setPkgBreadth] = useState('15')
  const [pkgHeight, setPkgHeight]   = useState('5')
  const [courierId, setCourierId]   = useState('')

  const load = useCallback(async () => {
    if (!id) return
    try {
      const r = await api.get<any>(`/orders/${id}`)
      setOrder(r)
    } catch { setOrder(null) }
    finally { setLoading(false) }
  }, [id])

  useEffect(() => { load() }, [load])

  async function srAction(action: () => Promise<any>, successMsg: string) {
    setSrLoading(true); setSrMsg(null)
    try { await action(); setSrMsg({ type: 'ok', text: successMsg }); await load() }
    catch (e: any) { setSrMsg({ type: 'err', text: e?.message || 'Action failed' }) }
    finally { setSrLoading(false) }
  }

  async function handlePush() {
    await srAction(
      () => adminApi.pushToShiprocket(id, {
        weight: parseFloat(pkgWeight) || 0.5,
        length: parseFloat(pkgLength) || 20,
        breadth: parseFloat(pkgBreadth) || 15,
        height: parseFloat(pkgHeight) || 5,
        ...(courierId ? { courier_id: parseInt(courierId) } : {}),
      }),
      'Order pushed to ShipRocket — AWB assigned!'
    )
    setShowPushForm(false)
  }

  async function handleTrack() {
    setTrackLoading(true)
    try { setTracking(await adminApi.trackShipment(id)) }
    catch (e: any) { setSrMsg({ type: 'err', text: `Tracking failed: ${e?.message}` }) }
    finally { setTrackLoading(false) }
  }

  async function handleRefund() {
    if (!order) return
    setRefunding(true); setRefundMsg(null)
    try {
      const body: any = { order_id: order.id, reason: refundReason || undefined }
      if (refundAmt) body.amount = Math.round(parseFloat(refundAmt) * 100)
      await adminApi.refundOrder(order.id, body)
      setRefundMsg({ type: 'ok', text: 'Refund initiated.' })
      await load()
    } catch (e: any) { setRefundMsg({ type: 'err', text: e?.message || 'Refund failed' }) }
    finally { setRefunding(false) }
  }

  if (!id) return <div className="py-20 text-center text-[#6b6b6b]">No order ID provided.</div>
  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  if (!order)  return (
    <div className="py-20 text-center text-[#6b6b6b]">
      Order not found. <Link href="/admin/orders" className="underline">Back to orders</Link>
    </div>
  )

  const addr       = order.address_snapshot || {}
  const items: any[] = order.order_items || []
  const canRefund  = order.payment_status === 'paid'
  const inSR       = !!order.shiprocket_order_id
  const hasAwb     = !!order.awb_code
  const activities: any[] = tracking?.tracking_data?.shipment_track_activities || []

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-[#6b6b6b] hover:text-[#0a0a0a] text-sm">← Back</button>
        <h1 className="font-serif text-2xl text-[#0a0a0a]">Order #{order.order_number}</h1>
        <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${STATUS_COLOR[order.status] || 'bg-gray-100'}`}>{order.status}</span>
        {order.shiprocket_status && (
          <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-orange-100 text-orange-700">SR: {order.shiprocket_status}</span>
        )}
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white border border-[#e8e4e0] p-5">
          <h2 className="text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-3">Customer</h2>
          <p className="font-medium text-[#0a0a0a]">{order.users?.name || addr.name || '—'}</p>
          <p className="text-sm text-[#6b6b6b]">{order.users?.email || order.guest_email || '—'}</p>
        </div>
        <div className="bg-white border border-[#e8e4e0] p-5">
          <h2 className="text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-3">Payment</h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-[#6b6b6b]">Method</span><span className="uppercase text-[10px] tracking-widest">{order.payment_method}</span></div>
            <div className="flex justify-between"><span className="text-[#6b6b6b]">Status</span><span className={`font-medium ${PAY_COLOR[order.payment_status] || ''}`}>{order.payment_status}</span></div>
            <div className="flex justify-between"><span className="text-[#6b6b6b]">Total</span><span className="font-medium">{formatPrice(order.total)}</span></div>
          </div>
        </div>
        <div className="bg-white border border-[#e8e4e0] p-5">
          <h2 className="text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-3">Shipping Address</h2>
          {addr.line1 ? (
            <address className="not-italic text-sm text-[#0a0a0a] leading-relaxed">
              {addr.name && <p>{addr.name}</p>}
              <p>{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
              <p>{addr.city}, {addr.state} – {addr.pincode}</p>
              {addr.phone && <p className="text-[#6b6b6b]">{addr.phone}</p>}
            </address>
          ) : <p className="text-sm text-[#6b6b6b]">No address</p>}
        </div>
        <div className="bg-white border border-[#e8e4e0] p-5">
          <h2 className="text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-3">Fulfillment</h2>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-[#6b6b6b]">Status</span><span className="uppercase text-[10px] tracking-widest">{order.fulfillment_status || 'unfulfilled'}</span></div>
            <div className="flex justify-between"><span className="text-[#6b6b6b]">Placed</span><span>{new Date(order.created_at).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</span></div>
          </div>
        </div>
      </div>

      {/* Items table */}
      <div className="bg-white border border-[#e8e4e0] mb-8">
        <h2 className="text-[11px] uppercase tracking-widest text-[#6b6b6b] px-5 pt-5 mb-3">Items ({items.length})</h2>
        <table className="min-w-[480px] w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-widest text-[#6b6b6b] border-b border-[#e8e4e0]">
              <th className="px-5 pb-2">Product</th><th className="px-5 pb-2">SKU</th>
              <th className="px-5 pb-2 text-right">Qty</th><th className="px-5 pb-2 text-right">Price</th><th className="px-5 pb-2 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item: any, i: number) => (
              <tr key={i} className="border-b border-[#f0ece8] last:border-0">
                <td className="px-5 py-3">{item.snapshot_name}</td>
                <td className="px-5 py-3 font-mono text-xs text-[#6b6b6b]">{item.snapshot_sku || '—'}</td>
                <td className="px-5 py-3 text-right">{item.quantity}</td>
                <td className="px-5 py-3 text-right">{formatPrice(item.snapshot_price)}</td>
                <td className="px-5 py-3 text-right font-medium">{formatPrice(item.snapshot_price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-[#e8e4e0]">
              <td colSpan={4} className="px-5 py-3 text-right text-[#6b6b6b] font-medium">Total</td>
              <td className="px-5 py-3 text-right font-semibold">{formatPrice(order.total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ShipRocket panel */}
      <div className="bg-white border border-[#e8e4e0] mb-8">
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-[#e8e4e0]">
          <div className="flex items-center gap-2">
            <h2 className="text-[11px] uppercase tracking-widest text-[#6b6b6b]">ShipRocket</h2>
            {inSR && <span className="text-[10px] font-mono text-[#6b6b6b]">#{order.shiprocket_order_id}</span>}
          </div>
          {inSR && !['cancelled','refunded'].includes(order.status) && (
            <button onClick={() => srAction(() => adminApi.cancelShipment(id), 'Shipment cancelled')}
              disabled={srLoading} className="text-[11px] text-red-600 hover:underline disabled:opacity-40">
              Cancel Shipment
            </button>
          )}
        </div>
        <div className="p-5">
          <Flash msg={srMsg} />
          {inSR && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
              <div><p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-1">AWB</p><p className="font-mono text-sm">{order.awb_code || '—'}</p></div>
              <div><p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-1">Courier</p><p className="text-sm">{order.courier_name || '—'}</p></div>
              <div><p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-1">SR Status</p><p className="text-sm">{order.shiprocket_status || '—'}</p></div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-1">Label</p>
                {order.label_url
                  ? <a href={order.label_url} target="_blank" rel="noopener noreferrer" className="text-sm underline text-[#c8a4a5]">Download ↗</a>
                  : <button disabled={srLoading} onClick={() => srAction(() => adminApi.generateLabel(id), 'Label generated')}
                      className="text-sm underline text-[#0a0a0a] disabled:opacity-40">Generate</button>}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {!inSR && !['cancelled','refunded'].includes(order.status) && (
              <button onClick={() => setShowPushForm(v => !v)}
                className="px-4 py-2 text-sm bg-[#ff6600] text-white hover:bg-[#e55a00] transition-colors">
                Push to ShipRocket
              </button>
            )}
            {inSR && !hasAwb && (
              <button disabled={srLoading} onClick={() => srAction(() => adminApi.assignAwb(id), 'AWB assigned')}
                className="px-4 py-2 text-sm border border-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white transition-colors disabled:opacity-40">
                Assign AWB
              </button>
            )}
            {inSR && hasAwb && !order.pickup_scheduled_at && (
              <button disabled={srLoading} onClick={() => srAction(() => adminApi.schedulePickup(id), 'Pickup scheduled!')}
                className="px-4 py-2 text-sm border border-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white transition-colors disabled:opacity-40">
                Schedule Pickup
              </button>
            )}
            {order.pickup_scheduled_at && (
              <span className="px-4 py-2 text-sm bg-green-50 border border-green-200 text-green-700">
                ✓ Pickup scheduled {new Date(order.pickup_scheduled_at).toLocaleDateString('en-IN')}
              </span>
            )}
            {inSR && hasAwb && (
              <button disabled={trackLoading} onClick={handleTrack}
                className="px-4 py-2 text-sm border border-[#e8e4e0] hover:border-[#0a0a0a] transition-colors disabled:opacity-40">
                {trackLoading ? 'Loading…' : 'Refresh Tracking'}
              </button>
            )}
          </div>

          {showPushForm && (
            <div className="mt-5 bg-[#faf8f5] border border-[#e8e4e0] p-4">
              <p className="text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-3">Package Details</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                {[['Weight (kg)',pkgWeight,setPkgWeight],['Length (cm)',pkgLength,setPkgLength],['Breadth (cm)',pkgBreadth,setPkgBreadth],['Height (cm)',pkgHeight,setPkgHeight]].map(([label,val,set]:any) => (
                  <div key={label}>
                    <label className="block text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-1">{label}</label>
                    <input type="number" step="0.1" min="0.1" value={val} onChange={e => set(e.target.value)}
                      className="w-full border border-[#e8e4e0] px-2 py-1.5 text-sm focus:outline-none focus:border-[#0a0a0a]" />
                  </div>
                ))}
              </div>
              <div className="mb-3">
                <label className="block text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-1">Courier ID (blank = auto-select cheapest)</label>
                <input type="number" value={courierId} onChange={e => setCourierId(e.target.value)} placeholder="e.g. 13 for Delhivery"
                  className="w-full max-w-xs border border-[#e8e4e0] px-2 py-1.5 text-sm focus:outline-none focus:border-[#0a0a0a]" />
              </div>
              <div className="flex gap-2">
                <button onClick={handlePush} disabled={srLoading}
                  className="px-4 py-2 text-sm bg-[#ff6600] text-white hover:bg-[#e55a00] disabled:opacity-50">
                  {srLoading ? 'Pushing…' : 'Confirm Push'}
                </button>
                <button onClick={() => setShowPushForm(false)} className="px-4 py-2 text-sm border border-[#e8e4e0]">Cancel</button>
              </div>
            </div>
          )}

          {activities.length > 0 && (
            <div className="mt-6">
              <p className="text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-3">Tracking Timeline</p>
              <div className="relative pl-4 border-l-2 border-[#e8e4e0] space-y-4">
                {activities.map((act: any, i: number) => (
                  <div key={i} className="relative">
                    <span className="absolute -left-[17px] top-1 w-3 h-3 rounded-full bg-white border-2 border-[#c8a4a5]" />
                    <p className="text-sm font-medium">{act['sr-status'] || act.status}</p>
                    <p className="text-xs text-[#6b6b6b]">{act.location} — {act.date}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Refund */}
      {canRefund && (
        <div className="bg-white border border-[#e8e4e0] p-5 mb-8">
          <h2 className="text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-4">Issue Refund</h2>
          <Flash msg={refundMsg} />
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Amount ₹ (blank = full)</label>
              <input type="number" step="0.01" value={refundAmt} onChange={e => setRefundAmt(e.target.value)}
                placeholder={`Max ₹${(order.total/100).toFixed(2)}`}
                className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:outline-none focus:border-[#0a0a0a]" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Reason</label>
              <input type="text" value={refundReason} onChange={e => setRefundReason(e.target.value)} placeholder="e.g. Customer request"
                className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:outline-none focus:border-[#0a0a0a]" />
            </div>
          </div>
          <button onClick={handleRefund} disabled={refunding}
            className="px-5 py-2 text-sm bg-[#c62828] text-white hover:bg-[#b71c1c] disabled:opacity-50">
            {refunding ? 'Processing…' : 'Issue Refund'}
          </button>
        </div>
      )}
      {order.payment_status === 'refunded' && (
        <div className="bg-[#f3e5f5] border border-[#ce93d8] px-5 py-4 text-sm text-purple-800">This order has been refunded.</div>
      )}
    </div>
  )
}
