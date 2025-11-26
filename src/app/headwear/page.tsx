import PageHeader from '@/components/PageHeader';
import ProductListing from '@/components/ProductListing';

export default function HeadwearPage() {
  return (
    <main className="bg-white">
      <PageHeader 
        title="Headwear" 
        subtitle="Top off your look. Tour-tested caps and lifestyle lids."
        imageSrc="/images/products/b9_cap1.jpeg"
        imageAlt="Back Nine Hat"
      />

      <section className="py-24">
        <div className="container mx-auto px-4">
          <ProductListing category="headwear" />
        </div>
      </section>
    </main>
  );
}

