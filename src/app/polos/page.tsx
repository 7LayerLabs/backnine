import PageHeader from '@/components/PageHeader';
import ProductListing from '@/components/ProductListing';

export default function PolosPage() {
  return (
    <main className="bg-white">
      <PageHeader 
        title="Performance Polos" 
        subtitle="Engineered for the swing. Designed for the clubhouse."
        imageSrc="/images/marketing/b9_mkt2.png"
        imageAlt="Golfer in polo"
      />

      <section className="py-24">
        <div className="container mx-auto px-4">
          <ProductListing category="polos" />
        </div>
      </section>
    </main>
  );
}

