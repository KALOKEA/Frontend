import type { Metadata } from 'next'
import Link from 'next/link'
import CmsPageContent from '@/components/CmsPageContent'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Kalokea',
  description: 'Terms and conditions for using Kalokea.',
  alternates: { canonical: 'https://kalokea.in/terms/' },
}

const SC = [
  '<h2>Acceptance of Terms</h2>',
  '<p>By accessing and using kalokea.in, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our website.</p>',
  '<h2>Products and Pricing</h2>',
  '<p>All prices are in Indian Rupees (INR) and inclusive of applicable taxes. We reserve the right to change prices at any time. Product images are for illustration — actual colours may vary slightly due to display settings.</p>',
  '<h2>Orders and Payment</h2>',
  '<p>Orders are confirmed upon successful payment. We accept UPI, credit/debit cards, net banking, and Cash on Delivery (COD). Payments are securely processed by Razorpay.</p>',
  '<p>We reserve the right to cancel any order at our discretion, in which case a full refund will be issued.</p>',
  '<h2>Shipping</h2>',
  '<p>We ship across India via ShipRocket. Delivery timelines are estimates and may vary. For detailed shipping information, see our <a href="/shipping-policy/">Shipping Policy</a>.</p>',
  '<h2>Returns and Refunds</h2>',
  '<p>We offer 7-day returns on eligible items. For full details, see our <a href="/refund-policy/">Refund & Return Policy</a>.</p>',
  '<h2>Intellectual Property</h2>',
  '<p>All content on kalokea.in — including text, images, logos, and design — is the property of Kalokea and protected by copyright law. You may not reproduce or use it without prior written permission.</p>',
  '<h2>User Accounts</h2>',
  '<p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorised use.</p>',
  '<h2>Limitation of Liability</h2>',
  '<p>To the maximum extent permitted by law, Kalokea shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products.</p>',
  '<h2>Governing Law</h2>',
  '<p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra.</p>',
  '<h2>Contact</h2>',
  '<p>For queries regarding these Terms, email <a href="mailto:support@kalokea.in">support@kalokea.in</a>.</p>',
].join('\n')

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <nav className="flex items-center gap-1.5 text-[10px] font-sans tracking-widest uppercase text-[#9b9b9b] mb-10">
        <Link href="/" className="hover:text-[#0a0a0a]">Home</Link>
        <span>/</span>
        <span className="text-[#6b6b6b]">Terms & Conditions</span>
      </nav>
      <h1 className="font-serif text-4xl text-[#0a0a0a] mb-2">Terms & Conditions</h1>
      <p className="text-sm font-sans text-[#9b9b9b] mb-10">Last updated: June 2025</p>
      <CmsPageContent slug="terms" staticContent={SC} />
    </div>
  )
}
