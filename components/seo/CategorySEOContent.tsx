'use client'
import { useSearchParams } from 'next/navigation'

// ─── Category SEO data ────────────────────────────────────────────────────────

interface CategoryData {
  heading: string
  subheading: string
  intro: string
  bullets: string[]
  sections: { title: string; body: string }[]
  closingCta: string
}

const CATEGORY_DATA: Record<string, CategoryData> = {
  dresses: {
    heading: "Women's Dresses Online India",
    subheading: 'Every silhouette. Every occasion. Every body.',
    intro:
      "Shop Kalokea's curated collection of women's dresses — the most important wardrobe investment you can make. A great dress does the thinking for you: one piece, one decision, ready to go. Our dresses range from easy everyday casuals in breathable cotton and linen to sleek occasion wear in satin and georgette, and everything in between. Every style is hand-selected and quality-checked before it reaches you.",
    bullets: [
      'Free shipping on orders above ₹999',
      '7-day hassle-free returns and exchanges',
      'Pan-India delivery in 3–7 business days',
      'Cash on Delivery available nationwide',
      'XS–XXL size range with detailed measurements',
    ],
    sections: [
      {
        title: 'Maxi Dresses — Effortless, Floor-Length Elegance',
        body: "Maxi dresses are the most versatile item in any wardrobe. A flowy maxi in a printed fabric is ideal for beach days, travel, or weekend brunch; a structured maxi in satin or crepe translates easily to evening events and celebrations. At Kalokea, our maxi dresses come in lightweight georgette, breezy cotton voile, rich satin, and textured fabric blends. Sizes run from XS to XXL with detailed size guidance on each product page so you order the right fit the first time.",
      },
      {
        title: 'Midi Dresses — The Versatile Middle Ground',
        body: "The midi dress hits between the knee and ankle — the sweet spot for versatility. Long enough to feel polished, short enough to feel modern. Midi dresses in wrap silhouettes are universally flattering across body types because the adjustable tie defines the waist naturally. A-line midis in printed fabric are a go-to for both formal and casual contexts. Our midi collection includes bodycon knits, tiered cottons, wrap silhouettes, and pleated styles.",
      },
      {
        title: 'Mini Dresses & Party Wear',
        body: "Short doesn't mean simple. Our mini dress collection includes bodycon fits in ribbed fabric and ponte for a sculpted look, wrap minis that drape elegantly, and structured bandage styles. Mesh panel detailing, cut-out elements, and off-shoulder necklines add dimension. Mini dresses in solid jewel tones or classic black make night-out dressing easy.",
      },
      {
        title: 'Casual Dresses for Everyday Wear',
        body: "Casual dresses deserve the same quality and thought as occasion wear. Kalokea's everyday dresses prioritise comfort — breathable cotton, relaxed-fit linen, and soft jersey fabrics that feel good through a full day. Shirt-dress styles with a collar and button placket can look put-together at work or relaxed at the weekend depending on how you style them. Sundresses with spaghetti straps or smocked bodies are easy summer staples.",
      },
      {
        title: 'How to Choose the Right Dress for Your Body Type',
        body: "Every body is a dress body — it's about knowing which silhouettes amplify what you love. If you prefer to define the waist: wrap dresses, belted styles, and fit-and-flare cuts all create an hourglass line. If you prefer to draw attention to the shoulder: off-shoulder or square necklines broaden the shoulder and create visual balance. If you want a lean vertical line: shift dresses, column styles, and vertical prints all elongate. For more guidance, visit our Size Guide at kalokea.in/size-guide/ — our stylists have written detailed notes for each common fit concern.",
      },
    ],
    closingCta:
      "Shop the full dresses collection at Kalokea — dresses in every style, size, and budget. Free shipping above ₹999. Easy 7-day returns. COD available.",
  },

  tops: {
    heading: "Women's Tops Online India",
    subheading: 'Statement tops. Wardrobe staples. Every occasion.',
    intro:
      "A great top is the hardest-working item in your wardrobe: it updates your favourite trousers, transforms a pair of jeans, and expresses your style in a single layer. Kalokea's tops collection spans casual crop tops and everyday blouses through structured corset tops and statement pieces for going out. Every top is sourced for quality — we check stitching, fabric hand-feel, and wash performance before listing anything.",
    bullets: [
      'Crop tops, blouses, corsets, mesh tops, off-shoulder & more',
      'Sizes XS to XXL with per-product size guides',
      'Cotton, linen, satin, georgette, and mixed fabrics',
      'Free shipping above ₹999 | COD available',
      '7-day returns — no questions asked',
    ],
    sections: [
      {
        title: 'Crop Tops — The Modern Wardrobe Essential',
        body: "The crop top is the most versatile item in contemporary Indian wardrobes. Pair a ribbed crop with high-waist trousers or palazzos for a pulled-together look; wear a bralette-style crop under a blazer for evening. At Kalokea, our crop tops come in cotton jersey for daily wear, satin for shine and occasion dressing, and knit for a bodycon fit. Asymmetric hems, frilled edges, and ruching add interest without effort.",
      },
      {
        title: 'Blouses & Shirts — Polished and Versatile',
        body: "A well-cut blouse is the centrepiece of smart-casual dressing. Kalokea's blouses include flowy georgette styles that tuck beautifully into trousers, crisp cotton poplin shirts that work from Monday morning to Saturday evening, and lightweight linen blouses perfect for Indian summers. Tie-front styles create a casual waist-definition detail. Puff-sleeve blouses add volume and drama to a minimalist base.",
      },
      {
        title: 'Corset Tops — Structured Elegance',
        body: "The corset top has earned its permanent place in fashion because it simultaneously defines the waist and elevates any outfit. Kalokea's corset tops use structured boning or strong ribbing to create shape without sacrifice. Wear over a crisp white shirt for a layered editorial look, or on its own with wide-leg trousers for a going-out fit. Satin corsets in deep jewel tones — emerald, burgundy, navy — are particularly striking.",
      },
      {
        title: 'Off-Shoulder & Tube Tops',
        body: "Off-shoulder and tube tops are the right choice when the occasion calls for something special but not formal. An off-shoulder ruched top in a solid colour is an easy answer for birthdays, evenings out, and celebrations. Bardot styles with a wide neckline are universally flattering because they draw the eye across the shoulder. Our tube tops come in bodycon ribbing, satin, and print-forward fabrics.",
      },
    ],
    closingCta:
      "Discover Kalokea's tops collection — crop tops, blouses, corsets, and statement pieces. Free shipping above ₹999. Free returns within 7 days.",
  },

  bottoms: {
    heading: "Women's Bottoms Online India",
    subheading: 'Trousers, palazzos, skirts & shorts — the foundation of every outfit.',
    intro:
      "The right bottom is the foundation of a great outfit. Kalokea's bottoms collection includes wide-leg trousers and palazzos for breezy comfort and polish, mini and midi skirts for femininity and versatility, and shorts for casual warm-weather days. All cut with the Indian body proportion in mind — standard inseam lengths, generous hip allowances, and a higher rise for a flattering fit.",
    bullets: [
      'Wide-leg trousers, palazzos, skirts (mini / midi / maxi), shorts',
      'Sizes XS to XXL — inseam guide on each product page',
      'Elastic waistbands, adjustable ties, and zip closures',
      'Cotton, linen, crepe, satin, and printed fabrics',
      'Free shipping above ₹999 | Easy 7-day returns',
    ],
    sections: [
      {
        title: 'Wide-Leg Trousers & Palazzos — Comfort Meets Style',
        body: "The wide-leg trouser is the single most important bottom to own in 2025–26. The silhouette is universally flattering because the wide leg creates a continuous line from waist to floor, visually lengthening. Palazzos in a flowy fabric — chiffon, georgette, or crepe — have the added bonus of keeping you cool through Indian summers while looking effortlessly dressed. Kalokea's palazzo range includes printed, solid, and textured options. Pair with a tucked-in crop or a structured blouse for balance.",
      },
      {
        title: 'Midi & Maxi Skirts — Feminine, Fluid, Timeless',
        body: "The midi skirt hit the waist-to-below-knee proportions that work for every body type and every dress code. Satin bias-cut midis are the most elegant option — they move with the body and photograph beautifully. Pleated midis in cotton or linen are the casual, comfortable pick for daily wear. Our maxi skirts sweep to the floor and pair best with simple, tucked-in tops so the skirt remains the focus.",
      },
      {
        title: 'Mini Skirts — Bold and Confident',
        body: "The mini skirt in a strong fabric — leather-look, denim, or structured ponte — is one of the most confident statements in fashion. Kalokea's mini skirts include bodycon bandage styles, A-line floaty versions in printed fabric, and pleated school-style cuts. Pair with a fitted top and block heels for evening, or with an oversized tee and sneakers for a casual daytime look.",
      },
      {
        title: 'Shorts — Casual Comfort for Indian Summers',
        body: "Kalokea's shorts range covers everything from relaxed linen wide-leg shorts to bodycon cycling-style shorts and printed casual shorts. The best short for Indian weather is high-waisted, with an elastic or tie waistband, in cotton or linen — it breathes well and doesn't cling uncomfortably in heat. Pair with a crop top and sandals for everyday ease.",
      },
    ],
    closingCta:
      "Shop Kalokea's bottoms — wide-leg trousers, palazzos, skirts, and shorts for every occasion. Free shipping above ₹999.",
  },

  bags: {
    heading: "Women's Bags & Handbags Online India",
    subheading: 'The finishing touch to every outfit.',
    intro:
      "A great bag completes an outfit — it's the detail that ties everything together and says something about your personal style. Kalokea's bags collection covers the full spectrum: spacious totes for work and travel, hands-free sling and crossbody bags for day-to-night ease, sleek clutches and mini bags for evenings out, and structured shoulder bags for a polished everyday look. Every bag is chosen for both aesthetic and practicality — internal organisation, quality hardware, and durable stitching.",
    bullets: [
      'Tote bags, sling bags, crossbody bags, clutches, mini bags',
      'Faux leather, fabric, rattan, and canvas options',
      'Secure zipped compartments + internal pockets',
      'Free shipping on bags above ₹999',
      '7-day returns on all unused bags',
    ],
    sections: [
      {
        title: 'Tote Bags — The Everyday Workhorse',
        body: "A tote bag is one of the most used items you will own. A good tote goes from commute to grocery run to weekend trip without missing a beat. Kalokea's totes include structured faux-leather styles with a firm base (so the bag doesn't collapse) and softer canvas totes for casual days. Internal zip compartments keep valuables secure; large main compartments fit a 13-inch laptop and daily essentials.",
      },
      {
        title: 'Sling & Crossbody Bags — Hands-Free Ease',
        body: "The sling bag is the most practical fashion item for active days — phone, wallet, keys, and you're out the door. Our crossbody bags come in adjustable-strap styles that can be worn across the body, over one shoulder, or clipped short as a clutch. Mini sling bags in trendy shapes — half-moon, rectangular, rounded — add interest to casual outfits. A monochrome sling in nude, black, or white bridges the gap from casual to smart-casual effortlessly.",
      },
      {
        title: 'Clutches — Evening Elegance',
        body: "A clutch is the most statement-ready bag — smaller, so every detail counts. Kalokea's evening clutches include structured box clutches in satin for weddings and celebrations, simple envelope clutches in metallic for parties, and contemporary cylindrical styles. Embellished, jewelled, and laser-cut clutches elevate a simple dress to something memorable.",
      },
      {
        title: 'Caring for Your Kalokea Bag',
        body: "Store bags stuffed with tissue paper to maintain shape. Keep leather-look bags away from prolonged heat and direct sunlight. Wipe down surfaces with a slightly damp cloth — avoid harsh cleaners. For fabric bags, spot-clean with a mild soap solution and allow to air-dry. Metal hardware can be polished gently with a dry cloth to maintain shine. Never overfill a bag beyond its designed capacity — overloading stresses the seams and hardware.",
      },
    ],
    closingCta:
      "Shop Kalokea's bags collection — totes, crossbody bags, clutches, and mini bags. Free shipping above ₹999. 7-day returns.",
  },

  'co-ords': {
    heading: "Women's Co-ord Sets Online India",
    subheading: 'Matching two-piece sets — the smartest investment in your wardrobe.',
    intro:
      "The co-ord set is fashion's best idea for modern life: two matching pieces that guarantee you look put-together without effort. The top and bottom are designed to work together — same fabric, same print, same proportion — so the outfit is solved before you even start. At Kalokea, our co-ords come in everything from casual cotton for weekends to sleek satin for evenings, printed sets for statement dressing, and neutral-toned sets that build a capsule wardrobe effortlessly.",
    bullets: [
      'Top + bottom sets in matching fabric and print',
      'Satin, cotton, linen, printed, structured fabrics',
      'Sizes XS to XXL — per-product sizing guides',
      'Wear as a set or mix with other pieces',
      'Free shipping above ₹999 | 7-day returns',
    ],
    sections: [
      {
        title: 'Why Co-ord Sets Work',
        body: "A co-ord set works because the work is already done for you. The proportions are designed together — so a crop top with high-waist trousers balances perfectly, a fitted top with wide-leg bottoms creates the ideal silhouette ratio, and a flowy blouse with wide-leg matching bottoms creates a fluid, coordinated look. You also get two pieces that can be split up and mixed with the rest of your wardrobe — doubling the value of a single purchase.",
      },
      {
        title: 'Satin Co-ord Sets — Elevated Occasion Wear',
        body: "Satin co-ords are Kalokea's most popular category for weddings, parties, festive occasions, and celebrations. The sheen of satin reads as dressed-up regardless of the silhouette, and matching satin pieces create a fluid, cohesive look. Wear with strappy heels and minimal jewellery for a clean, modern take on occasion dressing.",
      },
      {
        title: 'Printed Co-ord Sets — Bold, Statement Dressing',
        body: "A printed co-ord set is the easiest way to make an impact. When both pieces share the same bold print, the outfit reads as intentional and directional. Floral prints work across seasons; abstract and geometric prints have a more editorial quality. The trick to wearing a statement print confidently is to keep accessories minimal — let the print do all the talking.",
      },
      {
        title: 'Casual Cotton Co-ords — Weekend Ease',
        body: "Weekend dressing doesn't have to mean compromise. Cotton co-ords in relaxed silhouettes — a boxy top with wide-leg trousers, a shirt with matching shorts, a tie-front top with a midi skirt in the same fabric — deliver comfort and style together. Linen co-ords are perfect for Indian summers: breathable, cool, and inherently elegant.",
      },
    ],
    closingCta:
      "Shop Kalokea's co-ord sets — matching two-piece sets in satin, cotton, prints, and more. Free delivery above ₹999.",
  },

  jumpsuits: {
    heading: "Women's Jumpsuits & Playsuits Online India",
    subheading: 'One piece. Zero effort. Infinite style.',
    intro:
      "The jumpsuit is fashion's most efficient garment: one piece solves your entire outfit. No co-ordinating, no layering decisions — just zip up, step out, and look great. Kalokea's jumpsuit collection spans casual playsuits in cotton for warm days through tailored crepe jumpsuits for the office and sleek wide-leg styles for evenings and events.",
    bullets: [
      'Casual playsuits, wide-leg jumpsuits, tailored styles',
      'Cotton, crepe, satin, and jersey fabrics',
      'Sizes XS to XXL',
      'Free shipping above ₹999 | 7-day returns',
    ],
    sections: [
      {
        title: 'Wide-Leg Jumpsuits — The Elegant One-Piece',
        body: "A wide-leg jumpsuit in a draped fabric — crepe, satin, or georgette — is the easiest answer for semi-formal and smart-casual occasions. The wide leg creates a formal silhouette without restriction, while the one-piece construction keeps the outfit effortlessly co-ordinated. Belted wide-leg jumpsuits define the waist and create a structured, dressed shape.",
      },
      {
        title: 'Casual Playsuits — Short, Easy, Breezy',
        body: "A playsuit is the summer wardrobe equivalent of a dress — easy, contained, and ready to go. Kalokea's playsuits include printed styles in cotton for beach days and travel, tied-waist styles in linen for casual lunches, and ruched styles in jersey for a bodycon fit. Pair with sandals and a sun hat for an instant holiday look.",
      },
    ],
    closingCta:
      "Shop Kalokea's jumpsuits and playsuits — one-piece styles for every occasion. Free shipping above ₹999.",
  },
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CategorySEOContent() {
  const params = useSearchParams()
  const category = params.get('category')

  // Only render when a known category is active
  if (!category) return null
  const data = CATEGORY_DATA[category.toLowerCase()]
  if (!data) return null

  return (
    <section
      aria-label={`About ${data.heading}`}
      className="border-t border-[#E0D4C4] bg-[#FDFAF6] py-16 px-4 sm:px-6"
    >
      <div className="max-w-5xl mx-auto">

        {/* Section header */}
        <div className="mb-10">
          <p className="text-[9.5px] font-sans tracking-[0.35em] uppercase text-[#7C4A2D] mb-3">
            {category.charAt(0).toUpperCase() + category.slice(1)} Guide
          </p>
          <h2
            className="font-serif font-light text-[#0A0908] mb-3"
            style={{ fontSize: 'clamp(1.6rem, 3vw, 2.5rem)' }}
          >
            {data.heading}
          </h2>
          <p className="font-sans text-[15px] text-[#7C4A2D] italic mb-5">{data.subheading}</p>
          <p className="font-sans text-[14px] text-[#5a5a5a] leading-[1.85] max-w-3xl">{data.intro}</p>
        </div>

        {/* Quick trust bullets */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-12">
          {data.bullets.map((b) => (
            <div
              key={b}
              className="flex items-start gap-2 bg-white border border-[#E0D4C4] px-4 py-3"
            >
              <span
                className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#7C4A2D] flex-shrink-0"
                aria-hidden="true"
              />
              <span className="font-sans text-[12px] text-[#3a3a3a] leading-snug">{b}</span>
            </div>
          ))}
        </div>

        {/* Long-form sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 mb-12">
          {data.sections.map(({ title, body }) => (
            <div key={title}>
              <h3 className="font-sans font-semibold text-[#0A0908] text-[14px] mb-3 pb-2 border-b border-[#E0D4C4]">
                {title}
              </h3>
              <p className="font-sans text-[13px] text-[#5a5a5a] leading-[1.85]">{body}</p>
            </div>
          ))}
        </div>

        {/* Closing CTA */}
        <div className="bg-[#F5EEE6] border border-[#E0D4C4] px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="font-sans text-[13px] text-[#3a3a3a] leading-relaxed max-w-lg">
            {data.closingCta}
          </p>
          <a
            href="/size-guide/"
            className="flex-shrink-0 font-sans text-[10.5px] uppercase tracking-widest text-[#7C4A2D] border border-[#7C4A2D] px-5 py-2.5 hover:bg-[#7C4A2D] hover:text-white transition-colors whitespace-nowrap"
          >
            Size Guide →
          </a>
        </div>

      </div>
    </section>
  )
}
