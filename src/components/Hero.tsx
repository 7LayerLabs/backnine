import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative h-screen w-full flex items-end pb-24 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/marketing/b9_mkt1.png"
          alt="Golfer on the course"
          fill
          className="object-cover object-top"
          priority
        />
        {/* Gradient overlay for text readability at the bottom, keeping top clear */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-black tracking-tighter italic uppercase mb-6 drop-shadow-lg text-white">
            Own The <span className="text-transparent bg-clip-text bg-gradient-to-r from-b9-lime to-white">Back Nine</span>
          </h1>
          <p className="text-lg md:text-2xl font-light tracking-wide mb-10 max-w-xl text-gray-100">
            Premium performance apparel engineered for the modern game.
            Style that plays as hard as you do.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Link 
              href="/shop" 
              className="group bg-white text-b9-navy px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-b9-lime transition-all duration-300 flex items-center gap-2"
            >
              Shop Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/about" 
              className="group border border-white/40 backdrop-blur-sm text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-b9-navy transition-all duration-300"
            >
              Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
