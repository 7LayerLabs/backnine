"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useShopFilter, Category, SubFilter } from "@/context/ShopFilterContext";
import { db } from "@/lib/instant";
import AuthModal from "./AuthModal";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { itemCount } = useCart();
  const { setFilter } = useShopFilter();

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

  const handleNavClick = (category: Category, subFilter: SubFilter = null) => {
    setFilter(category, subFilter);
    setIsMobileMenuOpen(false);
    // Smooth scroll to shop section
    const shopSection = document.getElementById("shop");
    if (shopSection) {
      shopSection.scrollIntoView({ behavior: "smooth" });
    }
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
            <li><button onClick={() => handleNavClick("all")} className="text-sm font-medium hover:opacity-70 transition-opacity">All Products</button></li>
            <li><button onClick={() => handleNavClick("tops", "polos")} className="text-sm font-medium hover:opacity-70 transition-opacity">Polos</button></li>
            <li><button onClick={() => handleNavClick("tops", "hoodies")} className="text-sm font-medium hover:opacity-70 transition-opacity">Hoodies & Crews</button></li>
            <li><button onClick={() => handleNavClick("headwear")} className="text-sm font-medium hover:opacity-70 transition-opacity">Headwear</button></li>
            <li><button onClick={() => handleNavClick("accessories")} className="text-sm font-medium hover:opacity-70 transition-opacity">Accessories</button></li>
            <li><Link href="#our-story" className="text-sm font-medium hover:opacity-70 transition-opacity">Our Story</Link></li>
          </ul>

          <div className="flex items-center gap-4">
            {/* Social Links */}
            <div className="hidden md:flex items-center gap-3">
              <a href="https://x.com/BackNineApparel" target="_blank" rel="noopener noreferrer" className="text-white hover:opacity-70 transition-opacity" aria-label="X">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="https://instagram.com/BackNine.apparel" target="_blank" rel="noopener noreferrer" className="text-white hover:opacity-70 transition-opacity" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="https://tiktok.com/@backnine.apparel" target="_blank" rel="noopener noreferrer" className="text-white hover:opacity-70 transition-opacity" aria-label="TikTok">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
              <a href="https://facebook.com/BackNineApparel" target="_blank" rel="noopener noreferrer" className="text-white hover:opacity-70 transition-opacity" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>

            <div className="hidden md:block w-px h-6 bg-white/30 mx-2"></div>

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
              <li><button onClick={() => handleNavClick("all")} className="block w-full text-left px-6 py-3 text-white hover:bg-white/10">All Products</button></li>
              <li><button onClick={() => handleNavClick("tops", "polos")} className="block w-full text-left px-6 py-3 text-white hover:bg-white/10">Polos</button></li>
              <li><button onClick={() => handleNavClick("tops", "hoodies")} className="block w-full text-left px-6 py-3 text-white hover:bg-white/10">Hoodies & Crews</button></li>
              <li><button onClick={() => handleNavClick("headwear")} className="block w-full text-left px-6 py-3 text-white hover:bg-white/10">Headwear</button></li>
              <li><button onClick={() => handleNavClick("accessories")} className="block w-full text-left px-6 py-3 text-white hover:bg-white/10">Accessories</button></li>
              <li><Link href="#our-story" onClick={() => setIsMobileMenuOpen(false)} className="block px-6 py-3 text-white hover:bg-white/10">Our Story</Link></li>
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
