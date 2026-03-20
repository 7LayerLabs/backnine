"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useShopFilter, Category, SubFilter } from "@/context/ShopFilterContext";
import { db } from "@/lib/instant";
import AuthModal from "./AuthModal";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const [isScrolled, setIsScrolled]       = useState(false);
  const [isMobileMenuOpen, setMobileMenu] = useState(false);
  const [isAuthModalOpen, setAuthModal]   = useState(false);
  const [isCartOpen, setCartOpen]         = useState(false);
  const { itemCount }  = useCart();
  const { setFilter }  = useShopFilter();
  const { user }       = db.useAuth();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNavClick = (category: Category, subFilter: SubFilter = null) => {
    setFilter(category, subFilter);
    setMobileMenu(false);
    document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#2D5016] shadow-md py-3"
            : "bg-[#2D5016] py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none">
            <span className="text-lg font-bold tracking-[0.2em] font-montserrat text-[#F5F0E8]">
              BACK NINE
            </span>
            <span className="text-[9px] tracking-[0.45em] uppercase font-inter text-[#C17D2A]">
              Apparel
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8">
            {[
              { label: "All",          cat: "all" as Category,         sub: null },
              { label: "Polos",        cat: "tops" as Category,        sub: "polos" as SubFilter },
              { label: "Hoodies",      cat: "tops" as Category,        sub: "hoodies" as SubFilter },
              { label: "Headwear",     cat: "headwear" as Category,    sub: null },
              { label: "Accessories",  cat: "accessories" as Category, sub: null },
            ].map(({ label, cat, sub }) => (
              <li key={label}>
                <button
                  onClick={() => handleNavClick(cat, sub)}
                  className="text-sm font-medium tracking-wide transition-colors hover:text-[#C17D2A] text-[#F5F0E8]"
                >
                  {label}
                </button>
              </li>
            ))}
            <li>
              <Link
                href="#our-story"
                className="text-sm font-medium tracking-wide transition-colors hover:text-[#C17D2A] text-[#F5F0E8]"
              >
                Our Story
              </Link>
            </li>
          </ul>

          {/* Right icons */}
          <div className="flex items-center gap-5">

            {/* Social — desktop only */}
            <div className="hidden md:flex items-center gap-3">
              {[
                { href: "https://instagram.com/BackNine.apparel", label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
                { href: "https://x.com/BackNineApparel",          label: "X",         path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
              ].map(({ href, label, path }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label}
                  className="transition-colors hover:text-[#C17D2A] text-[#F5F0E8]/80"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={path} /></svg>
                </a>
              ))}
            </div>

            <div className="hidden md:block w-px h-5 bg-white/25" />

            {/* Auth */}
            {user ? (
              <button onClick={() => db.auth.signOut()}
                    className="hidden md:flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-[#C17D2A] text-[#F5F0E8]/80"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            ) : (
              <button onClick={() => setAuthModal(true)}
                className="hidden md:block transition-colors hover:text-[#C17D2A] text-[#F5F0E8]/80"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </button>
            )}

            {/* Cart */}
            <button onClick={() => setCartOpen(true)} className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="transition-colors hover:text-[#C17D2A] text-[#F5F0E8]"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#C17D2A] text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button className="md:hidden flex flex-col gap-1.5" onClick={() => setMobileMenu(!isMobileMenuOpen)}>
              {[0, 1, 2].map(i => (
                <span key={i} className={`block h-px w-6 transition-all bg-[#F5F0E8] ${
                  i === 0 && isMobileMenuOpen ? "rotate-45 translate-y-2" :
                  i === 1 && isMobileMenuOpen ? "opacity-0" :
                  i === 2 && isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`} />
              ))}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#F5F0E8] border-t border-[#D4C9B0]">
            <ul className="flex flex-col py-3">
              {[
                { label: "All Products",   fn: () => handleNavClick("all") },
                { label: "Polos",          fn: () => handleNavClick("tops", "polos") },
                { label: "Hoodies",        fn: () => handleNavClick("tops", "hoodies") },
                { label: "Headwear",       fn: () => handleNavClick("headwear") },
                { label: "Accessories",    fn: () => handleNavClick("accessories") },
              ].map(({ label, fn }) => (
                <li key={label}>
                  <button onClick={fn} className="block w-full text-left px-6 py-3 text-sm text-[#1A1208] font-medium hover:text-[#C17D2A] hover:bg-[#EDE7D9] transition-colors">
                    {label}
                  </button>
                </li>
              ))}
              <li>
                <Link href="#our-story" onClick={() => setMobileMenu(false)} className="block px-6 py-3 text-sm text-[#1A1208] font-medium hover:text-[#C17D2A] hover:bg-[#EDE7D9]">
                  Our Story
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setAuthModal(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
