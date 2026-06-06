// This file exists only to satisfy Next.js output:'export' dynamic-route requirement.
// The actual order detail UI lives at /admin/order-detail?id=<uuid>
// so this shell redirects client-side immediately.
'use client'
import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export function generateStaticParams() {
  // Static export requires this. Returns empty — no pages pre-built.
  // Cloudflare Pages _redirects routes /admin/orders/:id/ here.
  return []
}

export default function AdminOrderIdRedirect() {
  const { id } = useParams<{ id: string }>()
  const router  = useRouter()
  useEffect(() => {
    if (id) router.replace(`/admin/order-detail?id=${id}`)
    else    router.replace('/admin/orders')
  }, [id, router])
  return null
}
