"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { db } from "@/lib/instant";
import AuthModal from "./AuthModal";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { itemCount } = useCart();

  // Get auth state from InstantDB
  const { user } = db.useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = () => {
    db.auth.signOut();
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#1e3a5f] ${
          isScrolled ? "py-3 shadow-lg" : "py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="text-center">
              <span className="block text-xl font-bold tracking-[0.2em] font-montserrat text-white">
                BACK NINE
              </span>
              <span className="block text-xs tracking-[0.3em] uppercase text-white/80">
                Apparel
              </span>
            </div>
          </Link>

          <ul className="hidden md:flex items-center gap-8 text-white">
            <li><Link href="#shop" className="text-sm font-medium hover:opacity-70 transition-opacity">New Arrivals</Link></li>
            <li><Link href="#shop" className="text-sm font-medium hover:opacity-70 transition-opacity">Polos</Link></li>
            <li><Link href="#shop" className="text-sm font-medium hover:opacity-70 transition-opacity">Hoodies & Crews</Link></li>
            <li><Link href="#shop" className="text-sm font-medium hover:opacity-70 transition-opacity">Headwear</Link></li>
            <li><Link href="#shop" className="text-sm font-medium hover:opacity-70 transition-opacity">Accessories</Link></li>
            <li><Link href="#our-story" className="text-sm font-medium hover:opacity-70 transition-opacity">Our Story</Link></li>
          </ul>

          <div className="flex items-center gap-4">
            <button className="hidden md:block p-2 hover:opacity-70 transition-opacity text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="M21 21l-4.35-4.35"></path>
              </svg>
            </button>

            {/* User/Auth Button */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-white">
                  {user.email?.split('@')[0]}
                </span>
                <button
                  onClick={handleSignOut}
                  className="p-2 hover:opacity-70 transition-opacity text-white"
                  title="Sign Out"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="hidden md:block p-2 hover:opacity-70 transition-opacity text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 hover:opacity-70 transition-opacity text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <div className={`w-6 h-0.5 mb-1.5 transition-all bg-white ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
              <div className={`w-6 h-0.5 mb-1.5 transition-all bg-white ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-6 h-0.5 transition-all bg-white ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#1e3a5f] absolute top-full left-0 right-0 border-t border-white/10">
            <ul className="flex flex-col py-4">
              <li><Link href="#shop" className="block px-6 py-3 text-white hover:bg-white/10">New Arrivals</Link></li>
              <li><Link href="#shop" className="block px-6 py-3 text-white hover:bg-white/10">Polos</Link></li>
              <li><Link href="#shop" className="block px-6 py-3 text-white hover:bg-white/10">Hoodies & Crews</Link></li>
              <li><Link href="#shop" className="block px-6 py-3 text-white hover:bg-white/10">Headwear</Link></li>
              <li><Link href="#shop" className="block px-6 py-3 text-white hover:bg-white/10">Accessories</Link></li>
              <li><Link href="#our-story" className="block px-6 py-3 text-white hover:bg-white/10">Our Story</Link></li>
              {user ? (
                <li>
                  <button onClick={handleSignOut} className="block w-full text-left px-6 py-3 text-white hover:bg-white/10">
                    Sign Out ({user.email?.split('@')[0]})
                  </button>
                </li>
              ) : (
                <li>
                  <button onClick={() => setIsAuthModalOpen(true)} className="block w-full text-left px-6 py-3 text-white hover:bg-white/10">
                    Sign In
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
