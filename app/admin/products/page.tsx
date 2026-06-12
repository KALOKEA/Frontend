'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { productsApi, type Product, type ProductImageRow, type ProductVariant } from '@/lib/api/products'
import { variantsApi } from '@/lib/api/variants'
import { categoriesApi, type Category } from '@/lib/api/categories'
import { uploadImage } from '@/lib/api/upload'
import Spinner from '@/components/ui/Spinner'
import { formatPrice } from '@/lib/utils/formatPrice'
import { X, ChevronLeft, ChevronUp, ChevronDown } from 'lucide-react'

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

// ─── Constants ────────────────────────────────────────────────────────────────

const QUICK_SIZES   = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size']
const QUICK_COLOURS = ['Black', 'White', 'Ivory', 'Navy', 'Red', 'Blush', 'Sage', 'Camel', 'Brown', 'Olive']

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  id?: string
  name: string; slug: string; description: string
  base_price: string; compare_price: string
  hsn_code: string; gst_rate: string
  category_id: string; tags: string
  is_featured: boolean; is_active: boolean
  sort_weight: string
}

const emptyForm = (): FormState => ({
  name: '', slug: '', description: '',
  base_price: '', compare_price: '',
  hsn_code: '', gst_rate: '',
  category_id: '', tags: '',
  is_featured: false, is_active: true,
  sort_weight: '0',
})

function productToForm(p: Product): FormState {
  return {
    id: p.id,
    name: p.name, slug: p.slug, description: p.description || '',
    base_price: String(Math.round(p.base_price / 100)),
    compare_price: p.compare_price ? String(Math.round(p.compare_price / 100)) : '',
    hsn_code: p.hsn_code || '',
    gst_rate: p.gst_rate != null ? String(p.gst_rate) : '',
    category_id: p.category_id || '',
    tags: (p.tags || []).join(', '),
    is_featured: p.is_featured, is_active: p.is_active,
    sort_weight: String((p as any).sort_weight ?? 0),
  }
}

interface VariantDraft {
  size: string; colour: string; price: string; stock: string; sku: string
  _key?: string // local unique key for list rendering
}
const emptyVariant = (): VariantDraft => ({
  size: '', colour: '', price: '', stock: '0', sku: '', _key: String(Date.now() + Math.random()),
})

// ─── Main page ────────────────────────────────────────────────────────────────

export default function AdminProductsPage() {
  const [products, setProducts]   = useState<Product[]>([])
  const [loading, setLoading]     = useState(true)
  const [editing, setEditing]     = useState<Product | 'new' | null>(null)
  const [search, setSearch]       = useState('')

  function loadProducts() {
    setLoading(true)
    productsApi.getAll({ limit: 200, include_inactive: 'true' } as any)
      .then(res => setProducts((res as any).data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }
  useEffect(loadProducts, [])

  if (editing !== null) {
    return (
      <ProductEditor
        initial={editing === 'new' ? null : editing}
        onBack={() => { setEditing(null); loadProducts() }}
        onDuplicate={(p) => setEditing({ ...p, id: undefined as any, name: `${p.name} (copy)`, slug: `${p.slug}-copy`, is_active: false } as Product)}
      />
    )
  }

  const filtered = search.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.slug.toLowerCase().includes(search.toLowerCase()) ||
        p.categories?.name?.toLowerCase().includes(search.toLowerCase())
      )
    : products

  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <h1 className="font-serif text-2xl md:text-3xl text-[#0a0a0a]">Products</h1>
        <button
          onClick={() => setEditing('new')}
          className="px-4 py-2 text-sm bg-[#0a0a0a] text-white hover:bg-[#333] transition-colors shrink-0"
        >
          + New product
        </button>
      </div>

      <div className="relative mb-4">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, category or slug…"
          className="w-full border border-[#e8e4e0] px-4 py-2.5 text-sm focus:border-[#0a0a0a] outline-none pr-8"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b6b] hover:text-[#0a0a0a] text-xl leading-none"
          ><X size={16} /></button>
        )}
      </div>
      {search.trim() && !loading && (
        <p className="text-xs text-[#6b6b6b] mb-3">{filtered.length} of {products.length} products</p>
      )}

      {loading
        ? <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        : <ProductTable products={filtered} onEdit={p => setEditing(p)} onRefresh={loadProducts} />
      }
    </>
  )
}

// ─── Product list table ───────────────────────────────────────────────────────

function ProductTable({ products, onEdit, onRefresh }: {
  products: Product[]
  onEdit: (p: Product) => void
  onRefresh: () => void
}) {
  async function deactivate(p: Product) {
    if (!confirm(`Deactivate "${p.name}"? It will be hidden from the storefront.`)) return
    await productsApi.remove(p.id).catch(() => {})
    onRefresh()
  }

  async function hardDelete(p: Product) {
    if (!confirm(`Permanently delete "${p.name}"?\n\nThis removes all variants and images and CANNOT be undone.\nOnly works if the product has no order history.`)) return
    try {
      await productsApi.hardDelete(p.id)
      onRefresh()
    } catch (e: any) {
      alert(e?.message || 'Delete failed')
    }
  }

  return (
    <div className="bg-white border border-[#e8e4e0] overflow-x-auto">
      {!products.length ? (
        <div className="px-4 py-16 text-center">
          <p className="font-serif text-lg text-[#6b6b6b] mb-2">No products yet</p>
          <p className="text-xs text-[#6b6b6b]">Click "+ New product" above to add your first product.</p>
        </div>
      ) : (
        <table className="w-full min-w-[600px] text-sm font-sans">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-widest text-[#6b6b6b] border-b border-[#e8e4e0]">
              <th className="px-4 py-3 w-14">Image</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Variants</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              const thumb = p.product_images?.find(i => i.is_primary)?.url || p.product_images?.[0]?.url
              const varCount = p.product_variants?.length || 0
              return (
                <tr key={p.id} className="border-b border-[#f0ece8] last:border-0 hover:bg-[#faf8f5] transition-colors">
                  <td className="px-4 py-3">
                    <div className="relative w-10 h-12 bg-[#f0ece8] overflow-hidden">
                      {thumb && <Image src={thumb} alt={p.name} fill className="object-cover" sizes="40px" />}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-[#0a0a0a]">{p.name}</span>
                    {p.is_featured && (
                      <span className="ml-2 text-[9px] uppercase tracking-widest text-[#b8860b] bg-[#fdf8ee] px-1.5 py-0.5">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#6b6b6b]">{p.categories?.name || '—'}</td>
                  <td className="px-4 py-3">{formatPrice(p.base_price)}</td>
                  <td className="px-4 py-3 text-[#6b6b6b]">
                    {varCount > 0
                      ? `${varCount} variant${varCount > 1 ? 's' : ''}`
                      : <span className="text-amber-600 text-[11px]">No variants</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 ${
                      p.is_active ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-[#f5f0e8] text-[#8a6a00]'
                    }`}>
                      {p.is_active ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button
                      onClick={() => onEdit(p)}
                      className="text-[11px] uppercase tracking-widest text-[#c8a4a5] hover:underline mr-4"
                    >
                      Edit
                    </button>
                    {p.is_active ? (
                      <button
                        onClick={() => deactivate(p)}
                        className="text-[11px] uppercase tracking-widest text-amber-600 hover:underline mr-4"
                      >
                        Deactivate
                      </button>
                    ) : (
                      <button
                        onClick={() => hardDelete(p)}
                        className="text-[11px] uppercase tracking-widest text-red-600 hover:underline mr-4"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}

// ─── Full-page product editor ─────────────────────────────────────────────────

function ProductEditor({
  initial, onBack, onDuplicate,
}: {
  initial: Product | null
  onBack: () => void
  onDuplicate: (p: Product) => void
}) {
  const [form, setForm]           = useState<FormState>(initial ? productToForm(initial) : emptyForm())
  const [images, setImages]       = useState<ProductImageRow[]>([])
  const [variants, setVariants]   = useState<ProductVariant[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [saving, setSaving]       = useState(false)
  const [uploading, setUploading] = useState(false)
  const [toast, setToast]         = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)
  const [slugManual, setSlugManual] = useState(!!initial)

  // ── Pending variants (for new products before first save) ──────────────────
  const [pendingVariants, setPendingVariants] = useState<VariantDraft[]>([])
  const [vDraft, setVDraft]       = useState<VariantDraft>(emptyVariant())
  const [vSaving, setVSaving]     = useState(false)

  // ── Size×colour matrix generator ──────────────────────────────────────────
  const [showMatrix, setShowMatrix]     = useState(false)
  const [matrixSizes, setMatrixSizes]   = useState<string[]>([])
  const [matrixColours, setMatrixColours] = useState<string[]>([])
  const [matrixCustomColour, setMatrixCustomColour] = useState('')
  const [matrixPrice, setMatrixPrice]   = useState('')
  const [matrixStock, setMatrixStock]   = useState('0')

  const variantsSectionRef = useRef<HTMLDivElement>(null)
  const isNew = !form.id

  useEffect(() => {
    categoriesApi.getAll()
      .then(cats => setCategories(Array.isArray(cats) ? cats : (cats as any)?.data || []))
      .catch(() => {})
    if (initial?.id) refreshMedia(initial.id)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function setName(name: string) {
    setForm(f => ({ ...f, name, ...(!slugManual ? { slug: slugify(name) } : {}) }))
  }

  function showToast(msg: string, type: 'ok' | 'err' = 'ok') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  async function refreshMedia(productId: string) {
    const [imgs, vars] = await Promise.all([
      productsApi.listImages(productId).catch(() => [] as ProductImageRow[]),
      variantsApi.listByProduct(productId).catch(() => [] as ProductVariant[]),
    ])
    setImages(imgs)
    setVariants(vars)
  }

  // ── Save / create product (+ flush pending variants) ─────────────────────

  async function save() {
    if (!form.name.trim()) { showToast('Product name is required.', 'err'); return }
    const priceNum = parseFloat(form.base_price)
    if (!form.base_price || isNaN(priceNum) || priceNum <= 0) {
      showToast('Enter a valid selling price greater than 0.', 'err'); return
    }
    setSaving(true)
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      description: form.description || undefined,
      category_id: form.category_id || undefined,
      base_price: Math.round(priceNum * 100),
      compare_price: form.compare_price ? Math.round(parseFloat(form.compare_price) * 100) : undefined,
      hsn_code: form.hsn_code || undefined,
      gst_rate: form.gst_rate !== '' && !isNaN(Number(form.gst_rate)) ? Number(form.gst_rate) : undefined,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      is_featured: form.is_featured,
      is_active: form.is_active,
      sort_weight: parseInt(form.sort_weight, 10) || 0,
    }
    try {
      if (form.id) {
        await productsApi.update(form.id, payload)
        showToast('Changes saved')
      } else {
        // ── Create product (auto-retry with suffix on slug collision) ─────
        let created
        try {
          created = await productsApi.create(payload)
        } catch (e: any) {
          if (e?.message?.includes('slug') || e?.message?.includes('products_slug_key')) {
            // Slug already taken — append short random suffix and retry once
            const suffix = Date.now().toString(36).slice(-4)
            created = await productsApi.create({ ...payload, slug: `${payload.slug}-${suffix}` })
          } else {
            throw e
          }
        }
        setForm(f => ({ ...f, id: created.id, slug: created.slug }))

        // Flush pending variants SEQUENTIALLY — parallel POSTs risk a mid-flight
        // 401 that partially saves variants (token race condition root cause).
        const pendingCount = pendingVariants.length
        if (pendingCount > 0) {
          let saved = 0
          for (const v of pendingVariants) {
            try {
              await variantsApi.create({
                product_id: created.id,
                size: v.size || undefined,
                colour: v.colour || undefined,
                price: Math.round(parseFloat(v.price || '0') * 100),
                stock: parseInt(v.stock || '0', 10),
                sku: v.sku || undefined,
              })
              saved++
            } catch { /* skip individual failures */ }
          }
          setPendingVariants([])
          await refreshMedia(created.id)
          showToast(
            saved === pendingCount
              ? `Product created with ${saved} variant${saved > 1 ? 's' : ''} ✓ — add photos below.`
              : `Product created — ${saved}/${pendingCount} variants saved. Add remaining below.`
          )
        } else {
          await refreshMedia(created.id)
          showToast('Product created — add photos and variants below.')
        }
        setTimeout(() => variantsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 300)
      }
    } catch (e: any) {
      showToast(e?.message || 'Save failed', 'err')
    } finally {
      setSaving(false)
    }
  }

  // ── Pending variant helpers (used before first save) ──────────────────────

  function addPendingVariant() {
    if (!vDraft.price) { showToast('Price is required for each variant.', 'err'); return }
    setPendingVariants(prev => [...prev, { ...vDraft, _key: String(Date.now() + Math.random()) }])
    setVDraft(emptyVariant())
    showToast('Variant queued — will be created with the product.')
  }

  function removePendingVariant(key: string) {
    setPendingVariants(prev => prev.filter(v => v._key !== key))
  }

  function updatePendingVariant(key: string, field: keyof VariantDraft, value: string) {
    setPendingVariants(prev =>
      prev.map(v => v._key === key ? { ...v, [field]: value } : v)
    )
  }

  // ── Live variant helpers (after product exists) ───────────────────────────

  async function addLiveVariant() {
    if (!form.id) return
    if (!vDraft.price) { showToast('Price is required.', 'err'); return }
    setVSaving(true)
    try {
      await variantsApi.create({
        product_id: form.id,
        size: vDraft.size || undefined,
        colour: vDraft.colour || undefined,
        price: Math.round(parseFloat(vDraft.price) * 100),
        stock: parseInt(vDraft.stock || '0', 10),
        sku: vDraft.sku || undefined,
      })
      setVDraft(emptyVariant())
      await refreshMedia(form.id)
      showToast('Variant added')
    } catch (e: any) {
      showToast(e?.message || 'Could not add variant', 'err')
    } finally {
      setVSaving(false)
    }
  }

  // ── Matrix generator ──────────────────────────────────────────────────────

  function generateMatrix() {
    const allColours = [
      ...matrixColours,
      ...matrixCustomColour.split(',').map(c => c.trim()).filter(Boolean),
    ]
    if (matrixSizes.length === 0 && allColours.length === 0) {
      showToast('Pick at least one size or colour.', 'err'); return
    }
    if (!matrixPrice) { showToast('Enter a base price for the matrix.', 'err'); return }

    const sizes   = matrixSizes.length > 0 ? matrixSizes : ['']
    const colours = allColours.length > 0   ? allColours  : ['']
    const newDrafts: VariantDraft[] = []

    for (const size of sizes) {
      for (const colour of colours) {
        const parts = [slugify(form.name || 'sku'), size, colour].filter(Boolean)
        newDrafts.push({
          size, colour, price: matrixPrice, stock: matrixStock || '0',
          sku: parts.join('-').toUpperCase().slice(0, 40),
          _key: String(Date.now() + Math.random()),
        })
      }
    }

    if (form.id) {
      // Product already exists — create live variants SEQUENTIALLY to avoid
      // token-rotation race condition (parallel POSTs can partially fail on 401)
      setSaving(true);
      (async () => {
        let saved = 0
        for (const v of newDrafts) {
          try {
            await variantsApi.create({
              product_id: form.id!,
              size: v.size || undefined,
              colour: v.colour || undefined,
              price: Math.round(parseFloat(v.price) * 100),
              stock: parseInt(v.stock, 10),
              sku: v.sku || undefined,
            })
            saved++
          } catch { /* skip individual failure */ }
        }
        await refreshMedia(form.id!)
        showToast(
          saved === newDrafts.length
            ? `${saved} variant${saved > 1 ? 's' : ''} added`
            : `${saved}/${newDrafts.length} variants added — retry the rest.`
        )
        setSaving(false)
        setShowMatrix(false)
      })()
    } else {
      // Queue for creation with product
      setPendingVariants(prev => [...prev, ...newDrafts])
      showToast(`${newDrafts.length} variants queued`)
      setShowMatrix(false)
    }

    // Reset matrix
    setMatrixSizes([]); setMatrixColours([]); setMatrixCustomColour(''); setMatrixPrice(''); setMatrixStock('0')
  }

  // ── Photos helpers ────────────────────────────────────────────────────────

  async function onUpload(files: FileList | null) {
    if (!files || !form.id) return
    setUploading(true)
    try {
      const sorted = [...images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      for (let i = 0; i < files.length; i++) {
        const { url, public_id } = await uploadImage(files[i], 'products')
        await productsApi.addImage(form.id, { url, public_id, sort_order: sorted.length + i })
      }
      await refreshMedia(form.id)
      showToast(`${files.length > 1 ? `${files.length} photos` : 'Photo'} uploaded`)
    } catch (e: any) {
      showToast(e?.message || 'Upload failed — is Cloudinary configured on the server?', 'err')
    } finally {
      setUploading(false)
    }
  }

  async function moveImage(idx: number, dir: -1 | 1) {
    const sorted = [...images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    const other = idx + dir
    if (other < 0 || other >= sorted.length) return
    const a = sorted[idx], b = sorted[other]
    await Promise.all([
      productsApi.updateImage(a.id, { sort_order: b.sort_order ?? other }),
      productsApi.updateImage(b.id, { sort_order: a.sort_order ?? idx }),
    ]).catch(() => {})
    if (form.id) await refreshMedia(form.id)
  }

  const sortedImages = [...images].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  const allVariants  = form.id ? variants : []

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

      {/* Page header */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="text-[11px] uppercase tracking-widest text-[#6b6b6b] hover:text-[#0a0a0a] shrink-0"
          >
            ← Products
          </button>
          <span className="text-[#d0ccc8]">/</span>
          <h1 className="font-serif text-2xl text-[#0a0a0a] truncate">
            {isNew ? 'New product' : (form.name || 'Edit product')}
          </h1>
          {!isNew && (
            <span className={`shrink-0 text-[10px] uppercase tracking-widest px-2 py-0.5 ${
              form.is_active ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-[#f5f0e8] text-[#8a6a00]'
            }`}>
              {form.is_active ? 'Active' : 'Draft'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!isNew && (
            <button
              onClick={() => onDuplicate(initial!)}
              className="px-3 py-2 text-xs uppercase tracking-widest border border-[#e8e4e0] hover:bg-[#faf8f5] transition-colors text-[#6b6b6b]"
              title="Duplicate this product"
            >
              Duplicate
            </button>
          )}
          <button
            onClick={onBack}
            className="px-4 py-2 text-sm border border-[#e8e4e0] hover:bg-[#f5f2ef] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-2 text-sm bg-[#0a0a0a] text-white hover:bg-[#333] disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving…' : isNew ? 'Create product' : 'Save changes'}
          </button>
        </div>
      </div>

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left column ──────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Details */}
          <Card title="Product details">
            <Field label="Name *">
              <input
                value={form.name}
                onChange={e => setName(e.target.value)}
                className="inp"
                placeholder="e.g. Floral Midi Dress"
                autoFocus
              />
            </Field>
            <Field label="Slug (URL)">
              <input
                value={form.slug}
                onChange={e => { setSlugManual(true); setForm(f => ({ ...f, slug: e.target.value })) }}
                placeholder={form.name ? slugify(form.name) : 'auto-generated-from-name'}
                className="inp"
              />
              <p className="text-[11px] text-[#6b6b6b] mt-1">
                Leave blank to auto-generate. Avoid changing after Google has indexed the page.
              </p>
            </Field>
            <Field label="Description">
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={5}
                className="inp resize-y"
                placeholder="Fabric, fit, care instructions, styling tips…"
              />
            </Field>
          </Card>

          {/* Pricing */}
          <Card title="Pricing & GST">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Selling price ₹ (excl. GST) *">
                <input
                  type="number"
                  value={form.base_price}
                  onChange={e => setForm(f => ({ ...f, base_price: e.target.value }))}
                  className="inp"
                  placeholder="999"
                />
              </Field>
              <Field label="Compare-at price ₹">
                <input
                  type="number"
                  value={form.compare_price}
                  onChange={e => setForm(f => ({ ...f, compare_price: e.target.value }))}
                  className="inp"
                  placeholder="1499 (strikethrough)"
                />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="HSN code">
                <input
                  value={form.hsn_code}
                  onChange={e => setForm(f => ({ ...f, hsn_code: e.target.value }))}
                  className="inp"
                  placeholder="6109"
                />
              </Field>
              <Field label="GST rate %">
                <input
                  type="number"
                  step="0.5"
                  value={form.gst_rate}
                  onChange={e => setForm(f => ({ ...f, gst_rate: e.target.value }))}
                  className="inp"
                  placeholder="5 / 12 / 18  (blank = store default)"
                />
              </Field>
            </div>
          </Card>

          {/* Organisation */}
          <Card title="Organisation">
            <Field label="Category">
              <select
                value={form.category_id}
                onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}
                className="inp bg-white"
              >
                <option value="">— Uncategorised —</option>
                {categories.filter(c => c.is_active).map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Tags (comma-separated)">
              <input
                value={form.tags}
                onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                className="inp"
                placeholder="summer, floral, midi, cotton"
              />
              <p className="text-[11px] text-[#6b6b6b] mt-1">Used for search and filtering.</p>
            </Field>
          </Card>

          {/* ── Variants ─────────────────────────────────────────────── */}
          <div ref={variantsSectionRef}>
            <Card title={
              isNew && pendingVariants.length > 0
                ? `Variants (${pendingVariants.length} queued)`
                : allVariants.length > 0
                  ? `Variants (${allVariants.length})`
                  : 'Variants'
            }>

              {/* ── LIVE variant table (product exists) ─────────────── */}
              {!isNew && allVariants.length > 0 && (
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[10px] uppercase tracking-widest text-[#6b6b6b] border-b border-[#e8e4e0]">
                        <th className="py-2 pr-3">Colour</th>
                        <th className="py-2 pr-3">Size</th>
                        <th className="py-2 pr-3">SKU</th>
                        <th className="py-2 pr-3">Price ₹</th>
                        <th className="py-2 pr-3">Stock</th>
                        <th className="py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {allVariants.map(v => (
                        <VariantRow
                          key={v.id}
                          v={v}
                          onSave={async (v2, stock, price) => {
                            await variantsApi.update(v2.id, {
                              stock: parseInt(stock, 10),
                              price: Math.round(parseFloat(price) * 100),
                            })
                            if (form.id) refreshMedia(form.id)
                          }}
                          onDelete={async id => {
                            await variantsApi.remove(id)
                            if (form.id) refreshMedia(form.id)
                          }}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {!isNew && allVariants.length === 0 && (
                <p className="text-xs text-amber-600 mb-4">
                  No variants yet — a product needs at least one variant to be purchasable.
                </p>
              )}

              {/* ── PENDING variant table (new product) ─────────────── */}
              {isNew && pendingVariants.length > 0 && (
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[10px] uppercase tracking-widest text-[#6b6b6b] border-b border-[#e8e4e0]">
                        <th className="py-2 pr-2">Colour</th>
                        <th className="py-2 pr-2">Size</th>
                        <th className="py-2 pr-2">SKU</th>
                        <th className="py-2 pr-2">Price ₹</th>
                        <th className="py-2 pr-2">Stock</th>
                        <th className="py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingVariants.map(v => (
                        <tr key={v._key} className="border-b border-[#f0ece8] last:border-0">
                          <td className="py-1.5 pr-2">
                            <input value={v.colour} onChange={e => updatePendingVariant(v._key!, 'colour', e.target.value)}
                              className="inp-sm" placeholder="—" />
                          </td>
                          <td className="py-1.5 pr-2">
                            <input value={v.size} onChange={e => updatePendingVariant(v._key!, 'size', e.target.value)}
                              className="inp-sm" placeholder="—" />
                          </td>
                          <td className="py-1.5 pr-2">
                            <input value={v.sku} onChange={e => updatePendingVariant(v._key!, 'sku', e.target.value)}
                              className="inp-sm" placeholder="auto" />
                          </td>
                          <td className="py-1.5 pr-2">
                            <input type="number" value={v.price} onChange={e => updatePendingVariant(v._key!, 'price', e.target.value)}
                              className="inp-sm w-20" />
                          </td>
                          <td className="py-1.5 pr-2">
                            <input type="number" value={v.stock} onChange={e => updatePendingVariant(v._key!, 'stock', e.target.value)}
                              className="inp-sm w-16" />
                          </td>
                          <td className="py-1.5 text-right">
                            <button onClick={() => removePendingVariant(v._key!)}
                              className="text-[10px] uppercase tracking-widest text-red-500 hover:underline">
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-[11px] text-[#6b6b6b] mt-2 flex items-center gap-1">
                    <span className="text-amber-600">●</span>
                    These will be created when you click "Create product".
                  </p>
                </div>
              )}

              {/* ── Matrix generator toggle ──────────────────────────── */}
              <div className="mb-3">
                <button
                  onClick={() => setShowMatrix(m => !m)}
                  className="text-[11px] uppercase tracking-widest text-[#c8a4a5] hover:underline"
                >
                  {showMatrix ? '<ChevronUp size={12} className="inline" /> Hide matrix generator' : '<ChevronDown size={12} className="inline" /> Quick generate (size × colour matrix)'}
                </button>
              </div>

              {showMatrix && (
                <div className="border border-[#e8e4e0] bg-[#fdf8f4] p-4 mb-4">
                  <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-3">
                    Matrix generator — generates all size × colour combinations
                  </p>

                  <div className="mb-3">
                    <p className="text-[11px] text-[#6b6b6b] mb-1.5">Sizes</p>
                    <div className="flex flex-wrap gap-2">
                      {QUICK_SIZES.map(s => (
                        <label key={s} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={matrixSizes.includes(s)}
                            onChange={e => setMatrixSizes(prev =>
                              e.target.checked ? [...prev, s] : prev.filter(x => x !== s)
                            )}
                            className="accent-[#0a0a0a]"
                          />
                          <span className="text-xs">{s}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-[11px] text-[#6b6b6b] mb-1.5">Colours</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {QUICK_COLOURS.map(c => (
                        <label key={c} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={matrixColours.includes(c)}
                            onChange={e => setMatrixColours(prev =>
                              e.target.checked ? [...prev, c] : prev.filter(x => x !== c)
                            )}
                            className="accent-[#0a0a0a]"
                          />
                          <span className="text-xs">{c}</span>
                        </label>
                      ))}
                    </div>
                    <input
                      value={matrixCustomColour}
                      onChange={e => setMatrixCustomColour(e.target.value)}
                      placeholder="Custom colours, comma-separated (e.g. Dusty Rose, Mint)"
                      className="inp text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <Field label="Base price ₹ *">
                      <input type="number" value={matrixPrice}
                        onChange={e => setMatrixPrice(e.target.value)}
                        className="inp" placeholder="999" />
                    </Field>
                    <Field label="Initial stock each">
                      <input type="number" value={matrixStock}
                        onChange={e => setMatrixStock(e.target.value)}
                        className="inp" placeholder="0" />
                    </Field>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={generateMatrix}
                      disabled={saving}
                      className="px-4 py-2 text-sm bg-[#0a0a0a] text-white hover:bg-[#333] disabled:opacity-50 transition-colors"
                    >
                      {saving ? 'Generating…' : `Generate ${
                        (() => {
                          const s = matrixSizes.length || 1
                          const c = (matrixColours.length + matrixCustomColour.split(',').filter(x => x.trim()).length) || 1
                          return s * c
                        })()
                      } variants`}
                    </button>
                    <button
                      onClick={() => setShowMatrix(false)}
                      className="text-sm text-[#6b6b6b] hover:text-[#0a0a0a]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* ── Add single variant ────────────────────────────────── */}
              <div className="border border-[#e8e4e0] bg-[#faf8f5] p-3">
                <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-3">
                  {isNew ? 'Add variant (queued until save)' : 'Add variant'}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-2">
                  <input
                    value={vDraft.colour}
                    onChange={e => setVDraft(d => ({ ...d, colour: e.target.value }))}
                    placeholder="Colour"
                    className="inp"
                  />
                  <input
                    value={vDraft.size}
                    onChange={e => setVDraft(d => ({ ...d, size: e.target.value }))}
                    placeholder="Size  (XS / S / M / L / XL / Free)"
                    className="inp"
                  />
                  <input
                    value={vDraft.sku}
                    onChange={e => setVDraft(d => ({ ...d, sku: e.target.value }))}
                    placeholder="SKU (optional)"
                    className="inp"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 items-end">
                  <input
                    type="number"
                    value={vDraft.price}
                    onChange={e => setVDraft(d => ({ ...d, price: e.target.value }))}
                    placeholder="Price ₹"
                    className="inp"
                    onKeyDown={e => {
                      if (e.key === 'Enter') isNew ? addPendingVariant() : addLiveVariant()
                    }}
                  />
                  <input
                    type="number"
                    value={vDraft.stock}
                    onChange={e => setVDraft(d => ({ ...d, stock: e.target.value }))}
                    placeholder="Stock qty"
                    className="inp"
                    onKeyDown={e => {
                      if (e.key === 'Enter') isNew ? addPendingVariant() : addLiveVariant()
                    }}
                  />
                  <button
                    onClick={isNew ? addPendingVariant : addLiveVariant}
                    disabled={vSaving}
                    className="px-3 py-2 text-sm bg-[#0a0a0a] text-white hover:bg-[#333] disabled:opacity-50 transition-colors"
                  >
                    {vSaving ? 'Adding…' : '+ Add'}
                  </button>
                </div>
                <p className="text-[11px] text-[#6b6b6b] mt-2">
                  Leave colour/size blank for single-option products. Price excludes GST.
                  Press Enter to add quickly.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* ── Right column ─────────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Publish */}
          <Card title="Publish">
            <div className="space-y-4">
              <label className="flex items-center justify-between gap-4 cursor-pointer">
                <div>
                  <p className="text-sm text-[#0a0a0a]">Active</p>
                  <p className="text-[11px] text-[#6b6b6b]">Visible on the storefront</p>
                </div>
                <Toggle checked={form.is_active} onChange={v => setForm(f => ({ ...f, is_active: v }))} />
              </label>
              <label className="flex items-center justify-between gap-4 cursor-pointer">
                <div>
                  <p className="text-sm text-[#0a0a0a]">Featured</p>
                  <p className="text-[11px] text-[#6b6b6b]">Shown in homepage Featured tab</p>
                </div>
                <Toggle checked={form.is_featured} onChange={v => setForm(f => ({ ...f, is_featured: v }))} />
              </label>
              <div className="flex items-start justify-between gap-4 pt-3 border-t border-[#f0ece8]">
                <div>
                  <p className="text-sm text-[#0a0a0a]">Best Seller rank</p>
                  <p className="text-[11px] text-[#6b6b6b]">Higher = appears first in Best Sellers tab. 0 = not a bestseller.</p>
                </div>
                <input
                  type="number"
                  min="0"
                  max="999"
                  value={form.sort_weight}
                  onChange={e => setForm(f => ({ ...f, sort_weight: e.target.value }))}
                  className="w-20 border border-[#e8e4e0] px-2 py-1.5 text-sm font-sans text-center focus:outline-none focus:border-[#0a0a0a]"
                />
              </div>
            </div>
            {isNew && (
              <p className="text-[11px] text-[#6b6b6b] mt-4 pt-3 border-t border-[#f0ece8]">
                Tip: keep as Draft while setting up. Activate when ready to go live.
              </p>
            )}
          </Card>

          {/* Photos */}
          <Card title={`Photos${sortedImages.length > 0 ? ` (${sortedImages.length})` : ''}`}>
            {!form.id ? (
              <div className="py-3 text-center">
                <p className="text-sm text-[#6b6b6b] mb-1">
                  Photos are added after the product is created.
                </p>
                <p className="text-[11px] text-[#c8a4a5]">
                  Fill in the details, add variants, then click "Create product" — the upload button will appear here.
                </p>
              </div>
            ) : (
              <>
                {sortedImages.length > 0 && (
                  <div className="space-y-2 mb-3">
                    {sortedImages.map((img, idx) => (
                      <div key={img.id} className="flex items-center gap-2 p-2 bg-[#faf8f5] border border-[#e8e4e0]">
                        <div className="relative w-12 h-14 bg-[#f0ece8] overflow-hidden shrink-0">
                          <Image src={img.url} alt="" fill className="object-cover" sizes="48px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          {img.is_primary && (
                            <span className="text-[9px] uppercase tracking-widest text-[#b8860b] block mb-0.5">
                              Primary
                            </span>
                          )}
                          <p className="text-[11px] text-[#6b6b6b] truncate">
                            {img.url.split('/').pop()?.split('?')[0]}
                          </p>
                        </div>
                        {/* Reorder */}
                        <div className="flex flex-col gap-0.5">
                          <button onClick={() => moveImage(idx, -1)} disabled={idx === 0}
                            className="text-[12px] leading-none text-[#6b6b6b] hover:text-[#0a0a0a] disabled:opacity-20 px-1 py-0.5"
                            title="Move up">↑</button>
                          <button onClick={() => moveImage(idx, 1)} disabled={idx === sortedImages.length - 1}
                            className="text-[12px] leading-none text-[#6b6b6b] hover:text-[#0a0a0a] disabled:opacity-20 px-1 py-0.5"
                            title="Move down">↓</button>
                        </div>
                        {/* Actions */}
                        <div className="flex flex-col gap-1 items-end shrink-0">
                          {!img.is_primary && (
                            <button
                              onClick={() => productsApi.setPrimaryImage(img.id)
                                .then(() => { if (form.id) refreshMedia(form.id) }).catch(() => {})}
                              className="text-[9px] uppercase tracking-widest text-[#c8a4a5] hover:underline whitespace-nowrap"
                            >Set primary</button>
                          )}
                          <button
                            onClick={() => productsApi.deleteImage(img.id)
                              .then(() => { if (form.id) refreshMedia(form.id) }).catch(() => {})}
                            className="text-[9px] uppercase tracking-widest text-red-500 hover:underline"
                          >Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {!sortedImages.length && (
                  <p className="text-xs text-[#6b6b6b] mb-3">No photos yet.</p>
                )}
                <label className="block w-full px-4 py-2 text-sm border border-[#0a0a0a] text-center cursor-pointer hover:bg-[#faf8f5] transition-colors">
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Spinner size="sm" />Uploading…
                    </span>
                  ) : '+ Upload photos'}
                  <input
                    type="file" accept="image/jpeg,image/png,image/webp"
                    multiple hidden disabled={uploading}
                    onChange={e => onUpload(e.target.files)}
                  />
                </label>
                <p className="text-[11px] text-[#6b6b6b] mt-2">
                  JPEG / PNG / WebP · max 5 MB · first photo auto-sets as primary.
                </p>
              </>
            )}
          </Card>

          {/* Quick info card */}
          {isNew && pendingVariants.length > 0 && (
            <div className="bg-[#fdf8f4] border border-[#e8e4e0] p-4">
              <p className="text-[10px] uppercase tracking-widest text-[#b8860b] mb-2">Ready to create</p>
              <p className="text-sm text-[#0a0a0a]">
                {pendingVariants.length} variant{pendingVariants.length > 1 ? 's' : ''} queued
              </p>
              <p className="text-[11px] text-[#6b6b6b] mt-1">
                Click "Create product" to save everything at once.
              </p>
            </div>
          )}

        </div>
      </div>

      <style jsx>{`
        :global(.inp) {
          width: 100%;
          border: 1px solid #e8e4e0;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          outline: none;
          background: white;
        }
        :global(.inp:focus) { border-color: #0a0a0a; }
        :global(.inp-sm) {
          width: 100%;
          border: 1px solid #e8e4e0;
          padding: 0.25rem 0.5rem;
          font-size: 0.8rem;
          outline: none;
          background: white;
        }
        :global(.inp-sm:focus) { border-color: #0a0a0a; }
      `}</style>
    </>
  )
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#e8e4e0] p-5">
      <h3 className="text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-4 pb-3 border-b border-[#f0ece8]">
        {title}
      </h3>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">{label}</label>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`relative inline-flex w-10 h-5 rounded-full transition-colors shrink-0 ${
        checked ? 'bg-[#0a0a0a]' : 'bg-[#d0ccc8]'
      }`}>
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`} />
    </button>
  )
}

function VariantRow({ v, onSave, onDelete }: {
  v: ProductVariant
  onSave: (v: ProductVariant, stock: string, price: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const [stock, setStock]   = useState(String(v.stock))
  const [price, setPrice]   = useState(String(Math.round(v.price / 100)))
  const [saving, setSaving] = useState(false)
  return (
    <tr className="border-b border-[#f0ece8] last:border-0">
      <td className="py-2 pr-3 text-[#0a0a0a]">{v.colour || '—'}</td>
      <td className="py-2 pr-3 text-[#0a0a0a]">{v.size || '—'}</td>
      <td className="py-2 pr-3 text-[#6b6b6b] text-xs">{v.sku || '—'}</td>
      <td className="py-2 pr-3">
        <input type="number" value={price} onChange={e => setPrice(e.target.value)}
          className="w-20 border border-[#e8e4e0] px-2 py-1 text-sm focus:border-[#0a0a0a] outline-none" />
      </td>
      <td className="py-2 pr-3">
        <input type="number" value={stock} onChange={e => setStock(e.target.value)}
          className="w-16 border border-[#e8e4e0] px-2 py-1 text-sm focus:border-[#0a0a0a] outline-none" />
      </td>
      <td className="py-2 text-right whitespace-nowrap">
        <button
          onClick={async () => { setSaving(true); await onSave(v, stock, price); setSaving(false) }}
          disabled={saving}
          className="text-[10px] uppercase tracking-widest text-[#c8a4a5] hover:underline mr-3 disabled:opacity-50"
        >
          {saving ? '…' : 'Save'}
        </button>
        <button onClick={() => onDelete(v.id)}
          className="text-[10px] uppercase tracking-widest text-red-500 hover:underline">
          Delete
        </button>
      </td>
    </tr>
  )
}
