import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Kalokea',
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <p className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#c8a4a5] mb-3">Legal</p>
      <h1 className="font-serif text-4xl text-[#0a0a0a] mb-2">Privacy Policy</h1>
      <p className="text-xs font-sans text-[#6b6b6b] mb-10">Last updated: January 2026</p>

      <div className="space-y-8 text-sm font-sans text-[#6b6b6b] leading-relaxed">
        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Information We Collect</h2>
          <p>When you use Kalokea, we collect information you provide directly: your name, email address, phone number, shipping address, and payment information. We also collect data about how you use our website.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">How We Use Your Information</h2>
          <ul className="space-y-1 list-disc list-inside">
            <li>To process and fulfil your orders</li>
            <li>To send order confirmations and shipping updates</li>
            <li>To provide customer support</li>
            <li>To send promotional emails (you can unsubscribe at any time)</li>
            <li>To improve our website and services</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Data Sharing</h2>
          <p>We do not sell or rent your personal information. We share data only with service providers who help us operate our business (payment processing, shipping, email marketing) and as required by law.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Cookies</h2>
          <p>We use cookies to keep you logged in, remember your cart, and understand how you use our website. You can control cookies through your browser settings.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Your Rights</h2>
          <p>You can request access to, correction of, or deletion of your personal data at any time by emailing hello@kalokea.in.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">Contact</h2>
          <p>For privacy-related questions, contact us at hello@kalokea.in.</p>
        </section>
      </div>
    </div>
  )
}
