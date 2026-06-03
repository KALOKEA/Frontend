const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dvece6zpc'

export function cloudinaryUrl(publicId: string, transforms = 'f_auto,q_auto,w_600'): string {
  if (!publicId) return '/placeholder.jpg'
  if (publicId.startsWith('http')) return publicId
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transforms}/${publicId}`
}

export function productThumb(url: string) {
  return cloudinaryUrl(url, 'f_auto,q_auto,w_400,h_533,c_fill')
}

export function productDetail(url: string) {
  return cloudinaryUrl(url, 'f_auto,q_auto,w_800,h_1067,c_fill')
}
