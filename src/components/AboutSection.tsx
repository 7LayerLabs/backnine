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
              Built for the Back Nine
            </h2>
            <p className="text-stone-600 leading-relaxed">
              We started Back Nine in 2025 because golf apparel was either too stuffy or too boring.
              We wanted gear you could wear from your morning round to happy hour without missing a beat.
            </p>
            <p className="text-stone-600 leading-relaxed">
              Golf is where you close deals, catch up with the boys, and clear your head.
              Your gear should match that energy — clean, confident, and ready for whatever comes next.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="bg-stone-50 border border-stone-200 p-5 text-center">
                <h4 className="font-semibold text-stone-900 mb-2">Quality That Lasts</h4>
                <p className="text-sm text-stone-600">
                  Premium fabrics that hold up round after round
                </p>
              </div>
              <div className="bg-stone-50 border border-stone-200 p-5 text-center">
                <h4 className="font-semibold text-stone-900 mb-2">Fresh Designs</h4>
                <p className="text-sm text-stone-600">
                  Golf style that doesn't look like your dad's closet
                </p>
              </div>
              <div className="bg-stone-50 border border-stone-200 p-5 text-center">
                <h4 className="font-semibold text-stone-900 mb-2">By Golfers</h4>
                <p className="text-sm text-stone-600">
                  We play. We get it. We built this for us.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
