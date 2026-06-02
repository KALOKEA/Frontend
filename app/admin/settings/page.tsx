'use client'
import { useEffect, useState } from 'react'
import { settingsApi, INDIAN_STATES, type StoreSettings } from '@/lib/api/settings'
import Spinner from '@/components/ui/Spinner'

export default function AdminSettingsPage() {
  const [form, setForm] = useState<StoreSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    settingsApi.get()
      .then(setForm)
      .catch(() => setForm({ seller_name: 'KALOKEA', seller_address: '', seller_gstin: '', seller_state: '', gst_rate: 5, admin_email: '' }))
      .finally(() => setLoading(false))
  }, [])

  async function save() {
    if (!form) return
    setSaving(true); setMsg(null)
    try {
      const updated = await settingsApi.update({ ...form, gst_rate: Number(form.gst_rate) })
      setForm(updated)
      setMsg('Saved')
    } catch (e: any) {
      setMsg(e?.message || 'Could not save')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !form) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  const set = (k: keyof StoreSettings, v: string | number) => setForm({ ...form, [k]: v } as StoreSettings)

  return (
    <>
      <h1 className="font-serif text-3xl text-[#0a0a0a] mb-2">Settings</h1>
      <p className="text-sm text-[#6b6b6b] mb-8">Business &amp; GST details used on customer invoices and the GST report.</p>

      <div className="bg-white border border-[#e8e4e0] p-6 max-w-2xl">
        <h2 className="font-serif text-lg text-[#0a0a0a] mb-4">GST &amp; business identity</h2>

        <Field label="Business name">
          <input value={form.seller_name} onChange={(e) => set('seller_name', e.target.value)} className="inp" />
        </Field>
        <Field label="Business address">
          <textarea value={form.seller_address} onChange={(e) => set('seller_address', e.target.value)} rows={2} className="inp" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="GSTIN">
            <input value={form.seller_gstin} onChange={(e) => set('seller_gstin', e.target.value.toUpperCase())} placeholder="22AAAAA0000A1Z5" className="inp" />
          </Field>
          <Field label="Registered state">
            <select value={form.seller_state} onChange={(e) => set('seller_state', e.target.value)} className="inp">
              <option value="">Select state</option>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="GST rate (%)">
            <input type="number" step="0.5" value={form.gst_rate} onChange={(e) => set('gst_rate', e.target.value)} className="inp" />
          </Field>
          <Field label="Admin notification email">
            <input type="email" value={form.admin_email} onChange={(e) => set('admin_email', e.target.value)} placeholder="you@kalokea.in" className="inp" />
          </Field>
        </div>

        <p className="text-[11px] text-[#6b6b6b] mt-2 mb-4">
          Registered state decides the tax split on invoices: same state as the buyer → CGST + SGST, different state → IGST.
          Confirm your GST rate (apparel is commonly 5%) and HSN codes with your accountant.
        </p>

        <div className="flex items-center gap-3">
          <button onClick={save} disabled={saving} className="px-5 py-2 text-sm bg-[#0a0a0a] text-white disabled:opacity-50">
            {saving ? 'Saving…' : 'Save settings'}
          </button>
          {msg && <span className="text-sm text-[#6b6b6b]">{msg}</span>}
        </div>
      </div>

      <style jsx>{`
        :global(.inp) { width: 100%; border: 1px solid #e8e4e0; padding: 0.5rem 0.75rem; font-size: 0.875rem; }
      `}</style>
    </>
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
