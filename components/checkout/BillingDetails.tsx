'use client'
import { INDIAN_STATES } from '@/lib/api/settings'
import type { Address } from '@/lib/api/addresses'

export interface BillingForm {
  first_name: string
  last_name: string
  company: string
  line1: string
  line2: string
  city: string
  state: string
  pincode: string
  phone: string
  email: string
  gst_invoice: boolean
  gstin: string
}

export const emptyBilling: BillingForm = {
  first_name: '', last_name: '', company: '', line1: '', line2: '',
  city: '', state: '', pincode: '', phone: '', email: '',
  gst_invoice: false, gstin: '',
}

/** Map a saved address into the billing form (for quick-fill). */
export function billingFromAddress(a: Address, email = ''): BillingForm {
  const [first, ...rest] = (a.name || '').split(' ')
  return {
    first_name: first || '', last_name: rest.join(' '),
    company: '', line1: a.line1 || '', line2: a.line2 || '',
    city: a.city || '', state: a.state || '', pincode: a.pincode || '',
    phone: a.phone || '', email, gst_invoice: false, gstin: '',
  }
}

export default function BillingDetails({
  value,
  onChange,
  savedAddresses = [],
  showEmail = false,
}: {
  value: BillingForm
  onChange: (v: BillingForm) => void
  savedAddresses?: Address[]
  showEmail?: boolean
}) {
  const set = (k: keyof BillingForm, v: string | boolean) => onChange({ ...value, [k]: v })

  return (
    <div className="space-y-4">
      {savedAddresses.length > 0 && (
        <label className="flex flex-col gap-1">
          <span className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b]">Use a saved address</span>
          <select
            onChange={(e) => {
              const a = savedAddresses.find((x) => x.id === e.target.value)
              if (a) onChange({ ...billingFromAddress(a, value.email), gst_invoice: value.gst_invoice, gstin: value.gstin })
            }}
            defaultValue=""
            className="inp"
          >
            <option value="">Enter details manually</option>
            {savedAddresses.map((a) => (
              <option key={a.id} value={a.id}>{a.name} — {a.line1}, {a.city}</option>
            ))}
          </select>
        </label>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <F label="First name" req><input value={value.first_name} onChange={(e) => set('first_name', e.target.value)} className="inp" /></F>
        <F label="Last name" req><input value={value.last_name} onChange={(e) => set('last_name', e.target.value)} className="inp" /></F>
      </div>

      <F label="Company name (optional)"><input value={value.company} onChange={(e) => set('company', e.target.value)} className="inp" /></F>

      <F label="Country / Region" req>
        <input value="India" disabled className="inp bg-[#faf8f5] text-[#6b6b6b]" />
      </F>

      <F label="Street address" req>
        <input value={value.line1} onChange={(e) => set('line1', e.target.value)} placeholder="House number and street name" className="inp mb-2" />
        <input value={value.line2} onChange={(e) => set('line2', e.target.value)} placeholder="Apartment, suite, etc. (optional)" className="inp" />
      </F>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <F label="Town / City" req><input value={value.city} onChange={(e) => set('city', e.target.value)} className="inp" /></F>
        <F label="State" req>
          <select value={value.state} onChange={(e) => set('state', e.target.value)} className="inp">
            <option value="">Select state</option>
            {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </F>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <F label="Postcode / PIN" req>
          <input value={value.pincode} onChange={(e) => set('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} inputMode="numeric" className="inp" />
        </F>
        <F label="Phone" req>
          <input value={value.phone} onChange={(e) => set('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} inputMode="numeric" className="inp" />
        </F>
      </div>

      {showEmail && (
        <F label="Email address" req>
          <input type="email" value={value.email} onChange={(e) => set('email', e.target.value)} className="inp" />
        </F>
      )}

      <div className="border-t border-[#e8e4e0] pt-4">
        <label className="flex items-center gap-2 text-sm text-[#0a0a0a] cursor-pointer">
          <input type="checkbox" checked={value.gst_invoice} onChange={(e) => set('gst_invoice', e.target.checked)} className="accent-[#7C4A2D]" />
          I want a GST invoice (business purchase)
        </label>
        {value.gst_invoice && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <F label="Company name" req><input value={value.company} onChange={(e) => set('company', e.target.value)} className="inp" /></F>
            <F label="GSTIN" req><input value={value.gstin} onChange={(e) => set('gstin', e.target.value.toUpperCase())} placeholder="22AAAAA0000A1Z5" className="inp" /></F>
          </div>
        )}
      </div>

    </div>
  )
}

// Implicit label association: <label> wraps both the label text and children,
// so clicking the label or screen-reader focus on the input reads the label text.
// WCAG 1.3.1 (Info and Relationships, Level A).
function F({ label, req, children }: { label: string; req?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="flex flex-col gap-1">
        <span className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b]">
          {label}{req && <span className="text-[#c0392b]" aria-hidden="true"> *</span>}
          {req && <span className="sr-only"> (required)</span>}
        </span>
        {children}
      </label>
    </div>
  )
}
