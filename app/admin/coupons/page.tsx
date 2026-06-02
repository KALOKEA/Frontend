'use client'
import { useEffect, useState } from 'react'
import { adminApi, type Coupon } from '@/lib/api/admin'
import Spinner from '@/components/ui/Spinner'
import { formatPrice } from '@/lib/utils/formatPrice'

interface FormState {
  code: string
  type: 'percent' | 'fixed'
  value: string // percent: %, fixed: rupees
  min_order_value: string // rupees
  max_uses: string
  valid_until: string
}
const empty: FormState = { code: '', type: 'percent', value: '', min_order_value: '', max_uses: '', valid_until: '' }

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

  async function save() {
    if (!form) return
    setSaving(true); setMsg(null)
    // percent → store the number as-is; fixed amount → store in paise (×100).
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
      is_active: true,
    }
    try {
      await adminApi.createCoupon(payload)
      setForm(null); load()
    } catch (e: any) {
      setMsg(e?.message || 'Failed to create coupon')
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
        <button onClick={() => { setForm({ ...empty }); setMsg(null) }} className="px-4 py-2 text-sm bg-[#0a0a0a] text-white">+ New coupon</button>
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
              {coupons.map((c) => (
                <tr key={c.id} className="border-b border-[#f0ece8] last:border-0">
                  <td className="px-4 py-3 font-medium text-[#0a0a0a]">{c.code}</td>
                  <td className="px-4 py-3">{c.type === 'percent' ? `${c.value}%` : formatPrice(c.value)}</td>
                  <td className="px-4 py-3 text-[#6b6b6b]">{c.min_order_value ? formatPrice(c.min_order_value) : '—'}</td>
                  <td className="px-4 py-3 text-[#6b6b6b]">{c.used_count ?? 0}{c.max_uses ? ` / ${c.max_uses}` : ''}</td>
                  <td className="px-4 py-3 text-[#6b6b6b]">{c.valid_until ? new Date(c.valid_until).toLocaleDateString('en-IN') : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] ${c.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{c.is_active ? 'Active' : 'Disabled'}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => toggle(c)} className="text-[11px] uppercase tracking-widest text-[#c8a4a5] hover:underline">{c.is_active ? 'Disable' : 'Enable'}</button>
                  </td>
                </tr>
              ))}
              {!coupons.length && <tr><td colSpan={7} className="px-4 py-8 text-center text-[#6b6b6b]">No coupons</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {form && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setForm(null)}>
          <div className="bg-white w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-serif text-xl mb-4">New coupon</h2>
            <div className="mb-3">
              <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Code</label>
              <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full border border-[#e8e4e0] px-3 py-2 text-sm uppercase" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="mb-3">
                <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as 'percent' | 'fixed' })} className="w-full border border-[#e8e4e0] px-3 py-2 text-sm">
                  <option value="percent">Percent (%)</option>
                  <option value="fixed">Fixed (₹)</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">{form.type === 'percent' ? 'Value (%)' : 'Value (₹)'}</label>
                <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="w-full border border-[#e8e4e0] px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="mb-3">
                <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Min order (₹)</label>
                <input type="number" value={form.min_order_value} onChange={(e) => setForm({ ...form, min_order_value: e.target.value })} className="w-full border border-[#e8e4e0] px-3 py-2 text-sm" />
              </div>
              <div className="mb-3">
                <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Max uses</label>
                <input type="number" value={form.max_uses} onChange={(e) => setForm({ ...form, max_uses: e.target.value })} className="w-full border border-[#e8e4e0] px-3 py-2 text-sm" />
              </div>
            </div>
            <div className="mb-3">
              <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Valid until</label>
              <input type="date" value={form.valid_until} onChange={(e) => setForm({ ...form, valid_until: e.target.value })} className="w-full border border-[#e8e4e0] px-3 py-2 text-sm" />
            </div>
            {msg && <p className="text-sm text-red-600 mb-3">{msg}</p>}
            <div className="flex gap-2 justify-end">
              <button onClick={() => setForm(null)} className="px-4 py-2 text-sm border border-[#e8e4e0]">Cancel</button>
              <button onClick={save} disabled={saving || !form.code || !form.value} className="px-4 py-2 text-sm bg-[#0a0a0a] text-white disabled:opacity-50">{saving ? 'Saving…' : 'Create'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
