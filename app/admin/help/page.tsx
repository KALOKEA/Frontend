'use client'
import { useEffect, useState } from 'react'
import { siteContentApi, invalidateSiteContentCache } from '@/lib/api/siteContent'
import { useToast } from '@/components/ui/Toast'
import Spinner from '@/components/ui/Spinner'

interface Faq { q: string; a: string }

function safeFaqs(raw: string | undefined): Faq[] {
  if (!raw) return []
  try {
    const v = JSON.parse(raw)
    return Array.isArray(v) ? v.filter((x) => x && typeof x.q === 'string') : []
  } catch {
    return []
  }
}

export default function AdminHelpPage() {
  const { toast } = useToast()
  const [intro, setIntro] = useState('')
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    siteContentApi
      .getAll()
      .then((raw) => {
        setIntro(raw.help_intro || '')
        setFaqs(safeFaqs(raw.help_faqs))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function save() {
    setSaving(true)
    try {
      const clean = faqs
        .map((f) => ({ q: f.q.trim(), a: f.a.trim() }))
        .filter((f) => f.q || f.a)
      await siteContentApi.update('help_intro', intro)
      await siteContentApi.update('help_faqs', JSON.stringify(clean))
      invalidateSiteContentCache()
      setFaqs(clean)
      toast('Help & Support page saved')
    } catch (e: unknown) {
      toast(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>
  }

  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-2 gap-3">
        <h1 className="font-serif text-2xl md:text-3xl text-[#0a0a0a]">Help &amp; Support / FAQ</h1>
        <button
          onClick={save}
          disabled={saving}
          className="px-4 py-2 text-sm bg-[#0a0a0a] text-white hover:bg-[#333] disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
      <p className="text-sm text-[#6b6b6b] mb-6">
        This content powers the public <a href="/help/" target="_blank" rel="noreferrer" className="underline text-[#7C4A2D]">Help &amp; Support</a> page.
        FAQs are shown as an accordion and also emitted as FAQ schema for Google.
      </p>

      <div className="bg-white border border-[#e8e4e0] p-5 mb-6 max-w-3xl">
        <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Intro text (optional)</label>
        <textarea
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          rows={3}
          className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:outline-none focus:border-[#0a0a0a] resize-y"
          placeholder="e.g. Need help? Browse common questions below or reach us on WhatsApp."
        />
      </div>

      <div className="bg-white border border-[#e8e4e0] p-5 max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[11px] uppercase tracking-widest text-[#6b6b6b]">FAQs ({faqs.length})</h2>
          <button
            onClick={() => setFaqs((f) => [...f, { q: '', a: '' }])}
            className="px-3 py-1.5 text-sm border border-[#0a0a0a] hover:bg-[#faf8f5] transition-colors"
          >
            + Add FAQ
          </button>
        </div>

        {faqs.length === 0 && (
          <p className="text-sm text-[#6b6b6b]">No FAQs yet. Click “+ Add FAQ” to create one.</p>
        )}

        {faqs.map((fq, i) => (
          <div key={i} className="border border-[#e8e4e0] bg-[#faf8f5] p-3 mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase tracking-widest text-[#6b6b6b]">Q{i + 1}</span>
              <button
                onClick={() => setFaqs((f) => f.filter((_, idx) => idx !== i))}
                className="text-[10px] uppercase tracking-widest text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
            <input
              value={fq.q}
              onChange={(e) => setFaqs((f) => f.map((x, idx) => (idx === i ? { ...x, q: e.target.value } : x)))}
              className="w-full border border-[#e8e4e0] px-3 py-2 text-sm mb-2 focus:outline-none focus:border-[#0a0a0a]"
              placeholder="Question — e.g. How do I track my order?"
            />
            <textarea
              value={fq.a}
              onChange={(e) => setFaqs((f) => f.map((x, idx) => (idx === i ? { ...x, a: e.target.value } : x)))}
              rows={2}
              className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:outline-none focus:border-[#0a0a0a] resize-y"
              placeholder="Answer shown to customers"
            />
          </div>
        ))}
      </div>
    </>
  )
}
