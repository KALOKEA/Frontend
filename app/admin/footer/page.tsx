'use client'
import { useEffect, useState, useCallback } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import {
  siteContentApi, invalidateSiteContentCache,
  type FooterLink,
  FOOTER_SHOP_DEFAULT, FOOTER_HELP_DEFAULT, FOOTER_COMPANY_DEFAULT, FOOTER_LEGAL_DEFAULT,
} from '@/lib/api/siteContent'
import Spinner from '@/components/ui/Spinner'

const INP = 'w-full border border-[#e8e4e0] px-3 py-2 text-sm outline-none focus:border-[#0a0a0a] transition-colors bg-white'
const BTN = 'px-4 py-2 text-[10px] font-sans tracking-widest uppercase'

// ─── Sub-components ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-[#e8e4e0] bg-white p-6 space-y-4">
      <h2 className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] pb-2 border-b border-[#f4f2ef]">
        {title}
      </h2>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1">
      <span className="block text-xs font-sans text-[#6b6b6b]">{label}</span>
      {children}
    </label>
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
  const addLink = () => onChange([...links, { label: '', href: '' }])
  const removeLink = (i: number) => onChange(links.filter((_, idx) => idx !== i))
  const moveUp = (i: number) => {
    if (i === 0) return
    const copy = [...links]
    ;[copy[i - 1], copy[i]] = [copy[i], copy[i - 1]]
    onChange(copy)
  }
  const moveDown = (i: number) => {
    if (i === links.length - 1) return
    const copy = [...links]
    ;[copy[i], copy[i + 1]] = [copy[i + 1], copy[i]]
    onChange(copy)
  }

  return (
    <div className="space-y-3">
      {links.map((l, i) => (
        <div key={i} className="flex items-center gap-2">
          {/* Move up/down */}
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
            value={l.label}
            onChange={e => setLink(i, 'label', e.target.value)}
          />
          {/* Href */}
          <input
            className={INP}
            placeholder="Path (e.g. /shop/new-arrivals/)"
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

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdminFooterPage() {
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [msg, setMsg]           = useState<{ text: string; ok: boolean } | null>(null)

  const [shopCol,    setShopCol]    = useState<FooterLink[]>(FOOTER_SHOP_DEFAULT)
  const [helpCol,    setHelpCol]    = useState<FooterLink[]>(FOOTER_HELP_DEFAULT)
  const [companyCol, setCompanyCol] = useState<FooterLink[]>(FOOTER_COMPANY_DEFAULT)
  const [legalLinks, setLegalLinks] = useState<FooterLink[]>(FOOTER_LEGAL_DEFAULT)
  const [copyright,  setCopyright]  = useState('KALOKEA. All rights reserved.')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const parsed = await siteContentApi.getParsed()
      setShopCol(parsed.footer_shop_col)
      setHelpCol(parsed.footer_help_col)
      setCompanyCol(parsed.footer_company_col)
      setLegalLinks(parsed.footer_legal_links)
      setCopyright(parsed.footer_copyright)
    } catch {
      // keep defaults
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const flash = (text: string, ok: boolean) => {
    setMsg({ text, ok })
    setTimeout(() => setMsg(null), 4000)
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await Promise.all([
        siteContentApi.update('footer_shop_col',    JSON.stringify(shopCol)),
        siteContentApi.update('footer_help_col',    JSON.stringify(helpCol)),
        siteContentApi.update('footer_company_col', JSON.stringify(companyCol)),
        siteContentApi.update('footer_legal_links', JSON.stringify(legalLinks)),
        siteContentApi.update('footer_copyright',   copyright),
      ])
      invalidateSiteContentCache()
      flash('Saved', true)
    } catch (err: any) {
      flash(err?.message || 'Could not save', false)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <form onSubmit={save} className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl text-[#0a0a0a] mb-1">Footer</h1>
        <p className="text-sm text-[#6b6b6b] mb-6">
          Edit footer columns and links. Use the up/down arrows to reorder links. Changes take effect immediately.
        </p>
      </div>

      {/* ── Shop column ── */}
      <Section title="Shop column">
        <LinkEditor links={shopCol} onChange={setShopCol} />
      </Section>

      {/* ── Help column ── */}
      <Section title="Help column">
        <LinkEditor links={helpCol} onChange={setHelpCol} />
      </Section>

      {/* ── Company column ── */}
      <Section title="Company column">
        <LinkEditor links={companyCol} onChange={setCompanyCol} />
      </Section>

      {/* ── Legal / bottom links ── */}
      <Section title="Legal links (footer bottom bar)">
        <LinkEditor links={legalLinks} onChange={setLegalLinks} />
      </Section>

      {/* ── Copyright ── */}
      <Section title="Copyright text">
        <p className="text-xs text-[#6b6b6b]">
          The year is prepended automatically. Just add the rest of the text.
        </p>
        <Field label="Copyright text (without year)">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#6b6b6b] shrink-0">© {new Date().getFullYear()}</span>
            <input
              className={INP}
              value={copyright}
              onChange={e => setCopyright(e.target.value)}
              placeholder="KALOKEA. All rights reserved."
            />
          </div>
        </Field>
      </Section>

      {/* ── Save ── */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className={`${BTN} bg-[#0a0a0a] text-white hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {saving ? 'Saving…' : 'Save changes'}
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
