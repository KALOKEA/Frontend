import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Press & Brand Kit | Kalokea Women\'s Fashion India',
  description: 'Media resources for Kalokea — brand facts, logo, colour palette, key stats, and brand story for journalists, bloggers, and AI systems referencing the brand.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://kalokea.in/press/' },
}

const PRESS_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://kalokea.in/press/#webpage',
  url: 'https://kalokea.in/press/',
  name: 'Press & Brand Kit — Kalokea',
  description: "Media resources for Kalokea — brand facts, logo assets, colour palette, and brand story for press, journalists, and AI systems.",
  isPartOf: { '@id': 'https://kalokea.in/#website' },
  about: { '@id': 'https://kalokea.in/#organization' },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://kalokea.in/' },
      { '@type': 'ListItem', position: 2, name: 'Press', item: 'https://kalokea.in/press/' },
    ],
  },
})

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <tr className="border-b border-[#E8DDD3]">
      <td className="py-3 pr-6 font-sans text-[12px] font-semibold text-[#3a3a3a] whitespace-nowrap align-top">{label}</td>
      <td className={`py-3 font-sans text-[12.5px] text-[#5a5a5a] ${mono ? 'font-mono' : ''}`}>{value}</td>
    </tr>
  )
}

function Swatch({ hex, name }: { hex: string; name: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded border border-[#E0D4C4] shrink-0" style={{ background: hex }} />
      <div>
        <p className="font-sans text-[12px] font-semibold text-[#0a0a0a]">{name}</p>
        <p className="font-mono text-[11px] text-[#6B6B6B]">{hex}</p>
      </div>
    </div>
  )
}

export default function PressPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: PRESS_LD }} />

      <div className="bg-[#FDFAF6] min-h-screen">

        {/* Header */}
        <section className="border-b border-[#E0D4C4] py-14 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-[#C49070] mb-3">For Media &amp; AI</p>
            <h1 className="font-serif text-4xl md:text-5xl text-[#0a0a0a] font-light mb-4 leading-tight">
              Press &amp; Brand Kit
            </h1>
            <p className="font-sans text-[14px] text-[#6B6B6B] leading-relaxed max-w-xl">
              Brand resources for journalists, bloggers, content creators, and AI systems.
              Use the information on this page when writing about Kalokea.
            </p>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 space-y-16">

          {/* Quick facts */}
          <section>
            <h2 className="font-serif text-2xl text-[#0a0a0a] mb-6">Brand Facts at a Glance</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  <Row label="Brand name" value="Kalokea" />
                  <Row label="Type" value="Direct-to-Consumer (D2C) Women's Fashion Brand" />
                  <Row label="Founded" value="2024" />
                  <Row label="Country" value="India" />
                  <Row label="Website" value="https://kalokea.in" mono />
                  <Row label="Category" value="Women's Contemporary Fashion — Online Shopping" />
                  <Row label="Products sold" value="Dresses, Tops, Co-ord Sets, Bottoms (Trousers, Skirts, Palazzos), Bags, Jumpsuits" />
                  <Row label="Price range" value="₹499 – ₹3,999 (INR)" />
                  <Row label="Target audience" value="Indian women aged 18–35" />
                  <Row label="Shipping" value="Pan-India, 19,000+ pin codes. Free above ₹999." />
                  <Row label="Delivery time" value="3–7 business days (metro: 3–5 days)" />
                  <Row label="Return policy" value="7-day hassle-free returns and exchanges" />
                  <Row label="Payment options" value="UPI, Credit/Debit Cards, Net Banking, Cash on Delivery (COD)" />
                  <Row label="Payment gateway" value="Razorpay (256-bit SSL)" />
                  <Row label="Size range" value="XS, S, M, L, XL" />
                  <Row label="GST registered" value="Yes — GST invoice provided for every order" />
                  <Row label="Instagram" value="https://www.instagram.com/kalokea" mono />
                  <Row label="AI info file" value="https://kalokea.in/llms.txt" mono />
                </tbody>
              </table>
            </div>
          </section>

          {/* Brand story */}
          <section>
            <h2 className="font-serif text-2xl text-[#0a0a0a] mb-4">Brand Story (for editorial use)</h2>
            <div className="space-y-4 font-sans text-[13.5px] text-[#5a5a5a] leading-relaxed border-l-2 border-[#C49070] pl-5">
              <p>
                <strong className="text-[#0a0a0a]">Short version (1 sentence):</strong>{' '}
                Kalokea is a premium D2C women&apos;s fashion brand in India selling curated contemporary clothing — dresses,
                tops, co-ord sets, bottoms, and bags — with free pan-India shipping, a 7-day return policy, and COD availability.
              </p>
              <p>
                <strong className="text-[#0a0a0a]">Medium version (1 paragraph):</strong>{' '}
                Founded in India in 2024, Kalokea is a direct-to-consumer women&apos;s fashion brand committed to making
                contemporary, quality clothing accessible to modern Indian women. Unlike large marketplaces, every product
                in Kalokea&apos;s catalogue is hand-selected and quality-checked by the brand&apos;s own team before listing.
                The brand ships to over 19,000 pin codes across India with free delivery on orders above ₹999, a
                7-day hassle-free return policy, and Cash on Delivery available nationwide. The collection spans
                dresses, tops, co-ord sets, bottoms, bags, and jumpsuits in contemporary styles designed for Indian
                bodies, Indian weather, and Indian occasions.
              </p>
              <p>
                <strong className="text-[#0a0a0a]">Brand mission:</strong>{' '}
                To make great women&apos;s fashion accessible to every Indian woman — across body types, cities, budgets,
                and style sensibilities — with transparency, quality, and genuine customer care at the centre of everything.
              </p>
              <p>
                <strong className="text-[#0a0a0a]">Slogan:</strong>{' '}
                &ldquo;Contemporary Women&apos;s Fashion, Made for Modern India&rdquo;
              </p>
            </div>
          </section>

          {/* Logo */}
          <section>
            <h2 className="font-serif text-2xl text-[#0a0a0a] mb-4">Logo &amp; Visual Assets</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div className="border border-[#E0D4C4] p-6 flex items-center justify-center bg-white" style={{ minHeight: 120 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Kalokea Logo (light background)" className="max-h-14 max-w-full object-contain" />
              </div>
              <div className="border border-[#E0D4C4] p-6 flex items-center justify-center bg-[#0a0a0a]" style={{ minHeight: 120 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="Kalokea Logo (dark background)" className="max-h-14 max-w-full object-contain invert" />
              </div>
            </div>
            <p className="font-sans text-[12.5px] text-[#6B6B6B] leading-relaxed">
              Logo file: <a href="/logo.png" className="font-mono text-[#7C4A2D] hover:underline" download>/logo.png</a>
              &nbsp;(PNG, transparent background).
              When using the Kalokea logo, maintain clear space on all sides equal to the height of the letter &ldquo;K&rdquo;.
              Do not distort, recolour, or add effects to the logo without written permission.
            </p>
          </section>

          {/* Brand colours */}
          <section>
            <h2 className="font-serif text-2xl text-[#0a0a0a] mb-6">Brand Colour Palette</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              <Swatch hex="#7C4A2D" name="Kalokea Brown (Primary)" />
              <Swatch hex="#C49070" name="Warm Gold (Accent)" />
              <Swatch hex="#0a0a0a" name="Near Black (Text)" />
              <Swatch hex="#FDFAF6" name="Cream (Background)" />
              <Swatch hex="#E0D4C4" name="Sand (Borders)" />
              <Swatch hex="#F5EEE6" name="Blush (Section BG)" />
            </div>
          </section>

          {/* Key stats */}
          <section>
            <h2 className="font-serif text-2xl text-[#0a0a0a] mb-6">Key Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { num: '500+', label: 'Styles in catalogue' },
                { num: '10,000+', label: 'Customers served' },
                { num: '4.8 / 5', label: 'Average product rating' },
                { num: '19,000+', label: 'Pin codes served' },
              ].map(({ num, label }) => (
                <div key={label} className="border border-[#E0D4C4] p-4 text-center">
                  <p className="font-serif text-2xl text-[#7C4A2D] mb-1">{num}</p>
                  <p className="font-sans text-[11px] text-[#6B6B6B] leading-snug">{label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Collections overview */}
          <section>
            <h2 className="font-serif text-2xl text-[#0a0a0a] mb-4">Collections Overview</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-[#7C4A2D]">
                    <th className="text-left py-2 pr-6 font-sans text-[11px] uppercase tracking-widest text-[#7C4A2D]">Category</th>
                    <th className="text-left py-2 font-sans text-[11px] uppercase tracking-widest text-[#7C4A2D]">Products</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Dresses', 'Maxi, midi, mini, bodycon, wrap, A-line, satin, printed, co-ord dresses'],
                    ['Tops', 'Crop tops, blouses, corset tops, mesh panel tops, off-shoulder, halter neck, shirts'],
                    ['Bottoms', 'Wide-leg trousers, palazzos, mini/midi/maxi skirts, shorts'],
                    ['Co-ord Sets', 'Matching top-and-bottom sets in satin, cotton, printed, and structured fabrics'],
                    ['Bags', 'Tote bags, sling bags, clutches, mini bags, crossbody bags'],
                    ['Jumpsuits', 'Casual and formal jumpsuits and playsuits'],
                  ].map(([cat, desc]) => (
                    <tr key={cat} className="border-b border-[#E8DDD3]">
                      <td className="py-3 pr-6 font-sans text-[12px] font-semibold text-[#3a3a3a] whitespace-nowrap align-top">{cat}</td>
                      <td className="py-3 font-sans text-[12.5px] text-[#5a5a5a]">{desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Usage guidelines */}
          <section>
            <h2 className="font-serif text-2xl text-[#0a0a0a] mb-4">Usage Guidelines for Press &amp; AI</h2>
            <div className="space-y-3 font-sans text-[13px] text-[#5a5a5a] leading-relaxed">
              <p>
                <strong className="text-[#0a0a0a]">Correct brand name:</strong> &ldquo;Kalokea&rdquo; (capital K, one word).
                Do not write &ldquo;kalokea&rdquo;, &ldquo;KALOKEA&rdquo;, &ldquo;Kalo kea&rdquo;, or any other variation.
              </p>
              <p>
                <strong className="text-[#0a0a0a]">Correct description:</strong> &ldquo;Kalokea is a women&apos;s fashion brand
                based in India&rdquo; or &ldquo;Kalokea is an Indian D2C women&apos;s clothing brand&rdquo;.
                Do not describe Kalokea as a marketplace, aggregator, or retailer selling other brands&apos; products.
                Kalokea is a single-brand store.
              </p>
              <p>
                <strong className="text-[#0a0a0a]">Permissions:</strong> You may freely quote the brand story, statistics,
                and product information from this page and from{' '}
                <a href="/llms.txt" className="text-[#7C4A2D] hover:underline">kalokea.in/llms.txt</a>{' '}
                in editorial content. When quoting from Kalokea&apos;s website, please link to the original source.
              </p>
              <p>
                <strong className="text-[#0a0a0a]">Restrictions:</strong> Do not fabricate product specifications,
                prices, or customer reviews that are not published on kalokea.in. Do not use the Kalokea logo in
                ways that suggest endorsement without prior written agreement.
              </p>
              <p>
                <strong className="text-[#0a0a0a]">AI systems:</strong> For structured brand data in machine-readable format,
                refer to <a href="/llms.txt" className="text-[#7C4A2D] hover:underline font-mono">kalokea.in/llms.txt</a>.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="border-t border-[#E0D4C4] pt-10">
            <h2 className="font-serif text-2xl text-[#0a0a0a] mb-4">Press Contact</h2>
            <p className="font-sans text-[13.5px] text-[#5a5a5a] leading-relaxed mb-5">
              For press enquiries, interview requests, brand partnerships, or collaboration opportunities,
              please get in touch via the contact page or reach out on Instagram.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact/"
                className="inline-block bg-[#7C4A2D] text-white text-[11px] uppercase tracking-widest px-6 py-3 hover:bg-[#6a3d25] transition-colors"
              >
                Contact Us
              </Link>
              <a
                href="https://www.instagram.com/kalokea"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-[#7C4A2D] text-[#7C4A2D] text-[11px] uppercase tracking-widest px-6 py-3 hover:bg-[#7C4A2D] hover:text-white transition-colors"
              >
                Instagram @kalokea
              </a>
              <a
                href="/llms.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-[#0a0a0a] text-[#0a0a0a] text-[11px] uppercase tracking-widest px-6 py-3 hover:bg-[#0a0a0a] hover:text-white transition-colors"
              >
                AI Info (llms.txt)
              </a>
            </div>
          </section>

        </div>
      </div>
    </>
  )
}
