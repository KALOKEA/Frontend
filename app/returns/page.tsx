import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Returns & Exchanges | Kalokea',
}

export default function ReturnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <p className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#7C4A2D] mb-3">Returns & Exchanges</p>
      <h1 className="font-serif text-4xl text-[#0a0a0a] mb-8">Easy 7-Day Returns</h1>

      <div className="space-y-8 text-sm font-sans text-[#6b6b6b] leading-relaxed">
        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Return Policy</h2>
          <p>We accept returns within <strong className="text-[#0a0a0a]">7 days</strong> of delivery. Items must be unworn, unwashed, and in their original condition with all tags attached.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">How to Return</h2>
          <ol className="space-y-2 list-decimal list-inside">
            <li>Log in to your account and go to <Link href="/account/orders" className="text-[#7C4A2D] underline">My Orders</Link></li>
            <li>Select the item you want to return and click &quot;Return/Exchange&quot;</li>
            <li>Choose your reason and submit the request</li>
            <li>We&apos;ll arrange a free pickup within 2–3 business days</li>
            <li>Refund is processed within 5–7 business days after we receive the item</li>
          </ol>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Non-Returnable Items</h2>
          <ul className="space-y-1 list-disc list-inside">
            <li>Lingerie, swimwear, and items marked &quot;Final Sale&quot;</li>
            <li>Items returned after 7 days of delivery</li>
            <li>Items that are worn, washed, or have tags removed</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Refunds</h2>
          <p>Prepaid orders are refunded to the original payment method. COD orders are refunded via bank transfer — please provide your bank details when submitting your return request.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Exchanges</h2>
          <p>We currently do not support direct exchanges. Please return your item and place a new order for the size or style you prefer.</p>
        </section>
      </div>
    </div>
  )
}
