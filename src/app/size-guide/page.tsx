import Link from "next/link";
import Image from "next/image";

export default function SizeGuidePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-stone-900 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3">
            <Image
              src="/logo.jpeg"
              alt="Back Nine Apparel"
              width={40}
              height={40}
              className="rounded"
            />
            <span className="text-lg sm:text-xl font-bold tracking-wide font-montserrat">BACK NINE</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-stone-300 hover:text-white transition-colors"
          >
            &larr; Back to Shop
          </Link>
        </div>
      </header>

      {/* Size Guide Content */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-bold tracking-wide text-stone-900 text-center mb-4 uppercase">
            Size Guide
          </h1>
          <p className="text-center text-stone-600 mb-12 max-w-lg mx-auto">
            Find your perfect fit. All measurements are in inches. When in doubt, size up.
          </p>

          {/* T-Shirts */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
              T-Shirts
            </h2>
            <p className="text-stone-600 text-sm mb-4">Relaxed fit, 100% ring-spun cotton. Garment-dyed for a vintage feel.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-100">
                    <th className="px-4 py-3 text-left font-semibold text-stone-900">Size</th>
                    <th className="px-4 py-3 text-center font-semibold text-stone-900">Chest</th>
                    <th className="px-4 py-3 text-center font-semibold text-stone-900">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  <tr><td className="px-4 py-3">S</td><td className="px-4 py-3 text-center">18"</td><td className="px-4 py-3 text-center">28"</td></tr>
                  <tr><td className="px-4 py-3">M</td><td className="px-4 py-3 text-center">20"</td><td className="px-4 py-3 text-center">29"</td></tr>
                  <tr><td className="px-4 py-3">L</td><td className="px-4 py-3 text-center">22"</td><td className="px-4 py-3 text-center">30"</td></tr>
                  <tr><td className="px-4 py-3">XL</td><td className="px-4 py-3 text-center">24"</td><td className="px-4 py-3 text-center">31"</td></tr>
                  <tr><td className="px-4 py-3">2XL</td><td className="px-4 py-3 text-center">26"</td><td className="px-4 py-3 text-center">32"</td></tr>
                  <tr><td className="px-4 py-3">3XL</td><td className="px-4 py-3 text-center">28"</td><td className="px-4 py-3 text-center">33"</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Hoodies */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
              Hoodies
            </h2>
            <p className="text-stone-600 text-sm mb-4">Relaxed fit, 50/50 or 80/20 cotton-poly blend. Medium-weight for layering.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-100">
                    <th className="px-4 py-3 text-left font-semibold text-stone-900">Size</th>
                    <th className="px-4 py-3 text-center font-semibold text-stone-900">Chest</th>
                    <th className="px-4 py-3 text-center font-semibold text-stone-900">Length</th>
                    <th className="px-4 py-3 text-center font-semibold text-stone-900">Sleeve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  <tr><td className="px-4 py-3">S</td><td className="px-4 py-3 text-center">20"</td><td className="px-4 py-3 text-center">27"</td><td className="px-4 py-3 text-center">33"</td></tr>
                  <tr><td className="px-4 py-3">M</td><td className="px-4 py-3 text-center">22"</td><td className="px-4 py-3 text-center">28"</td><td className="px-4 py-3 text-center">34"</td></tr>
                  <tr><td className="px-4 py-3">L</td><td className="px-4 py-3 text-center">24"</td><td className="px-4 py-3 text-center">29"</td><td className="px-4 py-3 text-center">35"</td></tr>
                  <tr><td className="px-4 py-3">XL</td><td className="px-4 py-3 text-center">26"</td><td className="px-4 py-3 text-center">30"</td><td className="px-4 py-3 text-center">36"</td></tr>
                  <tr><td className="px-4 py-3">2XL</td><td className="px-4 py-3 text-center">28"</td><td className="px-4 py-3 text-center">31"</td><td className="px-4 py-3 text-center">37"</td></tr>
                  <tr><td className="px-4 py-3">3XL</td><td className="px-4 py-3 text-center">30"</td><td className="px-4 py-3 text-center">32"</td><td className="px-4 py-3 text-center">38"</td></tr>
                  <tr><td className="px-4 py-3">4XL</td><td className="px-4 py-3 text-center">32"</td><td className="px-4 py-3 text-center">33"</td><td className="px-4 py-3 text-center">39"</td></tr>
                  <tr><td className="px-4 py-3">5XL</td><td className="px-4 py-3 text-center">34"</td><td className="px-4 py-3 text-center">34"</td><td className="px-4 py-3 text-center">40"</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Sweatshirts */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
              Sweatshirts (Crewneck)
            </h2>
            <p className="text-stone-600 text-sm mb-4">Relaxed fit, 80/20 ring-spun cotton/poly blend. Garment-dyed.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-100">
                    <th className="px-4 py-3 text-left font-semibold text-stone-900">Size</th>
                    <th className="px-4 py-3 text-center font-semibold text-stone-900">Chest</th>
                    <th className="px-4 py-3 text-center font-semibold text-stone-900">Length</th>
                    <th className="px-4 py-3 text-center font-semibold text-stone-900">Sleeve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  <tr><td className="px-4 py-3">S</td><td className="px-4 py-3 text-center">21"</td><td className="px-4 py-3 text-center">26"</td><td className="px-4 py-3 text-center">23"</td></tr>
                  <tr><td className="px-4 py-3">M</td><td className="px-4 py-3 text-center">23"</td><td className="px-4 py-3 text-center">27"</td><td className="px-4 py-3 text-center">24"</td></tr>
                  <tr><td className="px-4 py-3">L</td><td className="px-4 py-3 text-center">25"</td><td className="px-4 py-3 text-center">28"</td><td className="px-4 py-3 text-center">25"</td></tr>
                  <tr><td className="px-4 py-3">XL</td><td className="px-4 py-3 text-center">27"</td><td className="px-4 py-3 text-center">29"</td><td className="px-4 py-3 text-center">26"</td></tr>
                  <tr><td className="px-4 py-3">2XL</td><td className="px-4 py-3 text-center">29"</td><td className="px-4 py-3 text-center">30"</td><td className="px-4 py-3 text-center">27"</td></tr>
                  <tr><td className="px-4 py-3">3XL</td><td className="px-4 py-3 text-center">31"</td><td className="px-4 py-3 text-center">31"</td><td className="px-4 py-3 text-center">28"</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Polos */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
              Polos
            </h2>
            <p className="text-stone-600 text-sm mb-4">Athletic fit, 100% polyester with moisture-wicking technology.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-100">
                    <th className="px-4 py-3 text-left font-semibold text-stone-900">Size</th>
                    <th className="px-4 py-3 text-center font-semibold text-stone-900">Chest</th>
                    <th className="px-4 py-3 text-center font-semibold text-stone-900">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  <tr><td className="px-4 py-3">S</td><td className="px-4 py-3 text-center">19"</td><td className="px-4 py-3 text-center">28"</td></tr>
                  <tr><td className="px-4 py-3">M</td><td className="px-4 py-3 text-center">21"</td><td className="px-4 py-3 text-center">29"</td></tr>
                  <tr><td className="px-4 py-3">L</td><td className="px-4 py-3 text-center">23"</td><td className="px-4 py-3 text-center">30"</td></tr>
                  <tr><td className="px-4 py-3">XL</td><td className="px-4 py-3 text-center">25"</td><td className="px-4 py-3 text-center">31"</td></tr>
                  <tr><td className="px-4 py-3">2XL</td><td className="px-4 py-3 text-center">27"</td><td className="px-4 py-3 text-center">32"</td></tr>
                  <tr><td className="px-4 py-3">3XL</td><td className="px-4 py-3 text-center">29"</td><td className="px-4 py-3 text-center">33"</td></tr>
                  <tr><td className="px-4 py-3">4XL</td><td className="px-4 py-3 text-center">31"</td><td className="px-4 py-3 text-center">34"</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Quarter Zips / Pullovers */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
              Quarter Zips & Pullovers
            </h2>
            <p className="text-stone-600 text-sm mb-4">Athletic fit, 90/10 polyester/spandex blend with Sport-Wick technology.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-stone-100">
                    <th className="px-4 py-3 text-left font-semibold text-stone-900">Size</th>
                    <th className="px-4 py-3 text-center font-semibold text-stone-900">Chest</th>
                    <th className="px-4 py-3 text-center font-semibold text-stone-900">Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  <tr><td className="px-4 py-3">S</td><td className="px-4 py-3 text-center">19"</td><td className="px-4 py-3 text-center">27"</td></tr>
                  <tr><td className="px-4 py-3">M</td><td className="px-4 py-3 text-center">21"</td><td className="px-4 py-3 text-center">28"</td></tr>
                  <tr><td className="px-4 py-3">L</td><td className="px-4 py-3 text-center">23"</td><td className="px-4 py-3 text-center">29"</td></tr>
                  <tr><td className="px-4 py-3">XL</td><td className="px-4 py-3 text-center">25"</td><td className="px-4 py-3 text-center">30"</td></tr>
                  <tr><td className="px-4 py-3">2XL</td><td className="px-4 py-3 text-center">27"</td><td className="px-4 py-3 text-center">31"</td></tr>
                  <tr><td className="px-4 py-3">3XL</td><td className="px-4 py-3 text-center">29"</td><td className="px-4 py-3 text-center">32"</td></tr>
                  <tr><td className="px-4 py-3">4XL</td><td className="px-4 py-3 text-center">31"</td><td className="px-4 py-3 text-center">33"</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Headwear */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
              Headwear
            </h2>
            <div className="space-y-4 text-stone-600">
              <div>
                <h3 className="font-semibold text-stone-900">Rope Caps</h3>
                <p className="text-sm">One Size Fits Most. Adjustable plastic snapback closure fits head circumferences 21" - 24".</p>
              </div>
              <div>
                <h3 className="font-semibold text-stone-900">Beanies</h3>
                <p className="text-sm">One Size Fits Most. Stretchy cuffed design accommodates most head sizes. Cuff can be adjusted for extra ear coverage.</p>
              </div>
            </div>
          </div>

          {/* Accessories */}
          <div className="mb-12">
            <h2 className="text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
              Accessories
            </h2>
            <div className="space-y-4 text-stone-600">
              <div>
                <h3 className="font-semibold text-stone-900">Golf Towel</h3>
                <p className="text-sm">One Size: 16" x 24". Premium microfiber construction with metal grommet and carabiner clip.</p>
              </div>
            </div>
          </div>

          {/* How to Measure */}
          <div className="bg-stone-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold text-stone-900 mb-4">How to Measure</h2>
            <ul className="space-y-3 text-stone-600 text-sm">
              <li><strong>Chest:</strong> Measure across the front of the garment, 1" below the armhole, from edge to edge. Double this measurement for full chest circumference.</li>
              <li><strong>Length:</strong> Measure from the highest point of the shoulder seam to the bottom hem.</li>
              <li><strong>Sleeve:</strong> Measure from the center back of the neck to the shoulder seam to the end of the sleeve.</li>
            </ul>
          </div>

          <div className="mt-12 text-center">
            <p className="text-stone-600 mb-4">Still unsure about sizing?</p>
            <Link
              href="/contact"
              className="inline-block bg-stone-900 text-white px-8 py-3 text-sm font-medium tracking-wide hover:bg-stone-800 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-stone-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-stone-500 text-sm">&copy; 2025 Back Nine Apparel. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
