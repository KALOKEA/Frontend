'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { useAuthStore } from '@/lib/store/useAuthStore'

interface ImageUploaderProps {
  images: { url: string; is_primary?: boolean }[]
  onChange: (images: { url: string; is_primary?: boolean }[]) => void
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    try {
      const token = useAuthStore.getState().accessToken
      const results = await Promise.all(files.map(async (file) => {
        const form = new FormData()
        form.append('file', file)
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/upload/image`, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: form,
        })
        const json = await res.json()
        return { url: json.data?.url || json.url }
      }))
      onChange([...images, ...results])
    } finally {
      setUploading(false)
    }
  }

  const remove = (url: string) => onChange(images.filter((i) => i.url !== url))
  const setPrimary = (url: string) => onChange(images.map((i) => ({ ...i, is_primary: i.url === url })))

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {images.map((img) => (
          <div key={img.url} className="relative w-20 h-24 border border-[#e8e4e0]">
            <Image src={img.url} alt="" fill className="object-cover" sizes="80px" />
            {img.is_primary && (
              <span className="absolute bottom-0 left-0 right-0 bg-[#c8a4a5] text-white text-[8px] text-center py-0.5">Primary</span>
            )}
            <button onClick={() => remove(img.url)} className="absolute top-1 right-1 bg-white/90 w-5 h-5 flex items-center justify-center text-red-500 text-xs">×</button>
            {!img.is_primary && (
              <button onClick={() => setPrimary(img.url)} className="absolute top-1 left-1 bg-white/90 text-[8px] px-1 py-0.5">Set Primary</button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-20 h-24 border border-dashed border-[#e8e4e0] flex flex-col items-center justify-center text-[#6b6b6b] hover:border-[#c8a4a5] hover:text-[#c8a4a5] transition-colors"
        >
          <span className="text-2xl">{uploading ? '...' : '+'}</span>
          <span className="text-[9px] font-sans mt-1">Upload</span>
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={upload} className="hidden" />
    </div>
  )
}
