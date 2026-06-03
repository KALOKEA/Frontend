import { getAccessToken } from './client'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-73aa.up.railway.app'

export interface UploadResult {
  url: string
  public_id: string
}

/** Upload an image file to Cloudinary via the backend (admin). Multipart, so it
 *  bypasses the JSON api client and attaches the bearer token manually. */
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
