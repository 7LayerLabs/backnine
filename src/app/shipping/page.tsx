import Link from "next/link";
import Image from "next/image";

export default function ShippingPage() {
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

      {/* Shipping Content */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-bold tracking-wide text-stone-900 text-center mb-4 uppercase">
            Shipping
          </h1>
          <p className="text-center text-stone-600 mb-12 max-w-lg mx-auto">
            We ship fast so you can hit the course in style. Here's everything you need to know.
          </p>

          <div className="space-y-8">
            {/* Made to Order Notice */}
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-lg">
              <h2 className="text-lg font-bold text-stone-900 mb-2">Made-to-Order Quality</h2>
              <p className="text-stone-600 leading-relaxed">
                Every Back Nine item is made just for you. This means less waste and better quality,
                but it also means a short production time before shipping. We appreciate your patience
                - the wait is worth it.
              </p>
            </div>

            {/* Processing Time */}
            <div>
              <h2 className="text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
                Processing Time
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                Orders typically take <strong>2-5 business days</strong> to produce before they ship.
                During busy periods or holidays, production may take an extra day or two.
              </p>
              <p className="text-stone-600 leading-relaxed">
                You'll receive an email with tracking information once your order ships.
              </p>
            </div>

            {/* Shipping Options */}
            <div>
              <h2 className="text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
                Shipping Options
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-stone-100">
                      <th className="px-4 py-3 text-left font-semibold text-stone-900">Method</th>
                      <th className="px-4 py-3 text-left font-semibold text-stone-900">Delivery Time</th>
                      <th className="px-4 py-3 text-left font-semibold text-stone-900">Cost</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    <tr>
                      <td className="px-4 py-4">
                        <span className="font-medium text-stone-900">Standard Shipping</span>
                      </td>
                      <td className="px-4 py-4 text-stone-600">5-7 business days</td>
                      <td className="px-4 py-4 text-stone-600">$4.99 - $7.99</td>
                    </tr>
                    <tr className="bg-emerald-50">
                      <td className="px-4 py-4">
                        <span className="font-medium text-stone-900">FREE Shipping</span>
                        <span className="block text-xs text-emerald-700">On select items</span>
                      </td>
                      <td className="px-4 py-4 text-stone-600">5-7 business days</td>
                      <td className="px-4 py-4 text-emerald-700 font-medium">FREE</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-stone-500 text-sm mt-4">
                * Delivery times are estimates after your order ships, not including production time.
              </p>
            </div>

            {/* Free Shipping */}
            <div className="bg-stone-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-stone-900 mb-4">Free Shipping Items</h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                The following items include FREE standard shipping:
              </p>
              <ul className="space-y-2 text-stone-600">
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600">&#10003;</span>
                  Golfer Logo Hoodie
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600">&#10003;</span>
                  Golf Player Sweatshirt
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-emerald-600">&#10003;</span>
                  Logo T-Shirt
                </li>
              </ul>
              <p className="text-stone-500 text-sm mt-4">
                Free shipping is indicated on product pages and at checkout.
              </p>
            </div>

            {/* Where We Ship */}
            <div>
              <h2 className="text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
                Where We Ship
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                We currently ship to all <strong>50 US states</strong> including Alaska, Hawaii, Puerto Rico,
                and US territories.
              </p>
              <div className="bg-stone-100 p-4 rounded">
                <p className="text-stone-600 text-sm">
                  <strong>International Shipping:</strong> Not available yet, but we're working on it!
                  Sign up for our newsletter to be notified when we expand.
                </p>
              </div>
            </div>

            {/* Tracking */}
            <div>
              <h2 className="text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
                Order Tracking
              </h2>
              <p className="text-stone-600 leading-relaxed">
                Once your order ships, you'll receive an email with your tracking number and a link
                to track your package. You can also check your order status anytime by emailing us
                at <a href="mailto:hello@backnineshop.com" className="text-emerald-700 hover:text-emerald-800">hello@backnineshop.com</a> with
                your order number.
              </p>
            </div>

            {/* Shipping Timeline */}
            <div>
              <h2 className="text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
                Total Delivery Timeline
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-24 text-right text-sm text-stone-500">Day 1</div>
                  <div className="w-4 h-4 bg-emerald-600 rounded-full"></div>
                  <div className="text-stone-900">Order placed</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 text-right text-sm text-stone-500">Days 2-5</div>
                  <div className="w-4 h-4 bg-emerald-400 rounded-full"></div>
                  <div className="text-stone-900">Production (made just for you)</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 text-right text-sm text-stone-500">Day 5-6</div>
                  <div className="w-4 h-4 bg-emerald-400 rounded-full"></div>
                  <div className="text-stone-900">Order ships + tracking email sent</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-24 text-right text-sm text-stone-500">Days 7-12</div>
                  <div className="w-4 h-4 bg-emerald-600 rounded-full"></div>
                  <div className="text-stone-900">Delivered to your door</div>
                </div>
              </div>
              <p className="text-stone-500 text-sm mt-4">
                * Total time from order to delivery is typically 7-12 business days.
              </p>
            </div>

            {/* Issues */}
            <div>
              <h2 className="text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
                Shipping Issues
              </h2>
              <div className="space-y-4 text-stone-600">
                <div>
                  <strong className="text-stone-900">Lost Package:</strong>
                  <p className="text-sm mt-1">If your tracking shows delivered but you haven't received your order, check with neighbors and your local post office. If it's still missing after 48 hours, contact us and we'll help.</p>
                </div>
                <div>
                  <strong className="text-stone-900">Damaged in Transit:</strong>
                  <p className="text-sm mt-1">Take photos of the packaging and damaged items, then contact us within 48 hours. We'll send a replacement right away.</p>
                </div>
                <div>
                  <strong className="text-stone-900">Wrong Address:</strong>
                  <p className="text-sm mt-1">Double-check your shipping address at checkout. If you need to update it after ordering, contact us immediately at hello@backnineshop.com. We can only change addresses before production begins.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-stone-600 mb-4">Questions about shipping?</p>
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
