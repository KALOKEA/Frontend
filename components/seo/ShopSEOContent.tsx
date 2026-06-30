'use client'
import Link from 'next/link'
import { useState } from 'react'

// ── FAQ accordion item ────────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-[#E0D4C4] last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left py-4 flex items-center justify-between gap-4 group"
        aria-expanded={open}
      >
        <span className="font-sans text-[14px] font-semibold text-[#0a0a0a] leading-snug">{q}</span>
        <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full border border-[#C49070] text-[#C49070] text-xs transition-transform duration-200"
          style={{ transform: open ? 'rotate(45deg)' : 'none' }} aria-hidden="true">+</span>
      </button>
      {open && (
        <div className="pb-4 pr-8">
          <p className="font-sans text-[13px] text-[#6B6B6B] leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  )
}

// ── Stat pill ─────────────────────────────────────────────────────────────────
function Stat({ num, label }: { num: string; label: string }) {
  return (
    <div className="text-center px-4 py-5">
      <p className="font-serif text-3xl text-[#7C4A2D] font-light mb-1">{num}</p>
      <p className="font-sans text-[11px] uppercase tracking-widest text-[#6B6B6B]">{label}</p>
    </div>
  )
}

// ── Category card ─────────────────────────────────────────────────────────────
function CatCard({ href, name, desc }: { href: string; name: string; desc: string }) {
  return (
    <Link href={href} className="block border border-[#E0D4C4] p-5 hover:border-[#C49070] transition-colors group">
      <h3 className="font-serif text-[15px] text-[#0a0a0a] mb-1 group-hover:text-[#7C4A2D] transition-colors">{name}</h3>
      <p className="font-sans text-[12px] text-[#6B6B6B] leading-relaxed">{desc}</p>
    </Link>
  )
}

// ── Main SEO content component ────────────────────────────────────────────────

const FAQS = [
  {
    q: 'What types of women\'s clothing does Kalokea sell?',
    a: 'Kalokea offers a wide range of women\'s fashion including dresses (maxi, midi, mini, bodycon, wrap, and A-line styles), tops (crop tops, blouses, corsets, mesh tops, and shirts), bottoms (trousers, palazzos, skirts, shorts, and leggings), co-ord sets, jumpsuits, and fashion bags. Our catalogue is updated regularly with new arrivals that reflect the latest trends in contemporary Indian women\'s fashion.',
  },
  {
    q: 'Does Kalokea offer free shipping?',
    a: 'Yes! Kalokea offers free shipping on all orders above ₹999. For orders below ₹999, a flat shipping fee applies. We deliver across India through trusted courier partners including Shiprocket. Most orders are delivered within 4–7 business days depending on your location. Metro cities like Mumbai, Delhi, Bengaluru, Hyderabad, Pune, and Chennai typically receive orders faster (3–5 days).',
  },
  {
    q: 'What is Kalokea\'s return and exchange policy?',
    a: 'Kalokea offers a 7-day hassle-free return and exchange policy. If you are not completely satisfied with your purchase, you can initiate a return or exchange within 7 days of delivery. Items must be unworn, unwashed, and in original condition with all tags attached. Once we receive and inspect the returned item, a refund will be processed to your original payment method within 5–7 business days. Exchanges for a different size or colour are processed free of charge.',
  },
  {
    q: 'How do I find the right size at Kalokea?',
    a: 'Each product page includes a detailed size guide with measurements in centimetres and inches. We recommend measuring your bust, waist, and hips and comparing them to our size chart before placing an order. If you are between sizes, we suggest sizing up for a more comfortable fit. Our customer support team is also happy to help you choose the right size via WhatsApp or email.',
  },
  {
    q: 'Are Kalokea clothes true to size?',
    a: 'Most Kalokea garments are true to standard Indian sizing. However, as fits can vary by style and fabric, we always recommend checking the specific size chart on each product page. Some of our stretchy fabrics (like ribbed knit and spandex blends) offer more flexibility, while structured pieces like corsets and blazers tend to run truer to the listed measurements. Customer reviews often mention fit details which can also be helpful.',
  },
  {
    q: 'What payment methods does Kalokea accept?',
    a: 'Kalokea accepts all major payment methods including UPI (Google Pay, PhonePe, Paytm, BHIM), Credit Cards (Visa, Mastercard, Rupay), Debit Cards, Net Banking, and Cash on Delivery (COD) for eligible pin codes across India. All online payments are secured through Razorpay, India\'s most trusted payment gateway, with 256-bit SSL encryption.',
  },
  {
    q: 'Is Cash on Delivery (COD) available?',
    a: 'Yes, Cash on Delivery is available on most products and pin codes across India. During checkout, COD availability will be shown based on your delivery pin code. Please note that for COD orders, the delivery partner will collect the exact order amount in cash at the time of delivery. COD orders may take an additional 1–2 days to process compared to prepaid orders.',
  },
  {
    q: 'How can I track my Kalokea order?',
    a: 'Once your order is dispatched, you will receive an SMS and email notification with your courier tracking number and the courier partner\'s name. You can track your order in real time from the "My Orders" section in your Kalokea account, or directly on the courier partner\'s tracking portal. You can also use the Track Order page on our website by entering your order number and registered email.',
  },
  {
    q: 'Does Kalokea provide GST invoices?',
    a: 'Yes, Kalokea is a GST-registered business (GSTIN: 24HRYPK5081F1Z8) and provides valid GST tax invoices for all purchases. Your GST invoice is automatically generated and available for download from the "My Orders" section within your account. If you require a B2B invoice with your company name and GSTIN, you can enter these details during the checkout process under the GST Invoice option.',
  },
  {
    q: 'How do I care for Kalokea garments?',
    a: 'Care instructions vary by fabric type. Most Kalokea garments come with care labels. As a general guide: machine wash delicate fabrics like chiffon and lace on a gentle cycle with cold water; hand wash silk and satin; tumble dry on low for cotton; and dry clean only for heavily embellished or structured pieces. Avoid bleach on coloured garments and iron on the reverse side for printed fabrics. Detailed care instructions are also listed on each product page under the "Fabric & Care" tab.',
  },
  {
    q: 'Can I cancel my order after placing it?',
    a: 'You can cancel your order within a short window after placing it (before it is dispatched for shipping). To cancel, go to "My Orders" in your account and select the Cancel Order option. If the order has already been dispatched, you can still return it once received using our 7-day return policy. For prepaid orders, the refund will be credited to your original payment method. COD orders do not have a refund to process for returns.',
  },
  {
    q: 'Does Kalokea restock sold-out items?',
    a: 'Popular items are regularly restocked at Kalokea. If a product or specific size is out of stock, you can use the "Notify Me" / Back-in-Stock feature on the product page to receive an email alert as soon as it is restocked. You can also follow us on Instagram (@kalokea) for the latest restock announcements and new arrivals. Some limited-edition pieces are not restocked, so we recommend adding wishlist items to cart as soon as your size is available.',
  },
  {
    q: 'Are there any ongoing discounts or coupon codes?',
    a: 'Kalokea regularly runs seasonal sales, festive offers, and exclusive discount campaigns. You can find active coupon codes and promotions on our website\'s banner and via our newsletter. Subscribe to the Kalokea newsletter to receive exclusive subscriber-only discount codes directly in your inbox. First-time customers may also receive a welcome discount on their first order. Follow us on Instagram for flash sale announcements.',
  },
  {
    q: 'How do I know if a product is authentic and good quality?',
    a: 'Every Kalokea product is sourced and quality-checked by our in-house team before being listed. We prioritise premium fabrics and clean finishes. You can read verified customer reviews on each product page — these include star ratings and detailed feedback from customers who have purchased and worn the item. Our Verified Purchase badge confirms that the reviewer actually bought the product through Kalokea.',
  },
  {
    q: 'Does Kalokea ship internationally?',
    a: 'Currently, Kalokea ships only within India. We are working on expanding our international shipping to countries with a large Indian diaspora such as UAE, USA, UK, Canada, and Australia. If you are based outside India, you can subscribe to our newsletter to be notified when international shipping becomes available. For urgent international orders, please contact us via the Contact page.',
  },
  {
    q: 'How do I contact Kalokea customer support?',
    a: 'You can reach Kalokea\'s customer support team through multiple channels: WhatsApp (click the WhatsApp button on our website for instant messaging), the Contact form on our Contact page, or by email. Our support team is available Monday to Saturday, 10 AM to 6 PM IST. For urgent order-related queries, WhatsApp is typically the fastest channel for a response.',
  },
  {
    q: 'Does Kalokea have a loyalty programme or referral scheme?',
    a: 'Kalokea is currently developing a loyalty rewards programme for our regular customers. In the meantime, we encourage customers to share their honest reviews and tag us on Instagram — we regularly feature customer photos and offer special appreciation gifts for our brand advocates. Stay tuned for our official loyalty programme launch by subscribing to our newsletter.',
  },
  {
    q: 'What makes Kalokea different from other online women\'s fashion brands in India?',
    a: 'Kalokea is a curated D2C (direct-to-consumer) fashion brand, which means every piece in our collection is hand-picked by our style team for quality, fit, and aesthetic appeal. Unlike marketplace platforms where quality can be inconsistent, Kalokea\'s products go through our own quality check before reaching you. We focus on contemporary women\'s fashion with clean cuts, modern silhouettes, and versatile styling — clothes that make you look and feel your best for everyday wear, college, work, or evenings out.',
  },
]

export default function ShopSEOContent() {
  return (
    <section className="bg-[#FDFAF6] border-t border-[#E8DDD3] mt-20 pt-16 pb-20">

      {/* ── Stats strip ──────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#E0D4C4] border border-[#E0D4C4]">
          <Stat num="500+" label="Styles Available" />
          <Stat num="10K+" label="Happy Customers" />
          <Stat num="4.8★" label="Average Rating" />
          <Stat num="7-Day" label="Easy Returns" />
        </div>
      </div>

      {/* ── About Kalokea ─────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-16">
        <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C49070] mb-3">About the Brand</p>
        <h2 className="font-serif text-3xl md:text-4xl text-[#0a0a0a] mb-6 leading-tight">
          Kalokea — Contemporary Women&apos;s Fashion, Made for Modern India
        </h2>
        <div className="prose prose-sm max-w-none font-sans text-[#5a5a5a] leading-relaxed space-y-4 text-[13.5px]">
          <p>
            Kalokea is a premium direct-to-consumer (D2C) women&apos;s fashion brand based in India, committed to delivering high-quality contemporary clothing that celebrates the modern Indian woman. From effortlessly chic everyday essentials to statement-making party outfits, Kalokea&apos;s curated catalogue spans a wide range of styles — dresses, tops, co-ord sets, bottoms, and fashion bags — all designed with the real woman in mind.
          </p>
          <p>
            In a sea of fast fashion and mass-market clothing, Kalokea stands apart by obsessing over fabric quality, fit, and finish. Every garment that makes it to our online store has been carefully reviewed by our in-house style team for cut, construction, and wearability. We believe that fashion should not just look good on a hanger — it should feel incredible when you wear it, boost your confidence, and hold up through the rigours of daily life.
          </p>
          <p>
            Kalokea was born from a simple observation: women in India have increasingly sophisticated tastes in fashion, deeply influenced by global trends they discover on Instagram, Pinterest, and YouTube — yet finding those styles in the right size, at an honest price, with the assurance of quality, remains a persistent challenge. We built Kalokea to solve exactly that problem. Our collections draw inspiration from international runways, street style, and the vibrant cultural fabric of contemporary Indian life, then translate those inspirations into clothes that work for our bodies, our climate, and our lifestyles.
          </p>
          <p>
            Whether you are shopping for a relaxed weekend look, a polished office ensemble, a date-night outfit, or a festive celebration dress, Kalokea has something for every occasion. Our diverse size range (XS to XL) and detailed size guides ensure that you can shop with confidence and find the fit that works for you. With nationwide delivery, a 7-day return policy, COD availability, and responsive customer support, shopping with Kalokea is as seamless as it is satisfying.
          </p>
          <p>
            We are a proud Indian brand, built on the values of transparency, quality, and genuine customer care. Every positive review, every Instagram tag, every repeat purchase from a loyal Kalokea customer fuels our passion to keep curating, keep innovating, and keep delivering fashion that makes women feel seen, stylish, and celebrated.
          </p>
        </div>
      </div>

      {/* ── Shop by Category ──────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-16">
        <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C49070] mb-3">Explore</p>
        <h2 className="font-serif text-2xl md:text-3xl text-[#0a0a0a] mb-6">Shop by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <CatCard href="/shop/?category=dresses" name="Dresses" desc="Maxi, midi, mini, bodycon, wrap dresses and more. From casual sundresses to elegant evening wear." />
          <CatCard href="/shop/?category=tops" name="Tops" desc="Crop tops, blouses, corsets, mesh panel tops, shirts and bodysuits for every style." />
          <CatCard href="/shop/?category=bottoms" name="Bottoms" desc="Trousers, palazzos, skirts, shorts, and co-ord sets for a complete polished look." />
          <CatCard href="/shop/?category=bags" name="Bags" desc="Trendy tote bags, sling bags, clutches, and mini bags to complete every outfit." />
        </div>
        <div className="space-y-4 font-sans text-[13.5px] text-[#5a5a5a] leading-relaxed">
          <p>
            <strong className="text-[#0a0a0a]">Women&apos;s Dresses Online India:</strong> Our dress collection is one of our most-loved categories. Whether you&apos;re looking for a flowy <Link href="/shop/?category=dresses" className="text-[#7C4A2D] hover:underline">maxi dress</Link> for a beach vacation, a sleek bodycon for a night out, a romantic wrap dress for brunch, or a modest midi dress for the office, Kalokea has you covered. We stock dresses in a variety of fabrics — breathable cotton for summer, luxurious satin for evenings, stretchy knit for a flattering fit, and sheer chiffon for layered looks. Our dress edit is updated with every season&apos;s trending silhouettes, colours, and prints, so you will always find something fresh and exciting.
          </p>
          <p>
            <strong className="text-[#0a0a0a]">Women&apos;s Tops &amp; Blouses Online:</strong> Tops are the workhorses of any wardrobe, and at Kalokea, we take them seriously. Our <Link href="/shop/?category=tops" className="text-[#7C4A2D] hover:underline">tops collection</Link> spans everything from relaxed cotton shirts and elegant satin blouses to trendy mesh panel tops, structured corset tops, and playful crop tops. Whether you&apos;re building a capsule wardrobe of classics or hunting for a statement piece, our tops are designed to pair effortlessly with jeans, trousers, skirts, and palazzos. Many of our tops come in co-ord sets that can also be purchased as separates.
          </p>
          <p>
            <strong className="text-[#0a0a0a]">Women&apos;s Bottoms &amp; Trousers:</strong> A great pair of trousers, a well-cut skirt, or a flattering palazzo can transform your entire wardrobe. Kalokea&apos;s <Link href="/shop/?category=bottoms" className="text-[#7C4A2D] hover:underline">bottoms range</Link> includes wide-leg trousers, cigarette pants, flared skirts, mini skirts, Bermuda shorts, and more. We focus on fits that are both comfortable and stylish — high-waisted cuts that elongate the silhouette, elastic waistbands for all-day comfort, and versatile neutral colours that work with virtually everything in your wardrobe.
          </p>
          <p>
            <strong className="text-[#0a0a0a]">Women&apos;s Fashion Bags Online India:</strong> No outfit is complete without the right bag. Kalokea&apos;s <Link href="/shop/?category=bags" className="text-[#7C4A2D] hover:underline">bags collection</Link> features everything from compact evening clutches and chic sling bags to practical tote bags and on-trend mini bags. Our bags are curated for their design, durability, and versatility — pieces that will work across multiple looks and seasons.
          </p>
        </div>
      </div>

      {/* ── Style Guide ───────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-16">
        <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C49070] mb-3">Style Guide</p>
        <h2 className="font-serif text-2xl md:text-3xl text-[#0a0a0a] mb-6">How to Style Women&apos;s Fashion in 2026</h2>
        <div className="space-y-10 font-sans text-[13.5px] text-[#5a5a5a] leading-relaxed">

          <div>
            <h3 className="font-serif text-[17px] text-[#0a0a0a] mb-3">1. Building a Capsule Wardrobe</h3>
            <p className="mb-3">
              A capsule wardrobe is a curated collection of timeless, versatile pieces that work together seamlessly. The beauty of a capsule wardrobe is that every item earns its place — nothing sits unworn at the back of your closet. For the modern Indian woman, a well-planned capsule wardrobe might include a white cotton shirt, a pair of perfectly fitted wide-leg trousers, a classic black bodycon dress, a silk slip dress that works day-to-night, a co-ord set for effortless outfits, and a few seasonal statement pieces.
            </p>
            <p>
              At Kalokea, we make it easy to build your capsule wardrobe with our curated collections. Look for pieces in versatile neutral tones — ivory, black, camel, nude, and forest green — that mix and match across different looks. Add colour and personality with our seasonal statement pieces in vibrant prints, bold monochromes, and textural fabrics.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-[17px] text-[#0a0a0a] mb-3">2. Dressing for Your Body Type</h3>
            <p className="mb-3">
              Great fashion is about celebrating your body, not hiding it. Understanding your natural silhouette helps you choose cuts and styles that make you feel confident and beautiful. Here are some broad guidelines:
            </p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Hourglass figure:</strong> Lucky you — most cuts work beautifully on an hourglass frame. Lean into wrap dresses, belted styles, and bodycon silhouettes that celebrate your waist. High-waisted bottoms with tucked-in tops are a classic combination.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Pear shape (wider hips):</strong> Draw attention upward with bold tops, off-shoulder styles, and statement necklines. A-line and flared skirts gracefully skim over the hips. Wide-leg trousers create a beautiful balanced silhouette.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Apple shape (fuller midsection):</strong> Empire waistlines, wrap styles, and flowy maxi dresses are your friends. V-necklines elongate and open up the upper body beautifully. Avoid anything that cinches exactly at the widest point.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Petite frames:</strong> Opt for fitted or tailored silhouettes, midi hemlines worn a little above the knee, and monochromatic looks that create a long, unbroken vertical line. Cropped tops with high-waisted bottoms work wonderfully to create the illusion of longer legs.</p>
            <p><strong className="text-[#3a3a3a]">Athletic/straight frame:</strong> Create curves with peplum tops, ruffled details, tiered skirts, and wrap styles. Colour-blocking — a dark top with a lighter bottom or vice versa — is a stylish technique to add visual dimension.</p>
          </div>

          <div>
            <h3 className="font-serif text-[17px] text-[#0a0a0a] mb-3">3. Dressing for Every Occasion</h3>
            <p className="mb-3">
              One of the hallmarks of a well-built wardrobe is versatility — the ability to dress up or down the same piece for different occasions. At Kalokea, we design with versatility in mind.
            </p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Office &amp; Professional:</strong> Opt for structured blazers, tailored trousers, midi dresses in solid colours or subtle prints, and classic blouses. Our co-ord sets in satin or crepe are particularly popular for the office — they look polished with minimal effort.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">College &amp; Casual:</strong> Denim-friendly tops, relaxed-fit crop shirts, high-waisted shorts, and comfortable co-ord sets are everyday staples. Our graphic-inspired prints and ribbed knit pieces are favourites among college students.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Date Night &amp; Evening Out:</strong> Bodycon mini dresses, satin slip dresses, corset tops with wide-leg trousers, and cutout styles make for stunning evening looks. Pair with strappy heels, a statement clutch from our bags collection, and bold jewellery.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Festive &amp; Celebratory:</strong> Indian festive occasions call for something special. Our embellished dresses, sequin tops, and rich jewel-toned pieces are perfect for Diwali, Eid, Christmas, and family celebrations.</p>
            <p><strong className="text-[#3a3a3a]">Vacations &amp; Travel:</strong> Flowy maxi dresses, lightweight linen-blend co-ord sets, and versatile wrap dresses are ideal travel companions — easy to pack, easy to wear, and elegant in photos.</p>
          </div>

          <div>
            <h3 className="font-serif text-[17px] text-[#0a0a0a] mb-3">4. Trending Styles in Women&apos;s Fashion 2026</h3>
            <p className="mb-3">
              Fashion in 2026 is characterised by a fascinating tension between quiet luxury and bold self-expression. Here are the key trends shaping women&apos;s fashion this year, all of which you will find well-represented in Kalokea&apos;s current collection:
            </p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Mesh and Sheer Fabrics:</strong> Mesh panel inserts, sheer overlays, and translucent tops continue to dominate the fashion conversation. At Kalokea, our mesh panel corset tops and ribbed mesh dresses have been bestsellers. The key to wearing sheer styles confidently is layering — a fitted cami or bralette underneath adds coverage while maintaining the effect.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Corset-Inspired Silhouettes:</strong> The corset trend shows no sign of slowing down. From structured boning to softer bralette-style corset tops, this silhouette cinches and defines the waist beautifully. Wear as a top with jeans or trousers, or layer over a shirt for a street-style-inspired look.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Monochrome Co-ord Sets:</strong> Co-ord sets remain one of the most popular categories in Indian women&apos;s fashion because they eliminate outfit-planning effort. A matching top-and-trouser or crop-and-skirt set looks effortlessly put-together and photographs beautifully.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Satin and Silky Textures:</strong> The silk-look satin fabric continues its reign across dresses, blouses, and co-ord sets. These fabrics drape beautifully, photograph luxuriously, and feel elegant against the skin — making them popular for both everyday wear and special occasions.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Flared and Wide-Leg Silhouettes:</strong> Wide-leg trousers, flared jeans, and palazzo pants are firmly entrenched in mainstream fashion. Pair with a fitted, tucked-in top to balance the volume and create a chic, proportional look.</p>
            <p><strong className="text-[#3a3a3a]">Quiet Luxury Aesthetics:</strong> Minimalist, understated pieces in premium fabrics and neutral palettes — think taupe, off-white, camel, and dusty rose — are the hallmarks of the quiet luxury trend. This aesthetic is about quality over flashiness, timelessness over trend-chasing, and confidence that comes from knowing you look effortlessly elegant.</p>
          </div>

          <div>
            <h3 className="font-serif text-[17px] text-[#0a0a0a] mb-3">5. How to Style Co-ord Sets</h3>
            <p className="mb-3">
              Co-ord sets are one of the most versatile categories in women&apos;s fashion. While they are designed to be worn together, the real magic lies in styling each piece individually. Here are some creative ways to maximise your co-ord set investment:
            </p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Wear them as designed:</strong> A matching set worn together looks instantly polished and intentional — perfect for events, dates, or days when you want to look put-together with zero effort. Accessories are key: a statement necklace, strappy sandals, and a clutch complete the look.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Mix with separates:</strong> Style the co-ord top with your favourite jeans, or pair the co-ord skirt or trousers with a solid-colour top. This extends the wearability of your co-ord set significantly.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Layer with outerwear:</strong> A co-ord set under a blazer or denim jacket takes the look from casual to smart-casual effortlessly.</p>
            <p><strong className="text-[#3a3a3a]">Colour-coordinate:</strong> When breaking up a co-ord set, try introducing a third neutral colour that bridges the two matching pieces. For example, a camel co-ord set styled with the top + black jeans could add white sneakers to tie the look together.</p>
          </div>

          <div>
            <h3 className="font-serif text-[17px] text-[#0a0a0a] mb-3">6. Choosing the Right Fabric for Indian Weather</h3>
            <p className="mb-3">
              India&apos;s diverse climate — from humid coastal cities to dry heat in the north and cool hill stations — means that fabric choice matters enormously. Here&apos;s a quick guide to choosing the right fabrics for different Indian conditions:
            </p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Summer / Hot &amp; Humid:</strong> Choose lightweight, breathable fabrics like cotton, linen, rayon, and georgette. These fabrics allow air circulation, absorb moisture, and keep you cool. Avoid synthetic fabrics like polyester in the peak of summer as they can feel sticky.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Monsoon:</strong> Quick-drying fabrics are your best bet during the monsoon. Polyester blends and synthetic fabrics actually come into their own here as they dry faster than cotton. Avoid heavy fabrics like denim and velvet that take a long time to dry and can become uncomfortable when wet.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Winter / Cooler months:</strong> Layer with knit fabrics, ribbed textures, and heavier blends. Our ribbed knit dresses, corset tops, and structured co-ord sets in thicker fabrics are perfect for the cooler months in northern and central India. Satin and silk-look fabrics also add a touch of warmth compared to lightweight chiffon.</p>
            <p><strong className="text-[#3a3a3a]">Year-round versatility:</strong> Crepe and satin-look fabrics work beautifully across seasons — they are not too heavy for summer evenings (especially with air conditioning) and not too thin for cooler months. These are the most versatile fabrics in our collection and the most popular year-round.</p>
          </div>
        </div>
      </div>

      {/* ── Why Kalokea ───────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-16">
        <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C49070] mb-3">Why Choose Us</p>
        <h2 className="font-serif text-2xl md:text-3xl text-[#0a0a0a] mb-6">Why Women Across India Love Shopping at Kalokea</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[
            { title: 'Curated Quality', body: 'Every product is hand-selected and quality-checked by our team. We reject pieces that don\'t meet our standards for fabric quality, stitch finish, and accurate sizing before they ever reach our catalogue.' },
            { title: 'Fair, Transparent Pricing', body: 'No hidden fees. The price you see includes what you pay. We display the original price and sale price honestly, with the exact discount clearly shown. GST is separately calculated at checkout.' },
            { title: 'Size-Inclusive Range', body: 'We stock sizes from XS to XL across most of our range, with detailed measurement-based size guides for every product. We are continuously working to expand our size range.' },
            { title: 'Fast, Pan-India Delivery', body: 'We ship to 19,000+ pin codes across India through reliable courier partners. Metro orders typically arrive in 3–5 days; other locations in 5–7 days. Tracking provided on every order.' },
            { title: 'Hassle-Free 7-Day Returns', body: 'Changed your mind or need a different size? Our 7-day return and exchange policy makes it easy to shop without worry. Our customer support team handles returns with care and speed.' },
            { title: 'Secure Payments', body: 'All transactions are protected by Razorpay\'s 256-bit SSL encryption. We accept UPI, cards, net banking, and COD. We never store your payment details.' },
            { title: 'Real Customer Reviews', body: 'All reviews on Kalokea product pages are from real customers who have purchased and received the product. Our Verified Purchase badge gives you additional confidence in review authenticity.' },
            { title: 'Responsive Customer Care', body: 'Our dedicated support team is available via WhatsApp and email, Monday to Saturday. We typically respond within a few hours and resolve most queries on the same day.' },
          ].map(({ title, body }) => (
            <div key={title} className="flex gap-3">
              <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-[#7C4A2D] flex items-center justify-center">
                <svg width="9" height="9" viewBox="0 0 12 10" fill="none" aria-hidden="true">
                  <path d="M1 5l3.5 3.5L11 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <p className="font-sans text-[13px] font-semibold text-[#0a0a0a] mb-0.5">{title}</p>
                <p className="font-sans text-[12.5px] text-[#6B6B6B] leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4 font-sans text-[13.5px] text-[#5a5a5a] leading-relaxed">
          <p>
            Shopping for clothes online can be a gamble — but at Kalokea, we have worked hard to eliminate that uncertainty. Our product photography shows clothes on real-bodied models with the model&apos;s height mentioned, so you can visualise how a dress or top will actually look when worn, not just how it looks flat on a hanger. Our detailed size charts use actual body measurements (not just S/M/L labels that mean different things to different brands), so you can make an accurate size choice before ordering.
          </p>
          <p>
            We believe in building long-term relationships with our customers, not just making one-off sales. That philosophy shows up in every aspect of how we operate: the honest descriptions we write, the transparent pricing we maintain, the genuine customer reviews we collect and display, the fair return policy we uphold, and the responsive support team that stands behind every order. When you shop at Kalokea, you are not just buying a piece of clothing — you are investing in a positive shopping experience backed by a brand that genuinely cares about your satisfaction.
          </p>
        </div>
      </div>

      {/* ── Fabric & Care ─────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-16">
        <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C49070] mb-3">Care Guide</p>
        <h2 className="font-serif text-2xl md:text-3xl text-[#0a0a0a] mb-6">Fabric Guide &amp; Garment Care Tips</h2>
        <div className="space-y-5 font-sans text-[13.5px] text-[#5a5a5a] leading-relaxed">
          <p>
            Taking care of your Kalokea clothes properly extends their life and keeps them looking as good as the day you bought them. Here is our comprehensive guide to fabric care for the most common materials in our collection:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5">
            {[
              { fabric: 'Cotton', care: 'Machine washable at 30°C on a gentle cycle. Tumble dry on low or air dry flat. Iron on a medium-high setting when slightly damp for best results. Pre-treat stains before washing. Cotton can shrink slightly on first wash — size up if you prefer a more relaxed fit.' },
              { fabric: 'Satin / Satin-look (Polyester)', care: 'Hand wash in cold water with mild detergent, or machine wash on delicate cycle in a mesh laundry bag. Do not wring. Lay flat to dry or hang immediately. Iron on the lowest setting through a cloth or steam from a distance. Avoid harsh chemicals that can dull the sheen.' },
              { fabric: 'Chiffon / Georgette', care: 'Hand wash gently in cold water. These delicate fabrics are prone to snagging, so handle with care. Avoid rubbing or wringing. Hang to drip-dry away from direct sunlight. Iron on the lowest setting on the reverse side. Dry cleaning is recommended for heavily embellished chiffon pieces.' },
              { fabric: 'Ribbed Knit / Jersey', care: 'Machine wash on a gentle/delicate cycle in cold water. Reshape and lay flat to dry to prevent stretching out of shape. Avoid tumble drying on high heat as this can cause shrinkage. Ribbed knit is generally low-maintenance and easy to care for.' },
              { fabric: 'Linen / Linen Blend', care: 'Machine washable on a gentle cycle. Linen wrinkles naturally — embrace it for a casual look, or iron on a high setting while still damp for a crisp finish. Linen softens beautifully with each wash. Avoid tumble drying on high heat to prevent significant shrinkage.' },
              { fabric: 'Mesh / Net Fabric', care: 'Hand wash in cold water or machine wash on delicate in a mesh bag. Avoid fabric softener which can clog the open weave. Lay flat to dry. Do not iron directly on mesh — use a damp cloth or steam from a distance.' },
              { fabric: 'Velvet', care: 'Dry clean only for the best results. If you must hand wash, use cold water and gentle soap, and handle very carefully as velvet can crush easily. To restore the pile, steam gently and brush in one direction with a soft-bristle brush. Never iron directly on velvet.' },
              { fabric: 'Crepe', care: 'Dry clean recommended for structured crepe pieces. For lighter crepe fabrics, hand wash in cold water with mild soap. Hang to dry. Iron on medium heat with steam, on the reverse side. Crepe holds its shape well and is one of the most low-maintenance premium fabrics.' },
            ].map(({ fabric, care }) => (
              <div key={fabric}>
                <p className="font-semibold text-[#0a0a0a] text-[13px] mb-1">{fabric}</p>
                <p className="text-[12.5px] text-[#6B6B6B]">{care}</p>
              </div>
            ))}
          </div>
          <p>
            <strong className="text-[#0a0a0a]">General tips for making clothes last longer:</strong> Turn garments inside out before washing to protect the outer surface. Use a colour-catcher sheet when washing dark or vibrant colours for the first few times. Store knitwear folded rather than hung to prevent stretching. Use padded or velvet hangers for delicate fabrics. Keep embellished pieces in garment bags to prevent jewellery from snagging. Wash less frequently — spot cleaning between wears extends the life of your clothes significantly.
          </p>
        </div>
      </div>

      {/* ── Size Guide ────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-16">
        <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C49070] mb-3">Sizing</p>
        <h2 className="font-serif text-2xl md:text-3xl text-[#0a0a0a] mb-4">Women&apos;s Size Guide — How to Measure</h2>
        <p className="font-sans text-[13.5px] text-[#5a5a5a] leading-relaxed mb-6">
          Getting your measurements right is the single most important thing you can do to ensure a great fit when shopping online. All you need is a soft measuring tape. Take measurements in centimetres (cm) for accuracy. Measure over your undergarments or fitted clothing, not over bulky layers. Stand naturally without tensing your muscles. Here is how to take each key measurement:
        </p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-[12px] font-sans border-collapse">
            <thead>
              <tr className="bg-[#7C4A2D] text-white">
                <th className="text-left py-2.5 px-3 font-semibold">Measurement</th>
                <th className="text-left py-2.5 px-3 font-semibold">How to Measure</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Bust', 'Measure around the fullest part of your chest, keeping the tape horizontal and parallel to the floor. Do not pull the tape tight — it should be snug but comfortable.'],
                ['Waist', 'Measure around the narrowest part of your natural waist, typically about 2 cm above your belly button. Breathe out normally before measuring.'],
                ['Hips', 'Stand with feet together and measure around the fullest part of your hips and buttocks, keeping the tape parallel to the floor.'],
                ['Inseam', 'Measure from the crotch seam to the bottom of the leg. This is particularly important for trousers and palazzos.'],
                ['Shoulder Width', 'Measure from the edge of one shoulder (where the shoulder seam sits) to the other. This measurement is key for tops and dresses.'],
                ['Length', 'For dresses and skirts, length is measured from the highest point of the shoulder (or from the waist, depending on the style) to the hem.'],
              ].map(([m, desc], i) => (
                <tr key={m} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FAF6F1]'}>
                  <td className="py-2.5 px-3 font-semibold text-[#0a0a0a] whitespace-nowrap align-top">{m}</td>
                  <td className="py-2.5 px-3 text-[#6B6B6B]">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-[12px] font-sans border-collapse">
            <thead>
              <tr className="bg-[#1a1208] text-white">
                {['Size', 'Bust (cm)', 'Waist (cm)', 'Hips (cm)'].map(h => (
                  <th key={h} className="text-left py-2.5 px-3 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['XS', '76–80', '60–64', '84–88'],
                ['S', '80–84', '64–68', '88–92'],
                ['M', '84–88', '68–72', '92–96'],
                ['L', '88–92', '72–76', '96–100'],
                ['XL', '92–96', '76–80', '100–104'],
              ].map(([size, bust, waist, hips], i) => (
                <tr key={size} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FAF6F1]'}>
                  <td className="py-2.5 px-3 font-bold text-[#7C4A2D]">{size}</td>
                  <td className="py-2.5 px-3 text-[#6B6B6B]">{bust}</td>
                  <td className="py-2.5 px-3 text-[#6B6B6B]">{waist}</td>
                  <td className="py-2.5 px-3 text-[#6B6B6B]">{hips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="font-sans text-[12px] text-[#6B6B6B]">
          Note: Size measurements are guidelines. Exact fit depends on the garment&apos;s style and fabric stretch. When between sizes, we recommend going up a size for a more comfortable fit. Each product page has style-specific sizing notes in the product description and size guide.
        </p>
      </div>

      {/* ── Delivery & Returns ────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-16">
        <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C49070] mb-3">Shipping &amp; Returns</p>
        <h2 className="font-serif text-2xl md:text-3xl text-[#0a0a0a] mb-6">Shipping &amp; Return Policy Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-sans text-[13.5px] text-[#5a5a5a] leading-relaxed">
          <div>
            <h3 className="font-serif text-[16px] text-[#0a0a0a] mb-3">Delivery Information</h3>
            <p className="mb-2">Kalokea ships pan-India to over 19,000 pin codes. All orders are dispatched within 1–2 business days of placement. Once dispatched, a tracking number is provided via SMS and email.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Metro cities</strong> (Mumbai, Delhi, Bengaluru, Hyderabad, Chennai, Pune, Kolkata): 3–5 business days.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Tier 2 &amp; Tier 3 cities:</strong> 5–7 business days.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Remote/hilly areas:</strong> 7–10 business days.</p>
            <p><strong className="text-[#3a3a3a]">Free shipping</strong> on orders above ₹999. A nominal shipping fee applies to orders below ₹999.</p>
          </div>
          <div>
            <h3 className="font-serif text-[16px] text-[#0a0a0a] mb-3">Returns &amp; Exchanges</h3>
            <p className="mb-2">We offer a <strong className="text-[#3a3a3a]">7-day return and exchange window</strong> from the date of delivery. To initiate a return, go to My Orders in your account or contact our support team via WhatsApp.</p>
            <p className="mb-2">Items must be unworn, unwashed, and with original tags attached. Sale items may have different return conditions — please check the product page.</p>
            <p className="mb-2">Refunds for prepaid orders are processed within <strong className="text-[#3a3a3a]">5–7 business days</strong> of us receiving and inspecting the returned item.</p>
            <p>Exchanges for different sizes or colours are processed free of charge, subject to stock availability.</p>
          </div>
        </div>
      </div>

      {/* ── Complete Fashion Guide ────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-16">
        <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C49070] mb-3">The Kalokea Edit</p>
        <h2 className="font-serif text-2xl md:text-3xl text-[#0a0a0a] mb-6">The Complete Women&apos;s Fashion Guide for 2026</h2>
        <div className="space-y-10 font-sans text-[13.5px] text-[#5a5a5a] leading-relaxed">

          <div>
            <h3 className="font-serif text-[17px] text-[#0a0a0a] mb-3">Understanding Women&apos;s Fashion Trends: How Trends Work and How to Use Them</h3>
            <p className="mb-3">
              Fashion trends can feel overwhelming — a new &quot;it&quot; silhouette every season, a new colour palette every year, a new &quot;must-have&quot; piece landing in your feed every week. But understanding how trends actually work makes it far easier to shop smartly and dress with intention rather than anxiety.
            </p>
            <p className="mb-3">
              Trends begin at the top of the fashion pyramid: the haute couture houses of Paris, Milan, London, and New York show collections that set the aesthetic direction for the industry. These trickle down through ready-to-wear designer brands, then into high street and D2C fashion brands like Kalokea, and finally into mainstream retail. By the time a trend reaches everyday shoppers, it has been refined, made wearable, and priced accessibly.
            </p>
            <p className="mb-3">
              The key to using trends well is selectivity. Not every trend will work for your body, your lifestyle, or your existing wardrobe. A smarter approach is to identify the 2–3 trends each season that genuinely excite you, and invest in affordable, versatile versions of those specific pieces. For everything else, stick to your timeless wardrobe staples — the pieces that have served you well season after season.
            </p>
            <p>
              At Kalokea, we edit our collections with exactly this philosophy. We do not flood our catalogue with every micro-trend that appears online. Instead, we curate the trends that are wearable for real Indian women, in real Indian climates and lifestyles, with real wardrobes to integrate them into. Our buyers are experienced style-watchers who understand what will actually be worn and loved versus what will gather dust after one Instagram photo.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-[17px] text-[#0a0a0a] mb-3">How to Shop Women&apos;s Fashion Online: A Practical Guide</h3>
            <p className="mb-3">
              Online shopping for women&apos;s clothing has transformed the Indian fashion landscape over the past decade. Millions of women across India — from tier-1 metros to smaller towns — now discover and purchase fashion primarily online. Yet with so many options, shopping online can sometimes feel frustrating: wrong sizes, misleading product photos, poor quality upon delivery, and complicated return processes.
            </p>
            <p className="mb-3">
              Here is our practical guide to shopping women&apos;s fashion online in India, developed from years of experience in the industry:
            </p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Read the size chart carefully.</strong> Do not just go by your usual S/M/L — different brands size their clothes differently. Always measure your bust, waist, and hips and compare those measurements to the brand&apos;s actual size chart. This is the single most effective way to avoid size-related returns.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Look at customer photos, not just model photos.</strong> Model photos are shot in controlled conditions with professional lighting and styling. Customer photos in reviews show how the piece actually looks in real life, on real people with similar body types to yours. At Kalokea, we encourage and feature customer photos for exactly this reason.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Read the fabric description.</strong> Fabric determines comfort, fit, drape, care requirements, and how a garment looks after multiple washes. A &quot;satin&quot; garment made from polyester satin behaves very differently from one made from silk satin. Check the fabric composition before buying.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Check the return policy before ordering.</strong> Understand the return window, conditions, and refund method before placing an order. Kalokea&apos;s 7-day return policy is straightforward and customer-friendly, but policies vary significantly across brands and platforms.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Read reviews with a critical eye.</strong> Look for verified purchase reviews that mention specific details about fit, fabric, and quality. Be cautious of reviews that are overly generic or suspiciously positive. A healthy mix of detailed positive and constructive negative reviews is a sign of an authentic review ecosystem.</p>
            <p><strong className="text-[#3a3a3a]">Shop from curated stores rather than mass marketplaces for quality assurance.</strong> Large marketplace platforms list products from thousands of sellers with varying quality standards. A curated D2C brand like Kalokea controls what goes into its catalogue, which means every piece you see has been reviewed by our team before being listed. This dramatically reduces the risk of a disappointing purchase.</p>
          </div>

          <div>
            <h3 className="font-serif text-[17px] text-[#0a0a0a] mb-3">Women&apos;s Fashion by Occasion: Complete Outfit Guides</h3>
            <p className="mb-3">Dressing well for every occasion is a skill that becomes easier with practice and the right wardrobe building blocks. Here are detailed outfit guides for the occasions Indian women most commonly dress for:</p>

            <p className="mb-2 font-semibold text-[#0a0a0a]">Office &amp; Professional Settings</p>
            <p className="mb-3">
              The modern Indian workplace has evolved significantly — many offices have moved away from rigid formal dress codes toward business casual, while creative industries have embraced smart casual or even casual. That said, dressing professionally remains important for making a positive impression and feeling confident in your workspace.
            </p>
            <p className="mb-3">
              For a traditional corporate environment, consider: tailored trousers in navy, black, or camel paired with a silk or satin blouse; a knee-length or midi dress in a structured fabric like crepe; a co-ord set in a neutral tone. For business casual workplaces, you have more flexibility: wide-leg trousers with a tucked-in blouse, a midi shirt dress, or well-fitting cropped trousers with a structured top.
            </p>
            <p className="mb-3">
              Avoid overly bright patterns, very short hemlines, revealing necklines, or extremely casual fabrics like jersey or knit for professional settings. Keep accessories clean and minimal. Your confidence should be the centrepiece, not your outfit.
            </p>

            <p className="mb-2 font-semibold text-[#0a0a0a]">College &amp; Campus Life</p>
            <p className="mb-3">
              College style is arguably the most fun category to dress for — you have creative freedom, the luxury of comfort, and a built-in audience of style-conscious peers. The key is finding the balance between self-expression and wearability.
            </p>
            <p className="mb-3">
              Popular choices for college: high-waisted jeans or shorts with a crop top or oversized shirt; co-ord sets in fun prints; casual dresses in cotton or jersey; relaxed-fit trousers with a fitted top. Comfort is paramount when you&apos;re walking between classes, sitting for hours, and transitioning from an AC classroom to an outdoor campus.
            </p>

            <p className="mb-2 font-semibold text-[#0a0a0a]">Evening &amp; Social Events</p>
            <p className="mb-3">
              Whether it&apos;s a restaurant dinner, a rooftop party, a club night, or a friend&apos;s wedding sangeet, evening events offer the perfect opportunity to step up your style. For dinner and social gatherings, a midi dress in satin or silk-look fabric is a perennial favourite — it reads as dressed-up without being overly formal. Bodycon dresses, corset-style tops with tailored trousers, and jumpsuits in luxe fabrics are also excellent choices.
            </p>
            <p className="mb-3">
              For more festive occasions like mehndi functions, cocktail parties, and sangeet evenings, embellished pieces, sequin tops, and rich jewel tones like emerald, burgundy, sapphire, and gold work beautifully. Layer with statement jewellery and style your hair to complete the look.
            </p>

            <p className="mb-2 font-semibold text-[#0a0a0a]">Weddings &amp; Festive Occasions</p>
            <p className="mb-3">
              Indian weddings are multi-day events with varying dress codes for different ceremonies. While many guests opt for traditional ethnic wear (sarees, lehengas, salwar kameez) for formal ceremonies, contemporary western wear is increasingly popular for pre-wedding functions and cocktail events. Kalokea&apos;s festive collection features dresses and sets that translate beautifully to these occasions — particularly pieces in rich fabrics, embellishments, and festive colour palettes.
            </p>

            <p className="mb-2 font-semibold text-[#0a0a0a]">Travel &amp; Vacations</p>
            <p className="mb-3">
              Travel outfits need to satisfy multiple demands simultaneously: they must be comfortable for long journeys, versatile enough for multiple settings (beach, restaurant, sightseeing), easy to pack, and photogenic enough for the inevitable travel photos. Flowy maxi dresses, lightweight co-ord sets, and wrap dresses excel in all these categories.
            </p>
            <p className="mb-3">
              For beach destinations, opt for lightweight, quick-drying fabrics — cotton and rayon blends are ideal. For city travel and hill stations, layer with a light jacket or shawl that can be added or removed. For international travel, aim for versatile neutral colours that mix and match, minimising the number of pieces you need to pack.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-[17px] text-[#0a0a0a] mb-3">Women&apos;s Fashion Glossary: Key Terms Every Shopper Should Know</h3>
            <p className="mb-3">Understanding the terminology used in fashion makes shopping online much easier. Here is a comprehensive glossary of the most important fashion terms you will encounter when shopping at Kalokea and across women&apos;s fashion:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3">
              {[
                ['A-line', 'A dress or skirt silhouette that is fitted at the hips and gradually widens toward the hem, resembling the shape of the letter A. Flattering on most body types.'],
                ['Bodycon', 'Short for "body-conscious" — a style of dress or skirt that fits very closely to the body, emphasising the figure. Typically made from stretchy fabric.'],
                ['Corset', 'Originally an undergarment worn to shape the waist, now used as outerwear. Corset tops feature structured boning and lace-up or hook-and-eye closures.'],
                ['Co-ord set', 'A matching set of two or more pieces (typically a top and bottom) in the same fabric and/or print, designed to be worn together or separately.'],
                ['Midi', 'A hemline that falls between the knee and ankle — typically mid-calf length. Midi dresses and skirts are considered versatile and wearable for most occasions.'],
                ['Maxi', 'A long hemline that reaches the ankle or floor. Maxi dresses are typically flowy and casual, while maxi skirts can be styled up or down.'],
                ['Mini', 'A hemline that falls significantly above the knee. Mini skirts and dresses are bold, youthful, and popular for casual and evening wear.'],
                ['Palazzo', 'Wide-leg trousers with a flowing, loose silhouette. A staple of Indian women\'s fashion, palazzos are comfortable and can be dressed up or down.'],
                ['Satin', 'A weave type that produces a smooth, glossy fabric surface with a subtle sheen. Satin can be made from silk or synthetic fibres (polyester satin is the most common in fashion).'],
                ['Chiffon', 'A lightweight, sheer, woven fabric with a slight texture. Commonly used for blouses, dresses, and layered pieces. Typically made from silk or polyester.'],
                ['Crepe', 'A fabric with a crinkled or granular texture, typically with a good drape and structure. Crepe is a popular fabric for professional wear and dresses because of its elegant appearance.'],
                ['Ruching', 'A gathering or pleating technique that creates textured folds of fabric. Ruching is commonly used on the sides of bodycon dresses to disguise the fit and add visual interest.'],
                ['Peplum', 'A short, flared ruffle attached to the waist of a top, dress, or skirt. Peplum styles are flattering for creating the illusion of curves on straight or athletic frames.'],
                ['Off-shoulder', 'A neckline that exposes both shoulders by sitting below them. Off-shoulder tops and dresses are popular for casual and evening wear.'],
                ['Bardot', 'Similar to off-shoulder but the neckline sits right across the bust, exposing both shoulders and the upper chest. Named after actress Brigitte Bardot.'],
                ['Halter neck', 'A neckline where the front of the garment is held up by a strap that ties behind the neck, leaving the back and shoulders bare. Ideal for summer and evening wear.'],
                ['Smocking', 'A decorative embroidery technique where fabric is gathered and stitched in a regular pattern, creating an elastic, textured effect. Popular on bodices and sleeve details.'],
                ['Ditsy print', 'A small-scale, scattered pattern, typically featuring tiny floral or botanical motifs on a plain background. Ditsy prints are cheerful and very wearable.'],
                ['Flared', 'Describing a silhouette that widens or flares out from a fitted point. Flared skirts widen from the waist; flared jeans widen from the knee.'],
                ['Wrap style', 'A garment that wraps around the body and fastens at the waist or side with ties. Wrap dresses are universally flattering as they can be adjusted to fit different body shapes.'],
              ].map(([term, def]) => (
                <div key={term} className="flex gap-2">
                  <span className="shrink-0 font-semibold text-[#7C4A2D] min-w-[100px] text-[12.5px]">{term}</span>
                  <span className="text-[12px] text-[#6B6B6B]">{def}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-serif text-[17px] text-[#0a0a0a] mb-3">The Indian Fashion Calendar: What to Wear and When</h3>
            <p className="mb-3">
              India&apos;s fashion calendar is shaped by both seasons and the rich calendar of festivals and celebrations that span the year. Here is a season-by-season guide to dressing well throughout the year in India:
            </p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">January – March (Winter to Spring):</strong> In North India, January remains cold — layering is key. Knitwear, ribbed fabrics, and structured pieces work well. As February and March arrive, temperatures warm up across most of India, making this a good time for lighter fabrics in transitional colours like dusty rose, sage green, and lavender. Holi in March calls for whites and pastels that can be splashed with colour.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">April – June (Summer):</strong> The hottest months in most of India. Breathable cotton, linen, and rayon are your best friends. Loose silhouettes — palazzos, flowy maxi dresses, oversized shirts — keep you cool. Light, bright colours and prints like florals, tropical motifs, and pastels lift the mood of the season. Eid celebrations in spring call for elegant ethnic-fusion or festive western wear in rich colours.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">July – September (Monsoon):</strong> The monsoon transforms India&apos;s landscape and wardrobe. Quick-drying synthetic fabrics come into their own. Avoid heavy fabrics that take forever to dry. Dark colours and prints camouflage mud splashes better. Teej and Onam festivals in this period call for festive, vibrant dressing.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">October – December (Festive Season and Winter):</strong> This is the most active period in the Indian fashion calendar. Navratri, Dussehra, Diwali, and Christmas follow in quick succession. Rich fabrics, embellishments, and jewel tones — emerald, burgundy, gold, royal blue, and deep plum — dominate this season. December brings cooler temperatures, making this the season for knitwear, satin, and layered looks. New Year&apos;s Eve calls for the most glamorous, statement-making outfit of the year.</p>
          </div>

          <div>
            <h3 className="font-serif text-[17px] text-[#0a0a0a] mb-3">Sustainable Fashion: How to Build a More Conscious Wardrobe</h3>
            <p className="mb-3">
              Sustainability has become an increasingly important consideration in fashion. The global fashion industry is one of the largest contributors to environmental pollution, and consumers in India are becoming more aware of the environmental and social impact of their purchasing decisions. Building a more sustainable wardrobe does not require abandoning fashion entirely — it requires a more thoughtful, intentional approach to how you buy and wear clothes.
            </p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Buy less, choose better.</strong> The most sustainable garment is one that you wear many times. Rather than buying many cheap, disposable pieces, invest in fewer, higher-quality items that will last. At Kalokea, we prioritise fabric quality and construction quality precisely because we want our clothes to be worn and loved for seasons, not discarded after a few wears.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Build a wardrobe around versatile pieces.</strong> Capsule wardrobe thinking is inherently more sustainable because it maximises the use of each piece. A single high-quality dress that you can style five different ways does far less environmental damage than five single-use trend pieces.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Care for your clothes properly.</strong> Proper washing, drying, and storage significantly extends the life of your garments. See our fabric care guide above for detailed instructions. Following care labels and treating garments gently can double or triple their usable lifespan.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Organise, donate, or resell rather than discard.</strong> When you outgrow or tire of a garment, consider donating it, selling it on a resale platform, or gifting it to someone who will use it. Clothes that end up in landfills are one of the biggest contributors to fashion waste.</p>
            <p><strong className="text-[#3a3a3a]">Choose quality over quantity.</strong> It is always better to have thirty pieces that you love and wear regularly than a hundred pieces where sixty never come off their hangers. Audit your wardrobe regularly — if you have not worn something in a year and cannot envision styling it again, it is time to let it go.</p>
          </div>

          <div>
            <h3 className="font-serif text-[17px] text-[#0a0a0a] mb-3">Women&apos;s Fashion on a Budget: Smart Shopping Strategies</h3>
            <p className="mb-3">
              Looking stylish does not require spending a fortune. In fact, some of the most stylish women we know have modest fashion budgets but exceptional taste and strong shopping instincts. Here are the strategies they use:
            </p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Invest in high-cost-per-wear basics.</strong> A well-made white shirt, perfectly fitting black trousers, and a classic midi dress are worth spending a little more on because you will wear them constantly. These are the pieces where quality shows and where a higher upfront cost pays off over time through longevity and frequency of wear.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Be more willing to buy affordable trend pieces.</strong> For very on-trend pieces that you might tire of in a season, there is less need to splurge. A trendy cut-out top or neon co-ord set does not need to be expensive — it just needs to look good for the season or two that you will wear it.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Shop sale strategically.</strong> End-of-season sales are an excellent time to stock up on basics and versatile pieces at reduced prices. Be disciplined though — only buy sale items that you would have bought at full price. Sales are not a reason to buy things you do not actually need.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Subscribe to brand newsletters for exclusive discount codes.</strong> Many D2C brands, including Kalokea, offer subscriber-only discount codes for newsletter subscribers. Sign up to get access to exclusive offers before they are announced publicly.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Style existing pieces in new ways.</strong> Before buying something new, ask yourself whether you could achieve a similar look with something you already own, styled differently. Capsule wardrobe thinking naturally encourages this habit of remixing existing pieces.</p>
            <p><strong className="text-[#3a3a3a]">Prioritise accessories for a fresh look.</strong> A new bag, a pair of earrings, or a belt can transform an existing outfit into something that feels new and exciting without requiring a full clothing purchase. Accessories often deliver the best cost-per-impact ratio in a wardrobe.</p>
          </div>

          <div>
            <h3 className="font-serif text-[17px] text-[#0a0a0a] mb-3">Indian Women&apos;s Fashion by Body Type: Extended Guide</h3>
            <p className="mb-3">
              Every woman is beautiful, and the goal of dressing well is not to conform to any single standard of appearance — it is to find clothes that make you feel your most confident and beautiful self. These guidelines are tools to help you find styles that work well with your natural proportions, not rules you must follow. Wear what makes you feel good.
            </p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Petite women (under 5&apos;3&quot;):</strong> Petite frames can wear virtually any style, but certain choices help maximise the visual impact. High-waisted bottoms with cropped tops create the illusion of longer legs. Monochromatic outfits create an unbroken vertical line that elongates the silhouette. Midi hemlines work well when worn slightly above mid-calf. Avoid very oversized or heavy fabrics that can overwhelm a petite frame. Vertical stripes and patterns add visual height.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Tall women:</strong> Tall women have the freedom to wear most silhouettes beautifully. Maxi dresses and long skirts that might swamp shorter figures look stunning on tall frames. Wide-leg trousers and flared jeans work beautifully. Horizontal stripes and bold, large-scale prints can work well where they might overwhelm a smaller frame. Embrace your height — it is a gift for fashion.</p>
            <p className="mb-2"><strong className="text-[#3a3a3a]">Plus-size and curvy women:</strong> Wrap dresses, A-line skirts, and empire-waist silhouettes are traditionally recommended, but the truth is that any style can work beautifully. Bodycon styles can be stunning on curvy figures. The key is choosing the right size (not going too large to &apos;hide&apos; — well-fitting clothes always look better), picking quality fabrics that drape well, and above all, wearing what makes you feel confident. At Kalokea, we are working to expand our size range to better serve our curvy customers.</p>
            <p><strong className="text-[#3a3a3a]">Athletic frames:</strong> Athletic builds benefit from styles that create the illusion of curves — peplum tops, ruffled details, A-line and tiered skirts, and wrap styles. Belted pieces at the waist define the midsection. Two-tone or colour-blocked looks add visual dimension. Do not be afraid to experiment — an athletic frame can pull off a wide range of styles that require a strong posture and confident bearing to wear.</p>
          </div>
        </div>
      </div>

      {/* ── FAQ ───────────────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mb-16">
        <p className="font-sans text-[10px] uppercase tracking-[0.25em] text-[#C49070] mb-3">FAQs</p>
        <h2 className="font-serif text-2xl md:text-3xl text-[#0a0a0a] mb-6">Frequently Asked Questions</h2>
        <div className="border border-[#E0D4C4] px-4 sm:px-6">
          {FAQS.map((f) => <FAQItem key={f.q} q={f.q} a={f.a} />)}
        </div>
      </div>

      {/* ── Brand closing ─────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-[#0a0a0a] text-white p-8 md:p-12 text-center">
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#C49070] mb-3">Join the Kalokea Family</p>
          <h2 className="font-serif text-2xl md:text-3xl mb-4 leading-tight">
            Discover Women&apos;s Fashion That&apos;s Made for You
          </h2>
          <p className="font-sans text-[13px] text-[#b0a090] leading-relaxed max-w-xl mx-auto mb-6">
            Shop the latest women&apos;s clothing online in India. Premium quality, honest pricing, fast delivery, and a shopping experience that puts you first — that&apos;s the Kalokea promise.
          </p>
          <Link href="/shop/" className="inline-block bg-[#7C4A2D] text-white text-[11px] uppercase tracking-widest px-8 py-3 hover:bg-[#6a3d25] transition-colors">
            Shop All Collections
          </Link>
        </div>
      </div>

    </section>
  )
}
