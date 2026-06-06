'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/api/client'
import Spinner from '@/components/ui/Spinner'

interface CmsPage {
  slug: string
  title: string
  content: string
  meta_description?: string
  updated_at: string
}

const PAGE_LABELS: Record<string, string> = {
  'about':           'About Us',
  'contact':         'Contact Us',
  'privacy-policy':  'Privacy Policy',
  'refund-policy':   'Refund & Return Policy',
  'shipping-policy': 'Shipping Policy',
  'terms':           'Terms & Conditions',
}

const PAGE_URLS: Record<string, string> = {
  'about':           '/about',
  'contact':         '/contact',
  'privacy-policy':  '/privacy-policy',
  'refund-policy':   '/refund-policy',
  'shipping-policy': '/shipping-policy',
  'terms':           '/terms',
}

function Flash({ msg }: { msg: { type: 'ok' | 'err'; text: string } | null }) {
  if (!msg) return null
  return (
    <div className={`px-4 py-3 text-sm border mb-4 ${msg.type === 'ok' ? 'bg-[#e8f5e9] border-[#a5d6a7] text-[#2e7d32]' : 'bg-[#fdecea] border-[#ef9a9a] text-[#c62828]'}`}>
      {msg.text}
    </div>
  )
}

function PageEditor({ page, onSaved }: { page: CmsPage; onSaved: () => void }) {
  const [title, setTitle]   = useState(page.title)
  const [content, setContent] = useState(page.content)
  const [meta, setMeta]     = useState(page.meta_description || '')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg]       = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [preview, setPreview] = useState(false)

  async function save() {
    setSaving(true); setMsg(null)
    try {
      await api.put(`/cms/${page.slug}`, { title, content, meta_description: meta })
      setMsg({ type: 'ok', text: 'Page saved successfully.' })
      onSaved()
    } catch (e: any) {
      setMsg({ type: 'err', text: e?.message || 'Save failed' })
    } finally { setSaving(false) }
  }

  return (
    <div>
      <Flash msg={msg} />

      <div className="mb-4">
        <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Page Title</label>
        <input
          value={title} onChange={e => setTitle(e.target.value)}
          className="w-full border border-[#e8e4e0] px-3 py-2 text-sm outline-none focus:border-[#c8a4a5]"
        />
      </div>

      <div className="mb-4">
        <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">SEO Meta Description</label>
        <input
          value={meta} onChange={e => setMeta(e.target.value)}
          placeholder="Short description for search engines (150–160 chars)"
          className="w-full border border-[#e8e4e0] px-3 py-2 text-sm outline-none focus:border-[#c8a4a5]"
        />
        <p className="text-[10px] text-[#9b9b9b] mt-1">{meta.length}/160 characters</p>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <label className="text-[11px] uppercase tracking-widest text-[#6b6b6b]">Content (HTML)</label>
          <button
            onClick={() => setPreview(!preview)}
            className="text-[10px] uppercase tracking-widest text-[#6b6b6b] hover:text-[#0a0a0a] border border-[#e8e4e0] px-3 py-1"
          >
            {preview ? 'Edit' : 'Preview'}
          </button>
        </div>
        {preview ? (
          <div
            className="min-h-[300px] border border-[#e8e4e0] p-4 prose prose-sm max-w-none text-[#0a0a0a] text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <textarea
            value={content} onChange={e => setContent(e.target.value)}
            rows={18}
            className="w-full border border-[#e8e4e0] px-3 py-2 text-sm font-mono outline-none focus:border-[#c8a4a5] resize-y"
            placeholder="Write HTML content here. Use <h2>, <p>, <strong>, <a href='...'> tags."
          />
        )}
        <p className="text-[10px] text-[#9b9b9b] mt-1">
          Supports HTML tags: &lt;h2&gt; &lt;h3&gt; &lt;p&gt; &lt;strong&gt; &lt;em&gt; &lt;a&gt; &lt;ul&gt; &lt;li&gt; &lt;br&gt;
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={save} disabled={saving}
          className="px-6 py-2.5 bg-[#0a0a0a] text-white text-[11px] uppercase tracking-widest hover:bg-[#2a2a2a] disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Page'}
        </button>
        <a
          href={PAGE_URLS[page.slug] || `/${page.slug}`}
          target="_blank" rel="noopener noreferrer"
          className="text-[11px] text-[#6b6b6b] hover:text-[#0a0a0a] underline"
        >
          View live page ↗
        </a>
        <span className="text-[10px] text-[#9b9b9b] ml-auto">
          Last saved: {new Date(page.updated_at).toLocaleString('en-IN')}
        </span>
      </div>
    </div>
  )
}

export default function CmsEditor() {
  const [pages, setPages]   = useState<CmsPage[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState<string>('about')

  const load = async () => {
    try {
      const r = await api.get<CmsPage[]>('/cms')
      setPages(r)
    } catch { setPages([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const activePage = pages.find(p => p.slug === active)

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-[#0a0a0a] mb-1">Content Management</h1>
        <p className="text-sm text-[#6b6b6b]">Edit static pages without touching code. Changes go live immediately after saving.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Page selector */}
          <div className="md:w-48 shrink-0">
            <p className="text-[10px] uppercase tracking-widest text-[#9b9b9b] mb-3">Pages</p>
            <nav className="space-y-0.5">
              {pages.map(p => (
                <button
                  key={p.slug}
                  onClick={() => setActive(p.slug)}
                  className={`w-full text-left px-3 py-2.5 text-[11px] font-sans tracking-widest uppercase transition-colors border-l-2 ${
                    active === p.slug
                      ? 'border-[#c8a4a5] bg-[#faf8f5] text-[#0a0a0a] font-medium'
                      : 'border-transparent text-[#6b6b6b] hover:text-[#0a0a0a] hover:bg-[#faf8f5]'
                  }`}
                >
                  {PAGE_LABELS[p.slug] || p.title}
                </button>
              ))}
            </nav>
          </div>

          {/* Editor */}
          <div className="flex-1 bg-white border border-[#e8e4e0] p-6">
            {activePage ? (
              <>
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#f0ece8]">
                  <h2 className="font-serif text-xl text-[#0a0a0a]">{PAGE_LABELS[activePage.slug] || activePage.title}</h2>
                  <span className="text-[10px] text-[#9b9b9b] font-mono bg-[#faf8f5] px-2 py-0.5 border border-[#e8e4e0]">
                    /{activePage.slug}
                  </span>
                </div>
                <PageEditor key={activePage.slug} page={activePage} onSaved={load} />
              </>
            ) : (
              <div className="py-20 text-center text-[#6b6b6b] text-sm">Select a page to edit.</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
