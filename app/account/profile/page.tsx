'use client'
import { useState } from 'react'
import { useAuthStore } from '@/lib/store/useAuthStore'
import api from '@/lib/api/client'
import { useToast } from '@/components/ui/Toast'

export default function ProfilePage() {
  const { user, setAuth, accessToken } = useAuthStore()
  const { toast } = useToast()
  const [name, setName]     = useState(user?.name || '')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved]   = useState(false)

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setSaved(false)
    try {
      const updated = await api.patch<{ id: string; name: string; email?: string; phone?: string; role: string }>(
        '/users/me', { name }
      )
      if (user && accessToken) setAuth(accessToken, { ...user, name: updated.name })
      setSaved(true)
      toast('Profile updated')
      setTimeout(() => setSaved(false), 3000)
    } catch {
      toast('Failed to update profile', 'error')
    } finally {
      setLoading(false)
    }
  }

  const initials = (n?: string, e?: string) => {
    if (n) {
      const parts = n.trim().split(/\s+/)
      return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : parts[0].slice(0, 2).toUpperCase()
    }
    return e?.[0]?.toUpperCase() || '?'
  }

  return (
    <div>
      <h2 className="font-serif text-2xl text-[#0a0a0a] mb-6">My Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Avatar card */}
        <div className="bg-white border border-[#e8e4e0] p-6 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-[#0a0a0a] flex items-center justify-center text-white font-serif text-2xl mb-4">
            {initials(user?.name, user?.email || user?.phone)}
          </div>
          <p className="font-serif text-lg text-[#0a0a0a] mb-1">{user?.name || 'Your Name'}</p>
          <p className="text-[11px] text-[#9b9b9b] truncate max-w-full">
            {user?.email || user?.phone || ''}
          </p>
          {(user as any)?.created_at && (
            <p className="text-[10px] uppercase tracking-widest text-[#7C4A2D] mt-2">
              Member since {new Date((user as any).created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
            </p>
          )}
        </div>

        {/* Edit form */}
        <div className="md:col-span-2 bg-white border border-[#e8e4e0] p-6">
          <h3 className="text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-5 pb-3 border-b border-[#f0ece8]">
            Personal information
          </h3>
          <form onSubmit={save} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Full name</label>
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full border border-[#e8e4e0] px-4 py-2.5 text-sm focus:border-[#0a0a0a] outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Email address</label>
              <input
                value={user?.email || ''}
                disabled
                className="w-full border border-[#f0ece8] bg-[#faf8f5] px-4 py-2.5 text-sm text-[#9b9b9b] cursor-not-allowed"
              />
              <p className="text-[11px] text-[#7C4A2D] mt-1">Email cannot be changed — it is your login identity.</p>
            </div>

            {user?.phone && (
              <div>
                <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">Phone</label>
                <input
                  value={user.phone}
                  disabled
                  className="w-full border border-[#f0ece8] bg-[#faf8f5] px-4 py-2.5 text-sm text-[#9b9b9b] cursor-not-allowed"
                />
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 text-sm bg-[#0a0a0a] text-white hover:bg-[#333] disabled:opacity-50 transition-colors"
              >
                {loading ? 'Saving…' : 'Save changes'}
              </button>
              {saved && (
                <span className="flex items-center gap-1.5 text-sm text-green-600">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                  Saved
                </span>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Security note */}
      <div className="mt-5 bg-white border border-[#e8e4e0] p-5">
        <h3 className="text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-3">Security</h3>
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <div>
            <p className="text-sm text-[#0a0a0a] mb-1">Your account is secured with OTP authentication</p>
            <p className="text-[11px] text-[#9b9b9b] leading-relaxed">
              Every login requires a one-time code sent to your email or phone. No password is stored. To change your login email or phone, contact support.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
