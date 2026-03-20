import Image from "next/image";
import Link from "next/link";

export default function LifestyleSection() {
  return (
    <section className="py-16 sm:py-24 bg-[#F5F0E8]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#C17D2A] text-xs tracking-[0.4em] uppercase font-montserrat font-semibold mb-2">Collections</p>
            <h2 className="font-dm-serif text-4xl sm:text-5xl text-[#1A1208]">
              Built for the course.<br />
              <span className="italic">Worn everywhere else.</span>
            </h2>
          </div>
          <Link
            href="#shop"
            className="hidden sm:flex items-center gap-2 text-sm text-[#2D5016] font-semibold font-montserrat hover:text-[#C17D2A] transition-colors tracking-wide"
          >
            View all
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>

        {/* Asymmetric image grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

          {/* Large left panel */}
          <div className="md:col-span-7 group relative overflow-hidden aspect-[4/5] md:aspect-auto md:min-h-[600px]">
            <Image
              src="/apparel/marketing/b9mkt6.png"
              alt="Classic Collection"
              fill
              className="object-cover object-top transition-transform duration-700 group-hover:scale-103"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1208]/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <p className="text-[#C17D2A] text-xs tracking-[0.4em] uppercase font-montserrat mb-2">Collection 01</p>
              <h3 className="font-dm-serif text-3xl text-[#F5F0E8] mb-1">Classic Collection</h3>
              <p className="text-[#F5F0E8]/65 text-sm font-inter mb-5">Timeless cuts for the modern golfer</p>
              <Link
                href="#shop"
                className="inline-flex items-center gap-2 bg-[#F5F0E8] text-[#1A1208] text-xs font-semibold tracking-wider px-6 py-3 font-montserrat hover:bg-[#C17D2A] hover:text-white transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>

          {/* Right column — two stacked panels */}
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="group relative overflow-hidden aspect-[4/3.5]">
              <Image
                src="/apparel/marketing/b9_mkt2.png"
                alt="Par-Tee Time"
                fill
                className="object-cover object-top transition-transform duration-700 group-hover:scale-103"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1208]/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-[#C17D2A] text-xs tracking-[0.4em] uppercase font-montserrat mb-1">Collection 02</p>
                <h3 className="font-dm-serif text-2xl text-[#F5F0E8] mb-3">Par-Tee Time</h3>
                <Link href="#shop" className="inline-flex items-center gap-2 bg-[#F5F0E8] text-[#1A1208] text-xs font-semibold tracking-wider px-5 py-2.5 font-montserrat hover:bg-[#C17D2A] hover:text-white transition-colors">
                  Shop Now
                </Link>
              </div>
            </div>

            {/* Ambient warm card */}
            <div className="relative overflow-hidden bg-[#2D5016] flex flex-col justify-center px-8 py-10 flex-1">
              {/* Subtle background texture */}
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "repeating-linear-gradient(45deg, #F5F0E8 0, #F5F0E8 1px, transparent 0, transparent 50%)", backgroundSize: "14px 14px" }}
              />
              <p className="text-[#C17D2A] text-xs tracking-[0.4em] uppercase font-montserrat mb-3 relative">The Back Nine Promise</p>
              <p className="font-dm-serif text-2xl text-[#F5F0E8] relative leading-snug mb-5">
                "Look good on the course.<br />
                <span className="italic">Stay that way after."</span>
              </p>
              <Link
                href="#our-story"
                className="inline-flex items-center gap-2 text-[#C17D2A] text-xs font-semibold tracking-wider font-montserrat hover:gap-3 transition-all relative"
              >
                Our Story
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
