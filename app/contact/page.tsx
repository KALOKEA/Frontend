'use client'
import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import CmsPageContent from '@/components/CmsPageContent'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-73aa.up.railway.app'

const STATIC_CONTACT_INFO = `<p><strong>Email:</strong> support@kalokea.in<br><strong>WhatsApp:</strong> +91 93101 78308<br><strong>Hours:</strong> Monday – Saturday, 10 AM – 6 PM IST</p><p>For order tracking, visit our <a href="/track-order">Track Order</a> page.</p>`

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${API_URL}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
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

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <p className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#c8a4a5] mb-3">Get in Touch</p>
      <h1 className="font-serif text-4xl text-[#0a0a0a] mb-6">Contact Us</h1>

      <div className="mb-10">
        <CmsPageContent slug="contact" staticContent={STATIC_CONTACT_INFO} />
      </div>

      {sent ? (
        <div className="border border-[#c8a4a5] p-6 text-center">
          <p className="font-serif text-2xl text-[#0a0a0a] mb-1">Thank you!</p>
          <p className="text-sm font-sans text-[#6b6b6b]">We&apos;ll get back to you within 24 hours.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Your Name" value={form.name} onChange={set('name')} required />
            <Input label="Email Address" type="email" value={form.email} onChange={set('email')} required />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] uppercase tracking-widest text-[#6b6b6b] font-sans">Message</label>
            <textarea
              value={form.message}
              onChange={set('message')}
              rows={5}
              required
              className="w-full border border-[#e8e4e0] bg-white px-4 py-3 text-base font-sans text-[#0a0a0a] outline-none focus:border-[#0a0a0a] transition-colors placeholder:text-[#6b6b6b] resize-none"
              placeholder="How can we help?"
            />
          </div>
          {error && <p className="text-sm font-sans text-[#c0392b]">{error}</p>}
          <Button type="submit" loading={loading}>Send Message</Button>
        </form>
      )}
    </div>
  )
}
