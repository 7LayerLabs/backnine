import PageHeader from '@/components/PageHeader';
import ProductListing from '@/components/ProductListing';

export default function AccessoriesPage() {
  return (
    <main className="bg-white">
      <PageHeader 
        title="Accessories" 
        subtitle="The essentials. Elevate your bag with premium details."
        imageSrc="/images/products/b9_golftowel.jpeg"
        imageAlt="Golf Accessories"
      />

      <section className="py-24">
        <div className="container mx-auto px-4">
          <ProductListing category="accessories" />
        </div>
      </section>
    </main>
  );
}

