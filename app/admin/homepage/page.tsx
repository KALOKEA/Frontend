'use client'
import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { homepageContentApi, HERO_DEFAULTS } from '@/lib/api/homepageContent'
import CloudinaryUploadButton from '@/components/admin/CloudinaryUploadButton'

// Keys that accept media uploads (image or video)
const MEDIA_KEYS: Record<string, { folder: string; accept: string }> = {
  hero_image_url:      { folder: 'homepage', accept: 'image/*' },
  hero_video_url:      { folder: 'homepage', accept: 'video/mp4,video/webm,video/*' },
  editorial_image_url: { folder: 'homepage', accept: 'image/*' },
}

// ─── Field definitions ────────────────────────────────────────────────────────

const SECTIONS = [
  {
    title: 'Hero Banner',
    fields: [
      { key: 'hero_eyebrow',    label: 'Hero eyebrow text',    hint: 'e.g. SS 2025 Collection' },
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
    ],
  },
  {
    title: 'Trust Strip',
    fields: [
      { key: 'trust_1_title', label: 'Badge 1 title', hint: 'e.g. Free Delivery' },
      { key: 'trust_1_sub',   label: 'Badge 1 subtitle', hint: 'e.g. On orders above ₹999' },
      { key: 'trust_2_title', label: 'Badge 2 title', hint: 'e.g. Easy Returns' },
      { key: 'trust_2_sub',   label: 'Badge 2 subtitle', hint: 'e.g. 7-day hassle-free returns' },
      { key: 'trust_3_title', label: 'Badge 3 title', hint: 'e.g. Secure Payments' },
      { key: 'trust_3_sub',   label: 'Badge 3 subtitle', hint: 'e.g. Razorpay 256-bit encrypted' },
      { key: 'trust_4_title', label: 'Badge 4 title', hint: 'e.g. Made in India' },
      { key: 'trust_4_sub',   label: 'Badge 4 subtitle', hint: 'e.g. Proudly designed & sourced' },
    ],
  },
  {
    title: 'Category Grid',
    fields: [
      { key: 'category_heading',    label: 'Section heading', hint: 'e.g. Find Your Signature' },
      { key: 'category_eyebrow',   label: 'Eyebrow label',   hint: 'e.g. Shop by Category' },
    ],
  },
  {
    title: 'Featured Products Section',
    fields: [
      { key: 'featured_section_heading', label: 'Section heading', hint: 'e.g. Featured Pieces' },
    ],
  },
  {
    title: 'Quote Strip',
    fields: [
      { key: 'quote_text',   label: 'Quote text',   hint: 'e.g. "Wear what makes you feel alive."', long: true },
      { key: 'quote_author', label: 'Quote author', hint: 'e.g. — Kalokea' },
    ],
  },
  {
    title: 'Editorial Banner',
    fields: [
      { key: 'editorial_eyebrow',   label: 'Eyebrow text',      hint: 'e.g. The Edit' },
      { key: 'editorial_heading',   label: 'Heading',           hint: 'e.g. Season\'s New Chapter' },
      { key: 'editorial_subtext',   label: 'Subtext',           hint: 'Short tagline', long: true },
      { key: 'editorial_cta_label', label: 'Button label',      hint: 'e.g. Explore the Edit' },
      { key: 'editorial_cta_link',  label: 'Button link',       hint: 'e.g. /shop/?tag=editorial' },
      { key: 'editorial_image_url', label: 'Background image',  hint: 'Direct image URL' },
    ],
  },
  {
    title: 'Best Sellers Section',
    fields: [
      { key: 'bestseller_heading', label: 'Section heading', hint: 'e.g. Best Sellers' },
      { key: 'bestseller_eyebrow', label: 'Eyebrow label',   hint: 'e.g. Most Loved' },
    ],
  },
  {
    title: 'Testimonials',
    fields: [
      { key: 'testimonials_heading', label: 'Section heading', hint: 'e.g. What Our Customers Say' },
      { key: 'testimonials_eyebrow', label: 'Eyebrow label',   hint: 'e.g. Reviews' },
    ],
  },
  {
    title: 'Newsletter Signup',
    fields: [
      { key: 'newsletter_heading', label: 'Newsletter heading', hint: 'e.g. Join the Kalokea Circle' },
      { key: 'newsletter_subtext', label: 'Newsletter subtext', hint: 'Short description below heading', long: true },
    ],
  },
] satisfies { title: string; fields: { key: string; label: string; hint: string; long?: boolean }[] }[]

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

      {/* Sections */}
      <div className="space-y-8">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="font-sans text-[10px] tracking-widest uppercase text-[#6b6b6b] mb-3 pb-2 border-b border-[#e8e4e0]">
              {section.title}
            </h2>
            <div className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.key} className="bg-white border border-[#e8e4e0] p-4">
                  <label className="block text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-1">
                    {field.label}
                  </label>
                  <p className="text-[10px] font-sans text-[#6b6b6b] mb-2">{field.hint}</p>

                  <div className="flex gap-2 items-start">
                    {'long' in field && field.long ? (
                      <textarea
                        rows={3}
                        value={values[field.key] ?? ''}
                        onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                        className="flex-1 border border-[#e8e4e0] px-3 py-2 text-sm font-sans text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a] resize-none"
                      />
                    ) : (
                      <div className="flex-1 flex gap-1.5 items-center">
                        <input
                          type="text"
                          value={values[field.key] ?? ''}
                          onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                          onKeyDown={(e) => e.key === 'Enter' && handleSave(field.key)}
                          className="flex-1 border border-[#e8e4e0] px-3 py-2 text-sm font-sans text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a]"
                        />
                        {MEDIA_KEYS[field.key] && (
                          <CloudinaryUploadButton
                            folder={MEDIA_KEYS[field.key].folder}
                            accept={MEDIA_KEYS[field.key].accept}
                            label="Upload"
                            onUploaded={(url) => {
                              setValues((v) => ({ ...v, [field.key]: url }))
                            }}
                          />
                        )}
                      </div>
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
                      {saving === field.key ? '…' : saved === field.key ? <><Check size={10} className="inline mr-1" />Saved</> : 'Save'}
                    </button>
                  </div>
                </div>
              ))}
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
