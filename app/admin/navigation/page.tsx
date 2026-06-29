'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import {
  siteContentApi, invalidateSiteContentCache,
  type FooterLink,
  HEADER_NAV_DEFAULT,
} from '@/lib/api/siteContent'
import Spinner from '@/components/ui/Spinner'

const INP = 'w-full border border-[#e8e4e0] px-3 py-2 text-sm outline-none focus:border-[#0a0a0a] transition-colors bg-white'
const BTN = 'px-4 py-2 text-[10px] font-sans tracking-widest uppercase'

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="border border-[#e8e4e0] bg-white p-6 space-y-4">
      <div className="pb-2 border-b border-[#f4f2ef]">
        <h2 className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b]">{title}</h2>
        {desc && <p className="text-xs text-[#9b9b9b] mt-1">{desc}</p>}
      </div>
      {children}
    </div>
  )
}

function LinkEditor({
  links,
  onChange,
}: {
  links: FooterLink[]
  onChange: (links: FooterLink[]) => void
}) {
  const setLink = (i: number, k: keyof FooterLink, v: string) =>
    onChange(links.map((l, idx) => (idx === i ? { ...l, [k]: v } : l)))
  const addLink  = () => onChange([...links, { label: '', href: '' }])
  const removeLink = (i: number) => onChange(links.filter((_, idx) => idx !== i))
  const moveUp = (i: number) => {
    if (i === 0) return
    const copy = [...links];
    [copy[i - 1], copy[i]] = [copy[i], copy[i - 1]]
    onChange(copy)
  }
  const moveDown = (i: number) => {
    if (i === links.length - 1) return
    const copy = [...links];
    [copy[i], copy[i + 1]] = [copy[i + 1], copy[i]]
    onChange(copy)
  }

  return (
    <div className="space-y-3">
      {links.map((l, i) => (
        <div key={i} className="flex items-center gap-2">
          {/* Reorder arrows */}
          <div className="flex flex-col gap-0.5 shrink-0">
            <button
              type="button"
              onClick={() => moveUp(i)}
              disabled={i === 0}
              className="w-6 h-5 flex items-center justify-center text-[#6b6b6b] hover:text-[#0a0a0a] disabled:opacity-30"
              aria-label="Move up"
            >
              <ChevronUp size={12} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => moveDown(i)}
              disabled={i === links.length - 1}
              className="w-6 h-5 flex items-center justify-center text-[#6b6b6b] hover:text-[#0a0a0a] disabled:opacity-30"
              aria-label="Move down"
            >
              <ChevronDown size={12} aria-hidden="true" />
            </button>
          </div>
          {/* Label */}
          <input
            className={INP}
            placeholder="Label (e.g. New Arrivals)"
            aria-label={`Link ${i + 1} label`}
            value={l.label}
            onChange={e => setLink(i, 'label', e.target.value)}
          />
          {/* Path */}
          <input
            className={INP}
            placeholder="Path (e.g. /shop/new-arrivals/)"
            aria-label={`Link ${i + 1} path`}
            value={l.href}
            onChange={e => setLink(i, 'href', e.target.value)}
          />
          <button
            type="button"
            onClick={() => removeLink(i)}
            className="shrink-0 text-red-400 hover:text-red-600 text-[11px] font-sans uppercase tracking-widest whitespace-nowrap"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addLink}
        className={`${BTN} border border-[#e8e4e0] text-[#0a0a0a] hover:bg-[#faf8f5]`}
      >
        + Add link
      </button>
    </div>
  )
}

export default function AdminNavigationPage() {
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [msg,     setMsg]     = useState<{ text: string; ok: boolean } | null>(null)
  const msgTimerRef           = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [navLinks, setNavLinks] = useState<FooterLink[]>(HEADER_NAV_DEFAULT)

  const load = useCallback(async () => {
    setLoading(true)
    // Always bust the HTTP cache on admin pages so we see the latest saved data,
    // not the browser-cached public response (Cache-Control: max-age=120).
    invalidateSiteContentCache()
    try {
      const parsed = await siteContentApi.getParsed()
      setNavLinks(parsed.header_nav_links)
    } catch {
      // keep defaults
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => () => { if (msgTimerRef.current) clearTimeout(msgTimerRef.current) }, [])

  const flash = (text: string, ok: boolean) => {
    setMsg({ text, ok })
    if (msgTimerRef.current) clearTimeout(msgTimerRef.current)
    msgTimerRef.current = setTimeout(() => setMsg(null), 4000)
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    // Validate: no empty labels or hrefs
    const invalid = navLinks.some(l => !l.label.trim() || !l.href.trim())
    if (invalid) { flash('All links must have a label and a path.', false); return }
    setSaving(true)
    try {
      await siteContentApi.update('header_nav_links', JSON.stringify(navLinks))
      invalidateSiteContentCache()
      flash('Saved — header will update on next page load.', true)
    } catch (err: unknown) {
      flash(err instanceof Error ? err.message : 'Could not save', false)
    } finally {
      setSaving(false)
    }
  }

  const reset = () => {
    if (!confirm('Reset to default links?')) return
    setNavLinks(HEADER_NAV_DEFAULT)
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <form onSubmit={save} className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl text-[#0a0a0a] mb-1">Header Navigation</h1>
        <p className="text-sm text-[#6b6b6b] mb-6">
          Manage the links shown in the top navigation bar. Use ↑↓ to reorder.
          Changes go live immediately after saving.
        </p>
      </div>

      {/* Preview strip */}
      <div className="border border-[#e8e4e0] bg-[#faf8f5] px-5 py-3 flex flex-wrap gap-5 items-center">
        <span className="text-[10px] font-sans tracking-widest uppercase text-[#9b9b9b] shrink-0">Preview</span>
        {navLinks.map((l, i) => (
          <span key={i} className="text-[11px] font-sans tracking-[0.12em] uppercase text-[#0a0a0a]">
            {l.label || '—'}
          </span>
        ))}
      </div>

      <Section
        title="Header links"
        desc="These appear in the desktop nav bar and the mobile menu (max 8 recommended)."
      >
        <LinkEditor links={navLinks} onChange={setNavLinks} />
      </Section>

      <div className="flex items-center gap-4 flex-wrap">
        <button
          type="submit"
          disabled={saving}
          className={`${BTN} bg-[#0a0a0a] text-white hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
        <button
          type="button"
          onClick={reset}
          className={`${BTN} border border-[#e8e4e0] text-[#6b6b6b] hover:bg-[#faf8f5]`}
        >
          Reset to default
        </button>
        {msg && (
          <span className={`text-xs font-sans ${msg.ok ? 'text-green-600' : 'text-red-600'}`}>
            {msg.text}
          </span>
        )}
      </div>
    </form>
  )
}
