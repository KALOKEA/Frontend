'use client'
// Reuses ImageUploader logic, scoped to banner uploads
import ImageUploader from './ImageUploader'

interface BannerUploaderProps {
  url: string
  onChange: (url: string) => void
}

export default function BannerUploader({ url, onChange }: BannerUploaderProps) {
  return (
    <ImageUploader
      images={url ? [{ url, is_primary: true }] : []}
      onChange={(imgs) => onChange(imgs[0]?.url || '')}
    />
  )
}
