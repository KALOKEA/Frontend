import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shipping Policy | Kalokea',
}

export default function ShippingPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <p className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#c8a4a5] mb-3">Delivery</p>
      <h1 className="font-serif text-4xl text-[#0a0a0a] mb-8">Shipping Policy</h1>

      <div className="space-y-8 text-sm font-sans text-[#6b6b6b] leading-relaxed">
        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Shipping Rates</h2>
          <p>We offer free shipping on all orders above ₹999. For orders below ₹999, a flat shipping fee of ₹49 applies.</p>
          <p className="mt-2">Cash on Delivery (COD) orders include an additional ₹49 handling fee.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Delivery Timelines</h2>
          <div className="space-y-2">
            {[
              ['Metro Cities', '2–3 business days'],
              ['Tier 2 Cities', '3–5 business days'],
              ['Tier 3 & Remote Areas', '5–7 business days'],
            ].map(([loc, time]) => (
              <div key={loc} className="flex justify-between border-b border-[#f4f2ef] py-2">
                <span className="text-[#0a0a0a]">{loc}</span>
                <span>{time}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Order Processing</h2>
          <p>Orders placed before 2 PM IST on business days are processed the same day. Orders placed after 2 PM or on weekends are processed the next business day.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Tracking</h2>
          <p>Once your order ships, you&apos;ll receive a tracking number via email. You can track your order from your account under &quot;My Orders&quot;.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Delivery Issues</h2>
          <p>If your package hasn&apos;t arrived within the estimated timeframe, please contact us at hello@kalokea.in with your order number and we&apos;ll look into it right away.</p>
        </section>
      </div>
    </div>
  )
}
