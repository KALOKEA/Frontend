'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/useCartStore'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { addressesApi, type Address } from '@/lib/api/addresses'
import { ordersApi } from '@/lib/api/orders'
import { useToast } from '@/components/ui/Toast'
import BillingDetails, { emptyBilling, billingFromAddress, type BillingForm } from '@/components/checkout/BillingDetails'
import OrderSummary from '@/components/checkout/OrderSummary'
import PaymentSection from '@/components/checkout/PaymentSection'
import CouponInput from '@/components/checkout/CouponInput'
import Button from '@/components/ui/Button'
import { trackBeginCheckout, trackPurchase, metaInitiateCheckout, metaPurchase } from '@/lib/analytics'

const toGaItems = (items: { product_id: string; variant_id: string; name: string; price: number; quantity: number; size?: string; colour?: string }[]) =>
  items.map((i) => ({
    product_id: i.product_id,
    variant_id: i.variant_id,
    name: i.name,
    price: i.price,
    quantity: i.quantity,
    size: i.size,
    colour: i.colour,
  }))

export default function CheckoutPage() {
  const router = useRouter()
  const { isLoggedIn, user, hydrated } = useAuthStore()
  const { items, clearCart, appliedCoupon, setAppliedCoupon, clearAppliedCoupon, guestSessionId, _hasHydrated: cartHydrated } = useCartStore()
  const { toast } = useToast()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [billing, setBilling] = useState<BillingForm>(emptyBilling)
  const [saveAddress, setSaveAddress] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('upi')
  // Initialise from store so a coupon applied in the cart carries through.
  const [couponCode, setCouponCode] = useState<string | null>(appliedCoupon?.code ?? null)
  const [couponDiscount, setCouponDiscount] = useState(appliedCoupon?.discount ?? 0)
  const [loading, setLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)
  // Prevents the billing form from being re-initialized if cart or user changes
  // mid-session (e.g. item removed from another tab, background token refresh).
  const addressLoadedRef = useRef(false)
  // Prevents "cart is empty → redirect to /cart/" from firing while a
  // payment is being processed (ordersApi.create clears the server cart,
  // and a background hydrate() can race and set items=[] before Razorpay opens).
  const processingPayment = useRef(false)

  // Redirect to cart if cart empties — but never during an active checkout.
  // Also wait for cartHydrated: Zustand rehydrates from localStorage AFTER the
  // first render, so items starts as [] momentarily on a hard refresh. Without
  // this guard the redirect fires before items load and the user is bounced to
  // /cart/ even though they have items.
  useEffect(() => {
    if (!hydrated) return
    if (!cartHydrated) return
    if (!items.length && !processingPayment.current) router.push('/cart/')
  }, [hydrated, cartHydrated, items.length, router])

  // Load saved addresses and pre-fill billing — runs exactly once per mount
  // after auth hydration. Does NOT re-run on user/cart changes.
  useEffect(() => {
    if (!hydrated || addressLoadedRef.current) return
    if (!isLoggedIn) return
    addressLoadedRef.current = true
    addressesApi.getAll().then((data) => {
      setAddresses(data)
      const def = data.find((a) => a.is_default) || data[0]
      setBilling((b) => def ? billingFromAddress(def, user?.email || '') : { ...b, email: user?.email || '' })
    }).catch(() => setBilling((b) => ({ ...b, email: user?.email || '' })))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, isLoggedIn])

  // Pre-load Razorpay script as soon as page mounts — avoids loading it inside
  // an async chain which some mobile browsers treat as an untrusted context.
  useEffect(() => {
    import('@/lib/utils/razorpay').then(({ loadRazorpay }) => loadRazorpay()).catch(() => {})
  }, [])

  // GA4 begin_checkout once, when the page loads with items.
  useEffect(() => {
    if (!items.length) return
    const value = items.reduce((s, i) => s + i.price * i.quantity, 0)
    trackBeginCheckout(toGaItems(items), value)
    metaInitiateCheckout(value, items.reduce((s, i) => s + i.quantity, 0))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const placeOrder = async () => {
    setCheckoutError(null)

    // Validate billing details (matches the backend's required fields).
    const required: [keyof BillingForm, string][] = [
      ['first_name', 'First name'], ['line1', 'Street address'], ['city', 'Town / City'],
      ['state', 'State'], ['pincode', 'Postcode / PIN'], ['phone', 'Phone'],
    ]
    // Guests must provide an email for order confirmation and invoice access.
    if (!isLoggedIn && !billing.email?.trim()) {
      setCheckoutError('Email address is required to place an order as a guest')
      return
    }
    for (const [k, label] of required) {
      if (!String(billing[k] || '').trim()) {
        setCheckoutError(`${label} is required`)
        return
      }
    }
    if (!/^\d{6}$/.test(billing.pincode)) { setCheckoutError('Enter a valid 6-digit PIN code'); return }
    if (!/^\d{10}$/.test(billing.phone)) { setCheckoutError('Enter a valid 10-digit phone number'); return }
    if (billing.gst_invoice && (!billing.gstin.trim() || !billing.company.trim())) {
      setCheckoutError('Company name and GSTIN are required for a GST invoice'); return
    }

    // Only lock the cart-empty redirect guard AFTER passing validation.
    // Early validation returns above must not leave processingPayment stuck true.
    processingPayment.current = true
    setLoading(true)
    try {
      // Save billing address to profile if user opted in (fire-and-forget — don't block checkout).
      if (saveAddress && isLoggedIn) {
        addressesApi.create({
          name: `${billing.first_name} ${billing.last_name}`.trim(),
          phone: billing.phone,
          line1: billing.line1,
          line2: billing.line2 || undefined,
          city: billing.city,
          state: billing.state,
          pincode: billing.pincode,
        }).then(() => {
          // Refresh addresses list so next checkout auto-fills this one.
          addressesApi.getAll().then(setAddresses).catch(() => {})
        }).catch(() => {})
        setSaveAddress(false)
      }

      const order = await ordersApi.create({
        address_snapshot: {
          name: `${billing.first_name} ${billing.last_name}`.trim(),
          phone: billing.phone,
          line1: billing.line1,
          line2: billing.line2 || undefined,
          city: billing.city,
          state: billing.state,
          pincode: billing.pincode,
        },
        guest_email: billing.email || undefined,
        payment_method: paymentMethod,
        coupon_code: couponCode || undefined,
        gst_invoice: billing.gst_invoice,
        company_name: billing.company || undefined,
        gstin: billing.gst_invoice ? billing.gstin : undefined,
        // Pass session_id for guest users so the backend uses the server cart
        // (which has stock validation). cart_items acts as a fallback when the
        // server cart is missing (e.g. sync failed or very first session).
        session_id: isLoggedIn ? undefined : guestSessionId,
        cart_items: items.map(i => ({ variant_id: i.variant_id, quantity: i.quantity })),
      })

      if (paymentMethod === 'cod') {
        trackPurchase(order.order_number, order.total, toGaItems(items))
        metaPurchase(order.order_number, order.total)
        clearCart()
        router.push(`/checkout/success/?order=${order.order_number}`)
      } else {
        // Razorpay — script was pre-loaded on mount, so loadRazorpay resolves instantly.
        const [{ paymentsApi }, { loadRazorpay }] = await Promise.all([
          import('@/lib/api/payments'),
          import('@/lib/utils/razorpay'),
        ])
        const RazorpayCtor = await loadRazorpay()
        if (!RazorpayCtor) {
          processingPayment.current = false
          setCheckoutError('Payment gateway failed to load. Please check your internet connection and try again.')
          return
        }
        const rzp = await paymentsApi.createOrder(order.id)
        // Keep loading=true until razorpay.open() — finally block will clear it.

        const razorpay = new RazorpayCtor({
          key: rzp.key_id,
          amount: rzp.amount,
          currency: rzp.currency,
          order_id: rzp.razorpay_order_id,
          name: 'Kalokea',
          description: `Order ${order.order_number}`,
          handler: async (response: {
            razorpay_payment_id: string
            razorpay_order_id: string
            razorpay_signature: string
          }) => {
            // Verify signature server-side before showing success screen.
            // This prevents a failed payment from landing on the success page.
            try {
              await paymentsApi.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
            } catch {
              processingPayment.current = false
              setCheckoutError('Payment verification failed. Please check My Orders or contact support.')
              return
            }
            trackPurchase(order.order_number, order.total, toGaItems(items))
            metaPurchase(order.order_number, order.total)
            // processingPayment stays true — we're immediately navigating away.
            clearCart()
            router.push(`/checkout/success/?order=${order.order_number}`)
          },
          prefill: {
            name: `${billing.first_name} ${billing.last_name}`.trim(),
            email: billing.email || undefined,
            // Razorpay requires +91 prefix for India
            contact: billing.phone ? `+91${billing.phone}` : undefined,
          },
          theme: { color: '#0a0a0a' },
          modal: {
            ondismiss: () => {
              // User dismissed without paying — unlock the cart-empty redirect guard.
              processingPayment.current = false
              toast('Payment cancelled. You can retry from My Orders.', 'info')
            },
          },
        })
        razorpay.on('payment.failed', () => {
          processingPayment.current = false
          setCheckoutError('Payment failed. Please try again or choose a different method.')
        })
        razorpay.open()
        return // trigger finally (setLoading) without going to catch
      }
    } catch (err) {
      processingPayment.current = false
      const msg = err instanceof Error ? err.message : 'Failed to place order'
      setCheckoutError(msg)
      // Intentionally not logging here — error is surfaced to the user via setCheckoutError.
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full mx-auto px-4 sm:px-6 py-10 pb-28 lg:pb-10" style={{ maxWidth: 1400 }}>
      <h1 className="font-serif text-3xl text-[#0a0a0a] mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Order summary — shows FIRST on mobile (order-1), right column on desktop (lg:order-2) */}
        <div className="order-1 lg:order-2">
          <OrderSummary
            couponDiscount={couponDiscount}
            couponCode={couponCode}
            paymentMethod={paymentMethod}
            addressState={billing.state}
          />
        </div>

        {/* Form — shows SECOND on mobile (order-2), left column on desktop (lg:order-1) */}
        <div className="space-y-8 order-2 lg:order-1">
          <section>
            <h2 className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-4">Billing details</h2>
            <BillingDetails
              value={billing}
              onChange={setBilling}
              savedAddresses={addresses}
              showEmail={!isLoggedIn}
            />
          </section>

          {/* Save address — only shown to logged-in users */}
          {isLoggedIn && (
            <label className="flex items-center gap-2.5 cursor-pointer -mt-4">
              <input
                type="checkbox"
                checked={saveAddress}
                onChange={e => setSaveAddress(e.target.checked)}
                className="w-4 h-4 accent-[#0a0a0a] shrink-0"
              />
              <span className="text-xs font-sans text-[#6b6b6b]">
                Save this address to my profile for future orders
              </span>
            </label>
          )}

          <section>
            <h2 className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-4">Coupon Code</h2>
            <CouponInput
              onApply={(d, c) => { setCouponDiscount(d); setCouponCode(c); setAppliedCoupon(c, d) }}
              onRemove={() => { setCouponDiscount(0); setCouponCode(null); clearAppliedCoupon() }}
              appliedCode={couponCode}
              userId={isLoggedIn ? (user?.id ?? null) : null}
              guestEmail={!isLoggedIn ? (billing.email || null) : null}
              showWelcomeHint={true}
            />
          </section>

          <section>
            <h2 className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-4">Payment Method</h2>
            <PaymentSection selected={paymentMethod} onSelect={setPaymentMethod} />
          </section>

          {checkoutError && (
            <div role="alert" className="bg-red-50 border border-red-200 text-red-700 text-sm font-sans px-4 py-3">
              {checkoutError}
            </div>
          )}

          <Button type="button" loading={loading} onClick={placeOrder} className="w-full">
            {paymentMethod === 'cod' ? 'Place Order (COD)' : 'Pay Now'}
          </Button>
        </div>
      </div>
    </div>
  )
}
