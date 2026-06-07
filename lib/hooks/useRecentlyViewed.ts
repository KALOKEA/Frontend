'use client'
import { useEffect, useState } from 'react'

export interface RecentItem {
  id: string
  slug: string
  name: string
  base_price: number
  image?: string
}

const KEY = 'kalokea-recently-viewed'
const MAX = 6

function readStore(): RecentItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]')
  } catch {
    return []
  }
}

/** Call this when a user views a product page. Safe to call on SSR (no-ops). */
export function addRecentlyViewed(item: RecentItem): void {
  if (typeof window === 'undefined') return
  try {
    const current = readStore().filter((i) => i.id !== item.id)
    localStorage.setItem(KEY, JSON.stringify([item, ...current].slice(0, MAX)))
  } catch {}
}

/**
 * Returns the recently viewed list, excluding `excludeId` (the current product).
 * Returns empty array during SSR.
 */
export function useRecentlyViewed(excludeId?: string): RecentItem[] {
  const [items, setItems] = useState<RecentItem[]>([])

  useEffect(() => {
    const all = readStore()
    setItems(excludeId ? all.filter((i) => i.id !== excludeId) : all)
  }, [excludeId])

  return items
}
