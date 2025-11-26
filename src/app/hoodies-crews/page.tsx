import PageHeader from '@/components/PageHeader';
import ProductListing from '@/components/ProductListing';

export default function HoodiesCrewsPage() {
  return (
    <main className="bg-white">
      <PageHeader 
        title="Hoodies & Crews" 
        subtitle="Layer up in style. Premium fleece for early mornings and late evenings."
        imageSrc="/images/products/b9_sweatshirt2.jpeg"
        imageAlt="Golfer in hoodie"
      />

      <section className="py-24">
        <div className="container mx-auto px-4">
          <ProductListing category="hoodies-crews" />
        </div>
      </section>
    </main>
  );
}

