'use client'
import { useEffect, useRef, useState } from 'react'
import { X, Upload } from 'lucide-react'
import Image from 'next/image'
import { blogApi, type BlogPost } from '@/lib/api/blog'
import { uploadImage } from '@/lib/api/upload'
import Spinner from '@/components/ui/Spinner'

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/['"]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

interface FormState {
  id?: string
  title: string
  slug: string
  eyebrow: string
  heading: string
  heading_italic: string
  excerpt: string
  description: string
  cover_image: string
  reading_time: string
  author: string
  keywords: string // comma separated in the form
  content: string
  status: 'draft' | 'published'
}

const emptyForm = (): FormState => ({
  title: '', slug: '', eyebrow: '', heading: '', heading_italic: '', excerpt: '',
  description: '', cover_image: '', reading_time: '', author: '', keywords: '', content: '',
  status: 'draft',
})

function postToForm(p: BlogPost): FormState {
  return {
    id: p.id,
    title: p.title || '',
    slug: p.slug || '',
    eyebrow: p.eyebrow || '',
    heading: p.heading || '',
    heading_italic: p.heading_italic || '',
    excerpt: p.excerpt || '',
    description: p.description || '',
    cover_image: p.cover_image || '',
    reading_time: p.reading_time || '',
    author: p.author || '',
    keywords: Array.isArray(p.keywords) ? p.keywords.join(', ') : '',
    content: p.content || '',
    status: p.status === 'published' ? 'published' : 'draft',
  }
}

export default function AdminBlogPage() {
  const [posts, setPosts]       = useState<BlogPost[]>([])
  const [loading, setLoading]   = useState(true)
  const [form, setForm]         = useState<FormState | null>(null)
  const [saving, setSaving]     = useState(false)
  const [uploading, setUploading] = useState(false)
  const [slugManual, setSlugManual] = useState(false)
  const [toast, setToast]       = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)
  const fileRef                 = useRef<HTMLInputElement>(null)
  const toastTimer              = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current) }, [])

  function showToast(msg: string, type: 'ok' | 'err' = 'ok') {
    setToast({ msg, type })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }

  function load() {
    setLoading(true)
    blogApi.listAll()
      .then((res) => setPosts(Array.isArray(res) ? res : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  function openNew() { setSlugManual(false); setForm(emptyForm()) }
  function openEdit(p: BlogPost) { setSlugManual(true); setForm(postToForm(p)) }

  function setTitle(title: string) {
    setForm((f) => f ? { ...f, title, ...(!slugManual ? { slug: slugify(title) } : {}) } : f)
  }

  async function onCoverUpload(files: FileList | null) {
    if (!files || files.length === 0) return
    setUploading(true)
    try {
      const { url } = await uploadImage(files[0], 'editorial')
      setForm((f) => f ? { ...f, cover_image: url } : f)
      showToast('Cover uploaded')
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Upload failed', 'err')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  function buildPayload(f: FormState) {
    return {
      title: f.title.trim(),
      slug: f.slug.trim() || undefined,
      eyebrow: f.eyebrow.trim() || undefined,
      heading: f.heading.trim() || undefined,
      heading_italic: f.heading_italic.trim() || undefined,
      excerpt: f.excerpt.trim() || undefined,
      description: f.description.trim() || undefined,
      cover_image: f.cover_image.trim() || undefined,
      reading_time: f.reading_time.trim() || undefined,
      author: f.author.trim() || undefined,
      keywords: f.keywords.split(',').map((k) => k.trim()).filter(Boolean),
      content: f.content,
      status: f.status,
    }
  }

  async function save(publish?: boolean) {
    if (!form) return
    if (!form.title.trim()) { showToast('Title is required.', 'err'); return }
    setSaving(true)
    const payload = buildPayload(form)
    if (publish !== undefined) payload.status = publish ? 'published' : 'draft'
    try {
      if (form.id) {
        await blogApi.update(form.id, payload)
        showToast('Post saved')
      } else {
        await blogApi.create(payload)
        showToast('Post created')
      }
      setForm(null)
      load()
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Save failed', 'err')
    } finally {
      setSaving(false)
    }
  }

  async function remove(p: BlogPost) {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return
    try {
      await blogApi.remove(p.id)
      showToast('Post deleted')
      load()
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : 'Failed', 'err')
    }
  }

  const published = posts.filter((p) => p.status === 'published')
  const drafts = posts.filter((p) => p.status !== 'published')

  return (
    <>
      {toast && (
        <div className={`fixed top-4 right-4 z-[60] px-4 py-3 text-sm shadow-lg max-w-xs ${
          toast.type === 'ok' ? 'bg-[#0a0a0a] text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.msg}
        </div>
      )}

      <div className="flex flex-wrap justify-between items-center mb-8 gap-3">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-[#0a0a0a]">Blog / Journal</h1>
          <p className="text-sm text-[#6b6b6b] mt-1">{published.length} published · {drafts.length} draft{drafts.length === 1 ? '' : 's'}</p>
        </div>
        <button onClick={openNew} className="px-4 py-2 text-sm bg-[#0a0a0a] text-white hover:bg-[#333] transition-colors">
          + New post
        </button>
      </div>

      <p className="text-sm text-[#6b6b6b] mb-6 max-w-2xl">
        Posts marked <strong>Published</strong> appear in the storefront Journal on the next site build.
        Drafts are saved privately and never shown to customers.
      </p>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="bg-white border border-[#e8e4e0] overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm font-sans">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-widest text-[#6b6b6b] border-b border-[#e8e4e0]">
                <th className="px-4 py-3 w-16">Cover</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center text-[#6b6b6b]">
                    <p className="font-serif text-lg mb-1">No posts yet</p>
                    <p className="text-xs">Click &quot;+ New post&quot; to write your first Journal article.</p>
                  </td>
                </tr>
              ) : posts.map((p) => (
                <tr key={p.id} className="border-b border-[#f0ece8] last:border-0 hover:bg-[#faf8f5] transition-colors">
                  <td className="px-4 py-3">
                    <div className="relative w-12 h-10 bg-[#f4f2ef] overflow-hidden shrink-0">
                      {p.cover_image ? (
                        <Image src={p.cover_image} alt={p.title} fill className="object-cover" sizes="48px" />
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-[#0a0a0a] max-w-[320px] truncate">{p.title}</td>
                  <td className="px-4 py-3 font-mono text-xs text-[#6b6b6b]">{p.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 ${
                      p.status === 'published' ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-[#f5f0e8] text-[#8a6a00]'
                    }`}>
                      {p.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => openEdit(p)} className="text-[11px] uppercase tracking-widest text-[#c8a4a5] hover:underline mr-4">Edit</button>
                    <button onClick={() => remove(p)} className="text-[11px] uppercase tracking-widest text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Create / Edit modal ────────────────────────────────────────── */}
      {form && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div aria-hidden="true" className="fixed inset-0 bg-black/50" onClick={() => setForm(null)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={form.id ? 'Edit post' : 'New post'}
            className="relative bg-white w-full max-w-2xl p-6 my-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif text-xl mb-5 text-[#0a0a0a]">{form.id ? 'Edit post' : 'New post'}</h2>

            <label className="block mb-3">
              <span className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Title *</span>
              <input
                value={form.title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none"
                placeholder="e.g. How to Style a Kurta Set"
                autoFocus
              />
            </label>

            <label className="block mb-3">
              <span className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Slug (URL) *</span>
              <input
                value={form.slug}
                onChange={(e) => { setSlugManual(true); setForm((f) => f ? { ...f, slug: e.target.value } : f) }}
                className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none font-mono"
                placeholder="how-to-style-a-kurta-set"
              />
              <span className="block text-[11px] text-[#6b6b6b] mt-1">Used in the URL: /blog/{form.slug || 'your-slug'}. Avoid changing once published.</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <label className="block">
                <span className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Eyebrow / category</span>
                <input value={form.eyebrow} onChange={(e) => setForm((f) => f ? { ...f, eyebrow: e.target.value } : f)} className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none" placeholder="Styling Guide" />
              </label>
              <label className="block">
                <span className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Reading time</span>
                <input value={form.reading_time} onChange={(e) => setForm((f) => f ? { ...f, reading_time: e.target.value } : f)} className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none" placeholder="8 min read" />
              </label>
              <label className="block">
                <span className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Heading (H1)</span>
                <input value={form.heading} onChange={(e) => setForm((f) => f ? { ...f, heading: e.target.value } : f)} className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none" placeholder="Defaults to the title" />
              </label>
              <label className="block">
                <span className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Heading italic tail</span>
                <input value={form.heading_italic} onChange={(e) => setForm((f) => f ? { ...f, heading_italic: e.target.value } : f)} className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none" placeholder="10 Effortless Looks" />
              </label>
            </div>

            {/* Cover image */}
            <div className="mb-3">
              <p className="text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-2">Cover image</p>
              {form.cover_image ? (
                <div className="relative w-full aspect-[16/7] bg-[#f4f2ef] mb-2 overflow-hidden">
                  <Image src={form.cover_image} alt="Cover preview" fill className="object-cover" sizes="600px" />
                  <button type="button" onClick={() => setForm((f) => f ? { ...f, cover_image: '' } : f)} className="absolute top-2 right-2 w-7 h-7 bg-black/60 text-white flex items-center justify-center hover:bg-black/80" aria-label="Remove cover">
                    <X size={14} aria-hidden="true" />
                  </button>
                </div>
              ) : (
                <div className="w-full aspect-[16/7] bg-[#f4f2ef] flex items-center justify-center mb-2 border border-dashed border-[#d0ccc8]">
                  <p className="text-[11px] text-[#6b6b6b] uppercase tracking-widest">No cover</p>
                </div>
              )}
              <label className="block w-full px-4 py-2 text-sm border border-[#0a0a0a] text-center cursor-pointer hover:bg-[#faf8f5] transition-colors">
                {uploading ? (
                  <span className="flex items-center justify-center gap-2"><Spinner size="sm" /> Uploading…</span>
                ) : (
                  <><Upload size={13} className="inline mr-1" aria-hidden="true" />{form.cover_image ? 'Replace cover' : 'Upload cover'}</>
                )}
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden disabled={uploading} onChange={(e) => onCoverUpload(e.target.files)} />
              </label>
            </div>

            <label className="block mb-3">
              <span className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Excerpt (card summary)</span>
              <textarea value={form.excerpt} onChange={(e) => setForm((f) => f ? { ...f, excerpt: e.target.value } : f)} rows={2} className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none resize-none" placeholder="One or two sentences shown on the blog index card." />
            </label>

            <label className="block mb-3">
              <span className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Meta description (SEO)</span>
              <textarea value={form.description} onChange={(e) => setForm((f) => f ? { ...f, description: e.target.value } : f)} rows={2} className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none resize-none" placeholder="Under ~158 characters for best search display." />
            </label>

            <label className="block mb-3">
              <span className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Keywords (comma separated)</span>
              <input value={form.keywords} onChange={(e) => setForm((f) => f ? { ...f, keywords: e.target.value } : f)} className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none" placeholder="kurta styling, ethnic wear, festive looks" />
            </label>

            <label className="block mb-3">
              <span className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Author</span>
              <input value={form.author} onChange={(e) => setForm((f) => f ? { ...f, author: e.target.value } : f)} className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none" placeholder="Team Kalokea" />
            </label>

            <label className="block mb-4">
              <span className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Body (HTML)</span>
              <textarea
                value={form.content}
                onChange={(e) => setForm((f) => f ? { ...f, content: e.target.value } : f)}
                rows={12}
                className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none font-mono leading-relaxed"
                placeholder={'<p>Write your article here. Basic HTML is supported:</p>\n<h2>A section heading</h2>\n<p>A paragraph with <strong>bold</strong> and <a href="/shop">links</a>.</p>\n<ul><li>A list item</li></ul>'}
              />
              <span className="block text-[11px] text-[#6b6b6b] mt-1">Supports headings, paragraphs, lists, links, images. Rendered with the Journal article styling.</span>
            </label>

            <div className="flex flex-wrap gap-2 justify-end items-center">
              <span className="mr-auto text-[11px] uppercase tracking-widest text-[#6b6b6b]">
                Status: <strong className="text-[#0a0a0a]">{form.status === 'published' ? 'Published' : 'Draft'}</strong>
              </span>
              <button onClick={() => setForm(null)} className="px-4 py-2 text-sm border border-[#e8e4e0] hover:bg-[#faf8f5] transition-colors">
                Cancel
              </button>
              <button onClick={() => save(false)} disabled={saving} className="px-4 py-2 text-sm border border-[#0a0a0a] text-[#0a0a0a] hover:bg-[#faf8f5] disabled:opacity-50 transition-colors">
                {saving ? 'Saving…' : 'Save draft'}
              </button>
              <button onClick={() => save(true)} disabled={saving} className="px-4 py-2 text-sm bg-[#0a0a0a] text-white hover:bg-[#333] disabled:opacity-50 transition-colors">
                {saving ? 'Saving…' : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
