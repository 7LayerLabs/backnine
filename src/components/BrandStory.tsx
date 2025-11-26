import Image from 'next/image';

export default function BrandStory() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative flex justify-center lg:justify-end">
            {/* Removed fixed aspect ratio wrapper to allow natural image dimensions */}
            <div className="relative w-full max-w-md">
              <Image 
                src="/images/marketing/b9_mkt3.png" 
                alt="Golfer giving thumbs up" 
                width={600}
                height={800}
                className="w-full h-auto object-contain rounded-sm shadow-xl"
                priority
              />
            </div>
            {/* Decorative element */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-b9-cream rounded-full opacity-50 blur-3xl"></div>
          </div>
          
          <div>
            <span className="inline-block bg-b9-navy text-b9-lime font-bold uppercase tracking-widest text-xs mb-6 px-3 py-1.5 rounded-sm">
              Our Philosophy
            </span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-b9-navy mb-8">
              Respect The Game.<br/>Redefine The Style.
            </h2>
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
              <p>
                Back Nine Apparel was born from a simple belief: golf apparel shouldn't choose between performance and aesthetic. We build gear for the athlete who treats every round like a championship Sunday.
              </p>
              <p>
                Inspired by the tradition of the country club but engineered for the modern game, our collection blends technical fabrics with sharp, athletic cuts. Whether you're grinding on the range or closing out a match on the 18th, we keep you looking as confident as you play.
              </p>
            </div>
            <div className="mt-10">
               <div className="flex gap-8">
                  <div>
                    <h4 className="text-4xl font-black text-b9-navy">100%</h4>
                    <p className="text-sm text-gray-500 uppercase tracking-wider">Performance Focused</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
