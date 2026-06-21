import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Shipping & Returns Policy | Kalokea Women\'s Fashion India',
  description:
    'Kalokea shipping policy — free delivery above ₹999, 3–7 business days pan-India, COD available. 7-day hassle-free returns and exchange policy. Full details here.',
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://kalokea.com/shipping-returns/' },
}

const PAGE_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': 'https://kalokea.com/shipping-returns/#webpage',
  url: 'https://kalokea.com/shipping-returns/',
  name: 'Shipping & Returns Policy — Kalokea',
  description:
    'Free shipping on orders above ₹999, pan-India delivery in 3–7 business days, and a 7-day hassle-free return/exchange policy.',
  isPartOf: { '@id': 'https://kalokea.com/#website' },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://kalokea.com/' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shipping & Returns',
        item: 'https://kalokea.com/shipping-returns/',
      },
    ],
  },
})

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="font-serif font-light text-[#0A0908] mb-5" style={{ fontSize: 'clamp(1.35rem,2.5vw,1.75rem)' }}>
        {title}
      </h2>
      <div className="font-sans text-[13.5px] text-[#5a5a5a] leading-[1.85] space-y-4">{children}</div>
    </section>
  )
}

function InfoCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="bg-white border border-[#E0D4C4] p-5 flex items-start gap-4">
      <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-[#F2EAE0] text-[#7C4A2D]">
        {icon}
      </div>
      <div>
        <p className="font-sans font-medium text-[#0A0908] text-[12px] uppercase tracking-wider mb-0.5">{title}</p>
        <p className="font-sans text-[14px] text-[#0A0908] font-medium">{value}</p>
      </div>
    </div>
  )
}

export default function ShippingReturnsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: PAGE_LD }} />

      <div className="bg-[#FDFAF6] min-h-screen">
        {/* Header */}
        <div className="border-b border-[#E0D4C4] py-12 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-2 text-[11px] font-sans tracking-wide text-[#7A6E68]">
                <li><Link href="/" className="hover:text-[#7C4A2D]">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-[#160F09]" aria-current="page">Shipping &amp; Returns</li>
              </ol>
            </nav>
            <p className="text-[9.5px] font-sans tracking-[0.35em] uppercase text-[#7C4A2D] mb-3">Policy</p>
            <h1
              className="font-serif font-light text-[#0A0908] mb-4"
              style={{ fontSize: 'clamp(2rem,4vw,3rem)' }}
            >
              Shipping &amp; <em className="italic" style={{ color: '#7C4A2D' }}>Returns</em>
            </h1>
            <p className="font-sans text-[13px] text-[#6B5E55]">
              Last updated: June 2026
            </p>
          </div>
        </div>

        {/* Quick-links strip */}
        <div className="border-b border-[#E0D4C4] bg-white px-4 sm:px-6 py-3 overflow-x-auto">
          <div className="max-w-3xl mx-auto flex gap-5 whitespace-nowrap">
            {[
              ['#shipping', 'Shipping'],
              ['#delivery', 'Delivery times'],
              ['#cod', 'Cash on delivery'],
              ['#returns', 'Returns'],
              ['#exchanges', 'Exchanges'],
              ['#refunds', 'Refunds'],
              ['#damaged', 'Damaged items'],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="font-sans text-[11px] text-[#6b5c55] hover:text-[#7C4A2D] tracking-wide"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-14 pb-28 lg:pb-14 space-y-14">

          {/* At-a-glance cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <InfoCard
              title="Free shipping"
              value="On orders ₹999+"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 8h14M5 8a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2M5 8V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2"/>
                </svg>
              }
            />
            <InfoCard
              title="Delivery"
              value="3–7 business days"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
              }
            />
            <InfoCard
              title="Returns"
              value="7-day window"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>
                </svg>
              }
            />
            <InfoCard
              title="COD"
              value="Available pan-India"
              icon={
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>
                </svg>
              }
            />
          </div>

          {/* Shipping */}
          <Section id="shipping" title="Shipping Policy">
            <p>
              Kalokea ships across India to over <strong className="text-[#0A0908]">19,000+ pin codes</strong>. We partner
              with trusted logistics providers to ensure your order reaches you safely and on time.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border border-[#E0D4C4] text-[13px]">
                <thead>
                  <tr className="bg-[#F5EEE6]">
                    <th className="text-left py-3 px-4 font-sans font-medium text-[#0A0908] text-[11px] uppercase tracking-wider">Order value</th>
                    <th className="text-left py-3 px-4 font-sans font-medium text-[#0A0908] text-[11px] uppercase tracking-wider">Shipping charge</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-[#E0D4C4]">
                    <td className="py-3 px-4 text-[#0A0908]">₹999 and above</td>
                    <td className="py-3 px-4 font-medium text-[#7C4A2D]">FREE</td>
                  </tr>
                  <tr className="border-t border-[#E0D4C4]">
                    <td className="py-3 px-4 text-[#0A0908]">Below ₹999</td>
                    <td className="py-3 px-4 text-[#5a5a5a]">₹79 flat shipping fee</td>
                  </tr>
                  <tr className="border-t border-[#E0D4C4]">
                    <td className="py-3 px-4 text-[#0A0908]">Cash on Delivery (COD)</td>
                    <td className="py-3 px-4 text-[#5a5a5a]">Additional ₹40 COD handling fee</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              All orders include a <strong className="text-[#0A0908]">GST-compliant invoice</strong>. Once your order
              ships, you will receive a tracking link via SMS and/or email so you can follow your parcel every step
              of the way.
            </p>

            <div className="border-l-2 border-[#7C4A2D] bg-[#FDF6EE] px-5 py-4">
              <p className="text-[12.5px]">
                <strong className="text-[#0A0908]">Note:</strong> Shipping charges and thresholds are subject to change
                during sale periods or special promotions. The charge applicable at the time of placing your order will
                always be displayed at checkout before payment.
              </p>
            </div>
          </Section>

          {/* Delivery times */}
          <Section id="delivery" title="Delivery Timeframes">
            <div className="overflow-x-auto">
              <table className="w-full border border-[#E0D4C4] text-[13px]">
                <thead>
                  <tr className="bg-[#F5EEE6]">
                    <th className="text-left py-3 px-4 font-sans font-medium text-[#0A0908] text-[11px] uppercase tracking-wider">Location</th>
                    <th className="text-left py-3 px-4 font-sans font-medium text-[#0A0908] text-[11px] uppercase tracking-wider">Estimated delivery</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Metro cities (Delhi, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata)', '3–5 business days'],
                    ['Tier-2 & Tier-3 cities', '4–6 business days'],
                    ['Remote / rural areas', '5–7 business days'],
                  ].map(([loc, time]) => (
                    <tr key={loc} className="border-t border-[#E0D4C4]">
                      <td className="py-3 px-4 text-[#0A0908]">{loc}</td>
                      <td className="py-3 px-4 text-[#5a5a5a]">{time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              Delivery times are counted in <strong className="text-[#0A0908]">business days</strong> (Monday–Saturday,
              excluding public holidays). Orders placed before <strong className="text-[#0A0908]">2 PM IST</strong> on a
              business day are typically dispatched the same day; orders placed after 2 PM or on Sundays and public
              holidays are dispatched the next business day.
            </p>

            <p>
              Once your order is dispatched, you will receive a tracking number. You can use this number on the courier
              partner&apos;s website or app to check real-time delivery status. If your tracking shows no update for more
              than 3 consecutive business days after dispatch, please{' '}
              <Link href="/contact/" className="text-[#7C4A2D] underline underline-offset-2">contact our support team</Link>{' '}
              and we will investigate immediately.
            </p>

            <div className="border-l-2 border-[#C49070] bg-[#FDF9F5] px-5 py-4">
              <p className="text-[12.5px]">
                <strong className="text-[#0A0908]">During sale events:</strong> Dispatch times may extend by 1–2
                business days due to higher order volumes. We appreciate your patience and always aim to ship as
                quickly as possible.
              </p>
            </div>
          </Section>

          {/* COD */}
          <Section id="cod" title="Cash on Delivery (COD)">
            <p>
              Cash on Delivery is available <strong className="text-[#0A0908]">across all serviceable pin codes</strong> in
              India. With COD, you pay in cash (or via a QR code/UPI to the delivery executive) when your order
              arrives at your door — no prepayment required.
            </p>

            <ul className="space-y-2 list-none">
              {[
                'COD is available on orders up to ₹5,000.',
                'A ₹40 COD handling fee applies to all Cash on Delivery orders.',
                'Please keep exact change ready at the time of delivery to ensure a smooth handover.',
                'For COD orders, please ensure someone is available at the delivery address to receive the parcel. If delivery is missed twice, the order may be returned.',
                'If you wish to switch from COD to prepaid payment, contact us within 1 hour of placing your order.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#7C4A2D] flex-shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          {/* Returns */}
          <Section id="returns" title="Returns Policy">
            <p>
              We offer a <strong className="text-[#0A0908]">7-day hassle-free return window</strong> from the date of
              delivery. If you are not completely satisfied with your purchase, you can request a return within 7 days
              — no questions asked.
            </p>

            <h3 className="font-sans font-semibold text-[#0A0908] text-[13.5px]">Eligibility for returns</h3>
            <p>
              To be eligible for a return, your item must meet all of the following conditions:
            </p>
            <ul className="space-y-2 list-none">
              {[
                'Item must be returned within 7 days of the delivery date.',
                'Item must be unused, unworn, and unwashed.',
                'All original tags must be intact and attached.',
                'Item must be in its original packaging (bag or box).',
                'Item must not be a product marked "Final Sale" or "Non-returnable" on the product page.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#7C4A2D] flex-shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h3 className="font-sans font-semibold text-[#0A0908] text-[13.5px]">Items not eligible for return</h3>
            <ul className="space-y-2 list-none">
              {[
                'Items purchased during final-clearance or non-returnable sales',
                'Innerwear, swimwear, and intimate apparel (for hygiene reasons)',
                'Accessories that show signs of use or have missing packaging',
                'Items that have been altered, washed, or damaged after delivery',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#C49070] flex-shrink-0" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h3 className="font-sans font-semibold text-[#0A0908] text-[13.5px]">How to initiate a return</h3>
            <ol className="space-y-3">
              {[
                'Log in to your Kalokea account and go to My Orders.',
                'Select the order and the specific item you wish to return.',
                'Choose the reason for return and submit the request.',
                'Our team will review your request and confirm within 24–48 hours.',
                'Once approved, pack the item securely in its original packaging.',
                'Our courier partner will arrange a pickup from your address (typically within 2–3 business days of approval).',
                'Once we receive and inspect the item, your refund or exchange will be processed.',
              ].map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7C4A2D] text-white text-[11px] flex items-center justify-center font-medium">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>

            <div className="border-l-2 border-[#7C4A2D] bg-[#FDF6EE] px-5 py-4">
              <p className="text-[12.5px]">
                <strong className="text-[#0A0908]">Return shipping:</strong> For approved returns of eligible items,
                Kalokea covers the reverse-pickup shipping cost. You do not need to pay for return shipping.
              </p>
            </div>
          </Section>

          {/* Exchanges */}
          <Section id="exchanges" title="Exchange Policy">
            <p>
              Want a different size or colour? We&apos;re happy to help with an exchange, subject to stock availability.
              Exchanges follow the same 7-day window and eligibility conditions as returns.
            </p>

            <h3 className="font-sans font-semibold text-[#0A0908] text-[13.5px]">How exchanges work</h3>
            <ol className="space-y-3">
              {[
                'Initiate a return request via My Orders and select "Exchange" as the reason.',
                'Specify the size or colour you would like instead.',
                'Our team will confirm availability of your requested variant.',
                'If available, the exchange is approved and a reverse pickup is scheduled.',
                'Once we receive your original item, the replacement is dispatched within 1–2 business days.',
                'If the requested variant is out of stock, we will offer a refund instead.',
              ].map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7C4A2D] text-white text-[11px] flex items-center justify-center font-medium">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>

            <p>
              Exchanges are a <strong className="text-[#0A0908]">one-time option per item</strong>. If after exchange
              you still wish to return the item, a standard refund will be issued (not a second exchange).
            </p>
          </Section>

          {/* Refunds */}
          <Section id="refunds" title="Refund Policy">
            <p>
              Once we receive and inspect your returned item, your refund is processed within{' '}
              <strong className="text-[#0A0908]">5–7 business days</strong>. Refunds are issued to the original payment
              method used at the time of purchase.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border border-[#E0D4C4] text-[13px]">
                <thead>
                  <tr className="bg-[#F5EEE6]">
                    <th className="text-left py-3 px-4 font-sans font-medium text-[#0A0908] text-[11px] uppercase tracking-wider">Payment method</th>
                    <th className="text-left py-3 px-4 font-sans font-medium text-[#0A0908] text-[11px] uppercase tracking-wider">Refund timeline</th>
                    <th className="text-left py-3 px-4 font-sans font-medium text-[#0A0908] text-[11px] uppercase tracking-wider">Refunded to</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['UPI / Net Banking', '5–7 business days after approval', 'Original bank account'],
                    ['Credit / Debit Card', '7–10 business days after approval', 'Original card'],
                    ['Cash on Delivery (COD)', '7–10 business days after approval', 'Bank account (you provide account details)'],
                    ['Wallet / Gift Card', '3–5 business days after approval', 'Wallet / store credit'],
                  ].map(([method, timeline, destination]) => (
                    <tr key={method} className="border-t border-[#E0D4C4]">
                      <td className="py-3 px-4 text-[#0A0908] font-medium">{method}</td>
                      <td className="py-3 px-4 text-[#5a5a5a]">{timeline}</td>
                      <td className="py-3 px-4 text-[#5a5a5a]">{destination}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              The refund timeline above starts from the date we <em>approve and process</em> the refund at our end.
              Once released, your bank or payment provider may take additional time to credit the amount to your
              account — this is outside Kalokea&apos;s control.
            </p>

            <p>
              You will receive an email confirmation once your refund has been initiated. If you haven&apos;t received your
              refund within the stated timeline, please check with your bank first, then{' '}
              <Link href="/contact/" className="text-[#7C4A2D] underline underline-offset-2">contact our support team</Link>{' '}
              with your order ID and we will follow up.
            </p>

            <div className="border-l-2 border-[#C49070] bg-[#FDF9F5] px-5 py-4">
              <p className="text-[12.5px]">
                <strong className="text-[#0A0908]">Shipping fee refunds:</strong> Original shipping charges (if any)
                are non-refundable unless the return is due to a defective or incorrect item sent by Kalokea.
              </p>
            </div>
          </Section>

          {/* Damaged / Wrong items */}
          <Section id="damaged" title="Damaged, Defective or Wrong Items">
            <p>
              We take quality very seriously. However, if you receive an item that is{' '}
              <strong className="text-[#0A0908]">damaged, defective, or different from what you ordered</strong>, please
              reach out to us within <strong className="text-[#0A0908]">48 hours of delivery</strong> and we will make it
              right immediately.
            </p>

            <h3 className="font-sans font-semibold text-[#0A0908] text-[13.5px]">What to do</h3>
            <ol className="space-y-3">
              {[
                'Take clear photographs of the item showing the damage or defect, and a photo of the packaging if it arrived damaged.',
                'Email us at support@kalokea.com or use the Contact page — include your order ID and the photographs.',
                'Our team will respond within 24 hours with a resolution.',
                'We will arrange a free reverse pickup and either dispatch a replacement or issue a full refund — whichever you prefer.',
              ].map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7C4A2D] text-white text-[11px] flex items-center justify-center font-medium">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>

            <p>
              For wrong items (we sent you something different from what you ordered), the same process applies.
              You will not be charged any shipping fee for returning the wrong item.
            </p>
          </Section>

          {/* Contact */}
          <section className="border-t border-[#E0D4C4] pt-12">
            <h2 className="font-serif font-light text-[#0A0908] mb-4" style={{ fontSize: 'clamp(1.35rem,2.5vw,1.75rem)' }}>
              Still have questions?
            </h2>
            <p className="font-sans text-[13.5px] text-[#5a5a5a] leading-relaxed mb-6">
              Our customer support team is available Monday to Saturday, 10 AM – 6 PM IST.
              We typically respond within a few hours.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact/"
                className="inline-block bg-[#7C4A2D] text-white font-sans text-[11px] uppercase tracking-widest px-6 py-3 hover:bg-[#6a3d25] transition-colors"
              >
                Contact Support
              </Link>
              <a
                href="mailto:support@kalokea.com"
                className="inline-block border border-[#7C4A2D] text-[#7C4A2D] font-sans text-[11px] uppercase tracking-widest px-6 py-3 hover:bg-[#7C4A2D] hover:text-white transition-colors"
              >
                support@kalokea.com
              </a>
            </div>
          </section>

        </div>
      </div>
    </>
  )
}
