'use client'
import { useEffect, useState } from 'react'
import { adminApi, type Coupon } from '@/lib/api/admin'
import Spinner from '@/components/ui/Spinner'
import { formatPrice } from '@/lib/utils/formatPrice'

interface FormState {
  id?: string
  code: string
  type: 'percent' | 'fixed'
  value: string
  min_order_value: string
  max_uses: string
  valid_until: string
  is_active: boolean
}

const emptyForm = (): FormState => ({
  code: '', type: 'percent', value: '', min_order_value: '',
  max_uses: '', valid_until: '', is_active: true,
})

function couponToForm(c: Coupon): FormState {
  return {
    id: c.id,
    code: c.code,
    type: c.type,
    value: c.type === 'fixed' ? String(Math.round(c.value / 100)) : String(c.value),
    min_order_value: c.min_order_value ? String(Math.round(c.min_order_value / 100)) : '',
    max_uses: c.max_uses ? String(c.max_uses) : '',
    valid_until: c.valid_until ? c.valid_until.slice(0, 10) : '',
    is_active: c.is_active,
  }
}

function isExpired(c: Coupon) {
  return c.valid_until ? new Date(c.valid_until) < new Date() : false
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<FormState | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  function load() {
    setLoading(true)
    adminApi.listCoupons().then(setCoupons).catch(() => setCoupons([])).finally(() => setLoading(false))
  }
  useEffect(load, [])

  function openCreate() { setForm(emptyForm()); setMsg(null) }
  function openEdit(c: Coupon) { setForm(couponToForm(c)); setMsg(null) }

  async function save() {
    if (!form) return
    setSaving(true); setMsg(null)
    const value = form.type === 'fixed'
      ? Math.round(parseFloat(form.value || '0') * 100)
      : parseFloat(form.value || '0')
    const payload: Partial<Coupon> = {
      code: form.code.toUpperCase().trim(),
      type: form.type,
      value,
      min_order_value: form.min_order_value ? Math.round(parseFloat(form.min_order_value) * 100) : undefined,
      max_uses: form.max_uses ? parseInt(form.max_uses, 10) : undefined,
      valid_until: form.valid_until || undefined,
      is_active: form.is_active,
    }
    try {
      if (form.id) {
        await adminApi.updateCoupon(form.id, payload)
      } else {
        await adminApi.createCoupon(payload)
      }
      setForm(null); load()
    } catch (e: any) {
      setMsg(e?.message || 'Failed to save coupon')
    } finally {
      setSaving(false)
    }
  }

  async function toggle(c: Coupon) {
    await adminApi.toggleCoupon(c.id).catch(() => {})
    load()
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl text-[#0a0a0a]">Coupons</h1>
        <button onClick={openCreate} className="px-4 py-2 text-sm bg-[#0a0a0a] text-white hover:bg-[#333] transition-colors">
          + New coupon
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="bg-white border border-[#e8e4e0]">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-widest text-[#6b6b6b] border-b border-[#e8e4e0]">
                <th className="px-4 py-3">Code</th>
                <th className="px-4 py-3">Discount</th>
                <th className="px-4 py-3">Min order</th>
                <th className="px-4 py-3">Used</th>
                <th className="px-4 py-3">Valid until</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(c => {
                const expired = isExpired(c)
                return (
                  <tr key={c.id} className="border-b border-[#f0ece8] last:border-0 hover:bg-[#faf8f5] transition-colors">
                    <td className="px-4 py-3 font-medium font-mono text-[#0a0a0a]">{c.code}</td>
                    <td className="px-4 py-3">
                      {c.type === 'percent' ? `${c.value}% off` : `${formatPrice(c.value)} off`}
                    </td>
                    <td className="px-4 py-3 text-[#6b6b6b]">{c.min_order_value ? formatPrice(c.min_order_value) : '—'}</td>
                    <td className="px-4 py-3 text-[#6b6b6b]">
                      {c.used_count ?? 0}
                      {c.max_uses ? <span className="text-[#9b9b9b]"> / {c.max_uses}</span> : ''}
                    </td>
                    <td className="px-4 py-3">
                      {c.valid_until ? (
                        <span className={expired ? 'text-red-500 line-through' : 'text-[#6b6b6b]'}>
                          {new Date(c.valid_until).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] uppercase tracking-widest px-2 py-0.5 rounded ${
                        expired ? 'bg-red-100 text-red-600' :
                        c.is_active ? 'bg-[#e8f5e9] text-[#2e7d32]' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {expired ? 'Expired' : c.is_active ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button onClick={() => openEdit(c)} className="text-[11px] uppercase tracking-widest text-[#c8a4a5] hover:underline mr-3">Edit</button>
                      <button onClick={() => toggle(c)} className="text-[11px] uppercase tracking-widest text-[#6b6b6b] hover:underline">
                        {c.is_active ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                )
              })}
              {!coupons.length && <tr><td colSpan={7} className="px-4 py-10 text-center text-[#6b6b6b]">No coupons yet</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {form && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setForm(null)}>
          <div className="bg-white w-full max-w-md p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <h2 className="font-serif text-xl mb-5 text-[#0a0a0a]">{form.id ? 'Edit coupon' : 'New coupon'}</h2>

            <div className="mb-3">
              <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Code *</label>
              <input
                value={form.code}
                onChange={e => setForm(f => f ? { ...f, code: e.target.value.toUpperCase() } : f)}
                className="w-full border border-[#e8e4e0] px-3 py-2 text-sm font-mono focus:border-[#0a0a0a] outline-none uppercase"
                placeholder="SUMMER20"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={e => setForm(f => f ? { ...f, type: e.target.value as 'percent' | 'fixed' } : f)}
                  className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none bg-white"
                >
                  <option value="percent">Percent (%)</option>
                  <option value="fixed">Fixed amount (₹)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">
                  {form.type === 'percent' ? 'Discount %' : 'Amount ₹'}
                </label>
                <input
                  type="number"
                  value={form.value}
                  onChange={e => setForm(f => f ? { ...f, value: e.target.value } : f)}
                  className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none"
                  placeholder={form.type === 'percent' ? '20' : '200'}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Min order ₹</label>
                <input
                  type="number"
                  value={form.min_order_value}
                  onChange={e => setForm(f => f ? { ...f, min_order_value: e.target.value } : f)}
                  className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none"
                  placeholder="999"
                />
              </div>
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Max uses</label>
                <input
                  type="number"
                  value={form.max_uses}
                  onChange={e => setForm(f => f ? { ...f, max_uses: e.target.value } : f)}
                  className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none"
                  placeholder="Unlimited"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Valid until</label>
              <input
                type="date"
                value={form.valid_until}
                onChange={e => setForm(f => f ? { ...f, valid_until: e.target.value } : f)}
                className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-[#0a0a0a] mb-5 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={e => setForm(f => f ? { ...f, is_active: e.target.checked } : f)}
                className="w-4 h-4"
              />
              Active (customers can use this coupon)
            </label>

            {msg && <p className="text-sm text-red-600 mb-3">{msg}</p>}

            <div className="flex gap-2 justify-end">
              <button onClick={() => setForm(null)} className="px-4 py-2 text-sm border border-[#e8e4e0] hover:bg-[#faf8f5]">Cancel</button>
              <button
                onClick={save}
                disabled={saving || !form.code || !form.value}
                className="px-4 py-2 text-sm bg-[#0a0a0a] text-white hover:bg-[#333] disabled:opacity-50"
              >
                {saving ? 'Saving…' : form.id ? 'Save changes' : 'Create coupon'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
