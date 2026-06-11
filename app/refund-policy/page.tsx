import type { Metadata } from 'next'
import Link from 'next/link'
import CmsPageContent from '@/components/CmsPageContent'

export const metadata: Metadata = {
  title: 'Refund & Return Policy | Kalokea',
  description: 'Kalokea refund and return policy — 7-day returns on eligible items.',
  alternates: { canonical: 'https://kalokea.in/refund-policy/' },
}

const SC = [
  '<h2>Overview</h2>',
  '<p>We want you to love what you ordered. If something is not right, we accept returns and exchanges within <strong>7 days of delivery</strong> on eligible items.</p>',
  '<h2>Eligibility</h2>',
  '<p>To be eligible, your item must be: unworn and unwashed with original tags attached, returned within 7 days of delivery, and in its original packaging.</p>',
  '<p>Items <strong>not eligible</strong> for return: sale items, intimate wear, accessories, and final-sale items.</p>',
  '<h2>How to Initiate a Return</h2>',
  '<p>Log in to your account, go to <strong>My Orders</strong>, select the order, and click <strong>Request Return</strong>. Our team reviews requests within 24-48 hours and sends a return shipping label.</p>',
  '<p>Guest orders: email <a href="mailto:support@kalokea.in">support@kalokea.in</a> with your order number and reason.</p>',
  '<h2>Refund Process</h2>',
  '<p><strong>Online payments (Razorpay):</strong> Refunded to the original payment method within 5-7 business days after approval.</p>',
  '<p><strong>Cash on Delivery:</strong> Refunded as store credit or via bank transfer (NEFT/UPI) within 5-7 business days.</p>',
  '<h2>Exchange Policy</h2>',
  '<p>Free size exchanges (subject to stock). Select "Exchange" during the return request. The replacement ships once we receive the original.</p>',
  '<h2>Damaged or Wrong Items</h2>',
  '<p>Email <a href="mailto:support@kalokea.in">support@kalokea.in</a> with your order number and a photo within <strong>48 hours of delivery</strong>. We will arrange a free pickup and send a replacement or full refund.</p>',
  '<h2>Return Shipping</h2>',
  '<p>We provide a prepaid return label via ShipRocket. If the return is due to change of mind, a flat return shipping fee of <strong>Rs. 99</strong> will be deducted from your refund.</p>',
  '<h2>Contact Us</h2>',
  '<p>Email <a href="mailto:support@kalokea.in">support@kalokea.in</a> — Mon to Sat, 10 AM to 6 PM IST.</p>',
].join('\n')

const refundFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is Kalokea\'s return policy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We accept returns within 7 days of delivery on eligible items. Items must be unworn, unwashed, with original tags attached and in original packaging. Sale items, intimate wear, and accessories are not eligible.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I initiate a return on Kalokea?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Log in to your account, go to My Orders, select the order, and click Request Return. For guest orders, email support@kalokea.in with your order number and reason. Requests are reviewed within 24–48 hours.',
      },
    },
    {
      '@type': 'Question',
      name: 'When will I receive my refund?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Online payments are refunded to the original payment method within 5–7 business days after approval. COD orders are refunded as store credit or via bank transfer (NEFT/UPI) within 5–7 business days.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Kalokea offer exchanges?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — free size exchanges are available subject to stock. Select Exchange during the return request. The replacement ships once we receive the original item.',
      },
    },
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(refundFaqJsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <nav className="flex items-center gap-1.5 text-[10px] font-sans tracking-widest uppercase text-[#9b9b9b] mb-10">
          <Link href="/" className="hover:text-[#0a0a0a]">Home</Link>
          <span>/</span>
          <span className="text-[#6b6b6b]">Refund &amp; Return Policy</span>
        </nav>
        <h1 className="font-serif text-4xl text-[#0a0a0a] mb-2">Refund &amp; Return Policy</h1>
        <p className="text-sm font-sans text-[#9b9b9b] mb-10">Last updated: June 2025</p>
        <CmsPageContent slug="refund-policy" staticContent={SC} />
      </div>
    </>
  )
}
