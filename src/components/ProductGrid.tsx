import Link from 'next/link';
import ProductListing from './ProductListing';

export default function ProductGrid() {
  return (
    <section className="py-24 bg-b9-cream">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-b9-green font-bold uppercase tracking-widest text-xs mb-2 block">New Arrivals</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic text-b9-navy">
              Course Ready
            </h2>
          </div>
          <Link href="/shop" className="hidden md:block text-b9-navy font-bold uppercase text-sm tracking-widest border-b border-b9-navy pb-1 hover:text-b9-green hover:border-b9-green transition-colors">
            View All Products
          </Link>
        </div>

        <ProductListing limit={4} />
        
        <div className="mt-12 text-center md:hidden">
          <Link href="/shop" className="inline-block bg-b9-navy text-white px-8 py-4 text-sm font-bold uppercase tracking-widest">
             View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
