import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Kalokea Women\'s Fashion',
  description: 'All your questions about Kalokea answered — shipping, returns, sizing, payments, COD, product care, order tracking, and more. Get help fast.',
  alternates: { canonical: 'https://kalokea.com/faq/' },
  openGraph: {
    title: 'FAQ | Kalokea Women\'s Fashion India',
    description: 'Answers to all common questions about shopping at Kalokea — shipping, returns, sizing, payments, COD, order tracking, and more.',
    url: 'https://kalokea.com/faq/',
  },
}

// ── FAQ data ──────────────────────────────────────────────────────────────────

const FAQS: { category: string; items: { q: string; a: string }[] }[] = [
  {
    category: 'Orders & Shopping',
    items: [
      {
        q: 'How do I place an order on Kalokea?',
        a: 'Browse our collection at kalokea.com/shop, add items to your cart by selecting the right size and clicking "Add to Cart", then proceed to checkout. Enter your delivery address, choose a payment method (UPI, card, net banking, or COD), and confirm your order. You will receive an order confirmation email and SMS immediately after placing the order.',
      },
      {
        q: 'Can I modify or cancel my order after placing it?',
        a: 'You can cancel or modify your order within a short window after placing it, before it is dispatched for shipping. Go to "My Orders" in your account and select the option to cancel. If the order has already been dispatched, you can still return it under our 7-day return policy once it is delivered. For urgent modifications, contact our WhatsApp support immediately after placing the order.',
      },
      {
        q: 'How do I know if my order was placed successfully?',
        a: 'Once your order is successfully placed, you will receive an order confirmation email and an SMS to your registered email address and mobile number. The email contains your Order ID, list of items ordered, delivery address, and estimated delivery date. You can also view your order in the "My Orders" section of your Kalokea account.',
      },
      {
        q: 'Can I order without creating an account?',
        a: 'Currently, Kalokea requires an account to place orders so we can keep track of your orders, facilitate returns, and provide personalised service. Creating an account is free and takes less than a minute — you just need your email address and a password. You can also sign in with Google for even faster access.',
      },
      {
        q: 'Does Kalokea restock sold-out products?',
        a: 'Yes, popular products are regularly restocked. Use the "Notify Me" feature on the product page to get an email alert the moment a sold-out item comes back in stock. We also announce restocks on our Instagram (@kalokea), so following us there ensures you never miss a restock of your favourite piece.',
      },
      {
        q: 'How do I apply a coupon or discount code?',
        a: 'On the checkout page, you will see a field labelled "Apply Coupon" or "Discount Code". Enter your code exactly as given (codes are case-sensitive) and click Apply. The discount will be reflected in your order total before you confirm payment. Only one coupon code can be applied per order. Some codes have minimum order value requirements which will be shown if the code cannot be applied.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    items: [
      {
        q: 'Does Kalokea offer free shipping?',
        a: 'Yes! Kalokea offers free shipping on all prepaid orders above ₹999. For orders below ₹999, a flat shipping fee applies at checkout. COD orders may have an additional small handling fee. Free shipping is applicable across India on eligible orders.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Standard delivery timelines are: Metro cities (Mumbai, Delhi, Bengaluru, Hyderabad, Chennai, Pune, Kolkata) — 3 to 5 business days. Tier 2 and Tier 3 cities — 5 to 7 business days. Remote or hilly areas — 7 to 10 business days. These are estimates after dispatch; orders are typically dispatched within 1–2 business days of placement.',
      },
      {
        q: 'Does Kalokea ship all across India?',
        a: 'Yes, Kalokea delivers to over 19,000 pin codes across India. During checkout, enter your pin code to check delivery availability and estimated delivery date for your location. If your pin code is not currently serviceable, we are actively working to expand coverage.',
      },
      {
        q: 'How can I track my order?',
        a: 'Once your order is dispatched, you will receive an SMS and email notification with your AWB (tracking) number and the courier partner\'s name. You can track your order in real time from the "My Orders" section in your Kalokea account, or directly on the courier partner\'s website by entering your AWB number.',
      },
      {
        q: 'What courier partners does Kalokea use?',
        a: 'Kalokea ships through trusted logistics partners including Shiprocket\'s network of courier services such as Delhivery, Ekart, Xpressbees, and Blue Dart, depending on your location and the fastest available service. The specific courier is assigned at the time of dispatch and communicated via your tracking notification.',
      },
      {
        q: 'What happens if no one is available at the delivery address?',
        a: 'Our courier partner will attempt delivery up to 3 times. After unsuccessful delivery attempts, your package will be held at the local courier facility for a few days before being returned to us. If your order is returned undelivered, we will contact you to arrange a re-delivery or process a refund (minus shipping charges for prepaid orders). Make sure your delivery address and mobile number are accurate when placing an order.',
      },
      {
        q: 'Does Kalokea offer express or same-day delivery?',
        a: 'Currently, Kalokea does not offer same-day or express delivery. Standard delivery timelines apply. We are exploring faster delivery options for select metro cities and will announce them when available. Subscribe to our newsletter to be notified of any new delivery options.',
      },
    ],
  },
  {
    category: 'Returns, Exchanges & Refunds',
    items: [
      {
        q: 'What is Kalokea\'s return policy?',
        a: 'Kalokea offers a 7-day return policy from the date of delivery. Items must be unworn, unwashed, and in their original condition with all tags and packaging intact. Sale items and products marked as non-returnable on the product page are not eligible for return. To initiate a return, go to "My Orders" in your account or contact our support team via WhatsApp.',
      },
      {
        q: 'How do I initiate a return or exchange?',
        a: 'To start a return or exchange: (1) Go to "My Orders" in your account. (2) Select the order and the specific item you want to return. (3) Choose "Return" or "Exchange" and select your reason. (4) Our team will arrange a pickup from your address within 2–3 business days. For exchanges, specify the size or colour you want, and we will send the replacement once we receive and inspect your return.',
      },
      {
        q: 'How long does a refund take?',
        a: 'Once we receive your returned item and it passes quality inspection (typically within 2–3 business days of receiving it), the refund is processed within 5–7 business days back to your original payment method. UPI and bank transfers are generally faster (3–5 days) while credit/debit card refunds may take 7–10 days depending on your bank. For COD orders, refunds are issued to your bank account via NEFT — please ensure your bank details are updated in your account.',
      },
      {
        q: 'What if I receive a damaged or incorrect item?',
        a: 'We are sorry if you received a damaged or wrong product! Please contact us within 48 hours of delivery via WhatsApp with photos of the item and packaging. We will arrange an immediate replacement or full refund at no cost to you, including reverse shipping. This policy applies regardless of the 7-day return window in case of damaged or incorrect items.',
      },
      {
        q: 'Can I exchange for a different product (not just a different size)?',
        a: 'Currently, Kalokea\'s exchange policy supports exchanges for a different size or colour of the same product. If you would like a completely different product, we suggest initiating a return for the original item and placing a new order for the desired product. Your return refund will be credited to your original payment method.',
      },
      {
        q: 'Are there any products that cannot be returned?',
        a: 'Products marked as "Non-Returnable" on their product page cannot be returned. This typically includes deeply discounted sale items, intimate wear, and customised or personalised products. The return eligibility is always clearly stated on the product page before you purchase. All other products are covered by our standard 7-day return policy.',
      },
    ],
  },
  {
    category: 'Payments & Security',
    items: [
      {
        q: 'What payment methods does Kalokea accept?',
        a: 'Kalokea accepts: UPI (Google Pay, PhonePe, Paytm, BHIM, and all UPI apps), Credit Cards (Visa, Mastercard, RuPay), Debit Cards, Net Banking (all major Indian banks), and Cash on Delivery (COD). All online payments are processed securely through Razorpay, India\'s most trusted payment gateway.',
      },
      {
        q: 'Is it safe to pay online on Kalokea?',
        a: 'Absolutely. All online transactions on Kalokea are processed through Razorpay, which uses 256-bit SSL encryption — the same security standard used by banks. We do not store your card or payment information on our servers. Kalokea is a PCI DSS compliant platform, ensuring your financial data is always protected.',
      },
      {
        q: 'Is Cash on Delivery (COD) available?',
        a: 'Yes, Cash on Delivery is available for most products and eligible pin codes. COD availability will be shown during checkout based on your pin code. A small COD handling fee may apply. Please keep the exact order amount ready in cash when your delivery arrives. COD orders may take 1–2 additional days to process compared to prepaid orders.',
      },
      {
        q: 'My payment failed but my account was debited. What should I do?',
        a: 'If your payment was debited but the order was not confirmed, the amount will automatically be refunded to your original payment method within 5–7 business days by your bank. This is a standard banking process for failed transactions and the funds are not held by Kalokea. If you do not receive the refund after 7 days, please contact us with your transaction reference number and we will assist you.',
      },
      {
        q: 'Does Kalokea provide GST invoices?',
        a: 'Yes, Kalokea is a GST-registered business (GSTIN: 24HRYPK5081F1Z8) and provides valid GST invoices for all purchases. Your invoice is automatically generated and available for download from the "My Orders" section of your account after delivery. For B2B purchases requiring your company GSTIN on the invoice, enter your GSTIN details during checkout.',
      },
    ],
  },
  {
    category: 'Sizing & Fit',
    items: [
      {
        q: 'How do I find the right size at Kalokea?',
        a: 'Each product page has a detailed size guide with body measurements in centimetres and inches. Measure your bust, waist, and hips with a soft tape measure and compare your measurements to the size chart. If you are between sizes, we generally recommend sizing up for a more comfortable fit. Our full size guide with measurement instructions is available at kalokea.com/size-guide/',
      },
      {
        q: 'Are Kalokea clothes true to size?',
        a: 'Most Kalokea garments run true to standard Indian sizing. However, fit can vary by garment style, cut, and fabric. We always recommend checking the specific product size chart rather than relying on your usual label size alone. Customer reviews often include helpful notes about whether an item runs large, small, or true to size — check the reviews section on each product page for real customer feedback on fit.',
      },
      {
        q: 'What sizes does Kalokea carry?',
        a: 'Kalokea currently stocks sizes XS, S, M, L, and XL across most of our range. Some products may have a narrower size range depending on the style and design. We are actively working to expand our size range to include XXL and plus-size options. Use the size filter on our shop page to browse only products available in your size.',
      },
      {
        q: 'What if the item doesn\'t fit when it arrives?',
        a: 'No problem — that is exactly what our exchange policy is for. If the item does not fit as expected, you can exchange it for a different size within 7 days of delivery. Initiate the exchange from "My Orders" in your account. Exchanges for size are processed free of charge. If your preferred size is unavailable, you can opt for a full refund instead.',
      },
    ],
  },
  {
    category: 'Products & Quality',
    items: [
      {
        q: 'How does Kalokea ensure product quality?',
        a: 'Every product in Kalokea\'s catalogue goes through an in-house quality check before being listed. Our team evaluates fabric quality, construction, stitch finish, colour accuracy, and true-to-size measurements. Products that do not meet our quality standards are not listed. This means everything you see on Kalokea has been personally reviewed and approved by our team.',
      },
      {
        q: 'Are the product photos accurate to the actual item?',
        a: 'Yes, we strive to show products as accurately as possible. Our product photos are taken on real models with their heights and body measurements noted. We photograph in natural and studio lighting to represent colours accurately. Minor variations in colour may occur due to different screen settings. If you have specific questions about a product\'s appearance before ordering, message us on WhatsApp — we are happy to share additional photos.',
      },
      {
        q: 'How should I care for my Kalokea clothes?',
        a: 'Care instructions depend on the fabric. Key guidelines: Cotton — machine wash at 30°C, air dry. Satin/polyester — hand wash or gentle machine wash, hang to dry. Chiffon — hand wash only, no wringing. Knit/jersey — gentle machine wash, lay flat to dry. Specific care instructions are printed on the label of every garment. Our full fabric care guide is available at kalokea.com/blog/fabric-care-guide/',
      },
      {
        q: 'Are Kalokea\'s customer reviews genuine?',
        a: 'All reviews on Kalokea are from verified customers who have purchased and received the product. Our Verified Purchase badge confirms the reviewer actually bought the item through Kalokea. We display all reviews — including critical ones — and do not delete or filter negative reviews. This transparency is part of our commitment to honest, trustworthy customer service.',
      },
    ],
  },
  {
    category: 'Account & General',
    items: [
      {
        q: 'How do I create a Kalokea account?',
        a: 'Visit kalokea.com and click "Sign Up" or "Create Account". Enter your name, email address, and a strong password, then verify your email. You can also sign up using your Google account for instant access. Your account lets you track orders, save your wishlist, manage addresses, and access your order history and invoices.',
      },
      {
        q: 'I forgot my password. How do I reset it?',
        a: 'On the login page, click "Forgot Password". Enter your registered email address and click Submit. You will receive a password reset link in your inbox within a few minutes. Click the link and set a new password. If you don\'t see the email, check your spam folder. If you still have trouble, contact our support team via WhatsApp.',
      },
      {
        q: 'How do I contact Kalokea customer support?',
        a: 'Our customer support team is available through: WhatsApp (click the WhatsApp button on any page for instant messaging — fastest response), the Contact form at kalokea.com/contact/, and email. Support hours are Monday to Saturday, 10 AM to 6 PM IST. We typically respond to WhatsApp messages within a few hours during business hours.',
      },
      {
        q: 'Does Kalokea have a referral or loyalty programme?',
        a: 'Kalokea is currently developing a loyalty rewards programme for our regular customers. In the meantime, subscribe to our newsletter to receive exclusive discount codes and early access to sales. Follow us on Instagram (@kalokea) where we regularly share promo codes for our followers. We also love featuring real customer photos — tag us on Instagram for a chance to be featured.',
      },
      {
        q: 'Does Kalokea ship internationally?',
        a: 'Currently, Kalokea ships only within India. We are working on international shipping to countries with a large Indian diaspora including UAE, USA, UK, Canada, and Australia. Subscribe to our newsletter at the bottom of any page to be notified when international shipping becomes available.',
      },
      {
        q: 'How does Kalokea handle my personal data?',
        a: 'Kalokea takes your privacy seriously. We collect only the information necessary to process and deliver your orders. We do not sell your personal data to third parties. Your payment information is processed securely by Razorpay and never stored on our servers. For full details, please read our Privacy Policy available at kalokea.com/privacy-policy/.',
      },
    ],
  },
]

// ── JSON-LD ────────────────────────────────────────────────────────────────────

const FAQ_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': 'https://kalokea.com/faq/#faqpage',
  url: 'https://kalokea.com/faq/',
  name: 'Kalokea FAQ — Frequently Asked Questions',
  description: 'Answers to all common questions about shopping at Kalokea — shipping, returns, sizing, payments, COD, order tracking, product quality, and more.',
  isPartOf: { '@id': 'https://kalokea.com/#website' },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://kalokea.com/' },
      { '@type': 'ListItem', position: 2, name: 'FAQ', item: 'https://kalokea.com/faq/' },
    ],
  },
  mainEntity: FAQS.flatMap(section =>
    section.items.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    }))
  ),
})

// ── Components ────────────────────────────────────────────────────────────────

// Server-rendered static accordion (no client JS needed — CSS-only details/summary)
function FAQSection({ category, items }: { category: string; items: { q: string; a: string }[] }) {
  return (
    <div className="mb-10">
      <h2 className="font-serif text-xl text-[#0a0a0a] mb-4 pb-2 border-b border-[#E0D4C4]">
        {category}
      </h2>
      <div className="space-y-2">
        {items.map(({ q, a }) => (
          <details
            key={q}
            className="group border border-[#E0D4C4] open:border-[#C49070] transition-colors"
          >
            <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none select-none">
              <span className="font-sans text-[13.5px] font-semibold text-[#0a0a0a] leading-snug">{q}</span>
              {/* Plus / minus indicator */}
              <span className="shrink-0 w-5 h-5 flex items-center justify-center rounded-full border border-[#C49070] text-[#C49070] text-xs group-open:rotate-45 transition-transform duration-200" aria-hidden="true">
                +
              </span>
            </summary>
            <div className="px-5 pb-5 pt-1">
              <p className="font-sans text-[13px] text-[#5a5a5a] leading-relaxed">{a}</p>
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function FAQPage() {
  const totalQuestions = FAQS.reduce((sum, s) => sum + s.items.length, 0)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: FAQ_LD }} />

      <div className="bg-[#FDFAF6] min-h-screen">

        {/* Header */}
        <section className="border-b border-[#E0D4C4] py-14 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6 text-[11px] font-sans text-[#7a7a7a]">
              <ol className="flex items-center gap-2">
                <li><Link href="/" className="hover:text-[#7C4A2D]">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-[#0a0a0a]">FAQ</li>
              </ol>
            </nav>
            <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-[#C49070] mb-3">Help Centre</p>
            <h1 className="font-serif text-4xl md:text-5xl text-[#0a0a0a] font-light mb-4 leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="font-sans text-[14px] text-[#6B6B6B] leading-relaxed">
              {totalQuestions} questions answered across {FAQS.length} topics.
              Can&apos;t find what you&apos;re looking for?{' '}
              <Link href="/contact/" className="text-[#7C4A2D] hover:underline">Contact us</Link> or{' '}
              <a href="https://wa.me/message/kalokea" className="text-[#7C4A2D] hover:underline">WhatsApp us</a>.
            </p>
          </div>
        </section>

        {/* Quick links */}
        <section className="border-b border-[#E0D4C4] px-4 sm:px-6 py-4 bg-white">
          <div className="max-w-3xl mx-auto flex flex-wrap gap-2">
            {FAQS.map(s => (
              <a
                key={s.category}
                href={`#${s.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                className="font-sans text-[11px] uppercase tracking-wider text-[#7C4A2D] border border-[#E0D4C4] px-3 py-1.5 hover:bg-[#7C4A2D] hover:text-white hover:border-[#7C4A2D] transition-colors"
              >
                {s.category}
              </a>
            ))}
          </div>
        </section>

        {/* FAQ sections */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-14 pb-28 lg:pb-14">
          {FAQS.map(section => (
            <div key={section.category} id={section.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}>
              <FAQSection category={section.category} items={section.items} />
            </div>
          ))}

          {/* Still need help */}
          <div className="mt-10 bg-[#F5EEE6] border border-[#E0D4C4] p-8 text-center">
            <h2 className="font-serif text-xl text-[#0a0a0a] mb-2">Still need help?</h2>
            <p className="font-sans text-[13px] text-[#6B6B6B] mb-5">
              Our support team is available Monday–Saturday, 10 AM–6 PM IST.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/contact/"
                className="inline-block bg-[#7C4A2D] text-white text-[11px] uppercase tracking-widest px-6 py-2.5 hover:bg-[#6a3d25] transition-colors"
              >
                Contact Us
              </Link>
              <a
                href="https://wa.me/message/kalokea"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#25D366] text-white text-[11px] uppercase tracking-widest px-6 py-2.5 hover:bg-[#1ebe5d] transition-colors"
              >
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
