'use client'
import { useEffect, useState } from 'react'
import { adminApi, type Banner } from '@/lib/api/admin'
import { uploadImage } from '@/lib/api/upload'
import Spinner from '@/components/ui/Spinner'

interface FormState {
  title: string
  image_url: string
  link_url: string
  position: 'hero' | 'mid' | 'footer'
  sort_order: string
}
const empty: FormState = { title: '', image_url: '', link_url: '', position: 'hero', sort_order: '0' }

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<FormState | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  function load() {
    setLoading(true)
    adminApi.listBanners().then(setBanners).catch(() => setBanners([])).finally(() => setLoading(false))
  }
  useEffect(load, [])

  async function uploadBannerImage(files: FileList | null) {
    if (!files?.length || !form) return
    setUploading(true); setMsg(null)
    try {
      const { url } = await uploadImage(files[0], 'banners')
      setForm(f => f ? { ...f, image_url: url } : f)
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function save() {
    if (!form) return
    if (!form.title) { setMsg('Title is required'); return }
    if (!form.image_url) { setMsg('Upload an image first'); return }
    setSaving(true); setMsg(null)
    try {
      await adminApi.createBanner({
        title: form.title,
        image_url: form.image_url,
        link_url: form.link_url || undefined,
        position: form.position,
        sort_order: parseInt(form.sort_order || '0', 10),
        is_active: true,
      })
      setForm(null); load()
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : 'Failed to save banner')
    } finally {
      setSaving(false)
    }
  }

  async function toggle(b: Banner) {
    await adminApi.updateBanner(b.id, { is_active: !b.is_active }).catch(() => {})
    load()
  }

  async function remove(b: Banner) {
    if (!confirm(`Delete banner "${b.title}"?`)) return
    await adminApi.removeBanner(b.id).catch(() => {})
    load()
  }

  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-8 gap-3">
        <h1 className="font-serif text-2xl md:text-3xl text-[#0a0a0a]">Banners</h1>
        <button
          onClick={() => { setForm({ ...empty }); setMsg(null) }}
          className="px-4 py-2 text-sm bg-[#0a0a0a] text-white hover:bg-[#333] transition-colors"
        >
          + New banner
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map(b => (
            <div key={b.id} className="bg-white border border-[#e8e4e0] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.image_url} alt={b.title} className="w-full h-36 object-cover bg-[#f0ece8]" />
              <div className="p-4">
                <div className="flex justify-between items-start mb-1 gap-2">
                  <p className="font-medium text-[#0a0a0a] truncate">{b.title}</p>
                  <span className="text-[10px] uppercase tracking-widest text-[#6b6b6b] shrink-0 bg-[#f0ece8] px-1.5 py-0.5">{b.position}</span>
                </div>
                {b.link_url && (
                  <p className="text-[11px] text-[#6b6b6b] truncate mb-1">{b.link_url}</p>
                )}
                <div className="flex justify-between items-center text-[11px] uppercase tracking-widest mt-3 pt-3 border-t border-[#f0ece8]">
                  <button onClick={() => toggle(b)} className={`${b.is_active ? 'text-green-700' : 'text-[#6b6b6b]'} hover:underline`}>
                    {b.is_active ? 'Active' : 'Hidden'}
                  </button>
                  <button onClick={() => remove(b)} className="text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {!banners.length && (
            <p className="text-sm text-[#6b6b6b] col-span-full py-8 text-center">No banners yet.</p>
          )}
        </div>
      )}

      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div aria-hidden="true" className="absolute inset-0 bg-black/40" onClick={() => setForm(null)} />
          <div role="dialog" aria-modal="true" aria-label="New banner" className="relative bg-white w-full max-w-md p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="font-serif text-xl mb-5 text-[#0a0a0a]">New banner</h2>

            {/* Image upload */}
            <div className="mb-4">
              <p className="text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-2">Banner image *</p>
              {form.image_url ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.image_url} alt="preview" className="w-full h-32 object-cover border border-[#e8e4e0]" />
                  <button
                    onClick={() => setForm(f => f ? { ...f, image_url: '' } : f)}
                    className="absolute top-2 right-2 bg-white border border-[#e8e4e0] text-[11px] px-2 py-1 hover:bg-[#faf8f5]"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <label className="block w-full border-2 border-dashed border-[#e8e4e0] p-8 text-center cursor-pointer hover:border-[#0a0a0a] transition-colors">
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2 text-sm text-[#6b6b6b]">
                      <Spinner size="sm" /> Uploading…
                    </span>
                  ) : (
                    <>
                      <p className="text-sm text-[#6b6b6b]">Click to upload</p>
                      <p className="text-[11px] text-[#6b6b6b] mt-1">JPEG / PNG / WebP · Recommended 1400×500 px</p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    hidden
                    disabled={uploading}
                    onChange={e => uploadBannerImage(e.target.files)}
                  />
                </label>
              )}
            </div>

            <label className="block mb-3">
              <span className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Title *</span>
              <input
                value={form.title}
                onChange={e => setForm(f => f ? { ...f, title: e.target.value } : f)}
                className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none"
                placeholder="Summer Sale"
              />
            </label>

            <label className="block mb-3">
              <span className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Link URL (optional)</span>
              <input
                value={form.link_url}
                onChange={e => setForm(f => f ? { ...f, link_url: e.target.value } : f)}
                className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none"
                placeholder="/category/sale"
              />
            </label>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <label className="block">
                <span className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Position</span>
                <select
                  value={form.position}
                  onChange={e => setForm(f => f ? { ...f, position: e.target.value as FormState['position'] } : f)}
                  className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none bg-white"
                >
                  <option value="hero">Hero (top)</option>
                  <option value="mid">Mid-page</option>
                  <option value="footer">Footer</option>
                </select>
              </label>
              <label className="block">
                <span className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Sort order</span>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={e => setForm(f => f ? { ...f, sort_order: e.target.value } : f)}
                  className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none"
                />
              </label>
            </div>

            {msg && <p className="text-sm text-red-600 mb-3">{msg}</p>}

            <div className="flex gap-2 justify-end">
              <button onClick={() => setForm(null)} className="px-4 py-2 text-sm border border-[#e8e4e0] hover:bg-[#faf8f5]">Cancel</button>
              <button
                onClick={save}
                disabled={saving || uploading || !form.title || !form.image_url}
                className="px-4 py-2 text-sm bg-[#0a0a0a] text-white hover:bg-[#333] disabled:opacity-50"
              >
                {saving ? 'Creating…' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
