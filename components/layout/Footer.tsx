import Link from 'next/link'

interface FooterProps {
  instagramUrl?: string
  whatsappUrl?:  string
  gstin?:        string
}

const VisaIcon = () => (
  <svg viewBox="0 0 48 30" width="36" height="22" xmlns="http://www.w3.org/2000/svg" aria-label="Visa">
    <rect width="48" height="30" rx="4" fill="#1a3a5c"/>
    <text x="24" y="21" textAnchor="middle" fontFamily="Arial" fontSize="13" fontWeight="700" fill="white" letterSpacing="0.5">VISA</text>
  </svg>
)

const MastercardIcon = () => (
  <svg viewBox="0 0 48 30" width="36" height="22" xmlns="http://www.w3.org/2000/svg" aria-label="Mastercard">
    <rect width="48" height="30" rx="4" fill="#252525"/>
    <circle cx="18" cy="15" r="8" fill="#EB001B" opacity="0.9"/>
    <circle cx="30" cy="15" r="8" fill="#F79E1B" opacity="0.9"/>
    <path d="M24 8.5a8 8 0 010 13" fill="#FF5F00" opacity="0.8"/>
  </svg>
)

const UPIIcon = () => (
  <svg viewBox="0 0 48 30" width="36" height="22" xmlns="http://www.w3.org/2000/svg" aria-label="UPI">
    <rect width="48" height="30" rx="4" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1"/>
    <text x="24" y="20" textAnchor="middle" fontFamily="Arial" fontSize="11" fontWeight="700" fill="#097969" letterSpacing="1">UPI</text>
  </svg>
)

const RazorpayIcon = () => (
  <svg viewBox="0 0 48 30" width="36" height="22" xmlns="http://www.w3.org/2000/svg" aria-label="Razorpay">
    <rect width="48" height="30" rx="4" fill="#072654"/>
    <text x="24" y="20" textAnchor="middle" fontFamily="Arial" fontSize="8" fontWeight="600" fill="white" letterSpacing="0.5">RAZORPAY</text>
  </svg>
)

const CODIcon = () => (
  <svg viewBox="0 0 48 30" width="36" height="22" xmlns="http://www.w3.org/2000/svg" aria-label="Cash on Delivery">
    <rect width="48" height="30" rx="4" fill="#1a1a1a" stroke="#2a2a2a" strokeWidth="1"/>
    <text x="24" y="20" textAnchor="middle" fontFamily="Arial" fontSize="8.5" fontWeight="600" fill="#6b6b6b" letterSpacing="0.5">COD</text>
  </svg>
)

export default function Footer({
  instagramUrl = 'https://www.instagram.com/kalokea.in',
  whatsappUrl  = 'https://wa.me/919999999999',
  gstin        = '',
}: FooterProps) {
  return (
    <footer className="bg-[#0a0a0a] text-white border-t-[3px] border-[#c8a4a5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-6">

        {/* Display wordmark */}
        <div className="text-center mb-12">
          <p
            className="font-serif font-light text-white opacity-90 leading-none select-none"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', letterSpacing: '0.18em' }}
          >
            KALOKEA
          </p>
          <p className="text-[11px] font-sans text-[#4a4a4a] tracking-[0.2em] uppercase mt-2">
            Curated Women's Fashion
          </p>
          {/* Rose divider */}
          <div className="mx-auto w-12 h-px bg-[#c8a4a5] mt-5 opacity-60" />
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-6 mb-10">

          {/* Brand col */}
          <div className="col-span-3 sm:col-span-1">
            <p className="text-[12px] font-sans text-[#4a4a4a] leading-relaxed mb-5 max-w-[180px]">
              Fashion for every woman — thoughtfully curated, delivered with care.
            </p>
            <div className="flex items-center gap-2.5">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full flex items-center justify-center border border-[#2a2a2a] text-[#6b6b6b] hover:text-[#c8a4a5] hover:border-[#c8a4a5] transition-all duration-200 hover:scale-110"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 rounded-full flex items-center justify-center border border-[#2a2a2a] text-[#6b6b6b] hover:text-[#c8a4a5] hover:border-[#c8a4a5] transition-all duration-200 hover:scale-110"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[9px] uppercase tracking-[0.22em] text-[#c8a4a5] mb-1 font-sans">Shop</span>
            {['New Arrivals','Dresses','Tops','Bottoms','Shoes','Bags','Sale'].map(c => (
              <Link
                key={c}
                href={`/shop?category=${c.toLowerCase().replace(/ /g,'-')}`}
                className="text-[11px] font-sans text-[#6b6b6b] hover:text-[#c8a4a5] transition-colors leading-relaxed"
              >{c}</Link>
            ))}
          </div>

          {/* Account */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[9px] uppercase tracking-[0.22em] text-[#c8a4a5] mb-1 font-sans">Account</span>
            {([['Orders','/account/orders'],['Profile','/account/profile'],['Wishlist','/account/wishlist'],['Track Order','/track-order']] as [string,string][]).map(([l,h]) => (
              <Link key={h} href={h} className="text-[11px] font-sans text-[#6b6b6b] hover:text-[#c8a4a5] transition-colors leading-relaxed">{l}</Link>
            ))}
          </div>

          {/* Help */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[9px] uppercase tracking-[0.22em] text-[#c8a4a5] mb-1 font-sans">Help</span>
            {([
              ['Shipping Policy','/shipping-policy'],
              ['Refund Policy','/refund-policy'],
              ['Contact Us','/contact'],
              ['About Us','/about'],
              ['Privacy Policy','/privacy-policy'],
              ['Terms','/terms'],
            ] as [string,string][]).map(([l,h]) => (
              <Link key={h} href={h} className="text-[11px] font-sans text-[#6b6b6b] hover:text-[#c8a4a5] transition-colors leading-relaxed">{l}</Link>
            ))}
          </div>
        </div>

        {/* Business / GST info */}
        {gstin && (
          <div className="border-t border-[#1a1a1a] pt-4 pb-3">
            <p className="text-[10px] font-sans text-[#4a4a4a] leading-relaxed">
              <span className="text-[#6b6b6b]">Kalokea Fashion Pvt. Ltd.</span>
              <span className="mx-2 text-[#2a2a2a]">|</span>
              GSTIN: <span className="text-[#6b6b6b]">{gstin}</span>
              <span className="mx-2 text-[#2a2a2a]">|</span>
              Registered in Gujarat, India
            </p>
          </div>
        )}

        {/* Bottom bar */}
        <div className="border-t border-[#1a1a1a] pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-sans text-[#4a4a4a] order-2 sm:order-1">
            © {new Date().getFullYear()} Kalokea. All rights reserved.
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
