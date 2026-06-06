import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Kalokea',
  description: 'How Kalokea collects, uses, and protects your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <nav className="flex items-center gap-1.5 text-[10px] font-sans tracking-widest uppercase text-[#9b9b9b] mb-10">
        <Link href="/" className="hover:text-[#0a0a0a]">Home</Link>
        <span>/</span>
        <span className="text-[#6b6b6b]">Privacy Policy</span>
      </nav>

      <h1 className="font-serif text-4xl text-[#0a0a0a] mb-2">Privacy Policy</h1>
      <p className="text-sm font-sans text-[#9b9b9b] mb-10">Last updated: June 2025</p>

      <div className="prose-kalokea space-y-8 font-sans text-sm text-[#3a3a3a] leading-relaxed">

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">1. Who We Are</h2>
          <p>
            Kalokea (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is an Indian women&rsquo;s fashion brand operating at
            kalokea.in. This Privacy Policy explains how we collect, use, store, and share information
            when you visit our website or make a purchase.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">2. Information We Collect</h2>
          <p className="mb-3"><strong>Information you provide directly:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-[#6b6b6b] mb-4">
            <li>Name, phone number, and email address (for account creation and order updates)</li>
            <li>Delivery address (for shipping your orders)</li>
            <li>GSTIN and company name (if you request a GST invoice)</li>
            <li>Review content and photos you submit</li>
          </ul>
          <p className="mb-3"><strong>Information collected automatically:</strong></p>
          <ul className="list-disc list-inside space-y-1 text-[#6b6b6b]">
            <li>IP address, browser type, and device information</li>
            <li>Pages visited, time spent, and referring URLs (via Google Analytics)</li>
            <li>Session cookies required for the shopping cart and authentication</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">3. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2 text-[#6b6b6b]">
            <li>Processing and fulfilling your orders, including dispatching and shipping</li>
            <li>Sending order confirmations, shipping updates, and invoices by email or SMS</li>
            <li>Sending our newsletter if you subscribed (you may unsubscribe at any time)</li>
            <li>Improving our website, product selection, and customer experience</li>
            <li>Detecting and preventing fraud or unauthorized access</li>
            <li>Complying with Indian tax laws (GST Act, Income Tax Act)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">4. Cookies</h2>
          <p>
            We use strictly necessary cookies (authentication token, cart session) that are required
            for the site to function. We also use analytics cookies (Google Analytics) to understand
            how visitors use our site. You may disable analytics cookies in your browser settings
            without affecting core functionality.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">5. Third-Party Services</h2>
          <p className="mb-3">We share your data with the following trusted third parties only as needed to operate our business:</p>
          <ul className="list-disc list-inside space-y-2 text-[#6b6b6b]">
            <li>
              <strong>Razorpay</strong> — processes your payments. Razorpay handles card and UPI data
              directly; we never see or store your full card number. Razorpay&rsquo;s privacy policy is
              available at razorpay.com.
            </li>
            <li>
              <strong>Supabase</strong> — our database provider, storing your account, order, and
              address data on servers within the European Union (Supabase&rsquo;s EU region).
            </li>
            <li>
              <strong>Cloudinary</strong> — stores product and review images. Images may be served via
              Cloudinary&rsquo;s global CDN.
            </li>
            <li>
              <strong>Brevo (Sendinblue)</strong> — sends transactional emails (order confirmations,
              OTP codes). Your email address is shared with Brevo solely for delivery.
            </li>
            <li>
              <strong>Cloudflare</strong> — hosts our website (Cloudflare Pages) and provides DDoS
              protection. Cloudflare may process request metadata but does not access order content.
            </li>
          </ul>
          <p className="mt-3">We do not sell your personal data to any third party.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">6. Data Retention</h2>
          <p>
            We retain your account and order data for 7 years as required by Indian tax regulations
            (GST Act). You may request deletion of your account at any time; however, records needed
            for legal compliance will be retained in anonymised form.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">7. Your Rights</h2>
          <ul className="list-disc list-inside space-y-2 text-[#6b6b6b]">
            <li>Request access to the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account (subject to legal retention obligations)</li>
            <li>Opt out of marketing emails via the unsubscribe link in any email</li>
            <li>Lodge a complaint with the appropriate data protection authority</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">8. Security</h2>
          <p>
            We implement industry-standard security measures including HTTPS, Row-Level Security on
            our database, hashed OTP codes, and short-lived JWT access tokens. Despite these measures,
            no method of internet transmission is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">9. Children&rsquo;s Privacy</h2>
          <p>
            Our services are not directed to individuals under the age of 18. We do not knowingly
            collect personal data from minors.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">10. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. Material changes will be notified by email
            or a prominent notice on our website. Continued use of the site after changes constitutes
            acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl text-[#0a0a0a] mb-3">11. Contact Us</h2>
          <p>
            For privacy-related queries, write to us at{' '}
            <a href="mailto:hello@kalokea.in" className="text-[#c8a4a5] hover:underline">hello@kalokea.in</a>{' '}
            or visit our <Link href="/contact" className="text-[#c8a4a5] hover:underline">Contact page</Link>.
          </p>
        </section>
      </div>
    </div>
  )
}
