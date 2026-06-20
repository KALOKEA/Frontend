import { getAccessToken, BASE_URL } from './client'

export interface UploadResult {
  url: string
  public_id: string
}

/** Upload an image file to Cloudinary via the backend (admin). */
export async function uploadImage(file: File, folder = 'products'): Promise<UploadResult> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${BASE_URL}/upload/image?folder=${encodeURIComponent(folder)}`, {
    method: 'POST',
    headers: getAccessToken() ? { Authorization: `Bearer ${getAccessToken()}` } : {},
    credentials: 'include',
    body: form,
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message || 'Upload failed')
  return json.data !== undefined ? json.data : json
}

/** Admin: upload image OR video for homepage/editorial/hero (uses /upload/admin-media endpoint). */
export async function uploadAdminMedia(file: File, folder = 'homepage'): Promise<UploadResult> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${BASE_URL}/upload/admin-media?folder=${encodeURIComponent(folder)}`, {
    method: 'POST',
    headers: getAccessToken() ? { Authorization: `Bearer ${getAccessToken()}` } : {},
    credentials: 'include',
    body: form,
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message || 'Upload failed')
  return json.data !== undefined ? json.data : json
}

/** Upload a photo or short video for a customer review (authenticated, not admin-only). */
export async function uploadReviewMedia(file: File): Promise<UploadResult> {
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${BASE_URL}/upload/review-media`, {
    method: 'POST',
    headers: getAccessToken() ? { Authorization: `Bearer ${getAccessToken()}` } : {},
    credentials: 'include',
    body: form,
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.message || 'Media upload failed')
  return json.data !== undefined ? json.data : json
}
