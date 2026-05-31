'use client'
import { useEffect } from 'react'
import { useAuthStore } from '@/lib/store/useAuthStore'
import { authApi } from '@/lib/api/auth'

export function useAuthInit() {
  const { setAuth, clearAuth } = useAuthStore()

  useEffect(() => {
    authApi.refresh()
      .then((res) => {
        return authApi.me().then((user) => {
          setAuth(res.access_token, user)
        })
      })
      .catch(() => clearAuth())
  }, [setAuth, clearAuth])
}
