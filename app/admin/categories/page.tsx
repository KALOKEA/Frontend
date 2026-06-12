'use client'
import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import Image from 'next/image'
import { categoriesApi, type Category } from '@/lib/api/categories'
import { uploadImage } from '@/lib/api/upload'
import Spinner from '@/components/ui/Spinner'

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

interface FormState {
  id?: string
  name: string
  slug: string
  description: string
  image_url: string
  sort_order: string
  is_active: boolean
}

const emptyForm = (): FormState => ({
  name: '', slug: '', description: '', image_url: '', sort_order: '99', is_active: true,
})

function catToForm(c: Category): FormState {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description || '',
    image_url: c.image_url || '',
    sort_order: String(c.sort_order ?? 99),
    is_active: c.is_active,
  }
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading]       = useState(true)
  const [form, setForm]             = useState<FormState | null>(null)
  const [saving, setSaving]         = useState(false)
  const [uploading, setUploading]   = useState(false)
  const [toast, setToast]           = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)
  const [slugManual, setSlugManual] = useState(false)
  const fileRef                     = useRef<HTMLInputElement>(null)

  function load() {
    setLoading(true)
    categoriesApi.getAllAdmin()
      .then(res => setCategories(Array.isArray(res) ? res : (res as any)?.data || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  function showToast(msg: string, type: 'ok' | 'err' = 'ok') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function onImageUpload(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      const { url } = await uploadImage(files[0], 'categories')
      setForm(f => f ? { ...f, image_url: url } : f)
      showToast('Photo uploaded')
    } catch (e: any) {
      showToast(e?.message || 'Upload failed', 'err')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function setName(name: string) {
    setForm(f => f ? { ...f, name, ...(!slugManual ? { slug: slugify(name) } : {}) } : f)
  }

  function openNew() {
    setSlugManual(false)
    setForm(emptyForm())
  }

  function openEdit(c: Category) {
    setSlugManual(true)
    setForm(catToForm(c))
  }

  async function save() {
    if (!form) return
    if (!form.name.trim()) { showToast('Name is required.', 'err'); return }
    if (!form.slug.trim()) { showToast('Slug is required.', 'err'); return }
    setSaving(true)
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description || undefined,
      image_url: form.image_url || undefined,
      sort_order: parseInt(form.sort_order, 10) || 99,
      is_active: form.is_active,
    }
    try {
      if (form.id) {
        await categoriesApi.update(form.id, payload)
        showToast('Category updated')
      } else {
        await categoriesApi.create(payload)
        showToast('Category created')
      }
      setForm(null)
      load()
    } catch (e: any) {
      showToast(e?.message || 'Save failed', 'err')
    } finally {
      setSaving(false)
    }
  }

  async function toggle(c: Category) {
    try {
      await categoriesApi.update(c.id, { is_active: !c.is_active })
      load()
    } catch (e: any) {
      showToast(e?.message || 'Failed', 'err')
    }
  }

  async function remove(c: Category) {
    if (!confirm(`Deactivate "${c.name}"? It will be hidden from the storefront.`)) return
    try {
      await categoriesApi.remove(c.id)
      load()
    } catch (e: any) {
      showToast(e?.message || 'Failed', 'err')
    }
  }

  const active   = categories.filter(c => c.is_active)
  const inactive = categories.filter(c => !c.is_active)

  return (
    <>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 text-sm shadow-lg max-w-xs ${
          toast.type === 'ok' ? 'bg-[#0a0a0a] text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="flex flex-wrap justify-between items-center mb-8 gap-3">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-[#0a0a0a]">Categories</h1>
          <p className="text-sm text-[#6b6b6b] mt-1">{active.length} active · {inactive.length} inactive</p>
        </div>
        <button
          onClick={openNew}
          className="px-4 py-2 text-sm bg-[#0a0a0a] text-white hover:bg-[#333] transition-colors"
        >
          + New category
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="bg-white border border-[#e8e4e0] overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm font-sans">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-widest text-[#6b6b6b] border-b border-[#e8e4e0]">
                <th className="px-4 py-3 w-16">Photo</th>
                <th className="px-4 py-3 w-8">#</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3 hidden md:table-cell">Description</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-[#6b6b6b]">
                    <p className="font-serif text-lg mb-1">No categories yet</p>
                    <p className="text-xs text-[#6b6b6b]">Click "+ New category" or run the seed script to add the 9 default categories.</p>
                  </td>
                </tr>
              ) : categories.map(c => (
                <tr
                  key={c.id}
                  className={`border-b border-[#f0ece8] last:border-0 transition-colors ${
                    c.is_active ? 'hover:bg-[#faf8f5]' : 'opacity-50 hover:opacity-75 hover:bg-[#faf8f5]'
                  }`}
                >
                  {/* Thumbnail */}
                  <td className="px-4 py-3">
                    <div className="relative w-12 h-10 bg-[#f4f2ef] overflow-hidden shrink-0">
                      {c.image_url ? (
                        <Image src={c.image_url} alt={c.name} fill className="object-cover" sizes="48px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d0ccc8" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#6b6b6b] text-xs">{c.sort_order}</td>
                  <td className="px-4 py-3 font-medium text-[#0a0a0a]">{c.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[#6b6b6b]">{c.slug}</td>
                  <td className="px-4 py-3 text-[#6b6b6b] text-xs max-w-[200px] truncate hidden md:table-cell">
                    {c.description || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 ${
                      c.is_active
                        ? 'bg-[#e8f5e9] text-[#2e7d32]'
                        : 'bg-[#f5f0e8] text-[#8a6a00]'
                    }`}>
                      {c.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => openEdit(c)}
                      className="text-[11px] uppercase tracking-widest text-[#c8a4a5] hover:underline mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggle(c)}
                      className={`text-[11px] uppercase tracking-widest hover:underline ${
                        c.is_active ? 'text-amber-600' : 'text-[#2e7d32]'
                      }`}
                    >
                      {c.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Create / Edit modal ────────────────────────────────────────── */}
      {form && (
        <div
          className="fixed inset-0 bg-black/40 flex items-start sm:items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={() => setForm(null)}
        >
          <div
            className="bg-white w-full max-w-md p-6 my-4"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="font-serif text-xl mb-5 text-[#0a0a0a]">
              {form.id ? 'Edit category' : 'New category'}
            </h2>

            <div className="mb-3">
              <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Name *</label>
              <input
                value={form.name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none"
                placeholder="e.g. Dresses"
                autoFocus
              />
            </div>

            <div className="mb-3">
              <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Slug (URL) *</label>
              <input
                value={form.slug}
                onChange={e => { setSlugManual(true); setForm(f => f ? { ...f, slug: e.target.value } : f) }}
                className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none font-mono"
                placeholder="dresses"
              />
              <p className="text-[11px] text-[#6b6b6b] mt-1">Used in URLs and filters. Don't change once indexed.</p>
            </div>

            <div className="mb-4">
              <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-2">Category Photo</label>

              {/* Preview */}
              {form.image_url ? (
                <div className="relative w-full aspect-[3/2] bg-[#f4f2ef] mb-2 overflow-hidden">
                  <Image
                    src={form.image_url}
                    alt="Category preview"
                    fill
                    className="object-cover"
                    sizes="400px"
                  />
                  <button
                    type="button"
                    onClick={() => setForm(f => f ? { ...f, image_url: '' } : f)}
                    className="absolute top-2 right-2 w-7 h-7 bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                    title="Remove photo"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="w-full aspect-[3/2] bg-[#f4f2ef] flex items-center justify-center mb-2 border border-dashed border-[#d0ccc8]">
                  <p className="text-[11px] text-[#6b6b6b] uppercase tracking-widest">No photo</p>
                </div>
              )}

              {/* Upload button */}
              <label className="block w-full px-4 py-2 text-sm border border-[#0a0a0a] text-center cursor-pointer hover:bg-[#faf8f5] transition-colors mb-2">
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Spinner size="sm" /> Uploading…
                  </span>
                ) : (
                  form.image_url ? '↑ Replace photo' : '+ Upload photo'
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  hidden
                  disabled={uploading}
                  onChange={e => onImageUpload(e.target.files)}
                />
              </label>

              {/* Manual URL fallback */}
              <input
                value={form.image_url}
                onChange={e => setForm(f => f ? { ...f, image_url: e.target.value } : f)}
                className="w-full border border-[#e8e4e0] px-3 py-2 text-xs focus:border-[#0a0a0a] outline-none text-[#6b6b6b]"
                placeholder="Or paste an image URL directly"
              />
              <p className="text-[11px] text-[#6b6b6b] mt-1">
                Shown on the homepage "Shop the Look" grid. Paste a Cloudinary or Unsplash URL.
                {form.image_url && (
                  <span> <a href={form.image_url} target="_blank" rel="noopener noreferrer" className="text-[#c8a4a5] underline">Preview ↗</a></span>
                )}
              </p>
            </div>

            <div className="mb-3">
              <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => f ? { ...f, description: e.target.value } : f)}
                rows={2}
                className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none resize-none"
                placeholder="Short description for SEO and category pages"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Sort order</label>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={e => setForm(f => f ? { ...f, sort_order: e.target.value } : f)}
                  className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none"
                  placeholder="1–99"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Status</label>
                <select
                  value={form.is_active ? 'active' : 'inactive'}
                  onChange={e => setForm(f => f ? { ...f, is_active: e.target.value === 'active' } : f)}
                  className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none bg-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setForm(null)}
                className="px-4 py-2 text-sm border border-[#e8e4e0] hover:bg-[#faf8f5] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="px-4 py-2 text-sm bg-[#0a0a0a] text-white hover:bg-[#333] disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving…' : form.id ? 'Save changes' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}