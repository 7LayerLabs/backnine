import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section id="home" className="min-h-screen bg-white flex items-center">
      <div className="max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <p className="text-sm tracking-[0.3em] text-stone-500 uppercase font-montserrat">Est. 2025</p>
            <h1 className="font-montserrat text-5xl md:text-6xl lg:text-7xl text-stone-900 font-bold tracking-wide">
              BACK NINE
              <span className="block text-emerald-700">APPAREL</span>
            </h1>
            <p className="text-lg text-stone-600 max-w-md font-inter leading-relaxed">
              Premium golf lifestyle clothing for those who appreciate the finer things — on and off the course.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                href="#shop"
                className="inline-block bg-stone-900 text-white px-8 py-4 text-sm font-medium tracking-wide hover:bg-stone-800 transition-colors"
              >
                Shop Collection
              </Link>
              <Link
                href="#our-story"
                className="inline-block border-2 border-stone-900 text-stone-900 px-8 py-4 text-sm font-medium tracking-wide hover:bg-stone-900 hover:text-white transition-colors"
              >
                Our Story
              </Link>
            </div>
          </div>
          <div className="relative">
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
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center text-stone-500 hover:text-stone-700 transition-colors"
      >
        <span className="text-xs tracking-widest uppercase mb-2">Scroll to explore</span>
        <div className="w-px h-8 bg-stone-400"></div>
      </Link>
    </section>
  );
}
