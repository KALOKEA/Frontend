import Link from 'next/link'

interface FooterProps {
  instagramUrl?: string
  facebookUrl?:  string
  pinterestUrl?: string
  gstin?:        string
}

const VisaIcon = () => (
  <svg viewBox="0 0 48 30" width="36" height="22" xmlns="http://www.w3.org/2000/svg" aria-label="Visa">
    <rect width="48" height="30" rx="3" fill="#1a3a5c"/>
    <text x="24" y="21" textAnchor="middle" fontFamily="Arial" fontSize="13" fontWeight="700" fill="white" letterSpacing="0.5">VISA</text>
  </svg>
)

const MastercardIcon = () => (
  <svg viewBox="0 0 48 30" width="36" height="22" xmlns="http://www.w3.org/2000/svg" aria-label="Mastercard">
    <rect width="48" height="30" rx="3" fill="#1A1612"/>
    <circle cx="18" cy="15" r="8" fill="#EB001B" opacity="0.9"/>
    <circle cx="30" cy="15" r="8" fill="#F79E1B" opacity="0.9"/>
    <path d="M24 8.5a8 8 0 010 13" fill="#FF5F00" opacity="0.8"/>
  </svg>
)

const UPIIcon = () => (
  <svg viewBox="0 0 48 30" width="36" height="22" xmlns="http://www.w3.org/2000/svg" aria-label="UPI">
    <rect width="48" height="30" rx="3" fill="#1A1612" stroke="#2A2220" strokeWidth="1"/>
    <text x="24" y="20" textAnchor="middle" fontFamily="Arial" fontSize="11" fontWeight="700" fill="#097969" letterSpacing="1">UPI</text>
  </svg>
)

const RazorpayIcon = () => (
  <svg viewBox="0 0 48 30" width="36" height="22" xmlns="http://www.w3.org/2000/svg" aria-label="Razorpay">
    <rect width="48" height="30" rx="3" fill="#072654"/>
    <text x="24" y="20" textAnchor="middle" fontFamily="Arial" fontSize="8" fontWeight="600" fill="white" letterSpacing="0.5">RAZORPAY</text>
  </svg>
)

const CODIcon = () => (
  <svg viewBox="0 0 48 30" width="36" height="22" xmlns="http://www.w3.org/2000/svg" aria-label="Cash on Delivery">
    <rect width="48" height="30" rx="3" fill="#1A1612" stroke="#2A2220" strokeWidth="1"/>
    <text x="24" y="20" textAnchor="middle" fontFamily="Arial" fontSize="8.5" fontWeight="600" fill="#6B5E55" letterSpacing="0.5">COD</text>
  </svg>
)

export default function Footer({
  instagramUrl = 'https://www.instagram.com/kalokea.fashion',
  facebookUrl  = 'https://www.facebook.com/kalokea.fashion',
  pinterestUrl = 'https://www.pinterest.com/kalokea',
  gstin        = '',
}: FooterProps) {
  return (
    <footer className="bg-[#1A1612] text-[#FDFAF6]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-16 pb-6">

        {/* Links grid — 4 cols matching prototype */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-12">

          {/* Brand col */}
          <div className="col-span-2 sm:col-span-1">
            <div className="font-serif font-light text-[#FDFAF6] text-[1.3rem] tracking-[0.12em] mb-4 select-none">KALOKEA</div>
            <p className="text-[12px] font-sans text-[#9B8F87] leading-relaxed mb-5 max-w-[210px]">
              Premium women's fashion rooted in Indian craftsmanship and global sensibility. Dressed for every chapter of your story.
            </p>
            <div className="flex items-center gap-2.5">
              {/* Instagram */}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 flex items-center justify-center border border-[#2A2220] text-[#6B5E55] hover:text-[#C4A882] hover:border-[#C4A882] transition-all duration-200"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              {/* Facebook */}
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 flex items-center justify-center border border-[#2A2220] text-[#6B5E55] hover:text-[#C4A882] hover:border-[#C4A882] transition-all duration-200"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              {/* Pinterest */}
              <a
                href={pinterestUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pinterest"
                className="w-9 h-9 flex items-center justify-center border border-[#2A2220] text-[#6B5E55] hover:text-[#C4A882] hover:border-[#C4A882] transition-all duration-200"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.852 0 1.265.64 1.265 1.408 0 .858-.546 2.14-.828 3.33-.236.995.499 1.806 1.476 1.806 1.771 0 3.135-1.867 3.135-4.563 0-2.385-1.715-4.052-4.163-4.052-2.836 0-4.5 2.127-4.5 4.326 0 .856.33 1.774.741 2.276a.3.3 0 0 1 .069.285c-.076.313-.244.995-.277 1.134-.044.183-.146.222-.337.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.966-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[9px] uppercase tracking-[0.28em] text-[#7C4A2D] mb-1 font-sans">Shop</span>
            {([
              ['New Arrivals',   '/shop/?sort=newest'],
              ['Dresses',        '/shop/dresses/'],
              ['Tops & Blouses', '/shop/tops/'],
              ['Skirts & Pants', '/shop/bottoms/'],
              ['Bags',           '/shop/bags/'],
              ['Accessories',    '/shop/accessories/'],
              ['Sale',           '/shop/sale/'],
            ] as [string, string][]).map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="text-[11px] font-sans text-[#9B8F87] hover:text-[#C4A882] transition-colors leading-relaxed"
              >{label}</Link>
            ))}
          </div>

          {/* Help */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[9px] uppercase tracking-[0.28em] text-[#7C4A2D] mb-1 font-sans">Help</span>
            {([
              ['Contact Us',          '/contact/'],
              ['Size Guide',          '/size-guide/'],
              ['Track Order',         '/track-order/'],
              ['Shipping Info',       '/shipping-policy/'],
              ['Returns & Refunds',   '/refund-policy/'],
              ['My Orders',           '/account/orders/'],
            ] as [string, string][]).map(([l, h]) => (
              <Link key={h} href={h} className="text-[11px] font-sans text-[#9B8F87] hover:text-[#C4A882] transition-colors leading-relaxed">{l}</Link>
            ))}
          </div>

          {/* Company */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[9px] uppercase tracking-[0.28em] text-[#7C4A2D] mb-1 font-sans">Company</span>
            {([
              ['About Us',      '/about/'],
              ['Privacy Policy','/privacy-policy/'],
              ['Terms of Use',  '/terms/'],
            ] as [string, string][]).map(([l, h]) => (
              <Link key={h} href={h} className="text-[11px] font-sans text-[#9B8F87] hover:text-[#C4A882] transition-colors leading-relaxed">{l}</Link>
            ))}
          </div>
        </div>

        {/* GSTIN */}
        {gstin && (
          <div className="border-t border-[#2A2220] pt-4 pb-3">
            <p className="text-[10px] font-sans text-[#9B8F87] leading-relaxed">
              <span className="text-[#6B5E55]">Kalokea Fashion Pvt. Ltd.</span>
              <span className="mx-2 text-[#2A2220]">|</span>
              GSTIN: <span className="text-[#6B5E55]">{gstin}</span>
              <span className="mx-2 text-[#2A2220]">|</span>
              Registered in Gujarat, India
            </p>
          </div>
        )}

        {/* Bottom bar */}
        <div className="border-t border-[#2A2220] pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-sans text-[#9B8F87] order-2 sm:order-1">
            © {new Date().getFullYear()} KALOKEA. All rights reserved.
          </p>

          {/* Payment icons */}
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <VisaIcon />
            <MastercardIcon />
            <UPIIcon />
            <RazorpayIcon />
            <CODIcon />
          </div>
        </div>

      </div>
    </footer>
  )
}
