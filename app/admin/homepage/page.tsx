'use client'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { Check, Plus, Trash2 } from 'lucide-react'
import { homepageContentApi, HERO_DEFAULTS } from '@/lib/api/homepageContent'
import CloudinaryUploadButton from '@/components/admin/CloudinaryUploadButton'

const MEDIA_KEYS: Record<string, { folder: string; accept: string; mediaUpload?: boolean }> = {
  hero_image_url:         { folder: 'homepage', accept: 'image/*' },
  hero_video_url:         { folder: 'homepage', accept: 'video/mp4,video/webm,video/*', mediaUpload: true },
  editorial_image_url:    { folder: 'editorial', accept: 'image/*' },
  editorial_video_url:    { folder: 'editorial', accept: 'video/mp4,video/webm,video/*', mediaUpload: true },
}

interface Look {
  _key: string
  title: string
  tags: string[]
  image: string
  href: string
}

interface PressLogo {
  name: string
  url: string
}

interface Slide {
  _key: string
  image: string
  video: string
  mode: 'image' | 'video'
}

function mkLook(partial: Omit<Look, '_key'>): Look {
  return { _key: `${Date.now()}-${Math.random()}`, ...partial }
}

function mkSlide(partial: Omit<Slide, '_key'>): Slide {
  return { _key: `${Date.now()}-${Math.random()}`, ...partial }
}

function ModeToggle({
  modeKey, values, saving, saved, setValues, onSave,
}: {
  modeKey: string
  values: Record<string, string>
  saving: string | null
  saved: string | null
  setValues: Dispatch<SetStateAction<Record<string, string>>>
  onSave: (key: string) => void
}) {
  const current = values[modeKey] || 'image'
  return (
    <div className="flex gap-1.5 items-center">
      {(['image', 'video'] as const).map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => setValues(v => ({ ...v, [modeKey]: opt }))}
          className={`px-3 py-1.5 text-[10px] font-sans tracking-widest uppercase transition-colors ${
            current === opt ? 'bg-[#0a0a0a] text-white' : 'bg-white border border-[#e8e4e0] text-[#6b6b6b] hover:bg-[#faf8f5]'
          }`}
        >
          {opt}
        </button>
      ))}
      <button
        onClick={() => onSave(modeKey)}
        disabled={saving === modeKey}
        className={`px-4 py-1.5 text-[10px] font-sans tracking-widest uppercase transition-colors ${
          saved === modeKey ? 'bg-green-600 text-white' : 'bg-[#0a0a0a] text-white hover:bg-[#c8a4a5]'
        } disabled:opacity-50`}
      >
        {saving === modeKey ? '…' : saved === modeKey ? <><Check size={10} className="inline mr-1" aria-hidden="true" />Saved</> : 'Save'}
      </button>
    </div>
  )
}

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
      { key: 'hero_video_url',  label: 'Hero video (upload or URL)', hint: 'Paste a YouTube link or upload .mp4/.webm — leave empty to use the image' },
    ],
  },
  {
    title: 'Trust Strip',
    fields: [
      { key: 'trust_1_title', label: 'Badge 1 title',    hint: 'e.g. Free Delivery' },
      { key: 'trust_1_sub',   label: 'Badge 1 subtitle', hint: 'e.g. On orders above ₹999' },
      { key: 'trust_2_title', label: 'Badge 2 title',    hint: 'e.g. Easy Returns' },
      { key: 'trust_2_sub',   label: 'Badge 2 subtitle', hint: 'e.g. 7-day hassle-free returns' },
      { key: 'trust_3_title', label: 'Badge 3 title',    hint: 'e.g. Secure Payments' },
      { key: 'trust_3_sub',   label: 'Badge 3 subtitle', hint: 'e.g. Razorpay 256-bit encrypted' },
      { key: 'trust_4_title', label: 'Badge 4 title',    hint: 'e.g. Made in India' },
      { key: 'trust_4_sub',   label: 'Badge 4 subtitle', hint: 'e.g. Proudly designed & sourced' },
    ],
  },
  {
    title: 'Category Grid',
    fields: [
      { key: 'category_heading', label: 'Section heading', hint: 'e.g. Find Your Signature' },
      { key: 'category_eyebrow', label: 'Eyebrow label',   hint: 'e.g. Shop by Category' },
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
      { key: 'editorial_eyebrow',   label: 'Eyebrow text',               hint: 'e.g. The Edit' },
      { key: 'editorial_heading',   label: 'Heading',                    hint: "e.g. Season's New Chapter" },
      { key: 'editorial_subtext',   label: 'Subtext',                    hint: 'Short tagline', long: true },
      { key: 'editorial_cta_label', label: 'Button label',               hint: 'e.g. Explore the Edit' },
      { key: 'editorial_cta_link',  label: 'Button link',                hint: 'e.g. /shop/?tag=editorial' },
      { key: 'editorial_image_url', label: 'Background image',           hint: 'Upload or paste image URL' },
      { key: 'editorial_video_url', label: 'Background video (optional)', hint: 'Paste a YouTube link or upload .mp4/.webm — overrides image when mode = video' },
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
  {
    title: 'As Seen In',
    fields: [
      { key: 'press_heading', label: 'Section label', hint: 'e.g. As Seen In' },
    ],
  },
  {
    title: 'Shop the Look',
    fields: [
      { key: 'stl_eyebrow', label: 'Eyebrow label',  hint: 'e.g. Styled For You' },
      { key: 'stl_heading', label: 'Section heading', hint: 'e.g. Shop the Look' },
    ],
  },
  {
    title: 'Why Kalokea',
    fields: [
      { key: 'why_eyebrow', label: 'Eyebrow label',  hint: 'e.g. Our Promise' },
      { key: 'why_heading', label: 'Section heading', hint: 'e.g. Why KALOKEA' },
    ],
  },
  {
    title: 'Instagram Section',
    fields: [
      { key: 'instagram_eyebrow', label: 'Eyebrow label', hint: 'e.g. Follow Along' },
      { key: 'instagram_subtext', label: 'Subtext',       hint: 'e.g. on Instagram' },
    ],
  },
] satisfies { title: string; fields: { key: string; label: string; hint: string; long?: boolean }[] }[]

export default function AdminHomepagePage() {
  const [values, setValues] = useState<Record<string, string>>(HERO_DEFAULTS as Record<string, string>)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved]   = useState<string | null>(null)
  const [error, setError]   = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const [looks, setLooks]         = useState<Look[]>([])
  const [looksSaving, setLooksSaving] = useState(false)
  const [looksSaved, setLooksSaved]   = useState(false)

  const [logos, setLogos]         = useState<PressLogo[]>([])
  const [logosSaving, setLogosSaving] = useState(false)
  const [logosSaved, setLogosSaved]   = useState(false)

  const [announcements, setAnnouncements] = useState<string[]>([])
  const [annSaving, setAnnSaving] = useState(false)
  const [annSaved, setAnnSaved]   = useState(false)

  const [heroSlides, setHeroSlides]         = useState<Slide[]>([])
  const [heroSlidesSaving, setHeroSlidesSaving] = useState(false)
  const [heroSlidesSaved, setHeroSlidesSaved]   = useState(false)

  const [editSlides, setEditSlides]         = useState<Slide[]>([])
  const [editSlidesSaving, setEditSlidesSaving] = useState(false)
  const [editSlidesSaved, setEditSlidesSaved]   = useState(false)

  useEffect(() => {
    homepageContentApi.getAll()
      .then((data) => {
        setValues({ ...HERO_DEFAULTS, ...data })
        try {
          const raw: Omit<Look, '_key'>[] = JSON.parse(data.stl_looks || HERO_DEFAULTS.stl_looks)
          setLooks(raw.map(mkLook))
        } catch { setLooks([]) }
        try { setLogos(JSON.parse(data.press_logos || HERO_DEFAULTS.press_logos)) } catch { setLogos([]) }
        try { setAnnouncements(JSON.parse(data.announcement_items || HERO_DEFAULTS.announcement_items)) } catch { setAnnouncements([]) }
        try {
          const hs: Omit<Slide, '_key'>[] = JSON.parse(data.hero_slides || '[]')
          setHeroSlides(hs.map(mkSlide))
        } catch { setHeroSlides([]) }
        try {
          const es: Omit<Slide, '_key'>[] = JSON.parse(data.editorial_slides || '[]')
          setEditSlides(es.map(mkSlide))
        } catch { setEditSlides([]) }
      })
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

  const saveLooks = async () => {
    setLooksSaving(true)
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const toSave = looks.map(({ _key, ...rest }) => rest)
      await homepageContentApi.update('stl_looks', JSON.stringify(toSave))
      setLooksSaved(true)
      setTimeout(() => setLooksSaved(false), 2500)
    } catch (e: any) {
      setError(e?.message || 'Save failed')
    } finally {
      setLooksSaving(false)
    }
  }

  const saveLogos = async () => {
    setLogosSaving(true)
    try {
      await homepageContentApi.update('press_logos', JSON.stringify(logos))
      setLogosSaved(true)
      setTimeout(() => setLogosSaved(false), 2500)
    } catch (e: any) {
      setError(e?.message || 'Save failed')
    } finally {
      setLogosSaving(false)
    }
  }

  const saveAnnouncements = async () => {
    setAnnSaving(true)
    try {
      await homepageContentApi.update('announcement_items', JSON.stringify(announcements.filter(Boolean)))
      setAnnSaved(true)
      setTimeout(() => setAnnSaved(false), 2500)
    } catch (e: any) { setError(e?.message || 'Save failed') }
    finally { setAnnSaving(false) }
  }

  const saveHeroSlides = async () => {
    setHeroSlidesSaving(true)
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const toSave = heroSlides.map(({ _key, ...rest }) => rest)
      await homepageContentApi.update('hero_slides', JSON.stringify(toSave))
      setHeroSlidesSaved(true)
      setTimeout(() => setHeroSlidesSaved(false), 2500)
    } catch (e: any) { setError(e?.message || 'Save failed') }
    finally { setHeroSlidesSaving(false) }
  }

  const saveEditSlides = async () => {
    setEditSlidesSaving(true)
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const toSave = editSlides.map(({ _key, ...rest }) => rest)
      await homepageContentApi.update('editorial_slides', JSON.stringify(toSave))
      setEditSlidesSaved(true)
      setTimeout(() => setEditSlidesSaved(false), 2500)
    } catch (e: any) { setError(e?.message || 'Save failed') }
    finally { setEditSlidesSaving(false) }
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
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-[#0a0a0a]">Homepage Content</h1>
        <p className="text-xs font-sans text-[#6b6b6b] mt-1">
          Edit all homepage text and media. Changes go live immediately.
        </p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-xs font-sans rounded">
          {error}
        </div>
      )}

      <div className="space-y-8">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="font-sans text-[10px] tracking-widest uppercase text-[#6b6b6b] mb-3 pb-2 border-b border-[#e8e4e0]">
              {section.title}
            </h2>
            <div className="space-y-4">
              {section.fields.map((field) => (
                <div key={field.key} className="bg-white border border-[#e8e4e0] p-4">
                  <label htmlFor={field.key} className="block text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-1">
                    {field.label}
                  </label>
                  <p className="text-[10px] font-sans text-[#6b6b6b] mb-2">{field.hint}</p>
                  <div className="flex gap-2 items-start">
                    {'long' in field && field.long ? (
                      <textarea
                        id={field.key}
                        rows={3}
                        value={values[field.key] ?? ''}
                        onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                        className="flex-1 border border-[#e8e4e0] px-3 py-2 text-sm font-sans text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a] resize-none"
                      />
                    ) : (
                      <div className="flex-1 flex gap-1.5 items-center flex-wrap">
                        <input
                          id={field.key}
                          type="text"
                          value={values[field.key] ?? ''}
                          onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
                          onKeyDown={(e) => e.key === 'Enter' && handleSave(field.key)}
                          className="flex-1 min-w-0 border border-[#e8e4e0] px-3 py-2 text-sm font-sans text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a]"
                        />
                        {MEDIA_KEYS[field.key] && (
                          <CloudinaryUploadButton
                            folder={MEDIA_KEYS[field.key].folder}
                            accept={MEDIA_KEYS[field.key].accept}
                            mediaUpload={MEDIA_KEYS[field.key].mediaUpload}
                            label="Upload"
                            onUploaded={(url) => setValues((v) => ({ ...v, [field.key]: url }))}
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
                      {saving === field.key ? '…' : saved === field.key ? 'Saved' : 'Save'}
                    </button>
                  </div>
                </div>
              ))}

              {section.title === 'Hero Banner' && (
                <div className="bg-white border border-[#e8e4e0] p-4">
                  <label className="block text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-1">Hero mode</label>
                  <p className="text-[10px] font-sans text-[#6b6b6b] mb-3">Switch between image and looping video background.</p>
                  <ModeToggle modeKey="hero_mode" values={values} saving={saving} saved={saved} setValues={setValues} onSave={handleSave} />
                </div>
              )}

              {section.title === 'Editorial Banner' && (
                <div className="bg-white border border-[#e8e4e0] p-4">
                  <label className="block text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-1">Editorial mode</label>
                  <p className="text-[10px] font-sans text-[#6b6b6b] mb-3">Show image or looping video on the left panel.</p>
                  <ModeToggle modeKey="editorial_mode" values={values} saving={saving} saved={saved} setValues={setValues} onSave={handleSave} />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Announcement Bar */}
        <div>
          <h2 className="font-sans text-[10px] tracking-widest uppercase text-[#6b6b6b] mb-3 pb-2 border-b border-[#e8e4e0]">
            Announcement Bar Messages
          </h2>
          <p className="text-[10px] font-sans text-[#6b6b6b] mb-3">Messages shown in the scrolling top bar.</p>
          <div className="space-y-2">
            {announcements.map((msg, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  value={msg}
                  onChange={e => setAnnouncements(a => a.map((x, j) => j === i ? e.target.value : x))}
                  placeholder="e.g. Free Shipping on Orders Above ₹999"
                  className="flex-1 border border-[#e8e4e0] px-3 py-2 text-sm font-sans focus:outline-none focus:border-[#0a0a0a]"
                />
                <button onClick={() => setAnnouncements(a => a.filter((_, j) => j !== i))} aria-label="Remove message" className="text-red-500 hover:text-red-700">
                  <Trash2 size={13} aria-hidden="true" />
                </button>
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setAnnouncements(a => [...a, ''])}
                className="flex items-center gap-1 px-3 py-2 text-[10px] font-sans tracking-widest uppercase border border-dashed border-[#e8e4e0] text-[#6b6b6b] hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-colors"
              >
                <Plus size={11} aria-hidden="true" /> Add Message
              </button>
              <button
                onClick={saveAnnouncements}
                disabled={annSaving}
                className={`px-5 py-2 text-[10px] font-sans tracking-widest uppercase transition-colors disabled:opacity-50 ${
                  annSaved ? 'bg-green-600 text-white' : 'bg-[#0a0a0a] text-white hover:bg-[#c8a4a5]'
                }`}
              >
                {annSaving ? '…' : annSaved ? 'Saved' : 'Save Messages'}
              </button>
            </div>
          </div>
        </div>

        {/* Hero Carousel Slides */}
        <div>
          <h2 className="font-sans text-[10px] tracking-widest uppercase text-[#6b6b6b] mb-3 pb-2 border-b border-[#e8e4e0]">
            Hero Carousel Slides
          </h2>
          <p className="text-[10px] font-sans text-[#6b6b6b] mb-3">
            Add multiple slides to cycle the hero panel every 5s. If empty, the single hero image/video above is used.
          </p>
          <div className="space-y-3">
            {heroSlides.map((slide, i) => (
              <div key={slide._key} className="bg-white border border-[#e8e4e0] p-4 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b]">Slide {i + 1}</span>
                  <button onClick={() => setHeroSlides(s => s.filter((_, j) => j !== i))} aria-label="Remove slide" className="text-red-500 hover:text-red-700">
                    <Trash2 size={13} aria-hidden="true" />
                  </button>
                </div>
                <div className="flex gap-1.5 items-center">
                  <input
                    value={slide.image}
                    onChange={e => setHeroSlides(s => s.map((x, j) => j === i ? { ...x, image: e.target.value } : x))}
                    placeholder="Image URL"
                    className="flex-1 border border-[#e8e4e0] px-3 py-2 text-sm font-sans focus:outline-none focus:border-[#0a0a0a]"
                  />
                  <CloudinaryUploadButton folder="hero" accept="image/*" label="Upload"
                    onUploaded={(url) => setHeroSlides(s => s.map((x, j) => j === i ? { ...x, image: url } : x))} />
                </div>
                <div className="flex gap-1.5 items-center">
                  <input
                    value={slide.video}
                    onChange={e => setHeroSlides(s => s.map((x, j) => j === i ? { ...x, video: e.target.value } : x))}
                    placeholder="Video URL (optional)"
                    className="flex-1 border border-[#e8e4e0] px-3 py-2 text-sm font-sans focus:outline-none focus:border-[#0a0a0a]"
                  />
                  <CloudinaryUploadButton folder="hero" accept="video/mp4,video/webm,video/*" mediaUpload label="Upload"
                    onUploaded={(url) => setHeroSlides(s => s.map((x, j) => j === i ? { ...x, video: url } : x))} />
                </div>
                <div className="flex gap-1.5 items-center">
                  <span className="text-[10px] font-sans text-[#6b6b6b] uppercase tracking-widest">Mode:</span>
                  {(['image', 'video'] as const).map(opt => (
                    <button key={opt} type="button"
                      onClick={() => setHeroSlides(s => s.map((x, j) => j === i ? { ...x, mode: opt } : x))}
                      className={`px-3 py-1.5 text-[10px] font-sans tracking-widest uppercase transition-colors ${
                        slide.mode === opt ? 'bg-[#0a0a0a] text-white' : 'bg-white border border-[#e8e4e0] text-[#6b6b6b] hover:bg-[#faf8f5]'
                      }`}>{opt}</button>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex gap-2">
              <button onClick={() => setHeroSlides(s => [...s, mkSlide({ image: '', video: '', mode: 'image' })])}
                className="flex items-center gap-1 px-3 py-2 text-[10px] font-sans tracking-widest uppercase border border-dashed border-[#e8e4e0] text-[#6b6b6b] hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-colors">
                <Plus size={11} aria-hidden="true" /> Add Slide
              </button>
              <button onClick={saveHeroSlides} disabled={heroSlidesSaving}
                className={`px-5 py-2 text-[10px] font-sans tracking-widest uppercase transition-colors disabled:opacity-50 ${
                  heroSlidesSaved ? 'bg-green-600 text-white' : 'bg-[#0a0a0a] text-white hover:bg-[#c8a4a5]'
                }`}>
                {heroSlidesSaving ? '…' : heroSlidesSaved ? 'Saved' : 'Save Slides'}
              </button>
            </div>
          </div>
        </div>

        {/* Editorial Carousel Slides */}
        <div>
          <h2 className="font-sans text-[10px] tracking-widest uppercase text-[#6b6b6b] mb-3 pb-2 border-b border-[#e8e4e0]">
            Editorial Carousel Slides
          </h2>
          <p className="text-[10px] font-sans text-[#6b6b6b] mb-3">
            Add multiple slides to cycle the editorial panel every 6s. If empty, the single editorial image/video above is used.
          </p>
          <div className="space-y-3">
            {editSlides.map((slide, i) => (
              <div key={slide._key} className="bg-white border border-[#e8e4e0] p-4 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b]">Slide {i + 1}</span>
                  <button onClick={() => setEditSlides(s => s.filter((_, j) => j !== i))} aria-label="Remove slide" className="text-red-500 hover:text-red-700">
                    <Trash2 size={13} aria-hidden="true" />
                  </button>
                </div>
                <div className="flex gap-1.5 items-center">
                  <input value={slide.image}
                    onChange={e => setEditSlides(s => s.map((x, j) => j === i ? { ...x, image: e.target.value } : x))}
                    placeholder="Image URL"
                    className="flex-1 border border-[#e8e4e0] px-3 py-2 text-sm font-sans focus:outline-none focus:border-[#0a0a0a]" />
                  <CloudinaryUploadButton folder="editorial" accept="image/*" label="Upload"
                    onUploaded={(url) => setEditSlides(s => s.map((x, j) => j === i ? { ...x, image: url } : x))} />
                </div>
                <div className="flex gap-1.5 items-center">
                  <input value={slide.video}
                    onChange={e => setEditSlides(s => s.map((x, j) => j === i ? { ...x, video: e.target.value } : x))}
                    placeholder="Video URL (optional)"
                    className="flex-1 border border-[#e8e4e0] px-3 py-2 text-sm font-sans focus:outline-none focus:border-[#0a0a0a]" />
                  <CloudinaryUploadButton folder="editorial" accept="video/mp4,video/webm,video/*" mediaUpload label="Upload"
                    onUploaded={(url) => setEditSlides(s => s.map((x, j) => j === i ? { ...x, video: url } : x))} />
                </div>
                <div className="flex gap-1.5 items-center">
                  <span className="text-[10px] font-sans text-[#6b6b6b] uppercase tracking-widest">Mode:</span>
                  {(['image', 'video'] as const).map(opt => (
                    <button key={opt} type="button"
                      onClick={() => setEditSlides(s => s.map((x, j) => j === i ? { ...x, mode: opt } : x))}
                      className={`px-3 py-1.5 text-[10px] font-sans tracking-widest uppercase transition-colors ${
                        slide.mode === opt ? 'bg-[#0a0a0a] text-white' : 'bg-white border border-[#e8e4e0] text-[#6b6b6b] hover:bg-[#faf8f5]'
                      }`}>{opt}</button>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex gap-2">
              <button onClick={() => setEditSlides(s => [...s, mkSlide({ image: '', video: '', mode: 'image' })])}
                className="flex items-center gap-1 px-3 py-2 text-[10px] font-sans tracking-widest uppercase border border-dashed border-[#e8e4e0] text-[#6b6b6b] hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-colors">
                <Plus size={11} aria-hidden="true" /> Add Slide
              </button>
              <button onClick={saveEditSlides} disabled={editSlidesSaving}
                className={`px-5 py-2 text-[10px] font-sans tracking-widest uppercase transition-colors disabled:opacity-50 ${
                  editSlidesSaved ? 'bg-green-600 text-white' : 'bg-[#0a0a0a] text-white hover:bg-[#c8a4a5]'
                }`}>
                {editSlidesSaving ? '…' : editSlidesSaved ? 'Saved' : 'Save Slides'}
              </button>
            </div>
          </div>
        </div>

        {/* Shop the Look */}
        <div>
          <h2 className="font-sans text-[10px] tracking-widest uppercase text-[#6b6b6b] mb-3 pb-2 border-b border-[#e8e4e0]">
            Shop the Look
          </h2>
          <div className="space-y-3">
            {looks.map((look, i) => (
              <div key={look._key} className="bg-white border border-[#e8e4e0] p-4 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b]">Look {i + 1}</span>
                  <button onClick={() => setLooks(l => l.filter((_, j) => j !== i))} aria-label="Remove look" className="text-red-500 hover:text-red-700">
                    <Trash2 size={13} aria-hidden="true" />
                  </button>
                </div>
                <input value={look.title}
                  onChange={e => setLooks(l => l.map((x, j) => j === i ? { ...x, title: e.target.value } : x))}
                  placeholder="Look title"
                  className="w-full border border-[#e8e4e0] px-3 py-2 text-sm font-sans focus:outline-none focus:border-[#0a0a0a]" />
                <input
                  value={look.tags.join(', ')}
                  onChange={e => setLooks(l => l.map((x, j) => j === i ? { ...x, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) } : x))}
                  placeholder="Tags: e.g. Aurelia Dress, Chain Bag"
                  className="w-full border border-[#e8e4e0] px-3 py-2 text-sm font-sans focus:outline-none focus:border-[#0a0a0a]" />
                <div className="flex gap-1.5 items-center">
                  <input value={look.image}
                    onChange={e => setLooks(l => l.map((x, j) => j === i ? { ...x, image: e.target.value } : x))}
                    placeholder="Image URL"
                    className="flex-1 border border-[#e8e4e0] px-3 py-2 text-sm font-sans focus:outline-none focus:border-[#0a0a0a]" />
                  <CloudinaryUploadButton folder="looks" accept="image/*" label="Upload"
                    onUploaded={(url) => setLooks(l => l.map((x, j) => j === i ? { ...x, image: url } : x))} />
                </div>
                <input value={look.href}
                  onChange={e => setLooks(l => l.map((x, j) => j === i ? { ...x, href: e.target.value } : x))}
                  placeholder="Link URL e.g. /shop/"
                  className="w-full border border-[#e8e4e0] px-3 py-2 text-sm font-sans focus:outline-none focus:border-[#0a0a0a]" />
              </div>
            ))}
            <div className="flex gap-2">
              <button onClick={() => setLooks(l => [...l, mkLook({ title: '', tags: [], image: '', href: '/shop/' })])}
                className="flex items-center gap-1 px-3 py-2 text-[10px] font-sans tracking-widest uppercase border border-dashed border-[#e8e4e0] text-[#6b6b6b] hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-colors">
                <Plus size={11} aria-hidden="true" /> Add Look
              </button>
              <button onClick={saveLooks} disabled={looksSaving}
                className={`px-5 py-2 text-[10px] font-sans tracking-widest uppercase transition-colors disabled:opacity-50 ${
                  looksSaved ? 'bg-green-600 text-white' : 'bg-[#0a0a0a] text-white hover:bg-[#c8a4a5]'
                }`}>
                {looksSaving ? '…' : looksSaved ? 'Saved' : 'Save All Looks'}
              </button>
            </div>
          </div>
        </div>

        {/* As Seen In */}
        <div>
          <h2 className="font-sans text-[10px] tracking-widest uppercase text-[#6b6b6b] mb-3 pb-2 border-b border-[#e8e4e0]">
            As Seen In (Press Logos)
          </h2>
          <div className="space-y-3">
            {logos.map((logo, i) => (
              <div key={i} className="bg-white border border-[#e8e4e0] p-3 flex gap-2 items-center">
                <input value={logo.name}
                  onChange={e => setLogos(l => l.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                  placeholder="Brand name"
                  className="flex-1 border border-[#e8e4e0] px-3 py-2 text-sm font-sans focus:outline-none focus:border-[#0a0a0a]" />
                <input value={logo.url}
                  onChange={e => setLogos(l => l.map((x, j) => j === i ? { ...x, url: e.target.value } : x))}
                  placeholder="https://..."
                  className="flex-1 border border-[#e8e4e0] px-3 py-2 text-sm font-sans focus:outline-none focus:border-[#0a0a0a]" />
                <button onClick={() => setLogos(l => l.filter((_, j) => j !== i))} aria-label="Remove logo" className="text-red-500 hover:text-red-700 shrink-0">
                  <Trash2 size={13} aria-hidden="true" />
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <button onClick={() => setLogos(l => [...l, { name: '', url: '' }])}
                className="flex items-center gap-1 px-3 py-2 text-[10px] font-sans tracking-widest uppercase border border-dashed border-[#e8e4e0] text-[#6b6b6b] hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-colors">
                <Plus size={11} aria-hidden="true" /> Add Brand
              </button>
              <button onClick={saveLogos} disabled={logosSaving}
                className={`px-5 py-2 text-[10px] font-sans tracking-widest uppercase transition-colors disabled:opacity-50 ${
                  logosSaved ? 'bg-green-600 text-white' : 'bg-[#0a0a0a] text-white hover:bg-[#c8a4a5]'
                }`}>
                {logosSaving ? '…' : logosSaved ? 'Saved' : 'Save Logos'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
