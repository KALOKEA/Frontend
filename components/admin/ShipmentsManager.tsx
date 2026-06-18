'use client'
import { X, Check, Package, Banknote, MapPin, ChevronUp, ChevronDown } from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import api from '@/lib/api/client'
import { adminApi } from '@/lib/api/admin'
import { formatPrice } from '@/lib/utils/formatPrice'
import Spinner from '@/components/ui/Spinner'

type TabFilter = 'all' | 'not_pushed' | 'in_transit' | 'delivered' | 'ndr' | 'cancelled'

const SR_STATUS_COLOR: Record<string, string> = {
  'not_pushed':         'bg-gray-100 text-gray-600',
  'Pending':            'bg-amber-100 text-amber-700',
  'Pickup Scheduled':   'bg-blue-100 text-blue-700',
  'In Transit':         'bg-indigo-100 text-indigo-700',
  'Out For Delivery':   'bg-purple-100 text-purple-700',
  'Delivered':          'bg-green-100 text-green-700',
  'Cancelled':          'bg-red-100 text-red-700',
  'RTO Initiated':      'bg-orange-100 text-orange-700',
  'RTO Delivered':      'bg-orange-200 text-orange-800',
  'NDR':                'bg-rose-100 text-rose-700',
}

// ─── Packaging profile picker modal ──────────────────────────────────────────

function ProfileManager({
  profiles, onClose, onCreated,
}: {
  profiles: any[]; onClose: () => void; onCreated: () => void
}) {
  const [form, setForm] = useState({ name: '', weight: '0.5', length: '20', breadth: '15', height: '5', is_default: false })
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  async function create() {
    if (!form.name.trim()) { setErr('Name is required'); return }
    setSaving(true); setErr('')
    try {
      await adminApi.createPackagingProfile({
        name: form.name, weight: parseFloat(form.weight), length: parseFloat(form.length),
        breadth: parseFloat(form.breadth), height: parseFloat(form.height), is_default: form.is_default,
      })
      onCreated()
    } catch (e: any) { setErr(e?.message || 'Failed') }
    finally { setSaving(false) }
  }

  async function del(id: string) {
    await adminApi.deletePackagingProfile(id); onCreated()
  }
  async function setDef(id: string) {
    await adminApi.setDefaultPackagingProfile(id); onCreated()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div aria-hidden="true" className="absolute inset-0 bg-black/40" />
      <div role="dialog" aria-modal="true" aria-label="Packaging Profiles" className="relative bg-white w-full max-w-md border border-[#e8e4e0] p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[11px] uppercase tracking-widest font-medium text-[#0a0a0a]">Packaging Profiles</p>
          <button onClick={onClose} aria-label="Close packaging profiles" className="text-[#6b6b6b] hover:text-[#0a0a0a] flex items-center justify-center"><X size={16} aria-hidden={true} /></button>
        </div>
        {/* Existing profiles */}
        {profiles.length > 0 && (
          <div className="mb-4 space-y-1.5">
            {profiles.map(p => (
              <div key={p.id} className="flex items-center justify-between p-2 bg-[#faf8f5] border border-[#e8e4e0] text-[11px]">
                <span className="font-medium text-[#0a0a0a]">
                  {p.name} {p.is_default && <span className="ml-1 text-[9px] bg-[#0a0a0a] text-white px-1.5 py-0.5 uppercase tracking-widest">Default</span>}
                </span>
                <span className="text-[#6b6b6b] mr-2">{p.weight}kg · {p.length}×{p.breadth}×{p.height}cm</span>
                <div className="flex gap-1.5">
                  {!p.is_default && (
                    <button onClick={() => setDef(p.id)} className="text-[9px] uppercase tracking-widest text-[#6b6b6b] hover:text-[#0a0a0a] border border-[#e8e4e0] px-1.5 py-0.5">Set Default</button>
                  )}
                  <button onClick={() => del(p.id)} className="text-[9px] uppercase tracking-widest text-red-500 hover:text-red-700 border border-red-200 px-1.5 py-0.5">Del</button>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Create new */}
        <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-2">New Profile</p>
        <input
          placeholder="Profile name (e.g. Small Box)" value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          className="w-full border border-[#e8e4e0] px-2 py-1.5 text-[11px] mb-2 outline-none focus:border-[#c8a4a5]"
        />
        <div className="grid grid-cols-4 gap-1.5 mb-2">
          {(['weight', 'length', 'breadth', 'height'] as const).map(k => (
            <div key={k}>
              <label htmlFor={`profile-${k}`} className="block text-[9px] uppercase tracking-widest text-[#6b6b6b] mb-0.5">{k}</label>
              <input
                id={`profile-${k}`}
                type="number" step="0.1" value={(form as any)[k]}
                onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                className="w-full border border-[#e8e4e0] px-1.5 py-1 text-[11px] outline-none focus:border-[#c8a4a5]"
              />
            </div>
          ))}
        </div>
        <label className="flex items-center gap-2 text-[11px] text-[#6b6b6b] mb-3 cursor-pointer">
          <input type="checkbox" checked={form.is_default} onChange={e => setForm(f => ({ ...f, is_default: e.target.checked }))} />
          Set as default
        </label>
        {err && <p role="alert" className="text-red-600 text-[11px] mb-2">{err}</p>}
        <button
          onClick={create} disabled={saving}
          className="w-full py-2 bg-[#0a0a0a] text-white text-[10px] uppercase tracking-widest hover:bg-[#2a2a2a] disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Create Profile'}
        </button>
      </div>
    </div>
  )
}

// ─── Push form with packaging profile picker ──────────────────────────────────

function PushForm({ orderId, profiles, onDone }: { orderId: string; profiles: any[]; onDone: () => void }) {
  const def = profiles.find(p => p.is_default)
  const [weight, setWeight]   = useState(def ? String(def.weight)  : '0.5')
  const [length, setLength]   = useState(def ? String(def.length)  : '20')
  const [breadth, setBreadth] = useState(def ? String(def.breadth) : '15')
  const [height, setHeight]   = useState(def ? String(def.height)  : '5')
  const [loading, setLoading] = useState(false)
  const [err, setErr]         = useState('')

  function applyProfile(id: string) {
    const p = profiles.find(x => x.id === id)
    if (!p) return
    setWeight(String(p.weight)); setLength(String(p.length))
    setBreadth(String(p.breadth)); setHeight(String(p.height))
  }

  async function submit() {
    setLoading(true); setErr('')
    try {
      await adminApi.pushToShiprocket(orderId, {
        weight: parseFloat(weight) || 0.5, length: parseFloat(length) || 20,
        breadth: parseFloat(breadth) || 15, height: parseFloat(height) || 5,
      })
      onDone()
    } catch (e: any) { setErr(e?.message || 'Failed to push'); setLoading(false) }
  }

  return (
    <div className="mt-2 p-3 bg-[#faf8f5] border border-[#e8e4e0] text-[11px]">
      {profiles.length > 0 && (
        <div className="mb-2">
          <label className="block text-[#6b6b6b] mb-0.5">Use saved profile</label>
          <select onChange={e => applyProfile(e.target.value)} className="border border-[#e8e4e0] px-2 py-1 text-[11px] bg-white outline-none">
            <option value="">— Select profile —</option>
            {profiles.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.weight}kg · {p.length}×{p.breadth}×{p.height}cm){p.is_default ? ' (Default)' : ''}</option>
            ))}
          </select>
        </div>
      )}
      <p className="font-medium text-[#0a0a0a] mb-2 uppercase tracking-widest">Package Dimensions</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
        {[
          ['Weight (kg)', weight, setWeight],
          ['Length (cm)', length, setLength],
          ['Breadth (cm)', breadth, setBreadth],
          ['Height (cm)', height, setHeight],
        ].map(([label, val, set]: any) => (
          <div key={label}>
            <label className="block text-[#6b6b6b] mb-0.5">{label}</label>
            <input type="number" step="0.1" value={val} onChange={e => set(e.target.value)}
              className="w-full border border-[#e8e4e0] px-2 py-1 text-[11px] outline-none focus:border-[#c8a4a5]" />
          </div>
        ))}
      </div>
      {err && <p role="alert" className="text-red-600 mb-2">{err}</p>}
      <div className="flex gap-2">
        <button onClick={submit} disabled={loading}
          className="px-4 py-1.5 bg-[#0a0a0a] text-white text-[10px] uppercase tracking-widest hover:bg-[#2a2a2a] disabled:opacity-50">
          {loading ? 'Pushing…' : 'Push to ShipRocket'}
        </button>
        <button onClick={onDone} className="px-4 py-1.5 border border-[#e8e4e0] text-[10px] uppercase tracking-widest text-[#6b6b6b] hover:text-[#0a0a0a]">
          Cancel
        </button>
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ShipmentsManager() {
  const [orders, setOrders]             = useState<any[]>([])
  const [loading, setLoading]           = useState(true)
  const [filter, setFilter]             = useState<TabFilter>('all')
  const [pushingId, setPushingId]       = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [tracking, setTracking]         = useState<Record<string, any>>({})
  const [msg, setMsg]                   = useState<{ id: string; type: 'ok' | 'err'; text: string } | null>(null)
  const [selected, setSelected]         = useState<Set<string>>(new Set())
  const [bulkMsg, setBulkMsg]           = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [bulkLoading, setBulkLoading]   = useState(false)
  const [syncMsg, setSyncMsg]           = useState<string | null>(null)
  const [syncLoading, setSyncLoading]   = useState(false)
  const [ndrs, setNdrs]                 = useState<any[]>([])
  const [ndrsLoaded, setNdrsLoaded]     = useState(false)
  const [profiles, setProfiles]         = useState<any[]>([])
  const [showProfileMgr, setShowProfileMgr] = useState(false)
  const [remittance, setRemittance]     = useState<any>(null)
  const [showRemittance, setShowRemittance] = useState(false)
  const [remLoading, setRemLoading]     = useState(false)
  const [pincode, setPincode]           = useState('')
  const [pinResult, setPinResult]       = useState<any>(null)
  const [pinLoading, setPinLoading]     = useState(false)
  const [showServiceability, setShowServiceability] = useState(false)

  const load = useCallback(async () => {
    try {
      const r = await api.get<any>('/orders?limit=200')
      setOrders((r as any).data || [])
    } catch { setOrders([]) }
    finally { setLoading(false) }
  }, [])

  const loadProfiles = useCallback(async () => {
    try { setProfiles(await adminApi.getPackagingProfiles()) } catch {}
  }, [])

  useEffect(() => { load(); loadProfiles() }, [load, loadProfiles])

  // ─── Derived counts ─────────────────────────────────────────────────────────

  const notPushedCount  = orders.filter(o => !o.shiprocket_order_id).length
  const inTransitCount  = orders.filter(o => ['Pending','Pickup Scheduled','In Transit','Out For Delivery'].includes(o.shiprocket_status)).length
  const deliveredToday  = orders.filter(o => {
    if (o.shiprocket_status !== 'Delivered') return false
    const d = new Date(o.updated_at || o.created_at)
    const today = new Date()
    return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
  }).length
  const ndrCount = orders.filter(o => o.ndr_reason || o.shiprocket_status === 'NDR').length

  const filtered = orders.filter(o => {
    if (filter === 'all')        return true
    if (filter === 'not_pushed') return !o.shiprocket_order_id
    if (filter === 'in_transit') return ['Pending','Pickup Scheduled','In Transit','Out For Delivery'].includes(o.shiprocket_status)
    if (filter === 'delivered')  return o.shiprocket_status === 'Delivered'
    if (filter === 'ndr')        return o.ndr_reason || o.shiprocket_status === 'NDR'
    if (filter === 'cancelled')  return o.shiprocket_status === 'Cancelled'
    return true
  })

  // ─── Selection helpers ───────────────────────────────────────────────────────

  function toggleSelect(id: string) {
    setSelected(prev => {
      const n = new Set(prev)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }
  function selectAll() {
    if (selected.size === filtered.length) { setSelected(new Set()); return }
    setSelected(new Set(filtered.map(o => o.id)))
  }

  // ─── Actions ─────────────────────────────────────────────────────────────────

  async function doAction(orderId: string, action: () => Promise<any>, successMsg: string) {
    setActionLoading(orderId); setMsg(null)
    try {
      await action()
      setMsg({ id: orderId, type: 'ok', text: successMsg })
      await load()
    } catch (e: any) {
      setMsg({ id: orderId, type: 'err', text: e?.message || 'Action failed' })
    } finally { setActionLoading(null) }
  }

  async function handleLabel(orderId: string) {
    setActionLoading(orderId); setMsg(null)
    try {
      const res = await adminApi.generateLabel(orderId)
      const url = (res as any)?.data?.label_url || (res as any)?.label_url
      if (url) window.open(url, '_blank', 'noopener,noreferrer')
      else setMsg({ id: orderId, type: 'err', text: 'Label URL not returned by ShipRocket' })
      await load()
    } catch (e: any) {
      setMsg({ id: orderId, type: 'err', text: e?.message || 'Label failed' })
    } finally { setActionLoading(null) }
  }

  async function handleTrack(orderId: string) {
    setActionLoading(orderId)
    try {
      const data = await adminApi.trackShipment(orderId)
      setTracking(prev => ({ ...prev, [orderId]: data }))
    } catch (e: any) {
      setMsg({ id: orderId, type: 'err', text: `Track failed: ${e?.message}` })
    } finally { setActionLoading(null) }
  }

  async function handleSyncAll() {
    setSyncLoading(true); setSyncMsg(null)
    try {
      const res = await adminApi.syncTracking()
      const count = (res as any)?.updated ?? 0
      setSyncMsg(`Updated ${count} order${count !== 1 ? 's' : ''}`)
      await load()
    } catch (e: any) { setSyncMsg(`Sync failed: ${e?.message}`) }
    finally { setSyncLoading(false) }
  }

  async function handleBulkPush() {
    const ids = Array.from(selected)
    if (!ids.length) return
    setBulkLoading(true); setBulkMsg(null)
    let ok = 0, fail = 0
    for (const id of ids) {
      try { await adminApi.pushToShiprocket(id, { weight: 0.5, length: 20, breadth: 15, height: 5 }); ok++ }
      catch { fail++ }
    }
    setBulkMsg({ type: fail > 0 ? 'err' : 'ok', text: `Pushed ${ok} orders${fail > 0 ? `, ${fail} failed` : ''}` })
    setSelected(new Set()); setBulkLoading(false); await load()
  }

  async function handleBulkManifest() {
    const shipIds = Array.from(selected)
      .map(id => orders.find(o => o.id === id)?.shiprocket_shipment_id)
      .filter(Boolean) as number[]
    if (!shipIds.length) { setBulkMsg({ type: 'err', text: 'No pushed orders selected' }); return }
    setBulkLoading(true); setBulkMsg(null)
    try {
      const res = await adminApi.generateManifest(shipIds)
      const url = (res as any)?.manifest_url
      if (url) window.open(url, '_blank', 'noopener,noreferrer')
      setBulkMsg({ type: 'ok', text: 'Manifest generated' })
    } catch (e: any) { setBulkMsg({ type: 'err', text: e?.message || 'Manifest failed' }) }
    finally { setBulkLoading(false) }
  }

  async function handleBulkSync() {
    setBulkLoading(true); setBulkMsg(null)
    try {
      const res = await adminApi.syncTracking()
      setBulkMsg({ type: 'ok', text: `Synced tracking (${(res as any)?.updated ?? 0} updated)` })
      await load()
    } catch (e: any) { setBulkMsg({ type: 'err', text: e?.message || 'Sync failed' }) }
    finally { setBulkLoading(false) }
  }

  async function loadNdrs() {
    if (ndrsLoaded) return
    try { setNdrs((await adminApi.getNdrs()) || []); setNdrsLoaded(true) } catch {}
  }

  async function handleNdrAction(shipmentId: string, action: 'reAttempt' | 'return') {
    setActionLoading(shipmentId)
    try {
      await adminApi.ndrAction(shipmentId, action, '')
      setMsg({ id: shipmentId, type: 'ok', text: action === 'reAttempt' ? 'Re-attempt scheduled' : 'Return initiated' })
      await load()
    } catch (e: any) {
      setMsg({ id: shipmentId, type: 'err', text: e?.message || 'NDR action failed' })
    } finally { setActionLoading(null) }
  }

  async function loadRemittance() {
    setRemLoading(true)
    try { setRemittance(await adminApi.getCodRemittance()) }
    catch (e: any) { setRemittance({ error: e?.message }) }
    finally { setRemLoading(false) }
  }

  async function checkServiceability() {
    if (!pincode || pincode.length !== 6) return
    setPinLoading(true); setPinResult(null)
    try { setPinResult(await adminApi.getServiceability(pincode)) }
    catch (e: any) { setPinResult({ error: e?.message || 'Check failed' }) }
    finally { setPinLoading(false) }
  }

  const TAB_LABELS: { key: TabFilter; label: string; badge?: number }[] = [
    { key: 'all',        label: 'All' },
    { key: 'not_pushed', label: 'Not Pushed', badge: notPushedCount },
    { key: 'in_transit', label: 'In Transit' },
    { key: 'delivered',  label: 'Delivered' },
    { key: 'ndr',        label: 'NDR', badge: ndrCount },
    { key: 'cancelled',  label: 'Cancelled' },
  ]

  return (
    <div>
      {showProfileMgr && (
        <ProfileManager
          profiles={profiles}
          onClose={() => setShowProfileMgr(false)}
          onCreated={() => { loadProfiles(); setShowProfileMgr(false) }}
        />
      )}

      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h1 className="font-serif text-2xl text-[#0a0a0a]">Shipments</h1>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleSyncAll} disabled={syncLoading}
            className="text-[11px] uppercase tracking-widest text-white bg-[#0a0a0a] hover:bg-[#2a2a2a] px-3 py-1.5 disabled:opacity-50"
          >
            {syncLoading ? 'Syncing…' : '↻ Sync Tracking'}
          </button>
          <button
            onClick={() => { setLoading(true); load() }}
            className="text-[11px] uppercase tracking-widest text-[#6b6b6b] hover:text-[#0a0a0a] border border-[#e8e4e0] px-3 py-1.5"
          >
            ↻ Refresh
          </button>
        </div>
      </div>
      {syncMsg && (
        <div className="mb-4 px-3 py-2 text-[11px] bg-blue-50 text-blue-700 border border-blue-200">{syncMsg}</div>
      )}

      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Pending Push',     value: notPushedCount, color: 'bg-amber-50 border-amber-200 text-amber-800' },
          { label: 'In Transit',       value: inTransitCount, color: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
          { label: 'Delivered Today',  value: deliveredToday, color: 'bg-green-50 border-green-200 text-green-800' },
          { label: 'NDR Pending',      value: ndrCount,       color: 'bg-rose-50 border-rose-200 text-rose-800' },
        ].map(c => (
          <div key={c.label} className={`border rounded p-3 ${c.color}`}>
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-[10px] uppercase tracking-widest mt-0.5 opacity-75">{c.label}</p>
          </div>
        ))}
      </div>

      {/* ── Bulk action toolbar ── */}
      {selected.size > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-2 bg-[#0a0a0a] text-white px-4 py-2.5">
          <span className="text-[11px] uppercase tracking-widest">{selected.size} selected</span>
          <button
            onClick={handleBulkPush} disabled={bulkLoading}
            className="ml-2 px-3 py-1 bg-white text-[#0a0a0a] text-[10px] uppercase tracking-widest hover:bg-[#f0ece8] disabled:opacity-50"
          >Push Selected</button>
          <button
            onClick={handleBulkManifest} disabled={bulkLoading}
            className="px-3 py-1 bg-white text-[#0a0a0a] text-[10px] uppercase tracking-widest hover:bg-[#f0ece8] disabled:opacity-50"
          >Generate Manifest</button>
          <button
            onClick={handleBulkSync} disabled={bulkLoading}
            className="px-3 py-1 bg-white text-[#0a0a0a] text-[10px] uppercase tracking-widest hover:bg-[#f0ece8] disabled:opacity-50"
          >Sync Tracking</button>
          <button onClick={() => setSelected(new Set())} className="ml-auto text-[10px] text-white/60 hover:text-white flex items-center gap-1"><X size={10} aria-hidden="true" /> Clear</button>
        </div>
      )}
      {bulkMsg && (
        <div className={`mb-4 px-3 py-2 text-[11px] border ${bulkMsg.type === 'ok' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
          {bulkMsg.text}
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="flex flex-wrap gap-1 mb-4">
        <label className="flex items-center gap-1.5 mr-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filtered.length > 0 && selected.size === filtered.length}
            onChange={selectAll}
            className="w-3.5 h-3.5"
          />
          <span className="text-[10px] text-[#6b6b6b] uppercase tracking-widest">All</span>
        </label>
        {TAB_LABELS.map(t => (
          <button
            key={t.key}
            onClick={() => { setFilter(t.key); if (t.key === 'ndr') loadNdrs() }}
            aria-pressed={filter === t.key}
            className={`px-3 py-1.5 text-[10px] uppercase tracking-widest border transition-colors ${
              filter === t.key
                ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]'
                : 'border-[#e8e4e0] text-[#6b6b6b] hover:text-[#0a0a0a] hover:border-[#0a0a0a]'
            }`}
          >
            {t.label}
            {t.badge != null && t.badge > 0 && (
              <span className="ml-1.5 bg-amber-400 text-[#0a0a0a] rounded-full px-1.5 text-[9px]">{t.badge}</span>
            )}
          </button>
        ))}
        <button
          onClick={() => setShowProfileMgr(true)}
          className="ml-auto px-3 py-1.5 text-[10px] uppercase tracking-widest border border-[#e8e4e0] text-[#6b6b6b] hover:text-[#0a0a0a] flex items-center gap-1.5"
        >
          <Package size={12} aria-hidden="true" /> Profiles</button>
      </div>

      {/* ── NDR Tab ── */}
      {filter === 'ndr' && (
        <div className="mb-6">
          {ndrs.length === 0 ? (
            <p className="text-[#6b6b6b] text-sm py-8 text-center">No NDRs found from ShipRocket.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[640px] w-full text-[11px]">
                <thead>
                  <tr className="border-b border-[#e8e4e0]">
                    {['Order', 'AWB', 'Courier', 'Reason', 'Our Action', 'Actions'].map(h => (
                      <th key={h} className="text-left py-2 pr-4 text-[#6b6b6b] font-medium uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ndrs.map((n: any, i: number) => (
                    <tr key={i} className="border-b border-[#f0ece8]">
                      <td className="py-2 pr-4 font-medium text-[#0a0a0a]">{n.order_id || '—'}</td>
                      <td className="py-2 pr-4 font-mono text-[#6b6b6b]">{n.awb || '—'}</td>
                      <td className="py-2 pr-4 text-[#6b6b6b]">{n.courier_name || '—'}</td>
                      <td className="py-2 pr-4 text-rose-700">{n.ndr_reason || '—'}</td>
                      <td className="py-2 pr-4 text-[#6b6b6b]">{n.ndr_action || '—'}</td>
                      <td className="py-2">
                        {n.shipment_id && (
                          <div className="flex gap-1.5">
                            <button
                              disabled={actionLoading === n.shipment_id}
                              onClick={() => handleNdrAction(String(n.shipment_id), 'reAttempt')}
                              className="px-2 py-1 text-[9px] uppercase tracking-widest bg-[#0a0a0a] text-white hover:bg-[#2a2a2a] disabled:opacity-50"
                            >Re-attempt</button>
                            <button
                              disabled={actionLoading === n.shipment_id}
                              onClick={() => handleNdrAction(String(n.shipment_id), 'return')}
                              className="px-2 py-1 text-[9px] uppercase tracking-widest border border-red-400 text-red-500 hover:bg-red-50 disabled:opacity-50"
                            >Return to Seller</button>
                          </div>
                        )}
                        {msg?.id === String(n.shipment_id) && (
                          <p className={`mt-1 text-[10px] ${msg.type === 'ok' ? 'text-green-700' : 'text-red-600'}`}>{msg.text}</p>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Orders list (all tabs except NDR) ── */}
      {filter !== 'ndr' && (
        loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-[#6b6b6b] text-sm">No orders found for this filter.</div>
        ) : (
          <div className="space-y-3">
            {filtered.map(order => {
              const inSR   = !!order.shiprocket_order_id
              const hasAwb = !!order.awb_code
              const isAL   = actionLoading === order.id
              const srStatus = order.shiprocket_status || (inSR ? 'Pending' : 'not_pushed')
              const activities: any[] = tracking[order.id]?.tracking_data?.shipment_track_activities || []
              const isSel  = selected.has(order.id)

              return (
                <div key={order.id} className={`bg-white border p-4 transition-colors ${isSel ? 'border-[#0a0a0a]' : 'border-[#e8e4e0]'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3 sm:justify-between">
                    {/* Checkbox + info */}
                    <div className="flex gap-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={isSel}
                        onChange={() => toggleSelect(order.id)}
                        aria-label={`Select order #${order.order_number}`}
                        className="mt-0.5 w-3.5 h-3.5 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-[#0a0a0a] text-sm">#{order.order_number}</span>
                          <span className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded ${SR_STATUS_COLOR[srStatus] || 'bg-gray-100 text-gray-600'}`}>
                            {srStatus === 'not_pushed' ? 'Not Pushed' : srStatus}
                          </span>
                          {order.awb_code && (
                            <span className="text-[10px] text-[#6b6b6b]">AWB: <span className="font-mono text-[#0a0a0a]">{order.awb_code}</span></span>
                          )}
                          {order.courier_name && (
                            <span className="text-[10px] text-[#6b6b6b]">{order.courier_name}</span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#6b6b6b] mt-0.5">
                          {order.users?.name || order.guest_email || '—'} · {formatPrice(order.total)} · {new Date(order.created_at).toLocaleDateString('en-IN')}
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-1.5 shrink-0 mt-2 sm:mt-0 ml-6 sm:ml-0">
                      {!inSR && (
                        <button
                          onClick={() => setPushingId(pushingId === order.id ? null : order.id)}
                          className="px-3 py-1.5 text-[10px] uppercase tracking-widest bg-[#0a0a0a] text-white hover:bg-[#2a2a2a]"
                        >Push to SR</button>
                      )}
                      {inSR && !hasAwb && (
                        <button disabled={isAL}
                          onClick={() => doAction(order.id, () => adminApi.assignAwb(order.id), 'AWB assigned')}
                          className="px-3 py-1.5 text-[10px] uppercase tracking-widest border border-[#0a0a0a] text-[#0a0a0a] hover:bg-[#faf8f5] disabled:opacity-50"
                        >Assign AWB</button>
                      )}
                      {hasAwb && (
                        <>
                          <button disabled={isAL}
                            onClick={() => doAction(order.id, () => adminApi.schedulePickup(order.id), 'Pickup scheduled')}
                            className="px-3 py-1.5 text-[10px] uppercase tracking-widest border border-[#e8e4e0] text-[#6b6b6b] hover:text-[#0a0a0a] hover:border-[#0a0a0a] disabled:opacity-50"
                          >Pickup</button>
                          <button disabled={isAL} onClick={() => handleLabel(order.id)}
                            className="px-3 py-1.5 text-[10px] uppercase tracking-widest border border-[#e8e4e0] text-[#6b6b6b] hover:text-[#0a0a0a] hover:border-[#0a0a0a] disabled:opacity-50"
                          >Label</button>
                          <button disabled={isAL} onClick={() => handleTrack(order.id)}
                            className="px-3 py-1.5 text-[10px] uppercase tracking-widest border border-[#e8e4e0] text-[#6b6b6b] hover:text-[#0a0a0a] hover:border-[#0a0a0a] disabled:opacity-50"
                          >{isAL ? '…' : 'Track'}</button>
                          <button disabled={isAL}
                            onClick={() => doAction(order.id, () => adminApi.cancelShipment(order.id), 'Shipment cancelled')}
                            className="px-3 py-1.5 text-[10px] uppercase tracking-widest border border-[#e8e4e0] text-red-500 hover:border-red-400 disabled:opacity-50"
                          >Cancel</button>
                        </>
                      )}
                      <Link href={`/admin/order-detail/?id=${order.id}`}
                        className="px-3 py-1.5 text-[10px] uppercase tracking-widest border border-[#e8e4e0] text-[#6b6b6b] hover:text-[#0a0a0a] hover:border-[#0a0a0a]"
                      >View</Link>
                    </div>
                  </div>

                  {/* Feedback */}
                  {msg && msg.id === order.id && (
                    <div className={`mt-2 px-3 py-2 text-[11px] border ${msg.type === 'ok' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                      {msg.text}
                    </div>
                  )}

                  {/* Push form */}
                  {pushingId === order.id && (
                    <PushForm orderId={order.id} profiles={profiles} onDone={() => { setPushingId(null); load() }} />
                  )}

                  {/* Tracking timeline */}
                  {activities.length > 0 && (
                    <div className="mt-3 border-t border-[#e8e4e0] pt-3">
                      <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] mb-2">Tracking Timeline</p>
                      <div className="space-y-1.5 max-h-40 overflow-y-auto">
                        {activities.map((a: any, i: number) => (
                          <div key={i} className="flex gap-3 text-[11px]">
                            <span className="text-[#6b6b6b] shrink-0 w-32">{a.date ? new Date(a.date).toLocaleString('en-IN', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' }) : '—'}</span>
                            <span className="text-[#0a0a0a]">{a.activity}</span>
                            {a.location && <span className="text-[#6b6b6b]">· {a.location}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )
      )}

      {/* ── COD Remittance ── */}
      <div className="mt-8 border border-[#e8e4e0]">
        <button
          type="button"
          className="flex items-center justify-between w-full p-4 text-left"
          onClick={() => { setShowRemittance(!showRemittance); if (!showRemittance && !remittance) loadRemittance() }}
          aria-expanded={showRemittance}
        >
          <p className="text-[11px] uppercase tracking-widest font-medium text-[#0a0a0a] flex items-center gap-1.5"><Banknote size={13} aria-hidden={true} /> COD Remittance</p>
          <span className="text-[#6b6b6b] text-xs flex items-center gap-1">{showRemittance ? <><ChevronUp size={12} aria-hidden="true" /> Hide</> : <><ChevronDown size={12} aria-hidden="true" /> Show</>}</span>
        </button>
        {showRemittance && (
          <div className="border-t border-[#e8e4e0] p-4">
            {remLoading && <div className="flex justify-center py-6"><Spinner size="sm" /></div>}
            {remittance?.error && <p className="text-red-600 text-sm">{remittance.error}</p>}
            {remittance && !remittance.error && (
              <div>
                {((remittance.data || remittance) as any[]).length === 0 ? (
                  <p className="text-[#6b6b6b] text-sm">No remittance records found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-[560px] w-full text-[11px]">
                      <thead>
                        <tr className="border-b border-[#e8e4e0]">
                          {['Remittance ID', 'Amount (₹)', 'Orders', 'Status', 'Expected Date'].map(h => (
                            <th key={h} className="text-left py-2 pr-4 text-[#6b6b6b] font-medium uppercase tracking-widest">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {((remittance.data || remittance) as any[]).slice(0, 20).map((r: any, i: number) => (
                          <tr key={i} className="border-b border-[#f0ece8]">
                            <td className="py-2 pr-4 font-mono text-[#0a0a0a]">{r.remittance_id || r.id || '—'}</td>
                            <td className="py-2 pr-4 text-[#0a0a0a]">₹{r.total_amount ?? r.amount ?? '—'}</td>
                            <td className="py-2 pr-4 text-[#6b6b6b]">{r.no_of_shipments ?? r.orders ?? '—'}</td>
                            <td className="py-2 pr-4">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase tracking-widest ${r.payment_status === 'COMPLETED' || r.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                {r.payment_status || r.status || '—'}
                              </span>
                            </td>
                            <td className="py-2 text-[#6b6b6b]">{r.remittance_date || r.expected_date || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Serviceability Checker ── */}
      <div className="mt-4 border border-[#e8e4e0]">
        <button type="button" className="flex items-center justify-between w-full p-4 text-left" onClick={() => setShowServiceability(!showServiceability)} aria-expanded={showServiceability}>
          <p className="text-[11px] uppercase tracking-widest font-medium text-[#0a0a0a] flex items-center gap-1.5"><MapPin size={13} aria-hidden={true} /> Pin Code Serviceability</p>
          <span className="text-[#6b6b6b] text-xs flex items-center gap-1">{showServiceability ? <><ChevronUp size={12} aria-hidden="true" /> Hide</> : <><ChevronDown size={12} aria-hidden="true" /> Show</>}</span>
        </button>
        {showServiceability && (
          <div className="border-t border-[#e8e4e0] p-4">
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <input
                type="text" maxLength={6} value={pincode}
                onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                onKeyDown={e => e.key === 'Enter' && checkServiceability()}
                placeholder="6-digit pin code"
                className="border border-[#e8e4e0] px-3 py-2 text-sm outline-none focus:border-[#c8a4a5] flex-1 min-w-0"
              />
              <button onClick={checkServiceability} disabled={pinLoading || pincode.length !== 6}
                className="px-4 py-2 bg-[#0a0a0a] text-white text-[10px] uppercase tracking-widest hover:bg-[#2a2a2a] disabled:opacity-50"
              >{pinLoading ? 'Checking…' : 'Check'}</button>
            </div>
            {pinResult && (pinResult.error ? (
              <p className="text-red-600 text-sm">{pinResult.error}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-[480px] w-full text-[11px]">
                  <thead>
                    <tr className="border-b border-[#e8e4e0]">
                      {['Courier','Est. Days','Rate (₹)','COD'].map(h => (
                        <th key={h} className="text-left py-1.5 pr-4 text-[#6b6b6b] font-medium uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(pinResult.data?.available_courier_companies || []).slice(0, 10).map((c: any, i: number) => (
                      <tr key={i} className="border-b border-[#f0ece8]">
                        <td className="py-1.5 pr-4 font-medium text-[#0a0a0a]">{c.courier_name}</td>
                        <td className="py-1.5 pr-4 text-[#6b6b6b]">{c.estimated_delivery_days ?? '—'}</td>
                        <td className="py-1.5 pr-4 text-[#6b6b6b]">₹{c.rate ?? '—'}</td>
                        <td className="py-1.5 text-[#6b6b6b]">
                          {c.cod === 1
                            ? <span className="text-green-600 flex items-center gap-0.5"><Check size={12} aria-hidden={true} /> Yes</span>
                            : <span className="text-red-400 flex items-center gap-0.5"><X size={12} aria-hidden={true} /> No</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
