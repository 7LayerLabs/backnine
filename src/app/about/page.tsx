import PageHeader from '@/components/PageHeader';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main className="bg-white">
      <PageHeader 
        title="Our Story" 
        subtitle="Born on the course. Built for the culture."
        imageSrc="/images/marketing/b9_mkt5.png"
      />

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic text-b9-navy mb-8">
              The Back Nine Mentality
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              The back nine is where tournaments are won. It's where the pressure mounts, the focus sharpens, and the real players separate themselves from the pack. We created Back Nine Apparel to embody that spirit—the relentless pursuit of better, hole after hole.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <Image 
                  src="/images/flag.png"
                  alt="Back Nine Flag"
                  width={600}
                  height={400}
                  className="w-full h-auto object-contain rounded-sm shadow-lg"
                />
              </div>
            </div>
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-b9-navy uppercase tracking-wide mb-4">Performance First</h3>
                <p className="text-gray-600 leading-relaxed">
                  We don't believe you should have to sacrifice style for performance. Our garments are engineered with moisture-wicking technology, 4-way stretch, and breathable fabrics that move with your swing, not against it.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-b9-navy uppercase tracking-wide mb-4">Country Club Modern</h3>
                <p className="text-gray-600 leading-relaxed">
                  We respect the traditions of the game, but we're not afraid to push them forward. Our aesthetic combines the clean lines of classic golf wear with modern fits and bold details that look just as good at the 19th hole as they do on the first tee.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-b9-navy uppercase tracking-wide mb-4">Community</h3>
                <p className="text-gray-600 leading-relaxed">
                  Back Nine isn't just a brand; it's a club. A community of golfers who play hard, respect the course, and know that looking good is the first step to playing good.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
