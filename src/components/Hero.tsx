import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section id="home" className="min-h-screen bg-white flex items-center relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-20 w-full">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-4 sm:space-y-6 order-2 md:order-1">
            <p className="text-xs sm:text-sm tracking-[0.3em] text-stone-500 uppercase font-montserrat">Est. 2025</p>
            <h1 className="font-montserrat text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-stone-900 font-bold tracking-wide">
              BACK NINE
              <span className="block text-emerald-700">APPAREL</span>
            </h1>
            <p className="text-base sm:text-lg text-stone-600 max-w-md font-inter leading-relaxed">
              Golf gear that goes from the course to the clubhouse. Look good. Play better. Finish strong.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
              <Link
                href="#shop"
                className="inline-block bg-stone-900 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm font-medium tracking-wide hover:bg-stone-800 transition-colors text-center"
              >
                Shop Collection
              </Link>
              <Link
                href="#our-story"
                className="inline-block border-2 border-stone-900 text-stone-900 px-6 sm:px-8 py-3 sm:py-4 text-sm font-medium tracking-wide hover:bg-stone-900 hover:text-white transition-colors text-center"
              >
                Our Story
              </Link>
            </div>
          </div>
          <div className="relative order-1 md:order-2">
            <Image
              src="/apparel/marketing/b9_mkt1.png"
              alt="Back Nine Apparel - Premium Golf Lifestyle"
              width={600}
              height={700}
              className="w-full h-auto object-cover rounded-sm shadow-2xl"
              priority
            />
          </div>
        </div>
      </div>
      <Link
        href="#shop"
        className="hidden sm:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center text-stone-500 hover:text-stone-700 transition-colors"
      >
        <span className="text-xs tracking-widest uppercase mb-2">Scroll to explore</span>
        <div className="w-px h-8 bg-stone-400"></div>
      </Link>
    </section>
  );
}
