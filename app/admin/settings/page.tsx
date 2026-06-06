'use client'
import { useEffect, useState } from 'react'
import { settingsApi, INDIAN_STATES, type StoreSettings } from '@/lib/api/settings'
import Spinner from '@/components/ui/Spinner'

const INP = 'w-full border border-[#e8e4e0] px-3 py-2 text-sm outline-none focus:border-[#0a0a0a] transition-colors bg-white'

const DEFAULT_FORM: StoreSettings = {
  seller_name: 'KALOKEA',
  seller_address: '',
  seller_gstin: '',
  seller_state: '',
  gst_rate: 5,
  admin_email: '',
  shipping_fee: 4900,
  shipping_free_threshold: 99900,
  cod_fee: 4900,
  live_chat_widget: '',
  low_stock_threshold: 5,
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
        low_stock_threshold: Number(form.low_stock_threshold ?? 5),
      })
      setForm({ ...DEFAULT_FORM, ...updated })
      setMsg({ text: 'Settings saved ✓', ok: true })
      setTimeout(() => setMsg(null), 4000)
    } catch (e: any) {
      setMsg({ text: e?.message || 'Could not save — check your connection', ok: false })
    } finally {
      setSaving(false)
    }
  }

  if (loading || !form) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>

  const set = (k: keyof StoreSettings, v: string | number) =>
    setForm(f => ({ ...DEFAULT_FORM, ...f, [k]: v }))

  return (
    <div className="max-w-2xl">
      <h1 className="font-serif text-2xl md:text-3xl text-[#0a0a0a] mb-1">Settings</h1>
      <p className="text-sm text-[#6b6b6b] mb-8">
        All settings are stored in the database — changes take effect immediately, no redeploy needed.
      </p>

      <div className="space-y-5">

        {/* ── GST & Business ─────────────────────────────────── */}
        <Section title="GST & Business identity">
          <Field label="Business name">
            <input
              value={form.seller_name}
              onChange={e => set('seller_name', e.target.value)}
              className={INP}
              placeholder="KALOKEA"
            />
          </Field>

          <Field label="Business address">
            <textarea
              value={form.seller_address}
              onChange={e => set('seller_address', e.target.value)}
              rows={2}
              className={INP}
              placeholder="123, Fashion Street, Mumbai – 400001"
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="GSTIN">
              <input
                value={form.seller_gstin}
                onChange={e => set('seller_gstin', e.target.value.toUpperCase())}
                placeholder="22AAAAA0000A1Z5"
                maxLength={15}
                className={INP}
              />
            </Field>
            <Field label="Registered state">
              <select
                value={form.seller_state}
                onChange={e => set('seller_state', e.target.value)}
                className={INP}
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Default GST rate (%)">
              <input
                type="number"
                step="0.5"
                min={0}
                max={28}
                value={form.gst_rate}
                onChange={e => set('gst_rate', e.target.value)}
                className={INP}
              />
            </Field>
            <Field label="Admin notification email">
              <input
                type="email"
                value={form.admin_email}
                onChange={e => set('admin_email', e.target.value)}
                placeholder="you@kalokea.in"
                className={INP}
              />
            </Field>
          </div>

          <p className="text-[11px] text-[#9b9b9b] mt-1">
            Same state as buyer → CGST + SGST split. Different state → IGST.
            Confirm GST rate with your CA — individual products can override this.
          </p>
        </Section>

        {/* ── Shipping & COD ─────────────────────────────────── */}
        <Section title="Shipping & COD">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field label="Shipping fee (₹)">
              <input
                type="number"
                min={0}
                value={Math.round((form.shipping_fee ?? 4900) / 100)}
                onChange={e => set('shipping_fee', Math.round(parseFloat(e.target.value || '0') * 100))}
                className={INP}
                placeholder="49"
              />
            </Field>
            <Field label="Free shipping above (₹)">
              <input
                type="number"
                min={0}
                value={Math.round((form.shipping_free_threshold ?? 99900) / 100)}
                onChange={e => set('shipping_free_threshold', Math.round(parseFloat(e.target.value || '0') * 100))}
                className={INP}
                placeholder="999"
              />
            </Field>
            <Field label="COD fee (₹)">
              <input
                type="number"
                min={0}
                value={Math.round((form.cod_fee ?? 4900) / 100)}
                onChange={e => set('cod_fee', Math.round(parseFloat(e.target.value || '0') * 100))}
                className={INP}
                placeholder="49"
              />
            </Field>
          </div>
          <p className="text-[11px] text-[#9b9b9b] mt-1">
            Set shipping fee to 0 for always-free shipping. Set COD fee to 0 to remove the COD surcharge.
            Free-shipping threshold is ignored when shipping fee is 0.
          </p>
        </Section>

        {/* ── Inventory ──────────────────────────────────────── */}
        <Section title="Inventory alerts">
          <Field label="Low stock threshold (units)">
            <input
              type="number"
              min={1}
              max={100}
              value={form.low_stock_threshold ?? 5}
              onChange={e => set('low_stock_threshold', parseInt(e.target.value || '5', 10))}
              className={INP}
              placeholder="5"
            />
          </Field>
          <p className="text-[11px] text-[#9b9b9b] mt-1">
            Admin dashboard will flag products as "low stock" when any size variant drops below this number.
          </p>
        </Section>

        {/* ── Live Chat Widget ───────────────────────────────── */}
        <Section title="Live chat / WhatsApp widget">
          <p className="text-[11px] text-[#9b9b9b] mb-3">
            Paste your Tawk.to, Crisp, or WhatsApp embed script here. It will be injected into every
            customer-facing page automatically. Leave blank to disable.
            <br />
            <strong className="text-[#0a0a0a]">Tawk.to:</strong>{' '}
            Dashboard → Administration → Chat Widget → copy the script tag.
          </p>
          <Field label="Widget embed code (script tag)">
            <textarea
              value={form.live_chat_widget ?? ''}
              onChange={e => set('live_chat_widget', e.target.value)}
              rows={5}
              placeholder={"<script type='text/javascript'>\n  var Tawk_API=...\n</script>"}
              className={`${INP} font-mono text-xs leading-relaxed`}
            />
          </Field>
          {form.live_chat_widget ? (
            <p className="text-[11px] text-green-700 mt-1">✓ Widget active — will appear on all customer pages.</p>
          ) : (
            <p className="text-[11px] text-[#9b9b9b] mt-1">No widget configured — chat bubble will not appear.</p>
          )}
        </Section>

        {/* ── Cloudflare Deploy Hook ─────────────────────────── */}
        <Section title="Auto-rebuild (Cloudflare deploy hook)">
          <p className="text-[11px] text-[#9b9b9b] mb-3">
            When set, the backend triggers a Cloudflare Pages rebuild after every product create / update / deactivate
            — so new products appear on the site without a manual redeploy.
            <br />
            <strong className="text-[#0a0a0a]">How to set up:</strong>{' '}
            Cloudflare Pages → your project → Settings → Builds &amp; deployments → Deploy Hooks → Add deploy hook
            → copy the URL → add it in Railway as{' '}
            <code className="bg-[#f0ece8] px-1 text-[10px]">CLOUDFLARE_DEPLOY_HOOK</code>.
          </p>
          <Field label="Deploy hook URL (Railway env var — not stored in DB)">
            <input
              readOnly
              value="Set CLOUDFLARE_DEPLOY_HOOK in Railway → Variables (not stored here for security)"
              className={`${INP} bg-[#faf8f5] text-[#9b9b9b] cursor-default`}
            />
          </Field>
        </Section>

        {/* ── Save button ────────────────────────────────────── */}
        <div className="flex items-center gap-4 pt-1 pb-8">
          <button
            onClick={save}
            disabled={saving}
            className="px-6 py-2.5 text-sm bg-[#0a0a0a] text-white hover:bg-[#333] disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving…' : 'Save all settings'}
          </button>
          {msg && (
            <span className={`text-sm ${msg.ok ? 'text-green-700' : 'text-red-600'}`}>
              {msg.text}
            </span>
          )}
        </div>

      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-[#e8e4e0] p-6">
      <h2 className="font-serif text-lg text-[#0a0a0a] mb-4 pb-3 border-b border-[#f0ece8]">{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  )
}
