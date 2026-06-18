'use client'
import { useEffect, useState, useCallback } from 'react'
import {
  siteContentApi, invalidateSiteContentCache,
  type AboutHero, type AboutValue, type AboutStat, type TeamMember,
  ABOUT_HERO_DEFAULT, ABOUT_VALUES_DEFAULT, ABOUT_STATS_DEFAULT,
} from '@/lib/api/siteContent'
import Spinner from '@/components/ui/Spinner'

const INP = 'w-full border border-[#e8e4e0] px-3 py-2 text-sm outline-none focus:border-[#0a0a0a] transition-colors bg-white'
const TA  = `${INP} resize-y min-h-[72px]`
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

function SaveBar({ saving, msg }: { saving: boolean; msg: { text: string; ok: boolean } | null }) {
  return (
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
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AdminAboutPage() {
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [msg, setMsg]           = useState<{ text: string; ok: boolean } | null>(null)

  // Hero
  const [hero, setHero]       = useState<AboutHero>(ABOUT_HERO_DEFAULT)
  // Values
  const [values, setValues]   = useState<AboutValue[]>(ABOUT_VALUES_DEFAULT)
  // Stats
  const [stats, setStats]     = useState<AboutStat[]>(ABOUT_STATS_DEFAULT)
  // Team
  const [team, setTeam]       = useState<TeamMember[]>([])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const parsed = await siteContentApi.getParsed()
      setHero(parsed.about_hero)
      setValues(parsed.about_values)
      setStats(parsed.about_stats)
      setTeam(parsed.about_team)
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
        siteContentApi.update('about_hero',   JSON.stringify(hero)),
        siteContentApi.update('about_values', JSON.stringify(values)),
        siteContentApi.update('about_stats',  JSON.stringify(stats)),
        siteContentApi.update('about_team',   JSON.stringify(team)),
      ])
      invalidateSiteContentCache()
      flash('Saved', true)
    } catch (err: any) {
      flash(err?.message || 'Could not save', false)
    } finally {
      setSaving(false)
    }
  }

  // ── Values helpers ──────────────────────────────────────────────────────────
  const setVal = (i: number, k: keyof AboutValue, v: string) =>
    setValues(arr => arr.map((item, idx) => idx === i ? { ...item, [k]: v } : item))
  const addVal = () => setValues(arr => [...arr, { title: '', desc: '' }])
  const removeVal = (i: number) => setValues(arr => arr.filter((_, idx) => idx !== i))

  // ── Stats helpers ───────────────────────────────────────────────────────────
  const setStat = (i: number, k: keyof AboutStat, v: string) =>
    setStats(arr => arr.map((item, idx) => idx === i ? { ...item, [k]: v } : item))
  const addStat = () => setStats(arr => [...arr, { num: '', label: '' }])
  const removeStat = (i: number) => setStats(arr => arr.filter((_, idx) => idx !== i))

  // ── Team helpers ────────────────────────────────────────────────────────────
  const setMember = (i: number, k: keyof TeamMember, v: string) =>
    setTeam(arr => arr.map((item, idx) => idx === i ? { ...item, [k]: v } : item))
  const addMember = () => setTeam(arr => [...arr, { name: '', role: '', bio: '', image: '' }])
  const removeMember = (i: number) => setTeam(arr => arr.filter((_, idx) => idx !== i))

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  return (
    <form onSubmit={save} className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl md:text-3xl text-[#0a0a0a] mb-1">About Page</h1>
        <p className="text-sm text-[#6b6b6b] mb-6">
          Edit all content on the About page — changes take effect immediately, no redeploy needed.
        </p>
      </div>

      {/* ── Hero ── */}
      <Section title="Hero section">
        <Field label="Eyebrow text">
          <input className={INP} value={hero.eyebrow}
            onChange={e => setHero(h => ({ ...h, eyebrow: e.target.value }))} />
        </Field>
        <Field label="Headline (normal text)">
          <input className={INP} value={hero.headline}
            onChange={e => setHero(h => ({ ...h, headline: e.target.value }))} />
        </Field>
        <Field label="Headline (italic / accent colour)">
          <input className={INP} value={hero.headline_italic}
            onChange={e => setHero(h => ({ ...h, headline_italic: e.target.value }))} />
        </Field>
        <Field label="Subtext paragraph">
          <textarea className={TA} value={hero.subtext}
            onChange={e => setHero(h => ({ ...h, subtext: e.target.value }))} />
        </Field>
        <Field label="Hero image URL (leave blank to use default dark background)">
          <input className={INP} placeholder="https://…" value={hero.image_url}
            onChange={e => setHero(h => ({ ...h, image_url: e.target.value }))} />
        </Field>
      </Section>

      {/* ── Values ── */}
      <Section title="Our Values cards">
        {values.map((v, i) => (
          <div key={i} className="border border-[#e8e4e0] p-4 space-y-3 relative">
            <span className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b]">Card {i + 1}</span>
            <button
              type="button"
              onClick={() => removeVal(i)}
              className="absolute top-3 right-3 text-[10px] text-red-400 hover:text-red-600 font-sans uppercase tracking-widest"
            >
              Remove
            </button>
            <Field label="Title">
              <input className={INP} value={v.title} onChange={e => setVal(i, 'title', e.target.value)} />
            </Field>
            <Field label="Description">
              <textarea className={TA} value={v.desc} onChange={e => setVal(i, 'desc', e.target.value)} />
            </Field>
          </div>
        ))}
        <button
          type="button"
          onClick={addVal}
          className={`${BTN} border border-[#e8e4e0] text-[#0a0a0a] hover:bg-[#faf8f5]`}
        >
          + Add value card
        </button>
      </Section>

      {/* ── Stats ── */}
      <Section title="Stats strip">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((s, i) => (
            <div key={i} className="border border-[#e8e4e0] p-4 space-y-3 relative">
              <span className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b]">Stat {i + 1}</span>
              <button
                type="button"
                onClick={() => removeStat(i)}
                className="absolute top-3 right-3 text-[10px] text-red-400 hover:text-red-600 font-sans uppercase tracking-widest"
              >
                Remove
              </button>
              <Field label="Number / value (e.g. 50K+)">
                <input className={INP} value={s.num} onChange={e => setStat(i, 'num', e.target.value)} />
              </Field>
              <Field label="Label">
                <input className={INP} value={s.label} onChange={e => setStat(i, 'label', e.target.value)} />
              </Field>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addStat}
          className={`${BTN} border border-[#e8e4e0] text-[#0a0a0a] hover:bg-[#faf8f5]`}
        >
          + Add stat
        </button>
      </Section>

      {/* ── Team ── */}
      <Section title="Team members">
        <p className="text-xs text-[#6b6b6b]">
          Add your real team here. Leave this empty and no team section will appear on the About page.
        </p>
        {team.map((m, i) => (
          <div key={i} className="border border-[#e8e4e0] p-4 space-y-3 relative">
            <span className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b]">Member {i + 1}</span>
            <button
              type="button"
              onClick={() => removeMember(i)}
              className="absolute top-3 right-3 text-[10px] text-red-400 hover:text-red-600 font-sans uppercase tracking-widest"
            >
              Remove
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Full name">
                <input className={INP} value={m.name} onChange={e => setMember(i, 'name', e.target.value)} />
              </Field>
              <Field label="Role / title">
                <input className={INP} value={m.role} onChange={e => setMember(i, 'role', e.target.value)} />
              </Field>
            </div>
            <Field label="Short bio">
              <textarea className={TA} value={m.bio} onChange={e => setMember(i, 'bio', e.target.value)} />
            </Field>
            <Field label="Photo URL (upload to Cloudinary or paste any image link)">
              <input className={INP} placeholder="https://res.cloudinary.com/…" value={m.image}
                onChange={e => setMember(i, 'image', e.target.value)} />
            </Field>
            {m.image && (
              <div className="w-16 h-16 rounded-full overflow-hidden bg-[#f4f2ef]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addMember}
          className={`${BTN} border border-[#e8e4e0] text-[#0a0a0a] hover:bg-[#faf8f5]`}
        >
          + Add team member
        </button>
      </Section>

      <SaveBar saving={saving} msg={msg} />
    </form>
  )
}
