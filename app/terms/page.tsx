import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Kalokea',
  description: 'Terms and conditions governing your use of Kalokea and purchases made on our platform.',
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <nav className="flex items-center gap-1.5 text-[10px] font-sans tracking-widest uppercase text-[#9b9b9b] mb-10">
        <Link href="/" className="hover:text-[#0a0a0a]">Home</Link>
        <span>/</span>
        <span className="text-[#6b6b6b]">Terms &amp; Conditions</span>
      </nav>

      <h1 className="font-serif text-4xl text-[#0a0a0a] mb-2">Terms &amp; Conditions</h1>
      <p className="text-sm font-sans text-[#9b9b9b] mb-10">Last updated: June 2025</p>

      <div className="space-y-8 font-sans text-sm text-[#3a3a3a] leading-relaxed">

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using kalokea.in (&ldquo;Website&rdquo;) or placing an order with Kalokea, you agree
            to be bound by these Terms &amp; Conditions. If you do not agree, please do not use our Website.
            These terms constitute a legally binding agreement between you and Kalokea.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">2. Governing Law</h2>
          <p>
            These Terms are governed by and construed in accordance with the laws of India, including
            the Consumer Protection Act 2019, the Information Technology Act 2000, and the Goods and
            Services Tax Act 2017. Any dispute arising shall be subject to the exclusive jurisdiction
            of the courts at the registered location of Kalokea.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">3. Product Descriptions</h2>
          <p>
            We make every effort to display our products accurately, including colours, sizes, and
            fabric. However, colour reproduction varies across screens and actual products may differ
            slightly. Sizes follow our published size guide; please refer to it before purchasing.
            We reserve the right to limit quantities and correct pricing errors.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">4. Pricing &amp; Payment</h2>
          <p className="mb-3">
            All prices on the Website are in Indian Rupees (INR) and are exclusive of GST unless
            stated otherwise. GST is calculated and displayed at checkout. We accept UPI, debit/credit
            cards, and net banking via Razorpay, as well as Cash on Delivery (COD) where available.
          </p>
          <p>
            COD orders carry an additional handling fee of ₹49. Prices are subject to change without
            notice; the price charged will be the price at the time you place your order.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">5. Order Confirmation &amp; Cancellation</h2>
          <p className="mb-3">
            Your order is confirmed when you receive an order confirmation email. We reserve the right
            to cancel orders due to stock availability, pricing errors, or suspected fraud. In such
            cases, a full refund will be issued within 5–7 business days.
          </p>
          <p>
            <strong>Customer cancellation window:</strong> You may cancel an order within 12 hours
            of placing it, provided the order has not yet been dispatched and its status is
            &ldquo;Pending&rdquo;. After 12 hours or once dispatched, cancellation is not possible.
            To cancel, visit My Orders on your account page.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">6. Shipping</h2>
          <p>
            We offer free shipping on orders above ₹999. Standard delivery takes 3–5 business days
            within India. Delivery to remote areas may take longer. Kalokea is not responsible for
            delays caused by courier partners, natural events, or factors beyond our control.
            A tracking number will be sent to you once your order is dispatched.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">7. Returns &amp; Refunds</h2>
          <p className="mb-3">
            We accept returns within <strong>7 days of delivery</strong>. Items must be unworn,
            unwashed, and returned with original tags and packaging. The following items are
            non-returnable: innerwear, swimwear, and items marked &ldquo;Final Sale&rdquo;.
          </p>
          <p>
            <strong>No returns are accepted after 7 days of delivery.</strong> Refunds for eligible
            returns are processed within 7–10 business days of receiving the returned item. For full
            details, please see our{' '}
            <Link href="/refund-policy" className="text-[#c8a4a5] hover:underline">Refund Policy</Link>.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">8. Intellectual Property</h2>
          <p>
            All content on this Website — including text, images, logos, and design — is the property
            of Kalokea or its licensors and is protected under Indian copyright law. You may not
            reproduce, distribute, or use any content without our prior written consent.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">9. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by Indian law, Kalokea&rsquo;s total liability for any claim
            arising from your use of the Website or purchase of products shall not exceed the amount
            you paid for the specific order giving rise to the claim. We are not liable for indirect,
            incidental, or consequential damages.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">10. Dispute Resolution</h2>
          <p>
            In case of any dispute, we encourage you to contact us first at{' '}
            <a href="mailto:hello@kalokea.in" className="text-[#c8a4a5] hover:underline">hello@kalokea.in</a>{' '}
            so we can resolve it amicably. If a resolution cannot be reached, disputes shall be
            submitted to binding arbitration under the Arbitration and Conciliation Act, 1996, or
            resolved by the competent consumer court under the Consumer Protection Act, 2019.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">11. Changes to Terms</h2>
          <p>
            We may revise these Terms at any time. The revised version will be effective when posted
            on this page. Continued use of the Website after changes constitutes your acceptance.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">12. Contact</h2>
          <p>
            Questions about these Terms?{' '}
            <Link href="/contact" className="text-[#c8a4a5] hover:underline">Contact us</Link> or
            email <a href="mailto:hello@kalokea.in" className="text-[#c8a4a5] hover:underline">hello@kalokea.in</a>.
          </p>
        </section>
      </div>
    </div>
  )
}
