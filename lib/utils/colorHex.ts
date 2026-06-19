/** Map of colour name → CSS hex code (case-insensitive lookup). */
export const COLOR_HEX: Record<string, string> = {
  // Neutrals
  black: '#0D0D0D',
  white: '#FFFFFF',
  'off white': '#FAF8F4',
  'off-white': '#FAF8F4',
  cream: '#F5EFE6',
  ivory: '#FFFFF0',
  beige: '#F5F5DC',
  grey: '#9CA3AF',
  gray: '#9CA3AF',
  'light grey': '#D1D5DB',
  'light gray': '#D1D5DB',
  'dark grey': '#374151',
  'dark gray': '#374151',
  charcoal: '#374151',
  silver: '#C0C0C0',

  // Reds & Pinks
  red: '#C0392B',
  'dark red': '#8B0000',
  pink: '#F9A8D4',
  'baby pink': '#FFD1DC',
  'light pink': '#FFB6C1',
  'hot pink': '#FF69B4',
  'dusty pink': '#C8A4A5',
  'rose pink': '#FF9AA2',
  mauve: '#C27BA0',
  coral: '#FF7F7F',
  peach: '#FFCBA4',
  blush: '#FFB7B2',

  // Oranges & Yellows
  orange: '#F97316',
  yellow: '#FDE047',
  mustard: '#D4A017',
  'mustard yellow': '#D4A017',
  gold: '#D4A426',

  // Greens
  green: '#22C55E',
  'light green': '#86EFAC',
  'dark green': '#166534',
  'olive green': '#808000',
  olive: '#808000',
  'sage green': '#87AE73',
  sage: '#87AE73',
  mint: '#98FF98',
  teal: '#14B8A6',
  'forest green': '#228B22',
  emerald: '#50C878',

  // Blues
  blue: '#3B82F6',
  'sky blue': '#87CEEB',
  'baby blue': '#BFEFFF',
  'light blue': '#ADD8E6',
  'dark blue': '#1E3A5F',
  'navy blue': '#1E3A5F',
  navy: '#1E3A5F',
  'royal blue': '#4169E1',
  indigo: '#4F46E5',
  cobalt: '#0047AB',
  cerulean: '#2A52BE',
  denim: '#1560BD',

  // Purples
  purple: '#A855F7',
  lavender: '#E6E6FA',
  'light purple': '#D8B4FE',
  'dark purple': '#6B21A8',
  violet: '#7C3AED',
  lilac: '#C8A2C8',
  plum: '#8E4585',

  // Browns & Earthy
  brown: '#92400E',
  'light brown': '#C4A882',
  tan: '#D2B48C',
  camel: '#C19A6B',
  chocolate: '#7B3F00',
  rust: '#B7410E',
  terracotta: '#E2725B',
  copper: '#B87333',
  mocha: '#6F4E37',
  taupe: '#483C32',

  // Reds (continued)
  maroon: '#800000',
  burgundy: '#800020',
  wine: '#722F37',
  'rose red': '#E11D48',
}

/** Look up the hex code for a colour name (case-insensitive). Falls back to light grey. */
export function getColorHex(name: string): string {
  return COLOR_HEX[name.toLowerCase().trim()] ?? '#D1D5DB'
}

/** True if the colour is light enough that dark text / ring looks better on it. */
export function isLightColor(hex: string): boolean {
  if (!hex.startsWith('#') || hex.length < 7) return false
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.72
}
