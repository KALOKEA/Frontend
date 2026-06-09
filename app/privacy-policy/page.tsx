import type { Metadata } from 'next'
import Link from 'next/link'
import CmsPageContent from '@/components/CmsPageContent'

export const metadata: Metadata = {
  title: 'Privacy Policy | Kalokea',
  description: 'How Kalokea collects, uses, and protects your personal information.',
  alternates: { canonical: 'https://kalokea.in/privacy-policy/' },
}

const SC = [
  '<h2>Introduction</h2>',
  '<p>Kalokea ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website kalokea.in or make a purchase.</p>',
  '<h2>Information We Collect</h2>',
  '<p><strong>Personal Information:</strong> Name, email address, phone number, shipping address, and payment details (processed securely by Razorpay — we never store card data).</p>',
  '<p><strong>Usage Data:</strong> Pages visited, products viewed, device type, and browser information collected via cookies and analytics.</p>',
  '<h2>How We Use Your Information</h2>',
  '<p>We use your information to process and fulfil orders, send order confirmations and tracking updates, provide customer support, improve our website and offerings, and send marketing emails (only if you opt in).</p>',
  '<h2>Data Sharing</h2>',
  '<p>We do not sell your personal data. We share it only with trusted service providers who help us operate our business: Razorpay (payments), ShipRocket (logistics), Brevo (email), and Supabase (database) — all under strict data protection agreements.</p>',
  '<h2>Cookies</h2>',
  '<p>We use essential cookies for site functionality and optional analytics cookies to understand usage patterns. You can manage cookie preferences in your browser settings.</p>',
  '<h2>Data Retention</h2>',
  '<p>We retain your personal data for as long as your account is active or as needed to provide services, comply with legal obligations, and resolve disputes.</p>',
  '<h2>Your Rights</h2>',
  '<p>You have the right to access, correct, or delete your personal data. To exercise these rights, email <a href="mailto:support@kalokea.in">support@kalokea.in</a>.</p>',
  '<h2>Security</h2>',
  '<p>We implement industry-standard security measures including SSL encryption, secure payment processing via Razorpay, and limited staff access to personal data.</p>',
  '<h2>Contact</h2>',
  '<p>For privacy-related queries, email <a href="mailto:support@kalokea.in">support@kalokea.in</a> — Mon to Sat, 10 AM to 6 PM IST.</p>',
].join('\n')

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <nav className="flex items-center gap-1.5 text-[10px] font-sans tracking-widest uppercase text-[#9b9b9b] mb-10">
        <Link href="/" className="hover:text-[#0a0a0a]">Home</Link>
        <span>/</span>
        <span className="text-[#6b6b6b]">Privacy Policy</span>
      </nav>
      <h1 className="font-serif text-4xl text-[#0a0a0a] mb-2">Privacy Policy</h1>
      <p className="text-sm font-sans text-[#9b9b9b] mb-10">Last updated: June 2025</p>
      <CmsPageContent slug="privacy-policy" staticContent={SC} />
    </div>
  )
}
