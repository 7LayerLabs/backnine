import PageHeader from '@/components/PageHeader';
import ProductListing from '@/components/ProductListing';

export default function NewArrivalsPage() {
  return (
    <main className="bg-white">
      <PageHeader 
        title="New Arrivals" 
        subtitle="Fresh off the press. The latest gear to elevate your game."
        imageSrc="/images/marketing/b9_mkt1.png"
      />

      <section className="py-24">
        <div className="container mx-auto px-4">
          <ProductListing filterNew={true} />
        </div>
      </section>
    </main>
  );
}

