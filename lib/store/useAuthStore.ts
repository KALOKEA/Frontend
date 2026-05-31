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
  setAuth: (token: string, user: User) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  isLoggedIn: false,

  setAuth: (token, user) => {
    setAccessToken(token)
    set({ user, accessToken: token, isLoggedIn: true })
  },

  clearAuth: () => {
    setAccessToken(null)
    set({ user: null, accessToken: null, isLoggedIn: false })
  },
}))
