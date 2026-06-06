import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Refund Policy | Kalokea',
  description: 'Kalokea refund and return policy — 7-day returns on eligible items.',
}

export default function RefundPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <nav className="flex items-center gap-1.5 text-[10px] font-sans tracking-widest uppercase text-[#9b9b9b] mb-10">
        <Link href="/" className="hover:text-[#0a0a0a]">Home</Link>
        <span>/</span>
        <span className="text-[#6b6b6b]">Refund Policy</span>
      </nav>

      <h1 className="font-serif text-4xl text-[#0a0a0a] mb-2">Refund Policy</h1>
      <p className="text-sm font-sans text-[#9b9b9b] mb-10">Last updated: June 2025</p>

      <div className="space-y-8 font-sans text-sm text-[#3a3a3a] leading-relaxed">

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Return Window</h2>
          <p>
            We accept returns within <strong>7 days of delivery</strong>. Requests made after 7 days
            will not be accepted under any circumstances.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Eligible Items</h2>
          <p className="mb-3">To be eligible for a return, items must be:</p>
          <ul className="list-disc list-inside space-y-1 text-[#6b6b6b]">
            <li>Unworn and unwashed</li>
            <li>In original condition with all tags attached</li>
            <li>In original packaging</li>
          </ul>
          <p className="mt-4 mb-3"><strong>Non-returnable items:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-[#6b6b6b]">
            <li>Innerwear and swimwear (for hygiene reasons)</li>
            <li>Items marked &ldquo;Final Sale&rdquo; or purchased during clearance</li>
            <li>Items that show signs of wear, washing, or damage caused by the customer</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">How to Initiate a Return</h2>
          <p>
            Log in to your account, go to <strong>My Orders</strong>, and click <strong>Return</strong>
            on the relevant order. Our team will review your request within 1–2 business days and
            provide a return pickup or drop-off instruction.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Refund Processing</h2>
          <p className="mb-3">
            Once we receive and inspect the returned item, refunds are processed within
            <strong> 7–10 business days</strong>. The refund is issued to the original payment method:
          </p>
          <ul className="list-disc list-inside space-y-1 text-[#6b6b6b]">
            <li>Online payments (UPI, card): refunded via Razorpay to the original account</li>
            <li>COD payments: refunded via bank transfer (NEFT/IMPS) — provide bank details when raising the request</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Order Cancellation</h2>
          <p>
            Orders may be cancelled within 12 hours of placement if the status is still
            &ldquo;Pending&rdquo;. Prepaid orders cancelled within the window are refunded in 5–7 business days.
            See our <Link href="/terms" className="text-[#c8a4a5] hover:underline">Terms &amp; Conditions</Link> for full cancellation rules.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Damaged or Wrong Items</h2>
          <p>
            If you received a damaged, defective, or wrong item, please contact us within 48 hours of
            delivery at{' '}
            <a href="mailto:hello@kalokea.in" className="text-[#c8a4a5] hover:underline">hello@kalokea.in</a>{' '}
            with your order number and photos. We will arrange a free replacement or full refund.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Questions?</h2>
          <p>
            <Link href="/contact" className="text-[#c8a4a5] hover:underline">Contact us</Link> — we&rsquo;re happy to help.
          </p>
        </section>
      </div>
    </div>
  )
}
