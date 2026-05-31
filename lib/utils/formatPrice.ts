export function formatPrice(paise: number): string {
  return `₹${(paise / 100).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export function formatDiscount(original: number, sale: number): number {
  if (!original || !sale || original <= sale) return 0
  return Math.round(((original - sale) / original) * 100)
}
