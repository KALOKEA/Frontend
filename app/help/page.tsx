'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { siteContentApi } from '@/lib/api/siteContent'

interface Faq { q: string; a: string }

const WA_NUMBER = '918799610432'
const SUPPORT_EMAIL = 'support@kalokea.com'

// Shown until the admin adds their own in Admin → Help & FAQ.
const DEFAULT_FAQS: Faq[] = [
  { q: 'How do I track my order?', a: 'Once your order ships you receive an SMS/email with a tracking link. You can also track it any time from the Track Order page or under My Orders in your account.' },
  { q: 'What is your return & exchange policy?', a: 'We offer easy 7-day returns and exchanges from the date of delivery. Items must be unworn, unwashed and have original tags. Start a request from My Orders.' },
  { q: 'Is Cash on Delivery (COD) available?', a: 'Yes, COD is available across most pin codes in India. You pay in cash when the order is delivered to your door.' },
  { q: 'How long does delivery take?', a: 'Metro cities: 3–5 business days. Rest of India: 5–7 business days. Free shipping on orders above ₹999.' },
  { q: 'How do I choose the right size?', a: 'Each product page has a detailed size guide with measurements. If you are between sizes we usually suggest sizing up. Still unsure? Message us on WhatsApp.' },
]

function safeFaqs(raw: string | undefined): Faq[] {
  if (!raw) return []
  try {
    const v = JSON.parse(raw)
    return Array.isArray(v) ? v.filter((x) => x && typeof x.q === 'string' && (x.q.trim() || x.a?.trim())) : []
  } catch {
    return []
  }
}

function FaqItem({ q, a }: Faq) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[#E0D4C4]">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left py-4 flex items-center justify-between gap-4"
        aria-expanded={open}
      >
        <span className="font-sans text-[14px] font-medium text-[#0A0908] leading-snug">{q}</span>
        <span
          className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full border border-[#C49070] text-[#C49070] text-xs transition-transform"
          style={{ transform: open ? 'rotate(45deg)' : 'none' }}
          aria-hidden="true"
        >+</span>
      </button>
      {open && (
        <div className="pb-4 pr-8">
          <p className="font-sans text-[13px] text-[#6B5E55] leading-relaxed whitespace-pre-line">{a}</p>
        </div>
      )}
    </div>
  )
}

export default function HelpPage() {
  const [intro, setIntro] = useState('')
  const [faqs, setFaqs] = useState<Faq[]>(DEFAULT_FAQS)

  useEffect(() => {
    siteContentApi
      .getAll()
      .then((raw) => {
        if (raw.help_intro) setIntro(raw.help_intro)
        const f = safeFaqs(raw.help_faqs)
        if (f.length) setFaqs(f)
      })
      .catch(() => {})
  }, [])

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <div className="bg-[#FDFAF6] min-h-screen">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* Header */}
      <div className="border-b border-[#f0ece8] bg-[#faf8f5]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 text-center">
          <p className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#7C4A2D] mb-3">We&rsquo;re here to help</p>
          <h1 className="font-serif text-3xl md:text-5xl text-[#0a0a0a] mb-3">Help &amp; Support</h1>
          <p className="font-sans text-sm text-[#6B5E55] max-w-xl mx-auto leading-relaxed">
            {intro || 'Browse common questions below, or reach our team directly — we usually reply within a few hours during business hours (Mon–Sat, 10 AM–6 PM IST).'}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Contact options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hi! I need help with my Kalokea order.')}`}
            target="_blank" rel="noopener noreferrer"
            className="border border-[#E0D4C4] p-5 text-center hover:border-[#7C4A2D] transition-colors"
          >
            <p className="font-serif text-[15px] text-[#0a0a0a] mb-1">WhatsApp</p>
            <p className="text-[12px] text-[#6B5E55]">Fastest reply — chat with us</p>
          </a>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="border border-[#E0D4C4] p-5 text-center hover:border-[#7C4A2D] transition-colors"
          >
            <p className="font-serif text-[15px] text-[#0a0a0a] mb-1">Email</p>
            <p className="text-[12px] text-[#6B5E55]">{SUPPORT_EMAIL}</p>
          </a>
          <Link
            href="/track-order/"
            className="border border-[#E0D4C4] p-5 text-center hover:border-[#7C4A2D] transition-colors"
          >
            <p className="font-serif text-[15px] text-[#0a0a0a] mb-1">Track Order</p>
            <p className="text-[12px] text-[#6B5E55]">Check your order status</p>
          </Link>
        </div>

        {/* FAQ accordion */}
        <h2 className="font-serif text-2xl text-[#0a0a0a] mb-2 text-center">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto mt-6 border-t border-[#E0D4C4]">
          {faqs.map((f, i) => (
            <FaqItem key={i} q={f.q} a={f.a} />
          ))}
        </div>

        {/* Quick links */}
        <div className="text-center mt-12 text-[13px] text-[#6B5E55]">
          More: {' '}
          <Link href="/size-guide/" className="text-[#7C4A2D] underline">Size Guide</Link> ·{' '}
          <Link href="/shipping-policy/" className="text-[#7C4A2D] underline">Shipping</Link> ·{' '}
          <Link href="/refund-policy/" className="text-[#7C4A2D] underline">Returns &amp; Refunds</Link> ·{' '}
          <Link href="/contact/" className="text-[#7C4A2D] underline">Contact Us</Link>
        </div>
      </div>
    </div>
  )
}
