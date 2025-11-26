import PageHeader from '@/components/PageHeader';
import ProductListing from '@/components/ProductListing';

export default function ShopPage() {
  return (
    <main className="bg-white">
      <PageHeader 
        title="Shop All" 
        subtitle="The complete collection. Performance essentials for the modern golfer."
        imageSrc="/images/marketing/b9_mkt1.png"
      />

      <section className="py-24">
        <div className="container mx-auto px-4">
          <ProductListing />
        </div>
      </section>
    </main>
  );
}

