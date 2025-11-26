import Link from 'next/link';
import { Search, ShoppingBag, User, Menu } from 'lucide-react';

const navLinks = [
  { name: 'New Arrivals', href: '/new-arrivals' },
  { name: 'Polos', href: '/polos' },
  { name: 'Hoodies & Crews', href: '/hoodies-crews' },
  { name: 'Headwear', href: '/headwear' },
  { name: 'Accessories', href: '/accessories' },
  { name: 'Our Story', href: '/about' },
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
      <div className="max-w-8xl mx-auto px-6 h-24 flex items-center justify-between">
        {/* Mobile Menu */}
        <button className="lg:hidden p-2">
          <Menu className="w-6 h-6 text-b9-navy" />
        </button>

        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none group">
          <span className="text-3xl font-black tracking-tighter text-b9-navy uppercase">
            Back Nine
          </span>
          <span className="text-[10px] font-semibold tracking-[0.35em] text-b9-green uppercase mt-1 group-hover:text-b9-lime transition-colors">
            Apparel
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-8 xl:gap-12">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              className="text-sm font-bold text-b9-navy hover:text-b9-green transition-colors uppercase tracking-widest"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-b9-navy">
            <Search className="w-6 h-6 stroke-[1.5]" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-b9-navy">
            <User className="w-6 h-6 stroke-[1.5]" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-b9-navy relative">
            <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-b9-gold text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
              0
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}
