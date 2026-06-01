'use client'
import { useState } from 'react'
import type { Metadata } from 'next'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <p className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#c8a4a5] mb-3">Get in Touch</p>
      <h1 className="font-serif text-4xl text-[#0a0a0a] mb-2">Contact Us</h1>
      <p className="text-sm font-sans text-[#6b6b6b] mb-10">
        We&apos;d love to hear from you. Send us a message and we&apos;ll respond within 24 hours.
      </p>

      <div className="grid md:grid-cols-2 gap-8 mb-10">
        {[
          ['Email', 'hello@kalokea.in'],
          ['WhatsApp', '+91 99999 99999'],
          ['Hours', 'Mon–Sat, 10am–6pm IST'],
          ['Returns', 'Within 7 days of delivery'],
        ].map(([label, val]) => (
          <div key={label}>
            <p className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-1">{label}</p>
            <p className="text-sm font-sans text-[#0a0a0a]">{val}</p>
          </div>
        ))}
      </div>

      {sent ? (
        <div className="border border-[#c8a4a5] p-6 text-center">
          <p className="font-serif text-2xl text-[#0a0a0a] mb-1">Thank you!</p>
          <p className="text-sm font-sans text-[#6b6b6b]">We&apos;ll get back to you within 24 hours.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
              className="w-full border border-[#e8e4e0] bg-white px-4 py-3 text-sm font-sans text-[#0a0a0a] outline-none focus:border-[#0a0a0a] transition-colors placeholder:text-[#6b6b6b] resize-none"
              placeholder="How can we help?"
            />
          </div>
          <Button type="submit">Send Message</Button>
        </form>
      )}
    </div>
  )
}
