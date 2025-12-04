import Image from "next/image";

export default function AboutSection() {
  return (
    <section id="our-story" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-square">
            <Image
              src="/logo.jpeg"
              alt="Back Nine Apparel"
              fill
              className="object-contain"
            />
          </div>
          <div className="space-y-6">
            <span className="text-sm tracking-[0.3em] text-stone-500 uppercase font-montserrat">
              Our Story
            </span>
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold tracking-wide text-stone-900 uppercase">
              Where Passion Meets the Fairway
            </h2>
            <p className="text-stone-600 leading-relaxed">
              Back Nine Apparel was founded in 2025 with a simple mission: create premium
              golf lifestyle clothing that looks as good at the 19th hole as it does on
              the fairway.
            </p>
            <p className="text-stone-600 leading-relaxed">
              We believe golf is more than a sport — it&apos;s a lifestyle. Our designs blend
              classic golf aesthetics with modern streetwear sensibility, perfect for the
              course, the clubhouse, or anywhere life takes you.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
              <div>
                <h4 className="font-semibold text-stone-900 mb-2">Premium Quality</h4>
                <p className="text-sm text-stone-600">
                  Carefully selected fabrics for comfort and durability
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-stone-900 mb-2">Unique Designs</h4>
                <p className="text-sm text-stone-600">
                  Original artwork celebrating golf culture
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-stone-900 mb-2">Made for Golfers</h4>
                <p className="text-sm text-stone-600">
                  By golfers who understand the lifestyle
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
