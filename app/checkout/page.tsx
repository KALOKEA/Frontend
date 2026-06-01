'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/store/useCartStore'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { addressesApi, type Address } from '@/lib/api/addresses'
import { ordersApi } from '@/lib/api/orders'
import { useToast } from '@/components/ui/Toast'
import AddressSelector from '@/components/checkout/AddressSelector'
import OrderSummary from '@/components/checkout/OrderSummary'
import PaymentSection from '@/components/checkout/PaymentSection'
import CouponInput from '@/components/checkout/CouponInput'
import Button from '@/components/ui/Button'

export default function CheckoutPage() {
  const router = useRouter()
  const { isLoggedIn } = useAuthStore()
  const { items, clearCart } = useCartStore()
  const { toast } = useToast()

  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [couponCode, setCouponCode] = useState<string | null>(null)
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isLoggedIn) { router.push('/login?redirect=/checkout'); return }
    if (!items.length) { router.push('/cart'); return }
    addressesApi.getAll().then((data) => {
      setAddresses(data)
      const def = data.find((a) => a.is_default)
      if (def) setSelectedAddress(def.id)
    }).catch(() => {})
  }, [isLoggedIn, items.length, router])

  const placeOrder = async () => {
    if (!selectedAddress) { toast('Please select a delivery address', 'error'); return }
    setLoading(true)
    try {
      const order = await ordersApi.create({
        address_id: selectedAddress,
        payment_method: paymentMethod,
        coupon_code: couponCode || undefined,
      })

      if (paymentMethod === 'cod') {
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
            <h2 className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-4">Delivery Address</h2>
            <AddressSelector
              addresses={addresses}
              selected={selectedAddress}
              onSelect={setSelectedAddress}
              onNewAddress={(addr) => { setAddresses((prev) => [...prev, addr]); setSelectedAddress(addr.id) }}
            />
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
        <OrderSummary couponDiscount={couponDiscount} paymentMethod={paymentMethod} />
      </div>
    </div>
  )
}
