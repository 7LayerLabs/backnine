import Image from "next/image";
import Link from "next/link";

export default function LifestyleSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="group relative overflow-hidden aspect-[4/5]">
            <Image
              src="/apparel/marketing/b9mkt6.png"
              alt="Back Nine Apparel - Classic Collection"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-white text-2xl font-semibold mb-2">Classic Collection</h3>
              <p className="text-white/80 mb-4">Timeless style for the modern golfer</p>
              <Link
                href="#shop"
                className="inline-block bg-white text-stone-900 px-6 py-3 text-sm font-medium w-fit hover:bg-stone-100 transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>
          <div className="group relative overflow-hidden aspect-[4/5]">
            <Image
              src="/apparel/marketing/b9_mkt2.png"
              alt="Back Nine Apparel - Par-Tee Time"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-white text-2xl font-semibold mb-2">Par-Tee Time</h3>
              <p className="text-white/80 mb-4">Because golf is always a good time</p>
              <Link
                href="#shop"
                className="inline-block bg-white text-stone-900 px-6 py-3 text-sm font-medium w-fit hover:bg-stone-100 transition-colors"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
