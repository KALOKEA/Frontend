'use client'
import { useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-73aa.up.railway.app'

const SUBJECTS = [
  'Order Status',
  'Returns & Refunds',
  'Product Query',
  'Sizing Help',
  'Other',
]

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    order_id: '',
    message: '',
  })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: `Subject: ${form.subject}${form.order_id ? ` | Order: ${form.order_id}` : ''}\n\n${form.message}`,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.message || 'Failed to send message')
      }
      setSent(true)
    } catch (err) {
      setError((err as Error).message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputCls =
    'w-full border border-[#E0D4C4] bg-white px-4 py-3 text-[14px] font-sans text-[#0A0908] outline-none focus:border-[#7C4A2D] transition-colors placeholder:text-[#6b5c55]'
  const labelCls = 'block text-[10px] uppercase tracking-[0.2em] text-[#6B5E55] font-sans mb-1.5'

  return (
    <div className="bg-[#FDFAF6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">

        {/* Page header */}
        <div className="mb-12">
          <p className="text-[9.5px] font-sans tracking-[0.35em] uppercase text-[#7C4A2D] mb-3">Get in Touch</p>
          <h1 className="font-serif font-light text-[#0A0908]" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Contact <em className="italic" style={{ color: '#7C4A2D' }}>Us</em>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* ── Left: contact info ───────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <p className="text-[9px] font-sans tracking-[0.28em] uppercase text-[#7C4A2D] mb-4">Contact Information</p>
              <div className="space-y-5">

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-[#F2EAE0] text-[#7C4A2D]" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.02 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92v2z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-sans uppercase tracking-widest text-[#6b5c55] mb-0.5">Phone / WhatsApp</p>
                    <p className="font-sans text-[14px] text-[#0A0908]">+91 87996 10432</p>
                    <p className="text-[11px] font-sans text-[#6B5E55]">Mon – Sat, 10 AM – 6 PM IST</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-[#F2EAE0] text-[#7C4A2D]" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-sans uppercase tracking-widest text-[#6b5c55] mb-0.5">Email</p>
                    <p className="font-sans text-[14px] text-[#0A0908]">support@kalokea.in</p>
                    <p className="text-[11px] font-sans text-[#6B5E55]">We reply within 24 hours</p>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-[#F2EAE0] text-[#7C4A2D]" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-[10px] font-sans uppercase tracking-widest text-[#6b5c55] mb-0.5">Address</p>
                    <p className="font-sans text-[14px] text-[#0A0908]">Bandra West</p>
                    <p className="text-[11px] font-sans text-[#6B5E55]">Mumbai, Maharashtra 400050</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Track order link */}
            <div className="border border-[#E0D4C4] p-5 bg-white">
              <p className="text-[11px] font-sans text-[#6B5E55] leading-relaxed">
                For order tracking, visit our{' '}
                <a href="/track-order/" className="text-[#7C4A2D] underline underline-offset-2">Track Order</a>{' '}
                page for real-time updates.
              </p>
            </div>
          </div>

          {/* ── Right: form ──────────────────────────────────────────────── */}
          <div className="lg:col-span-3">
            {sent ? (
              <div role="status" aria-live="polite" className="border border-[#7C4A2D] p-10 text-center">
                <div className="w-12 h-12 flex items-center justify-center bg-[#F2EAE0] text-[#7C4A2D] mx-auto mb-5" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <p className="font-serif text-2xl text-[#0A0908] mb-2">Thank you!</p>
                <p className="text-[13px] font-sans text-[#6B5E55]">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-name" className={labelCls}>Your Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      value={form.name}
                      onChange={set('name')}
                      required
                      placeholder="Priya Sharma"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className={labelCls}>Email Address</label>
                    <input
                      id="contact-email"
                      type="email"
                      value={form.email}
                      onChange={set('email')}
                      required
                      placeholder="priya@example.com"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-subject" className={labelCls}>Subject</label>
                    <select
                      id="contact-subject"
                      value={form.subject}
                      onChange={set('subject')}
                      required
                      className={inputCls}
                    >
                      <option value="">Select a topic</option>
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="contact-order-id" className={labelCls}>Order ID <span className="normal-case text-[#6b5c55]">(optional)</span></label>
                    <input
                      id="contact-order-id"
                      type="text"
                      value={form.order_id}
                      onChange={set('order_id')}
                      placeholder="e.g. KLK-12345"
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className={labelCls}>Message</label>
                  <textarea
                    id="contact-message"
                    value={form.message}
                    onChange={set('message')}
                    rows={5}
                    required
                    placeholder="How can we help you?"
                    className={`${inputCls} resize-none`}
                  />
                </div>

                {error && <p role="alert" className="text-[13px] font-sans text-[#c0392b]">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-10 py-4 text-[9.5px] font-sans tracking-[0.28em] uppercase transition-all duration-300 disabled:opacity-50"
                  style={{ background: '#0A0908', color: '#FDFAF6' }}
                >
                  {loading ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
