'use client'
import { useEffect, useState } from 'react'
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
import { trackBeginCheckout, trackPurchase } from '@/lib/analytics'

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
  const { isLoggedIn, user } = useAuthStore()
  const { items, clearCart } = useCartStore()
  const { toast } = useToast()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [billing, setBilling] = useState<BillingForm>(emptyBilling)
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [couponCode, setCouponCode] = useState<string | null>(null)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) { router.push('/login?redirect=/checkout'); return }
    if (!items.length) { router.push('/cart'); return }
    addressesApi.getAll().then((data) => {
      setAddresses(data)
      const def = data.find((a) => a.is_default) || data[0]
      setBilling((b) => def ? billingFromAddress(def, user?.email || '') : { ...b, email: user?.email || '' })
    }).catch(() => setBilling((b) => ({ ...b, email: user?.email || '' })))
  }, [isLoggedIn, items.length, router, user?.email])

  // GA4 begin_checkout once, when the page loads with items.
  useEffect(() => {
    if (!items.length) return
    const value = items.reduce((s, i) => s + i.price * i.quantity, 0)
    trackBeginCheckout(toGaItems(items), value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const placeOrder = async () => {
    // Validate billing details (matches the backend's required fields).
    const required: [keyof BillingForm, string][] = [
      ['first_name', 'First name'], ['line1', 'Street address'], ['city', 'Town / City'],
      ['state', 'State'], ['pincode', 'Postcode / PIN'], ['phone', 'Phone'],
    ]
    for (const [k, label] of required) {
      if (!String(billing[k] || '').trim()) { toast(`${label} is required`, 'error'); return }
    }
    if (billing.pincode.length !== 6) { toast('Enter a valid 6-digit PIN code', 'error'); return }
    if (billing.phone.length !== 10) { toast('Enter a valid 10-digit phone number', 'error'); return }
    if (billing.gst_invoice && (!billing.gstin.trim() || !billing.company.trim())) {
      toast('Company name and GSTIN are required for a GST invoice', 'error'); return
    }

    setLoading(true)
    try {
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
      })

      if (paymentMethod === 'cod') {
        trackPurchase(order.order_number, order.total, toGaItems(items))
        clearCart()
        router.push(`/checkout/success?order=${order.order_number}`)
      } else {
        // Razorpay integration
        const { paymentsApi } = await import('@/lib/api/payments')
        const rzp = await paymentsApi.createOrder(order.id)
        const options = {
          key: rzp.key_id,
          amount: rzp.amount,
          currency: rzp.currency,
          order_id: rzp.razorpay_order_id,
          name: 'Kalokea',
          handler: () => {
            trackPurchase(order.order_number, order.total, toGaItems(items))
            clearCart()
            router.push(`/checkout/success?order=${order.order_number}`)
          },
          prefill: {},
          theme: { color: '#0a0a0a' },
        }
        const razorpay = new (window as unknown as { Razorpay: new (o: typeof options) => { open: () => void } }).Razorpay(options)
        razorpay.open()
      }
    } catch (err) {
      toast((err as Error).message || 'Failed to place order', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-serif text-3xl text-[#0a0a0a] mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left */}
        <div className="space-y-8">
          <section>
            <h2 className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-4">Billing details</h2>
            <BillingDetails value={billing} onChange={setBilling} savedAddresses={addresses} />
          </section>

          <section>
            <h2 className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-4">Coupon Code</h2>
            <CouponInput
              onApply={(d, c) => { setCouponDiscount(d); setCouponCode(c) }}
              onRemove={() => { setCouponDiscount(0); setCouponCode(null) }}
              appliedCode={couponCode}
            />
          </section>

          <section>
            <h2 className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-4">Payment Method</h2>
            <PaymentSection selected={paymentMethod} onSelect={setPaymentMethod} />
          </section>

          <Button onClick={placeOrder} loading={loading} size="lg" className="w-full">
            {paymentMethod === 'cod' ? 'Place Order' : 'Proceed to Payment'}
          </Button>
        </div>

        {/* Right */}
        <OrderSummary
          couponDiscount={couponDiscount}
          couponCode={couponCode}
          paymentMethod={paymentMethod}
          addressState={billing.state}
        />
      </div>
    </div>
  )
}
