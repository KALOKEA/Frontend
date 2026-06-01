import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Kalokea',
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <p className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#c8a4a5] mb-3">Legal</p>
      <h1 className="font-serif text-4xl text-[#0a0a0a] mb-2">Terms & Conditions</h1>
      <p className="text-xs font-sans text-[#6b6b6b] mb-10">Last updated: January 2026</p>

      <div className="space-y-8 text-sm font-sans text-[#6b6b6b] leading-relaxed">
        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Agreement to Terms</h2>
          <p>By accessing and using Kalokea.in, you agree to these Terms & Conditions. If you do not agree, please do not use our website.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Products & Pricing</h2>
          <p>All prices are in Indian Rupees (INR) and inclusive of GST. We reserve the right to change prices at any time. Product images may vary slightly from the actual product due to photography and display settings.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Orders & Payment</h2>
          <p>By placing an order, you confirm that the information provided is accurate. We accept UPI, credit/debit cards, net banking, wallets, and Cash on Delivery (COD). Orders are confirmed only after successful payment.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Cancellations</h2>
          <p>Orders can be cancelled before they are packed. Once packed, cancellation is not possible. To cancel, contact us at hello@kalokea.in with your order number.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Intellectual Property</h2>
          <p>All content on Kalokea.in — including images, text, logos, and design — is the property of Kalokea and may not be reproduced without permission.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Limitation of Liability</h2>
          <p>Kalokea shall not be liable for indirect, incidental, or consequential damages arising from the use of our website or products.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Governing Law</h2>
          <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in India.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Contact</h2>
          <p>For any questions, contact us at hello@kalokea.in.</p>
        </section>
      </div>
    </div>
  )
}
