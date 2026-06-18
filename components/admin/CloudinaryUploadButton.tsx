'use client'
import { useRef, useState } from 'react'
import { Paperclip } from 'lucide-react'
import { uploadImage, uploadAdminMedia } from '@/lib/api/upload'

interface Props {
  folder?: string
  onUploaded: (url: string) => void
  accept?: string
  label?: string
  className?: string
  /** Use the admin-media endpoint (supports videos). Default: false (image only). */
  mediaUpload?: boolean
}

export default function CloudinaryUploadButton({
  folder = 'general',
  onUploaded,
  accept = 'image/*,video/*',
  label = 'Upload',
  className = '',
  mediaUpload = false,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError(null)
    try {
      const { url } = mediaUpload
        ? await uploadAdminMedia(file, folder)
        : await uploadImage(file, folder)
      onUploaded(url)
    } catch (err: any) {
      setError(err?.message || 'Upload failed')
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <span className={`inline-flex flex-col items-start ${className}`}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="shrink-0 px-3 py-2 text-[10px] font-sans tracking-widest uppercase bg-[#faf8f5] border border-[#e8e4e0] text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white transition-colors disabled:opacity-50 whitespace-nowrap"
      >
        {uploading ? '…' : <><Paperclip size={11} className="inline mr-1" aria-hidden={true} />{label}</>}
      </button>
      {error && <span role="alert" className="text-[10px] text-red-600 mt-0.5">{error}</span>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        aria-label={label}
        className="hidden"
      />
    </span>
  )
}
