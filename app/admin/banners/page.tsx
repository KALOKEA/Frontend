'use client'
import { useEffect, useState } from 'react'
import { adminApi, type Banner } from '@/lib/api/admin'
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
  const [msg, setMsg] = useState<string | null>(null)

  function load() {
    setLoading(true)
    adminApi.listBanners().then(setBanners).catch(() => setBanners([])).finally(() => setLoading(false))
  }
  useEffect(load, [])

  async function save() {
    if (!form) return
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
    } catch (e: any) {
      setMsg(e?.message || 'Failed to save banner')
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl text-[#0a0a0a]">Banners</h1>
        <button onClick={() => { setForm({ ...empty }); setMsg(null) }} className="px-4 py-2 text-sm bg-[#0a0a0a] text-white">+ New banner</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map((b) => (
            <div key={b.id} className="bg-white border border-[#e8e4e0]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.image_url} alt={b.title} className="w-full h-32 object-cover bg-[#f0ece8]" />
              <div className="p-4">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-medium text-[#0a0a0a]">{b.title}</p>
                  <span className="text-[10px] uppercase tracking-widest text-[#6b6b6b]">{b.position}</span>
                </div>
                {b.link_url && <p className="text-[11px] text-[#6b6b6b] truncate mb-2">{b.link_url}</p>}
                <div className="flex justify-between items-center text-[11px] uppercase tracking-widest">
                  <button onClick={() => toggle(b)} className={b.is_active ? 'text-green-700' : 'text-gray-400'}>{b.is_active ? 'Active' : 'Hidden'}</button>
                  <button onClick={() => remove(b)} className="text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
          {!banners.length && <p className="text-sm text-[#6b6b6b] col-span-full py-8 text-center">No banners</p>}
        </div>
      )}

      {form && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setForm(null)}>
          <div className="bg-white w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-serif text-xl mb-4">New banner</h2>
            <div className="mb-3">
              <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border border-[#e8e4e0] px-3 py-2 text-sm" />
            </div>
            <div className="mb-3">
              <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Image URL (Cloudinary)</label>
              <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="w-full border border-[#e8e4e0] px-3 py-2 text-sm" />
            </div>
            <div className="mb-3">
              <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Link URL (optional)</label>
              <input value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} className="w-full border border-[#e8e4e0] px-3 py-2 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="mb-3">
                <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Position</label>
                <select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value as FormState['position'] })} className="w-full border border-[#e8e4e0] px-3 py-2 text-sm">
                  <option value="hero">Hero</option>
                  <option value="mid">Mid</option>
                  <option value="footer">Footer</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Sort order</label>
                <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} className="w-full border border-[#e8e4e0] px-3 py-2 text-sm" />
              </div>
            </div>
            {msg && <p className="text-sm text-red-600 mb-3">{msg}</p>}
            <div className="flex gap-2 justify-end">
              <button onClick={() => setForm(null)} className="px-4 py-2 text-sm border border-[#e8e4e0]">Cancel</button>
              <button onClick={save} disabled={saving || !form.title || !form.image_url} className="px-4 py-2 text-sm bg-[#0a0a0a] text-white disabled:opacity-50">{saving ? 'Saving…' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
