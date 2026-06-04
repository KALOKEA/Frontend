'use client'
import { useEffect, useState } from 'react'
import { settingsApi, INDIAN_STATES, type StoreSettings } from '@/lib/api/settings'
import Spinner from '@/components/ui/Spinner'

const DEFAULT_FORM: StoreSettings = {
  seller_name: 'KALOKEA', seller_address: '', seller_gstin: '',
  seller_state: '', gst_rate: 5, admin_email: '',
  shipping_fee: 4900, shipping_free_threshold: 99900, cod_fee: 4900,
}

export default function AdminSettingsPage() {
  const [form, setForm] = useState<StoreSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)

  useEffect(() => {
    settingsApi.get()
      .then(s => setForm({ ...DEFAULT_FORM, ...s }))
      .catch(() => setForm(DEFAULT_FORM))
      .finally(() => setLoading(false))
  }, [])

  async function save() {
    if (!form) return
    setSaving(true); setMsg(null)
    try {
      const updated = await settingsApi.update({
        ...form,
        gst_rate: Number(form.gst_rate),
        shipping_fee: Number(form.shipping_fee ?? 4900),
        shipping_free_threshold: Number(form.shipping_free_threshold ?? 99900),
        cod_fee: Number(form.cod_fee ?? 4900),
      })
      setForm({ ...DEFAULT_FORM, ...updated })
      setMsg({ text: 'Settings saved ✓', ok: true })
    } catch (e: any) {
      setMsg({ text: e?.message || 'Could not save', ok: false })
    } finally {
      setSaving(false)
    }
  }

  if (loading || !form) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  const set = (k: keyof StoreSettings, v: string | number) => setForm({ ...form, [k]: v } as StoreSettings)

  return (
    <>
      <h1 className="font-serif text-3xl text-[#0a0a0a] mb-2">Settings</h1>
      <p className="text-sm text-[#6b6b6b] mb-8">Business, GST and shipping configuration — all stored in the database, no redeploy needed.</p>

      <div className="space-y-6 max-w-2xl">

        {/* GST & Business */}
        <div className="bg-white border border-[#e8e4e0] p-6">
          <h2 className="font-serif text-lg text-[#0a0a0a] mb-4 pb-3 border-b border-[#f0ece8]">GST &amp; Business identity</h2>

          <Field label="Business name">
            <input value={form.seller_name} onChange={e => set('seller_name', e.target.value)} className="inp" />
          </Field>
          <Field label="Business address">
            <textarea value={form.seller_address} onChange={e => set('seller_address', e.target.value)} rows={2} className="inp" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="GSTIN">
              <input value={form.seller_gstin} onChange={e => set('seller_gstin', e.target.value.toUpperCase())} placeholder="22AAAAA0000A1Z5" className="inp" />
            </Field>
            <Field label="Registered state">
              <select value={form.seller_state} onChange={e => set('seller_state', e.target.value)} className="inp bg-white">
                <option value="">Select state</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="GST rate (%)">
              <input type="number" step="0.5" value={form.gst_rate} onChange={e => set('gst_rate', e.target.value)} className="inp" />
            </Field>
            <Field label="Admin notification email">
              <input type="email" value={form.admin_email} onChange={e => set('admin_email', e.target.value)} placeholder="you@kalokea.in" className="inp" />
            </Field>
          </div>
          <p className="text-[11px] text-[#9b9b9b] mt-2">
            Same state as buyer → CGST + SGST split. Different state → IGST. Confirm GST rate with your accountant.
          </p>
        </div>

        {/* Shipping & COD */}
        <div className="bg-white border border-[#e8e4e0] p-6">
          <h2 className="font-serif text-lg text-[#0a0a0a] mb-1 pb-3 border-b border-[#f0ece8]">Shipping &amp; COD</h2>
          <p className="text-[11px] text-[#9b9b9b] mb-4">
            Requires migration <code className="bg-[#f0ece8] px-1">007_shipping_settings.sql</code> to be run in Supabase.
          </p>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Shipping fee ₹">
              <input
                type="number"
                value={Math.round((form.shipping_fee ?? 4900) / 100)}
                onChange={e => set('shipping_fee', Math.round(parseFloat(e.target.value || '0') * 100))}
                className="inp"
                placeholder="49"
              />
            </Field>
            <Field label="Free shipping above ₹">
              <input
                type="number"
                value={Math.round((form.shipping_free_threshold ?? 99900) / 100)}
                onChange={e => set('shipping_free_threshold', Math.round(parseFloat(e.target.value || '0') * 100))}
                className="inp"
                placeholder="999"
              />
            </Field>
            <Field label="COD fee ₹">
              <input
                type="number"
                value={Math.round((form.cod_fee ?? 4900) / 100)}
                onChange={e => set('cod_fee', Math.round(parseFloat(e.target.value || '0') * 100))}
                className="inp"
                placeholder="49"
              />
            </Field>
          </div>
          <p className="text-[11px] text-[#9b9b9b] mt-1">Set shipping fee to 0 for always-free shipping. COD fee to 0 to disable the surcharge.</p>
        </div>

        {/* Deploy hook */}
        <div className="bg-white border border-[#e8e4e0] p-6">
          <h2 className="font-serif text-lg text-[#0a0a0a] mb-1 pb-3 border-b border-[#f0ece8]">Auto-rebuild (Cloudflare deploy hook)</h2>
          <p className="text-[11px] text-[#9b9b9b] mb-4">
            When set, the backend calls this URL after every product create / update / deactivate —
            triggering a Cloudflare Pages rebuild so new products appear without a manual redeploy.
            <br />
            <strong className="text-[#0a0a0a]">How to get the URL:</strong> Cloudflare Pages → your project →
            Settings → Builds &amp; deployments → Deploy Hooks → Add deploy hook → copy the URL → paste in Railway as
            <code className="bg-[#f0ece8] px-1 mx-0.5">CLOUDFLARE_DEPLOY_HOOK</code>.
          </p>
          <Field label="Deploy hook URL (Railway env var)">
            <input
              readOnly
              value="Set CLOUDFLARE_DEPLOY_HOOK in Railway Variables — not stored here for security."
              className="inp bg-[#faf8f5] text-[#9b9b9b] cursor-default select-none"
            />
          </Field>
        </div>

        {/* Save */}
        <div className="flex items-center gap-3">
          <button onClick={save} disabled={saving}
            className="px-5 py-2 text-sm bg-[#0a0a0a] text-white hover:bg-[#333] disabled:opacity-50 transition-colors">
            {saving ? 'Saving…' : 'Save all settings'}
          </button>
          {msg && (
            <span className={`text-sm ${msg.ok ? 'text-green-700' : 'text-red-600'}`}>{msg.text}</span>
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
        }
        :global(.inp:focus) { border-color: #0a0a0a; }
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
