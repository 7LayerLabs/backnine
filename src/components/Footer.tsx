import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-b9-navy text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            {/* Logo Image */}
            <div className="relative w-48 h-20 -ml-2">
              <Image 
                src="/images/logo.jpeg" 
                alt="Back Nine Apparel Logo" 
                fill
                className="object-contain object-left"
              />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium golf apparel designed for the modern athlete. Performance meets style on and off the course.
            </p>
          </div>

          {/* Shop Column */}
          <div>
            <h4 className="font-bold uppercase tracking-wider mb-4 text-sm">Shop</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="#" className="hover:text-b9-lime transition-colors">New Arrivals</Link></li>
              <li><Link href="#" className="hover:text-b9-lime transition-colors">Polos</Link></li>
              <li><Link href="#" className="hover:text-b9-lime transition-colors">Outerwear</Link></li>
              <li><Link href="#" className="hover:text-b9-lime transition-colors">Accessories</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-bold uppercase tracking-wider mb-4 text-sm">Support</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="#" className="hover:text-b9-lime transition-colors">FAQ</Link></li>
              <li><Link href="#" className="hover:text-b9-lime transition-colors">Shipping & Returns</Link></li>
              <li><Link href="#" className="hover:text-b9-lime transition-colors">Size Guide</Link></li>
              <li><Link href="#" className="hover:text-b9-lime transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="font-bold uppercase tracking-wider mb-4 text-sm">Stay in the loop</h4>
            <p className="text-gray-400 text-sm mb-4">Subscribe for exclusive drops and early access.</p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-white/10 border border-white/20 px-4 py-2 text-sm w-full focus:outline-none focus:border-b9-lime transition-colors text-white placeholder:text-gray-500"
              />
              <button className="bg-b9-white text-b9-navy px-4 py-2 text-sm font-bold uppercase hover:bg-b9-lime transition-colors">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs">© {new Date().getFullYear()} Back Nine Apparel. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></Link>
            <Link href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook className="w-5 h-5" /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
