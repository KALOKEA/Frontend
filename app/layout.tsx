import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import { BASE_URL } from '@/lib/api/client'
import Header from '@/components/layout/Header'
import FooterWrapper from '@/components/layout/FooterWrapper'
import CartDrawer from '@/components/layout/CartDrawer'
import { ToastProvider } from '@/components/ui/Toast'
import AuthBootstrap from '@/components/AuthBootstrap'
import Analytics from '@/components/Analytics'
import ErrorBoundary from '@/components/ErrorBoundary'
import LiveChatWidget from '@/components/LiveChatWidget'
import MobileBottomNav from '@/components/layout/MobileBottomNav'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import BackToTop from '@/components/layout/BackToTop'
import ScrollRevealInit from '@/components/ScrollRevealInit'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'
import PageTransition from '@/components/PageTransition'
import ExitIntentPopup from '@/components/layout/ExitIntentPopup'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kalokea.com'

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Kalokea',
  legalName: 'Kalokea',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    '@id': `${SITE_URL}/#logo`,
    url: `${SITE_URL}/kalokea-logo.png`,
    contentUrl: `${SITE_URL}/kalokea-logo.png`,
    width: 200,
    height: 60,
    caption: 'Kalokea — Premium Women\'s Fashion India',
  },
  image: `${SITE_URL}/og-image.jpg`,
  description: "Kalokea is a premium direct-to-consumer (D2C) women's fashion brand based in India. We offer contemporary women's clothing including dresses, tops, co-ord sets, bottoms, bags, and jumpsuits. Free shipping above ₹999, 7-day returns, COD available, pan-India delivery to 19,000+ pin codes.",
  slogan: "Contemporary Women's Fashion, Made for Modern India",
  foundingDate: '2024',
  foundingLocation: {
    '@type': 'Country',
    name: 'India',
  },
  areaServed: {
    '@type': 'Country',
    name: 'India',
  },
  knowsAbout: [
    "Women's Fashion", "Women's Clothing", "Dresses", "Tops", "Co-ord Sets",
    "Women's Bottoms", "Fashion Bags", "Indian Fashion", "Contemporary Fashion",
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: "Kalokea Women's Fashion Collection",
    url: `${SITE_URL}/shop/`,
  },
  sameAs: [
    'https://www.instagram.com/kalokea',
    'https://www.facebook.com/kalokea.in',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'support@kalokea.com',
    availableLanguage: ['English', 'Hindi'],
    contactOption: 'TollFree',
    areaServed: 'IN',
  },
}

// WebSite schema — enables Sitelinks Searchbox in Google results
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${SITE_URL}/#website`,
  name: 'Kalokea',
  alternateName: "Kalokea Fashion",
  url: SITE_URL,
  description: "Shop women's dresses, tops, co-ord sets, bags and more at Kalokea. Free shipping above ₹999. 7-day returns. COD available.",
  publisher: {
    '@id': `${SITE_URL}/#organization`,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/shop/?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
  inLanguage: 'en-IN',
}

// GEO: Speakable schema — tells Google AI Overview and AI assistants
// exactly which content to extract when someone asks "what is Kalokea?"
// Also helps Perplexity, ChatGPT search, Gemini cite the right answer.
const speakableJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITE_URL}/#webpage`,
  url: SITE_URL,
  name: "Kalokea — Women's Fashion India",
  isPartOf: { '@id': `${SITE_URL}/#website` },
  about: { '@id': `${SITE_URL}/#organization` },
  speakable: {
    '@type': 'SpeakableSpecification',
    xpath: [
      "/html/head/title",
      "/html/head/meta[@name='description']/@content",
    ],
  },
  description: "Kalokea is a premium Indian women's fashion brand. We sell dresses, tops, co-ord sets, bottoms, jumpsuits, and bags. Free shipping above ₹999. Easy 7-day returns. Cash on delivery available across India.",
  inLanguage: 'en-IN',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: "KALOKEA | Women's Fashion — Dresses, Tops & More",
  description: "Shop the latest women's fashion at Kalokea — dresses, tops, co-ords, bags and accessories. Free shipping above ₹999. Easy 7-day returns. COD available pan India.",
  // SEO: the keywords meta-tag is ignored by Google & Bing. The 300+ term blob
  // below was emitted on every page (~2 KB) and reads as spam to any reviewer.
  // Disabled via `false ? [...] : undefined` so the tag is omitted from the HTML.
  // (The array body can be deleted entirely in a later cleanup.)
  keywords: false ? [
    // ── Brand ──────────────────────────────────────────────────────────────────
    'kalokea', 'kalokea fashion', 'kalokea women', 'kalokea online',
    'kalokea dresses', 'kalokea tops', 'kalokea bags', 'kalokea co-ords',
    'shop kalokea', 'kalokea india', 'kalokea new arrivals',
    'kalokea store', 'kalokea collection', 'kalokea sale',

    // ── Core discovery ────────────────────────────────────────────────────────
    "women's fashion india", "women's clothing online", "ladies fashion india",
    "girls fashion online", "women's dresses", "women's tops", "women's kurtas",
    "women's blouses", "women's co-ords", "women's palazzo", "women's skirts",
    "women's pants", "women's bags", "women's handbags", "women's tote bags",
    "women's sling bags", "women's accessories", "women's jewellery", "women's earrings",
    'women boutique online india', 'premium women fashion', 'curated women fashion',
    'women fashion brand india', 'made in india fashion', 'indian women clothing brand',
    'online women fashion store india', 'best women clothing brand india',
    'top women fashion website india', 'where to buy women clothes india',
    'best online shopping for women india', 'women fashion website india',

    // ── Dress types ───────────────────────────────────────────────────────────
    'maxi dress', 'midi dress', 'mini dress', 'floral dress', 'casual dress',
    'party wear dress', 'summer dress', 'western dress', 'bodycon dress',
    'a-line dress', 'wrap dress', 'shift dress', 'shirt dress',
    'ethnic dress', 'fusion dress', 'indo-western dress',
    'jumpsuit women india', 'romper women india', 'playsuit women india',
    'kaftan dress india', 'beach kaftan women', 'summer kaftan women',
    'denim dress india', 'velvet dress india', 'sequin dress india',
    'embroidered dress india', 'mirror work dress india',
    'off shoulder dress india', 'cold shoulder dress india', 'cut out dress india',
    'balloon sleeve dress india', 'butterfly sleeve dress india', 'fringe dress india',
    'slip dress india', 'smocked dress india', 'tiered dress india',
    'peasant dress india', 'sun dress india', 'tea length dress india',
    'empire waist dress india', 'drop waist dress india',

    // ── Tops ──────────────────────────────────────────────────────────────────
    'crop top', 'women top', 'flowy top', 'linen top', 'cotton top',
    'printed top', 'embroidered top', 'designer top', 'trendy top',
    'formal top women', 'casual top women', 'boho top',
    'oversized shirt women india', 'linen blazer women india',
    'cold shoulder top india', 'off shoulder top india', 'halter neck top india',
    'tube top women india', 'peplum top women india', 'balloon sleeve top india',
    'bell sleeve top india', 'tank top women india', 'sleeveless top women india',
    'bodysuit women india', 'shrug women india', 'cape top women india',
    'turtleneck women india', 'corset top india', 'wrap top women india',
    'asymmetric top india', 'bralette india', 'bustier top india',

    // ── Bottoms ───────────────────────────────────────────────────────────────
    'palazzo pants', 'wide leg pants', 'straight pants', 'high waist pants',
    'flared skirt', 'pencil skirt', 'wrap skirt', 'midi skirt',
    'flared trousers women india', 'wide leg jeans women india',
    'cigarette pants women india', 'culottes women india', 'dhoti pants india',
    'harem pants women india', 'leggings women india',
    'pleated skirt india', 'mini skirt india', 'maxi skirt india',
    'satin skirt india', 'denim skirt india', 'ruffled skirt india',

    // ── Co-ords & sets ────────────────────────────────────────────────────────
    'co-ord set', 'matching set women', 'co-ord set india', 'two piece set',
    'crop top skirt set', 'loungewear set', 'linen co-ord',
    'blazer trouser set india', 'satin co-ord set india', 'printed co-ord india',
    'ethnic co-ord set india', 'three piece set women india',
    'floral co-ord india', 'monochrome co-ord india', 'knit co-ord india',

    // ── Ethnic & fusion ───────────────────────────────────────────────────────
    'kurta set', 'kurti women', 'indo-western', 'ethnic wear online',
    'fusion wear india', 'desi fashion', 'indian fashion online',
    'anarkali dress', 'anarkali suit online', 'salwar kameez online',
    'salwar suit women india', 'punjabi suit online india', 'straight kurta women',
    'a-line kurta women', 'sharara set online', 'gharara set online',
    'dupatta women india', 'lehenga choli online india',
    'chikankari kurti india', 'phulkari suit india', 'ikat dress india',
    'block print kurta india', 'ajrakh print dress india', 'kalamkari dress india',
    'bandhani dress india', 'kantha dress india', 'lucknow chikankari',
    'gujarati embroidery dress', 'rajasthani print women', 'kashmiri shawl women',
    'banarasi suit online', 'chanderi suit india', 'khadi kurta india',

    // ── Bags & accessories ────────────────────────────────────────────────────
    'women handbag', 'tote bag', 'shoulder bag', 'crossbody bag',
    'clutch bag', 'bucket bag', 'leather bag women', 'canvas bag women',
    'potli bag india', 'jhola bag india', 'satchel bag women india',
    'mini bag women india', 'top handle bag india', 'chain bag women india',
    'woven bag india', 'jute bag women india', 'crochet bag india',
    'beaded bag india', 'embroidered bag india', 'printed bag india',

    // ── Fabrics & materials ───────────────────────────────────────────────────
    'linen dress women', 'cotton dress women', 'georgette dress',
    'rayon kurta', 'silk top women', 'chiffon dress',
    'modal fabric dress india', 'tencel dress india', 'organic cotton dress india',
    'handloom fabric dress india', 'khadi dress india', 'muslin dress india',
    'crepe dress india', 'satin dress india', 'velvet dress women india',
    'organza dress india', 'net fabric dress india', 'knit dress india',
    'jersey dress india', 'chambray dress india', 'silk blend dress india',
    'linen blend dress india',

    // ── Style movements ───────────────────────────────────────────────────────
    'boho fashion india', 'minimalist fashion', 'capsule wardrobe india',
    'slow fashion india', 'sustainable fashion india', 'ethical fashion india',
    'cottagecore fashion india', 'dark academia fashion india',
    'Y2K fashion india', 'Korean fashion india', 'aesthetic fashion india',
    'streetwear women india', 'athleisure women india', 'preppy fashion india',
    'romantic fashion india', 'chic fashion india', 'classic fashion women india',
    'vintage fashion india', 'retro fashion india', 'smart casual women india',

    // ── Fashion descriptors ────────────────────────────────────────────────────
    'affordable fashion india', 'budget fashion india', 'stylish women india',
    'trendy clothes india', 'everyday fashion', 'office wear women',
    'party wear women', 'beach wear women', 'vacation outfits',
    'summer collection india', 'festive wear women',

    // ── Occasions ─────────────────────────────────────────────────────────────
    'bridal wear', 'wedding guest outfit', 'reception outfit women',
    'office wear india', 'casual wear women india', 'date night outfit',
    'college girl fashion', 'work from home outfit',
    'pre-wedding shoot outfit india', 'photoshoot outfit women india',
    'honeymoon outfit india', 'maternity fashion india',
    'cocktail dress india', 'graduation dress india',
    'farewell outfit women india', 'first date outfit india',
    'anniversary outfit women india', 'birthday dress women india',
    'new year dress india', 'brunch outfit women india',
    'concert outfit women india', 'music festival outfit india',
    'travel outfit women india', 'airport outfit women india',
    'beach outfit women india', 'poolside outfit india',

    // ── Festive & cultural ────────────────────────────────────────────────────
    'mehndi outfit women', 'sangeet outfit', 'garba wear women',
    'navratri outfit', 'diwali fashion women', 'eid outfits women',
    'holi outfit women india', 'pongal outfit women india',
    'onam outfit women india', 'ugadi outfit india', 'bihu dress india',
    'durga puja outfit india', 'karwa chauth outfit india',
    'teej outfit women india', 'navratri chaniya choli india',
    'garba dress india', 'dandiya dress india',
    'lohri outfit women india', 'baisakhi outfit women india',

    // ── Shopping intent ───────────────────────────────────────────────────────
    'buy dresses online india', 'buy tops online india', 'buy women clothes online',
    'online shopping for women', 'new arrivals women fashion',
    'sale women clothes', 'discount women clothing india',
    'free shipping clothes india', 'women fashion free delivery india',
    'women fashion free returns india', 'COD women clothes india',
    'cash on delivery women fashion india', 'cod fashion india',
    'cash on delivery clothes', '7 day return policy',
    'easy return fashion', 'free delivery fashion india',
    'same day delivery clothes india', 'express delivery women clothes india',

    // ── Price & value ─────────────────────────────────────────────────────────
    'affordable dresses india', 'cheap women clothes india',
    'fashion under 999', 'fashion under 1999', 'best price women fashion',
    'value fashion india', 'quality women clothes',
    'dresses under 500 india', 'tops under 300 india',
    'fashion under 2000 india', 'best value dresses india',
    'cheapest dresses online india', 'premium but affordable fashion india',
    'luxury fashion india affordable', 'budget friendly kurta india',
    'affordable co-ord sets india',

    // ── Colors ────────────────────────────────────────────────────────────────
    'black dress india', 'white dress india', 'blue dress india',
    'red dress india', 'green dress india', 'yellow dress india',
    'orange dress india', 'pink dress india', 'purple dress india',
    'beige dress india', 'nude dress india', 'brown dress india',
    'maroon dress india', 'teal dress india', 'mustard dress india',
    'sage green dress india', 'rust orange dress india', 'dusty pink top india',
    'ivory dress india', 'cream kurta india', 'navy blue top india',
    'emerald green dress india', 'cobalt blue dress india',

    // ── Patterns ──────────────────────────────────────────────────────────────
    'floral print dress india', 'geometric print top india',
    'striped top india', 'polka dot dress india',
    'checked shirt women india', 'abstract print dress india',
    'animal print top india', 'leopard print dress india',
    'tie dye dress india', 'ombre dress india', 'shibori dress india',
    'paisley print india', 'solid color dress india', 'colorblock dress india',

    // ── Silhouettes & fit ─────────────────────────────────────────────────────
    'fitted dress india', 'loose fit dress india', 'oversized top india',
    'flared dress india', 'straight fit kurta india',
    'plus size dress india', 'plus size kurta india', 'plus size tops india',
    'plus size women fashion india', 'petite fashion india',
    'maternity dress india', 'maternity kurta india', 'maternity top india',
    'free size dress india',

    // ── Necklines & sleeves ───────────────────────────────────────────────────
    'V neck dress india', 'round neck top india', 'sweetheart neckline india',
    'boat neck dress india', 'square neck top india',
    'sleeveless dress india', 'full sleeve dress india', 'half sleeve dress india',
    '3/4 sleeve dress india', 'puff sleeve top india', 'cap sleeve top india',

    // ── City-specific (tier 1 + tier 2) ──────────────────────────────────────
    'women fashion mumbai', 'women fashion delhi', 'women fashion bangalore',
    'women fashion chennai', 'women fashion hyderabad', 'women fashion pune',
    'women fashion kolkata', 'women fashion ahmedabad',
    'women fashion jaipur', 'women fashion surat', 'women fashion chandigarh',
    'women fashion kochi', 'women fashion lucknow', 'women fashion indore',
    'women fashion bhopal', 'women fashion nagpur', 'women fashion vadodara',
    'women fashion coimbatore', 'women fashion visakhapatnam',
    'women fashion patna', 'women fashion bhubaneswar', 'women fashion mysore',
    'women fashion guwahati', 'women fashion jodhpur', 'women fashion udaipur',
    'women fashion amritsar', 'women fashion nashik', 'women fashion agra',
    'buy fashion online mumbai', 'buy dresses online delhi',
    'fashion delivery bangalore', 'online shopping delhi women',
    'online fashion store mumbai women',

    // ── Seasonal collections ──────────────────────────────────────────────────
    'winter collection 2025 women india', 'summer collection 2025 india',
    'festive collection 2025 india', 'spring summer 2026 fashion india',
    'monsoon fashion india', 'winter outfit women india',
    'latest collection women india', 'new collection women india 2025',
    'trending fashion 2025 india', 'fashion trends india 2026',

    // ── Cultural & identity ───────────────────────────────────────────────────
    'bollywood inspired fashion', 'celebrity fashion india',
    'instagram fashion india', 'ootd india women',
    'fashion blogger india outfit', 'influencer fashion india',
    'homegrown fashion brand india', 'independent fashion brand india',
    'boutique brand india', 'contemporary fashion india',
    'modern indian woman fashion', 'fusion fashion india',
    'desi girl fashion', 'modern desi fashion',

    // ── Gift & gifting ────────────────────────────────────────────────────────
    'gift for women india', 'birthday gift women india',
    'anniversary gift women india', 'fashion gift india',
    'gift dress women india', "women's clothing gift india",

    // ── Lounge & activewear ────────────────────────────────────────────────────
    'lounge wear women india', 'sleepwear women india',
    'nightwear women india', 'pyjama set women india',
    'yoga pants women india', 'active wear women india',
    'gym wear women india', 'workout outfit women india',

    // ── Services & trust ──────────────────────────────────────────────────────
    'trusted fashion brand india', 'authentic women clothes india',
    'secure payment women fashion india', 'verified fashion seller india',
    'hassle free returns india', 'genuine fabric women india',

    // ── Long-tail high intent ─────────────────────────────────────────────────
    'best women fashion brand india 2025', 'top women clothing store india',
    'women online boutique india', 'ladies suit sets online',
    'trendy kurta sets online', 'western wear for women india',
    'latest fashion for women india', 'stylish clothes for women online',
    'new fashion arrivals india every friday', 'friday fashion drop',
    'ethically sourced clothes india', 'women premium ethnic wear',
    'indo-western fusion wear online',
    'women party outfits india', 'bridesmaid outfits india',
    'what to wear for wedding india', 'wedding season fashion india',
    'ethnic party wear women india', 'semi formal women india',
    'workwear women india 2025', 'smart office wear women india',
    'versatile dress india', 'instagrammable dresses india',
    'trending tops india 2025', 'bestselling dress india',
    'bestselling top india', 'must have kurta india',
    'top rated dresses india', 'highly reviewed women clothing india',
    'most stylish women clothing brand india', 'curated fashion india women',

    // ── Jewellery & accessories deep ──────────────────────────────────────
    'oxidised earrings india', 'jhumka earrings india', 'statement earrings india',
    'chandelier earrings india', 'stud earrings women india', 'hoop earrings india',
    'layered necklace india', 'choker necklace india', 'pearl necklace india',
    'boho necklace india', 'mangalsutra style necklace india',
    'bangles women india', 'kada bangle india', 'stack bracelets women india',
    'anklet women india', 'hair accessories india', 'scrunchie india',
    'hair clip india', 'head band women india', 'belt women india',
    'fabric belt india', 'waist belt dress india', 'sunglasses women india',
    'cat eye sunglasses india', 'oversized sunglasses india', 'scarf women india',
    'stole women india', 'dupatta online india', 'socks women india',
    'printed socks india', 'hair pin india',

    // ── Footwear categories ───────────────────────────────────────────────
    'women shoes india', 'heels india', 'block heels india', 'stiletto heels india',
    'wedge heels india', 'kitten heels india', 'mule sandals india',
    'flat sandals women india', 'kolhapuri sandals india', 'juttis women india',
    'mojaris women india', 'espadrilles women india', 'loafers women india',
    'sneakers women india', 'white sneakers women india', 'canvas shoes women india',
    'boots women india', 'ankle boots india', 'knee high boots india',
    'chelsea boots women india', 'platform shoes women india',

    // ── Ethnic wear deeper keywords ───────────────────────────────────────
    'cotton anarkali online india', 'heavy anarkali suit india', 'printed anarkali india',
    'embroidered kurta india', 'mirror work kurta india', 'gota patti kurta india',
    'kalamkari kurta india', 'lucknow chikankari kurta india', 'hand block print kurta india',
    'mulmul kurta india', 'cotton silk kurta india', 'rayon kurta india',
    'kurti with pant india', 'kurti with palazzo india', 'kurti with jeans india',
    'short kurti india', 'long kurti india', 'asymmetric kurti india',
    'A-line kurti online india', 'straight kurti online india',
    'chanderi kurta india', 'silk kurta women india', 'banarasi kurta india',
    'ikkat kurta india', 'kantha stitch kurta india', 'shibori kurta india',
    'tie dye kurta india', 'batik print kurta india', 'ajrakh kurta india',
    'dabu print dress india', 'banjara embroidery india', 'kutch embroidery dress india',
    'sindhi embroidery blouse india', 'phulkari dupatta india', 'kashmiri embroidery dress india',

    // ── Occasion wear deeper ──────────────────────────────────────────────
    'lehenga blouse only india', 'bridal lehenga saree look india',
    'half saree women india', 'pattu pavadai india', 'silk pavadai india',
    'navratri special dress india', 'navratri chaniya choli buy online',
    'garba costume india', 'onam settu mundu india', 'kasavu saree india',
    'puja dress women india', 'temple jewellery india',
    'sangeet lehenga india', 'mehndi outfit yellow india', 'haldi outfit yellow india',
    'engagement dress india', 'ring ceremony dress india', 'nikah outfit india',
    'eid special dress india', 'christmas party dress india', 'new year party dress india',
    'valentine day dress india', 'karwa chauth saree india', 'baby shower outfit india',
    'babyshower sari india', 'godh bharai outfit india', 'mundan ceremony outfit india',

    // ── Workwear & professional ───────────────────────────────────────────
    'office wear kurta india', 'formal dress women india', 'business casual women india',
    'interview outfit women india', 'blazer women india', 'power suit women india',
    'shirt women formal india', 'tailored trousers women india',
    'formal pencil skirt india', 'work blouse women india', 'corporate dress india',
    'work from home outfit women india', 'zoom call outfit women india',
    'conference outfit women india', 'smart formal women india',

    // ── Maternity & nursing ───────────────────────────────────────────────
    'maternity wear india', 'pregnancy dress india', 'nursing dress india',
    'maternity salwar suit india', 'post partum dress india',
    'baby bump fashion india', 'maternity photoshoot dress india',
    'comfortable pregnancy clothes india', 'maternity kurti india',
    'breastfeeding friendly dress india', 'nursing top india',

    // ── Plus size & inclusive fashion ─────────────────────────────────────
    'plus size fashion india', 'XL XXL women clothes india',
    'plus size kurta india', 'plus size dress india', 'plus size co-ord india',
    'plus size saree blouse india', 'curvy women fashion india',
    'body positive fashion india', 'size inclusive fashion india',
    'plus size western wear india', 'large size women clothes india',
    'free size dress india', 'stretchable fabric dress india',
    '2XL women clothes india', '3XL women clothes india',

    // ── Sustainable & conscious fashion ──────────────────────────────────
    'sustainable fashion india', 'eco friendly clothing india',
    'organic cotton dress india', 'natural dye clothes india',
    'handwoven fabric india', 'handloom saree india', 'handloom kurta india',
    'ethical fashion brand india', 'slow fashion india', 'fair trade fashion india',
    'zero waste fashion india', 'upcycled fashion india', 'recycled fabric dress india',
    'artisan made clothes india', 'women artisan fashion india',
    'craft revival fashion india', 'khadi fashion india',
    'tribal weaves india', 'handmade clothes india',

    // ── Teen & college fashion ────────────────────────────────────────────
    'college girl fashion india', 'teen fashion india', 'girls fashion 18-25 india',
    'gen z fashion india', 'y2k fashion india', 'trendy college outfits india',
    'casual chic girl india', 'aesthetic outfits india', 'pastel fashion india',
    'ootd college india', 'campus fashion india', 'graduation outfit india',
    'farewell dress college india', 'college fest outfit india',
    'culturals day dress india', 'annual day outfit india',

    // ── Travel & honeymoon fashion ────────────────────────────────────────
    'honeymoon outfits women india', 'beach vacation outfit india',
    'goa trip outfit india', 'kerala trip dress india', 'manali trip outfit india',
    'europe trip outfit india', 'dubai trip outfit india', 'bali trip outfit india',
    'travel dress women india', 'packing light dress india',
    'wrinkle free travel dress india', 'resort wear india',
    'pool party outfit india', 'cruise outfit women india',

    // ── Social media & celebrity-inspired ────────────────────────────────
    'reels outfit india', 'instagram reel dress india', 'trending reel look india',
    'bollywood dance outfit india', 'reel viral dress india',
    'celebrity inspired dress india', 'tv actress outfit india',
    'deepika padukone style india', 'alia bhatt fashion india',
    'kriti sanon style india', 'rashmika mandanna fashion india',
    'janhvi kapoor dress india', 'sara ali khan fashion india',
    'influencer style india', 'fashion blogger india outfit',
    'micro trend india', 'dopamine dressing india',

    // ── Gifting & occasions ───────────────────────────────────────────────
    'fashion subscription box india', 'gift card women fashion india',
    'gift voucher fashion india', 'birthday gift dress india',
    'gift wrapped clothing india', 'corporate gift fashion india',
    'festival hamper women india', 'rakhi gift women india',
    'diwali gift women clothes india', 'anniversary gift set women india',

    // ── Regional/transliterated keywords ─────────────────────────────────
    'mahila kurta online', 'ladkiyon ke kapde', 'salwar suit kharidna',
    'anarkali kharidna online', 'dress kharidna', 'kurti online mangana',
    'kurta set online kharidna', 'lehenga online india', 'saree blouse online',
    'churidar suit india', 'plazo suit india', 'straight suit online india',

    // ── Styling & how-to search intent ────────────────────────────────────
    'how to style kurta india', 'how to wear co-ord set india',
    'best dresses for short women india', 'best dresses for tall women india',
    'what to wear to a indian wedding', 'what to wear in summer india',
    'what to wear in monsoon india', 'what to wear in winter india',
    'how to dress up casually india', 'how to look stylish india',
    'minimalist wardrobe india', 'capsule wardrobe india women',
    'wardrobe basics women india', 'essential clothes women india',
    '10 must have clothes women india', 'basic wardrobe pieces india',

    // ── Trust, delivery & policy signals ─────────────────────────────────
    'fast delivery clothes india', '1 day delivery dress india',
    'next day delivery fashion india', 'free delivery women clothes',
    'free shipping women clothing india', 'free returns women fashion india',
    'easy exchange clothes india', '7 day return clothes india',
    'hassle free return india', 'genuine quality women clothes india',
    'authentic fabric india', 'no fake products india', 'original brand india women',
    'safe payment women fashion india', 'UPI payment clothes india',
    'razorpay secured checkout india', 'safe shopping india women',
    'cash on delivery available india', 'COD fashion brand india',

    // ── Seasonal 2025-2026 ─────────────────────────────────────────────────
    'summer 2026 fashion india', 'monsoon fashion 2026 india',
    'winter collection 2026 india', 'festive collection 2026 india',
    'spring fashion 2026 india', 'new year fashion 2026',
    'christmas fashion 2025 india', 'diwali fashion 2025',
    'eid fashion 2025', 'navratri fashion 2025',
    'trending clothes 2026 india', 'fashion must haves 2026',
    'top fashion trends 2026 india', 'fashion forecast 2026 india',
    'best fashion brand 2026 india', 'new collection 2026 india',

    // ── Specific product combinations ─────────────────────────────────────
    'floral maxi dress india', 'white linen dress india', 'black bodycon india',
    'floral co-ord set india', 'beige linen co-ord india', 'rust orange kurta india',
    'mustard yellow kurta india', 'sage green dress india', 'teal blue co-ord india',
    'dusty pink top india', 'ivory satin dress india', 'emerald green kurta india',
    'navy blue palazzo set india', 'charcoal grey blazer women india',
    'maroon velvet dress india', 'printed georgette kurta india',
    'cotton printed co-ord india', 'linen blend palazzo india',
    'block print floral dress india', 'mirror work skirt india',
    'gota border kurta india', 'zari work dress india',

    // ── Body type & fit keywords ───────────────────────────────────────────
    'dresses for apple body shape india', 'dresses for pear body shape india',
    'dresses for hourglass figure india', 'clothes for rectangle body india',
    'dresses that hide tummy india', 'clothes that make you look slim india',
    'tall women fashion india', 'petite women fashion india',
    'broad shoulder dress india', 'big bust dress india',
    'empire waist dress india', 'a-line dress india',
    'wrap dress for all body types india', 'flowy dress all body types india',

    // ── Age group targeting ────────────────────────────────────────────────
    'fashion for women in 20s india', 'fashion for women in 30s india',
    'fashion for women in 40s india', 'fashion for women over 50 india',
    'young women fashion india', 'mature women fashion india',
    'sophisticated women fashion india', 'classic women fashion india',
    'youthful women fashion india', 'age appropriate fashion india',

    // ── Style tribe deep ──────────────────────────────────────────────────
    'cottagecore dress india', 'dark academia fashion india', 'light academia fashion india',
    'coastal grandmother style india', 'quiet luxury fashion india',
    'old money fashion india', 'barbiecore fashion india', 'coquette fashion india',
    'clean girl aesthetic india', 'mob wife aesthetic india', 'balletcore india',
    'gorpcore women india', 'indie aesthetic fashion india', 'grunge fashion india',
    'soft girl aesthetic india', 'e-girl fashion india', 'granola girl fashion india',
    'bookish girl fashion india', 'dark feminine fashion india',
    'feminine fashion india', 'girly fashion india',

    // ── B2B & reseller ────────────────────────────────────────────────────
    'bulk buy women clothes india', 'wholesale kurta india',
    'reseller women fashion india', 'boutique owner buy stock india',
    'bulk ethnic wear india', 'fashion reseller india', 'boutique stock india',

    // ── City fashion & local SEO ──────────────────────────────────────────
    'women fashion tiruppur', 'women fashion surat textile', 'women fashion ludhiana',
    'women fashion rajkot', 'women fashion kanpur', 'women fashion varanasi',
    'women fashion madurai', 'women fashion vijayawada', 'women fashion ranchi',
    'women fashion gurgaon', 'women fashion noida', 'women fashion thane',
    'women fashion navi mumbai', 'women fashion pimpri chinchwad',
    'women fashion hubli', 'women fashion mangalore', 'women fashion calicut',
    'women fashion trichy', 'women fashion salem', 'women fashion vellore',
    'buy fashion online jaipur', 'buy dresses online hyderabad',
    'fashion delivery chennai', 'online shopping bangalore women',
    'online fashion store kolkata women', 'fashion delivery ahmedabad',
    'online shopping pune women', 'buy kurta online surat',
  ].join(', ') : undefined,
  metadataBase: new URL(SITE_URL),
  // Canonical for the homepage (resolved against metadataBase).
  alternates: { canonical: '/' },
  // Let Google/Bing + AI Overviews show full snippets and large image previews
  // (max-snippet:-1, max-image-preview:large) — important for rich results & GEO.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  // Google Search Console site verification (set NEXT_PUBLIC_GSC_VERIFICATION in .env)
  ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } }
    : {}),
  openGraph: {
    type: 'website',
    siteName: 'KALOKEA',
    title: "KALOKEA | Women's Fashion",
    description: "Shop the latest women's fashion at Kalokea. Free shipping above Rs.999.",
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "KALOKEA -- Women's Fashion",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@kalokea',
    creator: '@kalokea',
    title: "KALOKEA | Women's Fashion",
    description: "Shop the latest women's fashion at Kalokea. Free shipping above Rs.999.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
  // Pinterest domain verification (set NEXT_PUBLIC_PINTEREST_VERIFY in .env)
  ...(process.env.NEXT_PUBLIC_PINTEREST_VERIFY
    ? { other: { 'p:domain_verify': process.env.NEXT_PUBLIC_PINTEREST_VERIFY } }
    : {}),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        {/* Favicons — all KALOKEA logo files from /public */}
        <link rel="shortcut icon"   href="/favicon.ico" />
        <link rel="icon"            href="/favicon.ico" sizes="any" />
        <link rel="icon"            type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon"            type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180"   href="/apple-touch-icon.png" />
        {/* Open Graph / PWA manifest logo */}
        <link rel="image_src" href="/logo.png" />
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="KALOKEA" />
        {/* API + images */}
        <link rel="preconnect" href={BASE_URL} crossOrigin="anonymous" />
        <link rel="dns-prefetch" href={BASE_URL} />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {/* Razorpay -- preconnect so the payment modal opens instantly */}
        <link rel="preconnect" href="https://checkout.razorpay.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://checkout.razorpay.com" />
        <link rel="dns-prefetch" href="https://api.razorpay.com" />
        {/* Analytics -- reduces first-beacon latency */}
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
      </head>
      <body>
        {/* llms.txt — structured brand info for AI agents */}
        <link rel="ai-info" href="/llms.txt" />
        {/* Skip-to-content — WCAG 2.4.1 (Level A). Visible only on keyboard focus. */}
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableJsonLd) }}
        />
        <Analytics />
        <ToastProvider>
          <AuthBootstrap />
          <Header />
          <CartDrawer />
          {/* pt is driven by --header-h, set by the Header's ResizeObserver.
              Fallback 94px covers the default mobile header (announcement + nav).
              Automatically adapts when FlashSaleBanner appears or is dismissed. */}
          <main id="main-content" tabIndex={-1} style={{ paddingTop: 'var(--header-h, 94px)' }}>
            <ErrorBoundary>
              <PageTransition>
                {children}
              </PageTransition>
            </ErrorBoundary>
          </main>
          <FooterWrapper />
        </ToastProvider>
        <MobileBottomNav />
        <LiveChatWidget />
        <WhatsAppButton />
        <BackToTop />
        <ScrollRevealInit />
        <ServiceWorkerRegister />
        <ExitIntentPopup />
      </body>
    </html>
  )
}
