import type { Metadata } from 'next'
import Link from 'next/link'
import CmsPageContent from '@/components/CmsPageContent'

export const metadata: Metadata = {
  title: 'Shipping Policy | Kalokea',
  description: 'Kalokea shipping policy — delivery times, free shipping, and order tracking.',
  alternates: { canonical: 'https://kalokea.com/shipping-policy/' },
}

const SC = [
  '<h2>Shipping Coverage</h2>',
  '<p>We ship across India via ShipRocket. International shipping is not currently available.</p>',
  '<h2>Delivery Timelines</h2>',
  '<p><strong>Metro cities</strong> (Mumbai, Delhi, Bengaluru, Chennai, Hyderabad, Kolkata, Pune, Ahmedabad): 2-4 business days</p>',
  '<p><strong>Tier 2 and Tier 3 cities:</strong> 3-5 business days</p>',
  '<p><strong>Remote areas:</strong> 5-7 business days</p>',
  '<p>Business days exclude Sundays and public holidays. Timelines are estimates and may vary.</p>',
  '<h2>Free Shipping</h2>',
  '<p>Free shipping on all orders above <strong>Rs. 999</strong> (after discounts, before taxes). Orders below Rs. 999 have a flat shipping fee of <strong>Rs. 49</strong>.</p>',
  '<p>Cash on Delivery orders have an additional handling fee of <strong>Rs. 49</strong> regardless of order value.</p>',
  '<h2>Order Processing</h2>',
  '<p>Orders are processed within 1-2 business days of payment confirmation. Orders placed after 5 PM IST or on Sundays/holidays are processed the next business day.</p>',
  '<h2>Order Tracking</h2>',
  '<p>Once dispatched, you will receive an email and SMS with your AWB tracking number. Track your order via the <strong>Track Order</strong> page on our website, or through your Account page if you are logged in.</p>',
  '<h2>Failed Delivery Attempts</h2>',
  '<p>If delivery fails (NDR), the courier makes up to 3 attempts. After 3 failed attempts, the package is returned to us. You will be notified at each step and can choose to re-schedule delivery or request a refund.</p>',
  '<h2>Damaged in Transit</h2>',
  '<p>If your package arrives visibly damaged, refuse delivery and contact us immediately at <a href="mailto:support@kalokea.com">support@kalokea.com</a> with a photo. If damage is found after opening, contact us within 48 hours of delivery.</p>',
  '<h2>Contact Us</h2>',
  '<p>Email <a href="mailto:support@kalokea.com">support@kalokea.com</a> — Mon to Sat, 10 AM to 6 PM IST.</p>',
].join('\n')

const shippingFaqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Is shipping free on Kalokea?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — free shipping on all orders above ₹999 (after discounts, before taxes). Orders below ₹999 have a flat shipping fee of ₹49.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does delivery take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Metro cities (Mumbai, Delhi, Bengaluru, etc.): 2–4 business days. Tier 2 and 3 cities: 3–5 business days. Remote areas: 5–7 business days. Business days exclude Sundays and public holidays.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does Kalokea offer Cash on Delivery (COD)?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, COD is available pan India. A handling fee of ₹49 applies to all COD orders regardless of order value.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do I track my order?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Once dispatched, you receive an email and SMS with your AWB tracking number. You can track your order via the Track Order page on our website or through your Account page if logged in.',
      },
    },
  ],
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(shippingFaqJsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-16 pb-28 lg:pb-16">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-10">
          <Link href="/" className="hover:text-[#0a0a0a]">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-[#6b6b6b]">Shipping Policy</span>
        </nav>
        <h1 className="font-serif text-4xl text-[#0a0a0a] mb-2">Shipping Policy</h1>
        <p className="text-sm font-sans text-[#6b6b6b] mb-10">Last updated: June 2025</p>
        <CmsPageContent slug="shipping-policy" staticContent={SC} />
      </div>
    </>
  )
}
