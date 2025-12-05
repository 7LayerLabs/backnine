import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.jpeg"
                alt="Back Nine Apparel"
                width={50}
                height={50}
                className="rounded"
              />
              <h3 className="text-xl font-bold tracking-wide font-montserrat">BACK NINE</h3>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed">
              Golf gear for guys who play hard and look good doing it.
              Course to bar, we got you.
            </p>
            {/* Social Media Links */}
            <div className="flex items-center gap-4 pt-2">
              {/* X (Twitter) */}
              <a
                href="https://x.com/BackNineApparel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-white transition-colors"
                aria-label="Follow us on X"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://instagram.com/BackNine.apparel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-white transition-colors"
                aria-label="Follow us on Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              {/* TikTok */}
              <a
                href="https://tiktok.com/@backnine.apparel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-white transition-colors"
                aria-label="Follow us on TikTok"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
              {/* Facebook */}
              <a
                href="https://facebook.com/BackNineApparel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-stone-400 hover:text-white transition-colors"
                aria-label="Follow us on Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <Link href="#shop" className="hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="#shop" className="hover:text-white transition-colors">
                  Tops
                </Link>
              </li>
              <li>
                <Link href="#shop" className="hover:text-white transition-colors">
                  Headwear
                </Link>
              </li>
              <li>
                <Link href="#shop" className="hover:text-white transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Help</h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <Link href="#our-story" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-12 pt-8">
          {/* Payment Methods */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-xs text-stone-500">Secure payments with</span>
            {/* Visa */}
            <svg className="h-8 w-auto opacity-60 hover:opacity-100 transition-opacity" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="38" height="24" rx="4" fill="#1A1F71"/>
              <path d="M15.5 16.5L17 7.5H19.5L18 16.5H15.5Z" fill="white"/>
              <path d="M24 7.5C23.5 7.3 22.7 7 21.7 7C19.2 7 17.5 8.3 17.5 10.1C17.5 11.5 18.8 12.2 19.8 12.7C20.8 13.2 21.1 13.5 21.1 13.9C21.1 14.5 20.4 14.8 19.7 14.8C18.7 14.8 18.2 14.6 17.4 14.3L17.1 14.2L16.8 16.1C17.4 16.4 18.4 16.6 19.5 16.6C22.2 16.6 23.8 15.3 23.8 13.4C23.8 12.3 23.1 11.5 21.6 10.8C20.7 10.4 20.2 10.1 20.2 9.6C20.2 9.2 20.7 8.8 21.6 8.8C22.4 8.8 23 9 23.4 9.2L23.6 9.3L24 7.5Z" fill="white"/>
              <path d="M28.5 7.5H26.5C25.9 7.5 25.5 7.7 25.2 8.3L21.5 16.5H24.2L24.7 15H28L28.3 16.5H30.7L28.5 7.5ZM25.4 13C25.6 12.4 26.5 10 26.5 10C26.5 10 26.7 9.4 26.8 9.1L27 10L27.6 13H25.4Z" fill="white"/>
              <path d="M13.5 7.5L11 13.5L10.7 12C10.2 10.5 8.8 8.8 7.2 8L9.5 16.5H12.2L16.2 7.5H13.5Z" fill="white"/>
              <path d="M9 7.5H5L5 7.7C8.2 8.5 10.3 10.5 11 12.5L10.2 8.3C10.1 7.7 9.6 7.5 9 7.5Z" fill="#F9A51A"/>
            </svg>
            {/* Mastercard */}
            <svg className="h-8 w-auto opacity-60 hover:opacity-100 transition-opacity" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="38" height="24" rx="4" fill="#F5F5F5"/>
              <circle cx="15" cy="12" r="7" fill="#EB001B"/>
              <circle cx="23" cy="12" r="7" fill="#F79E1B"/>
              <path d="M19 6.8C20.3 7.9 21.1 9.5 21.1 11.3C21.1 13.1 20.3 14.7 19 15.8C17.7 14.7 16.9 13.1 16.9 11.3C16.9 9.5 17.7 7.9 19 6.8Z" fill="#FF5F00"/>
            </svg>
            {/* Amex */}
            <svg className="h-8 w-auto opacity-60 hover:opacity-100 transition-opacity" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="38" height="24" rx="4" fill="#006FCF"/>
              <path d="M7 12L9.5 7H12L14.5 12L12 17H9.5L7 12Z" fill="white"/>
              <path d="M15 7H18V9H16V10.5H18V12.5H16V14H18V17H15V7Z" fill="white"/>
              <path d="M19 7H22L23.5 11L25 7H28V17H25.5V11L24 15H23L21.5 11V17H19V7Z" fill="white"/>
              <path d="M29 7H32V9H30V10.5H32V12.5H30V14H32V17H29V7Z" fill="white"/>
            </svg>
            {/* Klarna */}
            <svg className="h-8 w-auto opacity-60 hover:opacity-100 transition-opacity" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="38" height="24" rx="4" fill="#FFB3C7"/>
              <path d="M8 8H10.2V16H8V8Z" fill="black"/>
              <path d="M11 8H13.2C13.2 9.5 12.6 10.8 11.6 11.8L14 16H11.4L9.2 12L10.2 11.2C11.2 10.4 11.8 9.2 11.8 8H11Z" fill="black"/>
              <path d="M14.5 8H16.7V16H14.5V8Z" fill="black"/>
              <path d="M21.5 8H19V16H21.2V13.2L23.7 16H26.5L23.3 12.5C24.4 11.9 25.2 10.8 25.2 9.5C25.2 8.1 24 7 22.3 7H19V8H21.5C22.3 8 23 8.6 23 9.5C23 10.4 22.3 11 21.5 11H21.2V8H21.5Z" fill="black"/>
              <path d="M27 8C27 8.8 27.7 9.5 28.5 9.5C29.3 9.5 30 8.8 30 8C30 7.2 29.3 6.5 28.5 6.5C27.7 6.5 27 7.2 27 8Z" fill="black"/>
              <path d="M27.4 10H29.6V16H27.4V10Z" fill="black"/>
            </svg>
          </div>
          <p className="text-center text-stone-500 text-sm">&copy; 2025 Back Nine Apparel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
