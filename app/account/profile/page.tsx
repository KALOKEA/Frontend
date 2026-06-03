'use client'
import { useState } from 'react'
import { useAuthStore } from '@/lib/store/useAuthStore'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import api from '@/lib/api/client'
import { useToast } from '@/components/ui/Toast'

export default function ProfilePage() {
  const { user, setAuth, accessToken } = useAuthStore()
  const { toast } = useToast()
  const [name, setName] = useState(user?.name || '')
  const [loading, setLoading] = useState(false)

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updated = await api.patch<{ id: string; name: string; email?: string; phone?: string; role: string }>('/users/me', { name })
      if (user && accessToken) setAuth(accessToken, { ...user, name: updated.name })
      toast('Profile updated')
    } catch {
      toast('Failed to update profile', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="font-serif text-2xl text-[#0a0a0a] mb-6">My Profile</h2>
      <form onSubmit={save} className="max-w-md space-y-4">
        <Input label="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Email" value={user?.email || ''} disabled className="opacity-60 cursor-not-allowed" />
        <Input label="Phone" value={user?.phone || ''} disabled className="opacity-60 cursor-not-allowed" />
        <Button type="submit" loading={loading}>Save Changes</Button>
      </form>
    </div>
  )
}
