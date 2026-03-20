import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden grain">

      {/* Full-bleed background image */}
      <div className="absolute inset-0">
        <Image
          src="/apparel/marketing/b9_mkt1.png"
          alt="Back Nine — Golf lifestyle"
          fill
          className="object-cover object-top"
          priority
        />
        {/* Strong gradient for legibility — heavier at bottom where text lives */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/85" />
      </div>

      {/* Content — bottom-left anchored, editorial style */}
      <div className="relative z-10 flex flex-col justify-end min-h-screen pb-20 pt-32 px-6 sm:px-12 max-w-7xl mx-auto">

        {/* Eyebrow */}
        <p className="text-[#C17D2A] text-xs tracking-[0.45em] uppercase font-montserrat font-semibold mb-4 drop-shadow-md">
          Est. 2025 · Golf Apparel
        </p>

        {/* Headline */}
        <h1 className="font-dm-serif text-5xl sm:text-7xl md:text-8xl text-white leading-[0.95] mb-6 max-w-3xl drop-shadow-lg">
          The Back&nbsp;Nine
          <br />
          <span className="italic text-[#C17D2A]">Starts Here.</span>
        </h1>

        {/* Subline */}
        <p className="text-[#F5F0E8]/75 text-base sm:text-lg font-inter max-w-md mb-10 leading-relaxed">
          Golf gear that moves from the fairway to the 19th hole without missing a beat.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 items-center">
          <Link
            href="#shop"
            className="inline-flex items-center gap-2 bg-[#C17D2A] hover:bg-[#A8681F] text-white text-sm font-semibold tracking-wide px-8 py-4 transition-colors font-montserrat"
          >
            Shop the Collection
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
          <Link
            href="#our-story"
            className="inline-flex items-center gap-2 text-[#F5F0E8] border border-[#F5F0E8]/40 hover:border-[#F5F0E8] text-sm font-medium tracking-wide px-8 py-4 transition-colors font-montserrat"
          >
            Our Story
          </Link>
        </div>

        {/* Scroll cue */}
        <div className="hidden sm:flex items-center gap-3 mt-14 text-[#F5F0E8]/40">
          <div className="w-8 h-px bg-[#F5F0E8]/30" />
          <span className="text-[10px] tracking-[0.4em] uppercase font-inter">Scroll to explore</span>
        </div>
      </div>

      {/* Floating stat strip — bottom-right */}
      <div className="absolute bottom-10 right-6 sm:right-12 z-10 hidden md:flex flex-col items-end gap-4">
        {[
          { value: "100%", label: "Print on demand" },
          { value: "48hr", label: "Avg. ship time" },
        ].map(({ value, label }) => (
          <div key={label} className="text-right">
            <div className="text-[#C17D2A] text-2xl font-dm-serif font-bold">{value}</div>
            <div className="text-[#F5F0E8]/50 text-[10px] tracking-widest uppercase font-inter">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
