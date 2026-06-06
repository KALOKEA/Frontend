'use client'
import { useEffect, useState } from 'react'
import { homepageContentApi, HERO_DEFAULTS } from '@/lib/api/homepageContent'

// ─── Field definitions ────────────────────────────────────────────────────────

const FIELDS = [
  { key: 'hero_eyebrow',    label: 'Hero eyebrow text',    hint: 'e.g. NEW COLLECTION — 2026' },
  { key: 'hero_headline_1', label: 'Hero headline line 1', hint: 'e.g. Dressed for' },
  { key: 'hero_headline_2', label: 'Hero headline line 2 (italic accent)', hint: 'e.g. Every Moment' },
  { key: 'hero_subtext',    label: 'Hero subtext',         hint: 'Short tagline below headline', long: true },
  { key: 'hero_cta1_label', label: 'Button 1 label',       hint: 'e.g. Shop Collection' },
  { key: 'hero_cta1_link',  label: 'Button 1 link',        hint: 'e.g. /shop' },
  { key: 'hero_cta2_label', label: 'Button 2 label',       hint: 'e.g. New Arrivals' },
  { key: 'hero_cta2_link',  label: 'Button 2 link',        hint: 'e.g. /shop?tag=new-arrivals' },
  { key: 'hero_image_url',  label: 'Hero image URL',       hint: 'Direct image URL for the hero panel' },
  { key: 'hero_video_url',  label: 'Hero video URL (mp4)', hint: 'Leave empty to use image instead' },
  { key: 'hero_mode',       label: 'Hero mode',            hint: '"image" or "video"' },
] as const

type FieldKey = typeof FIELDS[number]['key']

// ─── Component ───────────────────────────────────────────────────────────────

export default function AdminHomepagePage() {
  const [values, setValues] = useState<Record<string, string>>(HERO_DEFAULTS as Record<string, string>)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved]   = useState<string | null>(null)
  const [error, setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    homepageContentApi.getAll()
      .then((data) => setValues({ ...HERO_DEFAULTS, ...data }))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async (key: string) => {
    setSaving(key)
    setError(null)
    try {
      await homepageContentApi.update(key, values[key] ?? '')
      setSaved(key)
      setTimeout(() => setSaved(null), 2500)
    } catch (e: any) {
      setError(e?.message || 'Save failed')
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-[#c8a4a5] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-[#0a0a0a]">Homepage Content</h1>
        <p className="text-xs font-sans text-[#6b6b6b] mt-1">
          Edit all homepage text and media. Changes go live immediately — no rebuild needed.
        </p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-xs font-sans rounded">
          {error}
        </div>
      )}

      {/* Field list */}
      <div className="space-y-4">
        {FIELDS.map((field) => (
          <div key={field.key} className="bg-white border border-[#e8e4e0] p-4">
            <label className="block text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-1">
              {field.label}
            </label>
            <p className="text-[10px] font-sans text-[#9b9b9b] mb-2">{field.hint}</p>

            <div className="flex gap-2 items-start">
              {'long' in field && field.long ? (
                <textarea
                  rows={3}
                  value={values[field.key] ?? ''}
                  onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                  className="flex-1 border border-[#e8e4e0] px-3 py-2 text-sm font-sans text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a] resize-none"
                />
              ) : (
                <input
                  type="text"
                  value={values[field.key] ?? ''}
                  onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave(field.key)}
                  className="flex-1 border border-[#e8e4e0] px-3 py-2 text-sm font-sans text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a]"
                />
              )}

              <button
                onClick={() => handleSave(field.key)}
                disabled={saving === field.key}
                className={`shrink-0 px-4 py-2 text-[10px] font-sans tracking-widest uppercase transition-colors ${
                  saved === field.key
                    ? 'bg-green-600 text-white'
                    : 'bg-[#0a0a0a] text-white hover:bg-[#c8a4a5]'
                } disabled:opacity-50`}
              >
                {saving === field.key
                  ? '…'
                  : saved === field.key
                  ? '✓ Saved'
                  : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Preview hint */}
      <div className="mt-8 p-4 bg-[#faf8f5] border border-[#e8e4e0] text-[11px] font-sans text-[#6b6b6b]">
        <strong className="text-[#0a0a0a]">Tip:</strong> Set <code className="bg-[#e8e4e0] px-1">hero_mode</code> to{' '}
        <code className="bg-[#e8e4e0] px-1">video</code> and paste an mp4 URL into{' '}
        <code className="bg-[#e8e4e0] px-1">hero_video_url</code> to show a looping video in the hero.
        Set to <code className="bg-[#e8e4e0] px-1">image</code> to use the image URL instead.
      </div>
    </div>
  )
}
