import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import BrandStory from '@/components/BrandStory';

export default function Home() {
  return (
    <main>
      <Hero />
      <ProductGrid />
      <BrandStory />
      
      {/* Newsletter / CTA Section */}
      <section className="py-32 bg-b9-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/marketing/b9_mkt4.png')] bg-cover bg-center bg-fixed"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-white mb-8">
            Join The Club
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto mb-10 text-lg">
            Sign up for early access to new drops, exclusive member events, and pro tips.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="ENTER YOUR EMAIL" 
              className="w-full bg-white/10 border border-white/20 px-6 py-4 text-white placeholder:text-gray-400 focus:outline-none focus:border-b9-lime transition-colors text-center sm:text-left uppercase tracking-wider font-bold"
            />
            <button className="w-full sm:w-auto bg-b9-lime text-b9-navy px-8 py-4 font-black uppercase tracking-widest hover:bg-white transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
