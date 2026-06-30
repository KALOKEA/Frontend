'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ordersApi, type Order } from '@/lib/api/orders'
import { returnsApi, RETURN_REASONS, type ReturnRequest } from '@/lib/api/returns'
import { exchangesApi, EXCHANGE_REASONS, type ExchangeOptions, type ExchangeRequest } from '@/lib/api/exchanges'
import { formatPrice } from '@/lib/utils/formatPrice'
import { useToast } from '@/components/ui/Toast'
import Spinner from '@/components/ui/Spinner'
import { paymentsApi } from '@/lib/api/payments'

// ─── Status helpers ──────────────────────────────────────────────────────────

const STATUS_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']

const STATUS_META: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  pending:    { label: 'Pending',    bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-400' },
  confirmed:  { label: 'Confirmed',  bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-400' },
  processing: { label: 'Processing', bg: 'bg-blue-50',   text: 'text-blue-700',   dot: 'bg-blue-400' },
  shipped:    { label: 'Shipped',    bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-400' },
  delivered:  { label: 'Delivered',  bg: 'bg-green-50',  text: 'text-green-700',  dot: 'bg-green-500' },
  cancelled:  { label: 'Cancelled',  bg: 'bg-red-50',    text: 'text-red-600',    dot: 'bg-red-400' },
  refunded:   { label: 'Refunded',   bg: 'bg-gray-100',  text: 'text-gray-600',   dot: 'bg-gray-400' },
}

function StatusBadge({ status }: { status: string }) {
  const m = STATUS_META[status] || { label: status, bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-widest font-medium rounded-full ${m.bg} ${m.text}`}>
      <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  )
}

function OrderProgress({ status }: { status: string }) {
  const idx = STATUS_STEPS.indexOf(status)
  if (idx === -1) return null
  return (
    <div aria-hidden="true" className="flex items-center gap-0 mb-4">
      {STATUS_STEPS.map((step, i) => {
        const done = i <= idx
        const last = i === STATUS_STEPS.length - 1
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`w-2.5 h-2.5 rounded-full border-2 transition-colors ${
                done ? 'bg-[#7C4A2D] border-[#7C4A2D]' : 'bg-white border-[#d0ccc8]'
              }`} />
              <span className="text-[8px] uppercase tracking-wider mt-1 text-[#6b6b6b] hidden sm:block whitespace-nowrap">
                {step === 'processing' ? 'Packing' : step.charAt(0).toUpperCase() + step.slice(1)}
              </span>
            </div>
            {!last && (
              <div className={`flex-1 h-px mx-1 ${i < idx ? 'bg-[#7C4A2D]' : 'bg-[#e8e4e0]'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const { toast } = useToast()
  const [orders, setOrders]     = useState<Order[]>([])
  const [returns, setReturns]   = useState<ReturnRequest[]>([])
  const [exchanges, setExchanges] = useState<ExchangeRequest[]>([])
  const [loading, setLoading]   = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  // Return modal
  const [returnFor, setReturnFor]   = useState<Order | null>(null)
  const [reason, setReason]         = useState<string>(RETURN_REASONS[0])
  const [submitting, setSubmitting] = useState(false)

  // Cancel confirmation
  const [cancelFor, setCancelFor] = useState<Order | null>(null)
  const [cancelling, setCancelling] = useState(false)

  // Exchange modal
  const [exchangeFor, setExchangeFor]   = useState<Order | null>(null)
  const [exItemId, setExItemId]         = useState<string>('')
  const [exOptions, setExOptions]       = useState<ExchangeOptions | null>(null)
  const [exVariantId, setExVariantId]   = useState<string>('')
  const [exReason, setExReason]         = useState<string>(EXCHANGE_REASONS[0])
  const [exLoadingOpts, setExLoadingOpts] = useState(false)

  // Retry Payment
  const [retryingId, setRetryingId] = useState<string | null>(null)

  // Escape key to close any open modal
  useEffect(() => {
    const anyOpen = !!cancelFor || !!returnFor || !!exchangeFor
    if (!anyOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (cancelFor) setCancelFor(null)
      else if (returnFor) setReturnFor(null)
      else if (exchangeFor) setExchangeFor(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [cancelFor, returnFor, exchangeFor])

  function load() {
    Promise.all([
      ordersApi.getMyOrders().catch(() => []),
      returnsApi.getMy().catch(() => []),
      exchangesApi.getMy().catch(() => []),
    ]).then(([o, r, e]) => {
      setOrders(o as Order[])
      setReturns(r as ReturnRequest[])
      setExchanges(e as ExchangeRequest[])
      // Auto-expand most recent order
      if ((o as Order[]).length > 0) setExpanded((o as Order[])[0].id)
    }).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const returnByOrder   = (id: string) => returns.find(r => r.order_id === id)
  const exchangeByOrder = (id: string) => exchanges.find(e => e.order_id === id)

  function isCancellable(order: Order): boolean {
    // Allow cancellation while the order is pending or confirmed (before packing starts).
    // No time restriction — if the admin hasn't started processing, the customer can cancel.
    return order.status === 'pending' || order.status === 'confirmed'
  }

  function openExchange(order: Order) {
    setExchangeFor(order); setExOptions(null); setExVariantId(''); setExReason(EXCHANGE_REASONS[0])
    const first = order.order_items?.[0]?.id || ''
    setExItemId(first)
    if (first) loadOptions(first)
  }

  async function loadOptions(orderItemId: string) {
    setExItemId(orderItemId); setExVariantId(''); setExLoadingOpts(true)
    try { setExOptions(await exchangesApi.getOptions(orderItemId)) }
    catch { setExOptions({ product_name: '', variants: [] }) }
    finally { setExLoadingOpts(false) }
  }

  async function submitExchange() {
    if (!exchangeFor || !exItemId || !exVariantId) return
    setSubmitting(true)
    try {
      await exchangesApi.create({ order_id: exchangeFor.id, order_item_id: exItemId, new_variant_id: exVariantId, reason: exReason })
      toast('Exchange request submitted')
      setExchangeFor(null); load()
    } catch (e: unknown) { toast(e instanceof Error ? e.message : 'Could not submit exchange', 'error') }
    finally { setSubmitting(false) }
  }

  async function openInvoice(orderId: string) {
    try {
      const html = await ordersApi.getInvoice(orderId)
      // Use Blob URL to avoid XSS risk from document.write in the caller's origin
      const blob = new Blob([html], { type: 'text/html' })
      const blobUrl = URL.createObjectURL(blob)
      const w = window.open(blobUrl, '_blank')
      if (!w) toast('Allow pop-ups to view the invoice', 'error')
      // Revoke after a short delay to give the browser time to start loading the document.
      setTimeout(() => URL.revokeObjectURL(blobUrl), 500)
    } catch { toast('Could not open invoice', 'error') }
  }

  async function submitReturn() {
    if (!returnFor) return
    setSubmitting(true)
    try {
      await returnsApi.create({ order_id: returnFor.id, reason })
      toast('Return request submitted')
      setReturnFor(null); load()
    } catch (e: unknown) { toast(e instanceof Error ? e.message : 'Could not submit return', 'error') }
    finally { setSubmitting(false) }
  }

  async function submitCancel() {
    if (!cancelFor) return
    setCancelling(true)
    try {
      await ordersApi.cancel(cancelFor.id)
      toast('Order cancelled successfully')
      setCancelFor(null); load()
    } catch (e: unknown) { toast(e instanceof Error ? e.message : 'Could not cancel order', 'error') }
    finally { setCancelling(false) }
  }

  async function retryPayment(order: Order) {
    setRetryingId(order.id)
    try {
      const [rzp, { loadRazorpay }] = await Promise.all([
        paymentsApi.createOrder(order.id),
        import('@/lib/utils/razorpay'),
      ])
      const RazorpayCtor = await loadRazorpay()
      if (!RazorpayCtor) { toast('Could not load payment gateway. Please try again.', 'error'); return }
      const rz = new RazorpayCtor({
        key: rzp.key_id,
        amount: rzp.amount,
        currency: rzp.currency,
        order_id: rzp.razorpay_order_id,
        name: 'KALOKEA',
        description: `Order ${order.order_number}`,
        theme: { color: '#7C4A2D' },
        handler: async (response) => {
          try {
            await paymentsApi.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            })
            toast('Payment successful! Your order is confirmed.')
            load()
          } catch { toast('Payment verification failed. Contact support.', 'error') }
        },
        modal: { ondismiss: () => setRetryingId(null) },
      })
      rz.on('payment.failed', () => { toast('Payment failed. Please try again.', 'error'); setRetryingId(null) })
      rz.open()
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : 'Could not initiate payment. Please try again.', 'error')
      setRetryingId(null)
    }
  }

  if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>

  // ── Empty state ─────────────────────────────────────────────────────────────
  if (!orders.length) return (
    <div className="bg-white border border-[#e8e4e0]">
      <div className="px-6 py-5 border-b border-[#f0ece8]">
        <h2 className="font-serif text-2xl text-[#0a0a0a]">My Orders</h2>
      </div>
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div aria-hidden="true" className="w-16 h-16 rounded-full bg-[#faf8f5] border border-[#e8e4e0] flex items-center justify-center mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </div>
        <h3 className="font-serif text-xl text-[#0a0a0a] mb-2">No orders yet</h3>
        <p className="text-sm text-[#6b6b6b] mb-8 max-w-xs leading-relaxed">
          Your order history will appear here once you place your first order.
        </p>
        <Link
          href="/shop/"
          className="inline-block bg-[#0a0a0a] text-white text-[11px] font-sans tracking-widest uppercase px-8 py-3.5 hover:bg-[#333] transition-colors"
        >
          Explore Collection
        </Link>
        <div className="mt-8 grid grid-cols-3 gap-6 text-center">
          {[
            {
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v3"/><rect x="9" y="11" width="14" height="10" rx="1"/><circle cx="12" cy="19" r="1"/><circle cx="20" cy="19" r="1"/></svg>,
              label: 'Free shipping', sub: 'on orders above ₹999',
            },
            {
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.05"/></svg>,
              label: 'Easy returns', sub: 'within 7 days',
            },
            {
              icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
              label: 'Secure payments', sub: 'Razorpay & COD',
            },
          ].map(b => (
            <div key={b.label}>
              <div aria-hidden="true" className="flex justify-center mb-2">{b.icon}</div>
              <p className="text-[11px] font-medium text-[#0a0a0a]">{b.label}</p>
              <p className="text-[10px] text-[#6b6b6b]">{b.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  // ── Orders list ─────────────────────────────────────────────────────────────
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-serif text-2xl text-[#0a0a0a]">My Orders</h2>
        <span className="text-[11px] uppercase tracking-widest text-[#6b6b6b]">{orders.length} order{orders.length !== 1 ? 's' : ''}</span>
      </div>

      <div className="space-y-3">
        {orders.map((order) => {
          const ret = returnByOrder(order.id)
          const ex  = exchangeByOrder(order.id)
          const canReturn   = order.status === 'delivered' && !ret && !ex
          const canExchange = order.status === 'delivered' && !ret && !ex
          const isOpen = expanded === order.id
          const isActive = !['cancelled', 'refunded', 'delivered'].includes(order.status)

          return (
            <div key={order.id} className="bg-white border border-[#e8e4e0] overflow-hidden">

              {/* Order header — always visible */}
              <button
                onClick={() => setExpanded(isOpen ? null : order.id)}
                aria-expanded={isOpen}
                aria-label={`Order #${order.order_number} — ${isOpen ? 'collapse' : 'expand'} details`}
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-[#faf8f5] transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <StatusBadge status={order.status} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#0a0a0a]">#{order.order_number}</p>
                    <p className="text-[11px] text-[#6b6b6b] mt-0.5">
                      {new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      {' · '}
                      {order.order_items?.length || 0} item{(order.order_items?.length || 0) !== 1 ? 's' : ''}
                      {order.payment_method && (
                        <span className="ml-2 text-[#7C4A2D] uppercase">
                          {order.payment_method === 'cod' ? '· COD' : '· Paid online'}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-serif text-base text-[#0a0a0a]">{formatPrice(order.total)}</span>
                  <svg
                    width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth="2"
                    aria-hidden="true"
                    className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </div>
              </button>

              {/* Expanded details */}
              {isOpen && (
                <div className="border-t border-[#f0ece8] px-5 pb-5 pt-4">

                  {/* Progress tracker (only for active orders) */}
                  {isActive && <OrderProgress status={order.status} />}

                  {/* Tracking info */}
                  {order.tracking_number && (
                    <div className="bg-[#faf8f5] border border-[#e8e4e0] rounded px-4 py-3 mb-4 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-0.5">Tracking</p>
                        <p className="text-sm font-medium text-[#0a0a0a]">{order.tracking_number}</p>
                        {order.courier_name && <p className="text-[11px] text-[#6b6b6b]">{order.courier_name}</p>}
                      </div>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.5" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </div>
                  )}

                  {/* Items */}
                  {order.order_items && order.order_items.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {order.order_items.map((item) => (
                        <div key={item.id} className="flex items-center gap-3">
                          {/* Image placeholder */}
                          <div className="w-12 h-14 bg-[#f4f2ef] border border-[#e8e4e0] shrink-0 flex items-center justify-center overflow-hidden">
                            {item.snapshot_image_url ? (
                              <img src={item.snapshot_image_url} alt={item.snapshot_name} className="w-full h-full object-cover" />
                            ) : (
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d0ccc8" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[#0a0a0a] font-medium truncate">{item.snapshot_name}</p>
                            <p className="text-[11px] text-[#6b6b6b]">
                              {[item.snapshot_colour, item.snapshot_size].filter(Boolean).join(' · ')}
                              {(item.snapshot_colour || item.snapshot_size) ? ' · ' : ''}
                              Qty {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm text-[#0a0a0a] shrink-0">{formatPrice(item.snapshot_price * item.quantity)}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Delivery address */}
                  {order.address_snapshot && (
                    <div className="text-[11px] text-[#6b6b6b] mb-4 leading-relaxed">
                      <span className="text-[10px] uppercase tracking-widest text-[#6b6b6b] block mb-1">Deliver to</span>
                      {order.address_snapshot.name && <span>{order.address_snapshot.name}, </span>}
                      {order.address_snapshot.line1 || order.address_snapshot.street}
                      {order.address_snapshot.city && `, ${order.address_snapshot.city}`}
                      {order.address_snapshot.state && `, ${order.address_snapshot.state}`}
                      {order.address_snapshot.pincode && ` - ${order.address_snapshot.pincode}`}
                    </div>
                  )}

                  {/* Order total breakdown */}
                  <div className="border-t border-[#f0ece8] pt-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#6b6b6b]">Order total</span>
                      <span className="font-medium text-[#0a0a0a]">{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  {/* Return/exchange status pills */}
                  {(ret || ex) && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {ret && (
                        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest bg-amber-50 text-amber-700 px-3 py-1 rounded-full">
                          Return · {ret.status}
                        </span>
                      )}
                      {ex && (
                        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                          Exchange · {ex.status}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action row */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => openInvoice(order.id)}
                      className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      Invoice
                    </button>

                    {isCancellable(order) && (
                      <button
                        onClick={() => setCancelFor(order)}
                        className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-red-500 hover:text-red-700 hover:underline transition-colors"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                        Cancel Order
                      </button>
                    )}

                    {/* Retry Payment — shown when online payment failed */}
                    {order.payment_status === 'failed' && order.payment_method !== 'cod' && (
                      <button
                        onClick={() => retryPayment(order)}
                        disabled={retryingId === order.id}
                        className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest bg-[#7C4A2D] text-white px-3 py-1.5 hover:bg-[#6a3d25] disabled:opacity-50 transition-colors"
                      >
                        {retryingId === order.id ? (
                          <>
                            <svg className="animate-spin" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="10" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                            Loading…
                          </>
                        ) : (
                          <>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.05"/></svg>
                            Retry Payment
                          </>
                        )}
                      </button>
                    )}

                    {canReturn && (
                      <button
                        onClick={() => { setReturnFor(order); setReason(RETURN_REASONS[0]) }}
                        className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#7C4A2D] hover:underline"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.05"/></svg>
                        Return
                      </button>
                    )}
                    {canExchange && (
                      <button
                        onClick={() => openExchange(order)}
                        className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#7C4A2D] hover:underline"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>
                        Exchange
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Cancel confirmation modal ──────────────────────────────────────────── */}
      {cancelFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div aria-hidden="true" className="absolute inset-0 bg-black/50" onClick={() => setCancelFor(null)} />
          <div role="dialog" aria-modal="true" aria-label="Cancel order confirmation" className="relative bg-white w-full max-w-sm p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-serif text-xl text-[#0a0a0a] mb-1">Cancel this order?</h3>
            <p className="text-xs text-[#6b6b6b] mb-4">Order #{cancelFor.order_number}</p>
            <p className="text-sm text-[#3a3a3a] mb-6 leading-relaxed">
              Are you sure you want to cancel this order? This action cannot be undone.
              If you paid online, a refund will be issued within 5–7 business days.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setCancelFor(null)}
                className="px-4 py-2 text-sm border border-[#e8e4e0] hover:bg-[#faf8f5] transition-colors"
              >
                Keep Order
              </button>
              <button
                onClick={submitCancel}
                disabled={cancelling}
                className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
              >
                {cancelling ? 'Cancelling…' : 'Yes, Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Return modal ──────────────────────────────────────────────────────── */}
      {returnFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div aria-hidden="true" className="absolute inset-0 bg-black/50" onClick={() => setReturnFor(null)} />
          <div role="dialog" aria-modal="true" aria-label="Request a return" className="relative bg-white w-full max-w-md p-6 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-serif text-xl text-[#0a0a0a] mb-1">Request a return</h3>
            <p className="text-xs text-[#6b6b6b] mb-5">Order #{returnFor.order_number}</p>
            <label htmlFor="return-reason" className="block text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-1">Reason</label>
            <select id="return-reason" value={reason} onChange={e => setReason(e.target.value)} className="w-full border border-[#e8e4e0] px-3 py-2.5 text-sm mb-4 focus:border-[#0a0a0a] outline-none">
              {RETURN_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <p className="text-[11px] text-[#6b6b6b] mb-5 leading-relaxed">
              Returns are accepted within 7 days of delivery for unworn items with original tags attached.
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setReturnFor(null)} className="px-4 py-2 text-sm border border-[#e8e4e0] hover:bg-[#faf8f5] transition-colors">Cancel</button>
              <button onClick={submitReturn} disabled={submitting} className="px-4 py-2 text-sm bg-[#0a0a0a] text-white hover:bg-[#333] disabled:opacity-50 transition-colors">
                {submitting ? 'Submitting…' : 'Submit request'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Exchange modal ────────────────────────────────────────────────────── */}
      {exchangeFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div aria-hidden="true" className="absolute inset-0 bg-black/50" onClick={() => setExchangeFor(null)} />
          <div role="dialog" aria-modal="true" aria-label="Request an exchange" className="relative bg-white w-full max-w-md p-6 max-h-[90vh] overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-serif text-xl text-[#0a0a0a] mb-1">Request an exchange</h3>
            <p className="text-xs text-[#6b6b6b] mb-5">Order #{exchangeFor.order_number}</p>

            <label htmlFor="ex-item" className="block text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-1">Item to exchange</label>
            <select id="ex-item" value={exItemId} onChange={e => loadOptions(e.target.value)} className="w-full border border-[#e8e4e0] px-3 py-2.5 text-sm mb-4 focus:border-[#0a0a0a] outline-none">
              {(exchangeFor.order_items || []).map(it => (
                <option key={it.id} value={it.id}>
                  {it.snapshot_name}{[it.snapshot_colour, it.snapshot_size].filter(Boolean).length
                    ? ` (${[it.snapshot_colour, it.snapshot_size].filter(Boolean).join(', ')})` : ''} × {it.quantity}
                </option>
              ))}
            </select>

            <label htmlFor="ex-variant" className="block text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-1">Exchange for</label>
            {exLoadingOpts ? (
              <div className="py-4"><Spinner /></div>
            ) : exOptions && exOptions.variants.length ? (
              <select id="ex-variant" value={exVariantId} onChange={e => setExVariantId(e.target.value)} className="w-full border border-[#e8e4e0] px-3 py-2.5 text-sm mb-4 focus:border-[#0a0a0a] outline-none">
                <option value="">Select a variant</option>
                {exOptions.variants.map(v => (
                  <option key={v.id} value={v.id}>
                    {[v.colour, v.size].filter(Boolean).join(' · ') || 'Variant'} — {formatPrice(v.price)} ({v.stock} in stock)
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-[#6b6b6b] mb-4 py-2">No other variants are currently in stock for this item.</p>
            )}

            <label htmlFor="ex-reason" className="block text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-1">Reason</label>
            <select id="ex-reason" value={exReason} onChange={e => setExReason(e.target.value)} className="w-full border border-[#e8e4e0] px-3 py-2.5 text-sm mb-4 focus:border-[#0a0a0a] outline-none">
              {EXCHANGE_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>

            <p className="text-[11px] text-[#6b6b6b] mb-5 leading-relaxed">
              Any price or GST difference is settled when the exchange is approved. Exchanges follow the same 7-day window as returns.
            </p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setExchangeFor(null)} className="px-4 py-2 text-sm border border-[#e8e4e0] hover:bg-[#faf8f5] transition-colors">Cancel</button>
              <button onClick={submitExchange} disabled={submitting || !exVariantId} className="px-4 py-2 text-sm bg-[#0a0a0a] text-white hover:bg-[#333] disabled:opacity-50 transition-colors">
                {submitting ? 'Submitting…' : 'Submit request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
