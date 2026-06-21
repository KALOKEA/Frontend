'use client'
import { useEffect, useRef, useState } from 'react'
import { settingsApi, INDIAN_STATES, type StoreSettings } from '@/lib/api/settings'
import { twoFactorApi } from '@/lib/api/auth'
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
  footer_instagram_url: 'https://www.instagram.com/kalokea.fashion',
  footer_whatsapp_url:  'https://wa.me/918799610432',
  footer_facebook_url:  'https://www.facebook.com/kalokea.in',
  footer_pinterest_url: 'https://www.pinterest.com/kalokea',
}

// ── 2FA panel ───────────────────────────────────────────────────────────────
function TwoFactorSection() {
  const [status, setStatus] = useState<'loading' | 'enabled' | 'disabled'>('loading')
  const [phase, setPhase] = useState<'idle' | 'setup' | 'confirm-enable' | 'confirm-disable'>('idle')
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [token, setToken] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const msgTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    twoFactorApi.status()
      .then(r => setStatus(r.enabled ? 'enabled' : 'disabled'))
      .catch(() => setStatus('disabled'))
    return () => { if (msgTimerRef.current) clearTimeout(msgTimerRef.current) }
  }, [])

  function flash(text: string, ok: boolean) {
    setMsg({ text, ok })
    if (msgTimerRef.current) clearTimeout(msgTimerRef.current)
    msgTimerRef.current = setTimeout(() => setMsg(null), 5000)
  }

  async function handleSetup() {
    setBusy(true)
    try {
      const r = await twoFactorApi.setup()
      setQrCode(r.qr_code)
      setSecret(r.secret)
      setPhase('confirm-enable')
    } catch (e: unknown) {
      flash(e instanceof Error ? e.message : 'Setup failed', false)
    } finally { setBusy(false) }
  }

  async function handleEnable() {
    if (!token.trim()) { flash('Enter the 6-digit code from your authenticator app', false); return }
    setBusy(true)
    try {
      await twoFactorApi.enable(token.trim())
      setStatus('enabled')
      setPhase('idle')
      setToken('')
      setQrCode('')
      flash('2FA enabled — your account is now protected', true)
    } catch (e: unknown) {
      flash(e instanceof Error ? e.message : 'Invalid code — try again', false)
    } finally { setBusy(false) }
  }

  async function handleDisable() {
    if (!token.trim()) { flash('Enter the 6-digit code to confirm disable', false); return }
    setBusy(true)
    try {
      await twoFactorApi.disable(token.trim())
      setStatus('disabled')
      setPhase('idle')
      setToken('')
      flash('2FA disabled', true)
    } catch (e: unknown) {
      flash(e instanceof Error ? e.message : 'Invalid code — 2FA not disabled', false)
    } finally { setBusy(false) }
  }

  if (status === 'loading') {
    return <div className="flex items-center gap-2 text-sm text-[#6b6b6b]"><Spinner size="sm" /> Loading security status…</div>
  }

  return (
    <div className="space-y-4">
      {/* Status badge */}
      <div className="flex items-center gap-3">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full ${
          status === 'enabled'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-amber-50 text-amber-700 border border-amber-200'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${status === 'enabled' ? 'bg-green-500' : 'bg-amber-500'}`} />
          {status === 'enabled' ? '2FA Enabled' : '2FA Disabled'}
        </span>
        <p className="text-[11px] text-[#6b6b6b]">
          {status === 'enabled'
            ? 'Your admin account is protected with two-factor authentication.'
            : 'Enable 2FA to protect your admin account with an authenticator app.'}
        </p>
      </div>

      {/* Idle state */}
      {phase === 'idle' && (
        <div>
          {status === 'disabled' ? (
            <button
              onClick={handleSetup}
              disabled={busy}
              className="px-4 py-2 text-sm bg-[#0a0a0a] text-white hover:bg-[#333] disabled:opacity-50 transition-colors"
            >
              {busy ? 'Loading…' : 'Set up 2FA'}
            </button>
          ) : (
            <button
              onClick={() => { setPhase('confirm-disable'); setToken('') }}
              className="px-4 py-2 text-sm border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
            >
              Disable 2FA
            </button>
          )}
        </div>
      )}

      {/* Setup + QR code */}
      {phase === 'confirm-enable' && qrCode && (
        <div className="border border-[#e8e4e0] p-4 space-y-4 bg-[#faf8f5]">
          <p className="text-sm font-medium text-[#0a0a0a]">Step 1 — Scan this QR code with Google Authenticator or Authy</p>
          <div className="flex items-start gap-6">
            <div className="border border-[#e8e4e0] bg-white p-2 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrCode} alt="2FA QR Code" width={160} height={160} />
            </div>
            <div className="space-y-2">
              <p className="text-[11px] text-[#6b6b6b]">Or enter the secret manually:</p>
              <code className="block text-xs bg-white border border-[#e8e4e0] px-3 py-2 break-all select-all">
                {secret}
              </code>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-[#0a0a0a] mb-2">Step 2 — Enter the 6-digit code from your app to activate</p>
            <div className="flex gap-2 max-w-xs">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={token}
                onChange={e => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                aria-label="Authenticator code"
                className={`${INP} tracking-widest text-center font-mono`}
              />
              <button
                onClick={handleEnable}
                disabled={busy || token.length !== 6}
                className="px-4 py-2 text-sm bg-[#0a0a0a] text-white hover:bg-[#333] disabled:opacity-50 transition-colors whitespace-nowrap"
              >
                {busy ? 'Verifying…' : 'Activate'}
              </button>
            </div>
            <button
              onClick={() => { setPhase('idle'); setToken('') }}
              className="text-[11px] text-[#6b6b6b] underline mt-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Disable confirmation */}
      {phase === 'confirm-disable' && (
        <div className="border border-red-200 p-4 space-y-3 bg-red-50">
          <p className="text-sm font-medium text-red-700">Enter your current authenticator code to disable 2FA</p>
          <div className="flex gap-2 max-w-xs">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={token}
              onChange={e => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="000000"
              aria-label="Current authenticator code"
              className={`${INP} tracking-widest text-center font-mono`}
            />
            <button
              onClick={handleDisable}
              disabled={busy || token.length !== 6}
              className="px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 transition-colors whitespace-nowrap"
            >
              {busy ? 'Checking…' : 'Disable'}
            </button>
          </div>
          <button
            onClick={() => { setPhase('idle'); setToken('') }}
            className="text-[11px] text-[#6b6b6b] underline"
          >
            Cancel
          </button>
        </div>
      )}

      {msg && (
        <p className={`text-sm ${msg.ok ? 'text-green-700' : 'text-red-600'}`}>{msg.text}</p>
      )}

      <p className="text-[11px] text-[#6b6b6b]">
        Works with Google Authenticator, Authy, Microsoft Authenticator, or any TOTP app.
      </p>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function AdminSettingsPage() {
  const [form, setForm] = useState<StoreSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const saveMsgTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (saveMsgTimerRef.current) clearTimeout(saveMsgTimerRef.current) }, [])

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
      setMsg({ text: 'Settings saved', ok: true })
      if (saveMsgTimerRef.current) clearTimeout(saveMsgTimerRef.current)
      saveMsgTimerRef.current = setTimeout(() => setMsg(null), 4000)
    } catch (e: unknown) {
      setMsg({ text: e instanceof Error ? e.message : 'Could not save — check your connection', ok: false })
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
                onChange={e => set('gst_rate', parseFloat(e.target.value) || DEFAULT_FORM.gst_rate)}
                className={INP}
              />
            </Field>
            <Field label="Admin notification email">
              <input
                type="email"
                value={form.admin_email}
                onChange={e => set('admin_email', e.target.value)}
                placeholder="you@kalokea.com"
                className={INP}
              />
            </Field>
          </div>

          <p className="text-[11px] text-[#6b6b6b] mt-1">
            GST is auto-calculated by price slab: ≤ ₹999/pc → 5%, ≥ ₹1,000/pc → 12% (Notification 01/2017-CT Rate).
            Same state as buyer → CGST + SGST split; different state → IGST.
            Per-product HSN rate (if set on the product) overrides the slab. Confirm with your CA.
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
          <p className="text-[11px] text-[#6b6b6b] mt-1">
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
          <p className="text-[11px] text-[#6b6b6b] mt-1">
            Admin dashboard will flag products as "low stock" when any size variant drops below this number.
          </p>
        </Section>

        {/* ── Live Chat Widget ───────────────────────────────── */}
        <Section title="Live chat / WhatsApp widget">
          <p className="text-[11px] text-[#6b6b6b] mb-3">
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
            <p className="text-[11px] text-green-700 mt-1">Widget active — will appear on all customer pages.</p>
          ) : (
            <p className="text-[11px] text-[#6b6b6b] mt-1">No widget configured — chat bubble will not appear.</p>
          )}
        </Section>

        {/* ── Social & Brand ─────────────────────────────────── */}
        <Section title="Social & brand links">
          <p className="text-[11px] text-[#6b6b6b] mb-3">
            These appear in the footer. Changes go live immediately — no redeploy needed.
          </p>
          <Field label="Instagram URL">
            <input
              value={form.footer_instagram_url ?? ''}
              onChange={e => set('footer_instagram_url', e.target.value)}
              placeholder="https://www.instagram.com/kalokea.fashion"
              className={INP}
            />
          </Field>
          <Field label="WhatsApp URL">
            <input
              value={form.footer_whatsapp_url ?? ''}
              onChange={e => set('footer_whatsapp_url', e.target.value)}
              placeholder="https://wa.me/919876543210"
              className={INP}
            />
          </Field>
          <Field label="Facebook URL">
            <input
              value={form.footer_facebook_url ?? ''}
              onChange={e => set('footer_facebook_url', e.target.value)}
              placeholder="https://www.facebook.com/kalokea.in"
              className={INP}
            />
          </Field>
          <Field label="Pinterest URL">
            <input
              value={form.footer_pinterest_url ?? ''}
              onChange={e => set('footer_pinterest_url', e.target.value)}
              placeholder="https://www.pinterest.com/kalokea"
              className={INP}
            />
          </Field>
          <p className="text-[11px] text-[#6b6b6b] mt-1">
            GSTIN in footer is pulled from <strong>Business name → GSTIN</strong> field above.
          </p>
        </Section>

        {/* ── Cloudflare Deploy Hook ─────────────────────────── */}
        <Section title="Auto-rebuild (Cloudflare deploy hook)">
          <p className="text-[11px] text-[#6b6b6b] mb-3">
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
              className={`${INP} bg-[#faf8f5] text-[#6b6b6b] cursor-default`}
            />
          </Field>
        </Section>

        {/* ── Flash Sale ────────────────────────────────────────── */}
        <Section title="Flash sale — countdown banner">
          <p className="text-[11px] text-[#6b6b6b] mb-4">
            When enabled, a site-wide countdown banner appears above the header. Set the end time in UTC.
            Create a matching coupon in <strong>Coupons → Add coupon</strong> for the actual discount.
          </p>
          <div className="flex items-center gap-3 mb-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                aria-label="Enable flash sale banner"
                checked={!!form.flash_sale_enabled}
                onChange={e => setForm(f => ({ ...DEFAULT_FORM, ...f, flash_sale_enabled: e.target.checked }))}
              />
              <div className="w-10 h-5 bg-[#e8e4e0] rounded-full peer peer-checked:bg-[#0a0a0a] transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
            </label>
            <span className="text-sm font-medium text-[#0a0a0a]">
              {form.flash_sale_enabled ? 'Banner active — shoppers can see it now' : 'Banner hidden'}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Sale headline">
              <input
                value={form.flash_sale_label ?? 'Flash Sale'}
                onChange={e => set('flash_sale_label', e.target.value)}
                placeholder="Flash Sale"
                className={INP}
              />
            </Field>
            <Field label="Discount % (shown in banner)">
              <input
                type="number"
                min={1}
                max={90}
                value={form.flash_sale_discount_pct ?? 20}
                onChange={e => set('flash_sale_discount_pct', parseInt(e.target.value || '20', 10))}
                className={INP}
                placeholder="20"
              />
            </Field>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Sale ends at (UTC) — ISO 8601">
              <input
                type="datetime-local"
                value={form.flash_sale_end_time ? form.flash_sale_end_time.slice(0, 16) : ''}
                onChange={e => set('flash_sale_end_time', e.target.value ? e.target.value + ':00Z' : '')}
                className={INP}
              />
            </Field>
            <Field label="Coupon code (optional — shoppers copy this)">
              <input
                value={form.flash_sale_coupon ?? ''}
                onChange={e => set('flash_sale_coupon', e.target.value.toUpperCase())}
                placeholder="FLASH20"
                className={`${INP} font-mono`}
              />
            </Field>
          </div>
          <p className="text-[11px] text-[#6b6b6b] mt-1">
            The banner auto-hides when the countdown reaches zero (no deploy needed). Shoppers can also dismiss it.
          </p>
        </Section>

        {/* ── Security / 2FA ─────────────────────────────────── */}
        <Section title="Security — Two-factor authentication (2FA)">
          <TwoFactorSection />
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
      <label className="block">
        <span className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1.5">{label}</span>
        {children}
      </label>
    </div>
  )
}
