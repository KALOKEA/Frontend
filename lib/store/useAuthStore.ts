'use client'
import { create } from 'zustand'
import { setAccessToken } from '@/lib/api/client'

interface User {
  id: string
  name?: string
  email?: string
  phone?: string
  role: string
}

interface AuthStore {
  user: User | null
  accessToken: string | null
  isLoggedIn: boolean
  // True once the on-load session restore (AuthBootstrap) has settled, whether
  // it succeeded or not. Guarded pages should wait for this before redirecting,
  // otherwise an admin/customer is bounced to /login on every hard refresh.
  hydrated: boolean
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
  setHydrated: (v: boolean) => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  isLoggedIn: false,
  hydrated: false,

  setAuth: (token, user) => {
    setAccessToken(token)
    set({ user, accessToken: token, isLoggedIn: true })
  },

  clearAuth: () => {
    setAccessToken(null)
    set({ user: null, accessToken: null, isLoggedIn: false })
  },

  setHydrated: (v) => set({ hydrated: v }),
}))
