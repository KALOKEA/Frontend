'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SlugRedirect({ slug }: { slug: string }) {
  const router = useRouter()
  useEffect(() => {
    router.replace(`/product?slug=${slug}`)
  }, [slug, router])
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-8 h-8 border-2 border-[#e8e4e0] border-t-[#c8a4a5] rounded-full animate-spin" />
    </div>
  )
}
