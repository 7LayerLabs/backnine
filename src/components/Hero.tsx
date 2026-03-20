import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden">

      {/* Background image — pushed right so face doesn't overlap text */}
      <div className="absolute inset-0">
        <Image
          src="/apparel/marketing/b9_mkt1.png"
          alt="Back Nine — Golf lifestyle"
          fill
          className="object-cover object-[70%_top]"
          priority
        />
        {/* Strong left-side gradient so text is always legible */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10" />
        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Nav spacer */}
      <div className="h-20" />

      {/* Content — left-aligned, vertically centered */}
      <div className="relative z-10 flex flex-col justify-center min-h-[calc(100vh-80px)] px-8 sm:px-16 max-w-3xl">

        {/* Eyebrow */}
        <p className="text-[#C17D2A] text-[10px] tracking-[0.5em] uppercase font-montserrat font-semibold mb-6">
          Est. 2025 · Golf Apparel
        </p>

        {/* Headline */}
        <h1 className="font-dm-serif text-6xl sm:text-7xl md:text-8xl text-white leading-[1] mb-3">
          The Back Nine
        </h1>
        <h1 className="font-dm-serif text-6xl sm:text-7xl md:text-8xl leading-[1] mb-10">
          <span className="italic text-[#C17D2A]">Starts Here.</span>
        </h1>

        {/* Subline */}
        <p className="text-white/70 text-base sm:text-lg font-inter max-w-sm mb-10 leading-relaxed">
          Golf gear that moves from the fairway to the 19th hole without missing a beat.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 items-center mb-16">
          <Link
            href="#shop"
            className="inline-flex items-center gap-2 bg-[#C17D2A] hover:bg-[#A8681F] text-white text-sm font-semibold tracking-wide px-8 py-4 transition-colors font-montserrat"
          >
            Shop the Collection
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
          <Link
            href="#our-story"
            className="inline-flex items-center gap-2 text-white/80 border border-white/30 hover:border-white/70 hover:text-white text-sm font-medium tracking-wide px-8 py-4 transition-colors font-montserrat"
          >
            Our Story
          </Link>
        </div>

        {/* Scroll cue — subtle */}
        <div className="flex items-center gap-3 text-white/30">
          <div className="w-6 h-px bg-white/20" />
          <span className="text-[9px] tracking-[0.5em] uppercase font-inter">Scroll</span>
        </div>
      </div>

      {/* Stats — bottom right, tighter and cleaner */}
      <div className="absolute bottom-12 right-10 z-10 hidden md:flex flex-col items-end gap-5">
        {[
          { value: "100%", label: "Print on demand" },
          { value: "48hr", label: "Avg. ship time" },
        ].map(({ value, label }) => (
          <div key={label} className="text-right">
            <div className="text-[#C17D2A] text-xl font-dm-serif font-bold leading-none">{value}</div>
            <div className="text-white/35 text-[9px] tracking-[0.3em] uppercase font-inter mt-1">{label}</div>
          </div>
        ))}
      </div>

    </section>
  );
}
