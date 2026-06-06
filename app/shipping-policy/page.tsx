import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Shipping Policy | Kalokea',
  description: 'Kalokea shipping policy — free delivery above ₹999, standard 3–5 day delivery across India.',
}

export default function ShippingPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <nav className="flex items-center gap-1.5 text-[10px] font-sans tracking-widest uppercase text-[#9b9b9b] mb-10">
        <Link href="/" className="hover:text-[#0a0a0a]">Home</Link>
        <span>/</span>
        <span className="text-[#6b6b6b]">Shipping Policy</span>
      </nav>

      <h1 className="font-serif text-4xl text-[#0a0a0a] mb-2">Shipping Policy</h1>
      <p className="text-sm font-sans text-[#9b9b9b] mb-10">Last updated: June 2025</p>

      <div className="space-y-8 font-sans text-sm text-[#3a3a3a] leading-relaxed">

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Shipping Charges</h2>
          <ul className="list-disc list-inside space-y-1 text-[#6b6b6b]">
            <li><strong>Free shipping</strong> on all orders above ₹999</li>
            <li>₹49 flat shipping fee on orders below ₹999</li>
            <li>COD orders carry an additional ₹49 handling fee</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Delivery Timeframes</h2>
          <ul className="list-disc list-inside space-y-1 text-[#6b6b6b]">
            <li>Metro cities: 2–4 business days</li>
            <li>Tier 2 &amp; 3 cities: 4–6 business days</li>
            <li>Remote / rural areas: 6–10 business days</li>
          </ul>
          <p className="mt-3 text-[#9b9b9b]">
            Business days exclude Sundays and public holidays. Orders placed before 2 PM IST are
            typically dispatched the same day.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Order Processing</h2>
          <p>
            Orders are processed and dispatched within 1–2 business days of payment confirmation.
            COD orders are dispatched once verified by our team. You will receive a shipping
            confirmation email with a tracking number once your order is dispatched.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Tracking Your Order</h2>
          <p>
            Once dispatched, you can track your order via the tracking number provided in your
            confirmation email, or by visiting{' '}
            <Link href="/account/orders" className="text-[#c8a4a5] hover:underline">My Orders</Link>{' '}
            in your account.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Delivery Attempts</h2>
          <p>
            Our courier partner will attempt delivery up to 3 times. If all attempts fail, the
            package will be returned to our warehouse. In such cases, please contact us to arrange
            re-delivery; additional shipping charges may apply.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Delays &amp; Exceptions</h2>
          <p>
            Kalokea is not responsible for delays caused by courier partners, natural disasters,
            strikes, or other events outside our control. During sale periods or festive seasons,
            delivery times may be slightly longer.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Questions?</h2>
          <p>
            <Link href="/contact" className="text-[#c8a4a5] hover:underline">Contact us</Link> at{' '}
            <a href="mailto:hello@kalokea.in" className="text-[#c8a4a5] hover:underline">hello@kalokea.in</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
