import Link from "next/link";
import Image from "next/image";

export default function ReturnsPage() {
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

      {/* Returns Content */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-bold tracking-wide text-stone-900 text-center mb-4 uppercase">
            Returns & Exchanges
          </h1>
          <p className="text-center text-stone-600 mb-12 max-w-lg mx-auto">
            We want you to love your Back Nine gear. If something's not right, we'll make it right.
          </p>

          <div className="space-y-8">
            {/* Return Policy */}
            <div className="bg-stone-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-stone-900 mb-4">Our Return Policy</h2>
              <p className="text-stone-600 leading-relaxed">
                We accept returns within <strong>30 days</strong> of delivery. Items must be unworn, unwashed,
                and in their original condition with all tags attached. Due to the made-to-order nature of our
                products, we take extra care in production - but if something doesn't meet your expectations,
                we're here to help.
              </p>
            </div>

            {/* What's Eligible */}
            <div>
              <h2 className="text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
                What's Eligible for Return
              </h2>
              <ul className="space-y-3 text-stone-600">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 mt-1">&#10003;</span>
                  <span>Unworn and unwashed items in original condition</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 mt-1">&#10003;</span>
                  <span>Items with all original tags attached</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 mt-1">&#10003;</span>
                  <span>Items returned within 30 days of delivery</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 mt-1">&#10003;</span>
                  <span>Defective or damaged items (no time limit - contact us immediately)</span>
                </li>
              </ul>
            </div>

            {/* What's NOT Eligible */}
            <div>
              <h2 className="text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
                What's NOT Eligible for Return
              </h2>
              <ul className="space-y-3 text-stone-600">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">&#10007;</span>
                  <span>Items that have been worn or washed</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">&#10007;</span>
                  <span>Items without original tags</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">&#10007;</span>
                  <span>Items returned after 30 days</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 mt-1">&#10007;</span>
                  <span>Items damaged through normal wear and tear</span>
                </li>
              </ul>
            </div>

            {/* How to Return */}
            <div>
              <h2 className="text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
                How to Start a Return
              </h2>
              <ol className="space-y-4 text-stone-600">
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-stone-900 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <div>
                    <strong className="text-stone-900">Contact Us</strong>
                    <p className="text-sm mt-1">Email us at <a href="mailto:hello@backnineshop.com" className="text-emerald-700 hover:text-emerald-800">hello@backnineshop.com</a> with your order number and reason for return.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-stone-900 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <div>
                    <strong className="text-stone-900">Get Your Return Label</strong>
                    <p className="text-sm mt-1">We'll send you a prepaid return shipping label within 24-48 hours.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-stone-900 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <div>
                    <strong className="text-stone-900">Ship It Back</strong>
                    <p className="text-sm mt-1">Pack your item securely and drop it off at any USPS location.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-stone-900 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  <div>
                    <strong className="text-stone-900">Get Your Refund</strong>
                    <p className="text-sm mt-1">Once we receive and inspect your return, we'll process your refund within 5-7 business days.</p>
                  </div>
                </li>
              </ol>
            </div>

            {/* Exchanges */}
            <div className="bg-emerald-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold text-stone-900 mb-4">Need a Different Size?</h2>
              <p className="text-stone-600 leading-relaxed">
                For exchanges, the fastest option is to return your item for a refund and place a new order
                for the correct size. This ensures you get your new item as quickly as possible. Contact us
                if you need help - we'll waive the shipping on your new order.
              </p>
            </div>

            {/* Damaged Items */}
            <div>
              <h2 className="text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
                Damaged or Defective Items
              </h2>
              <p className="text-stone-600 leading-relaxed mb-4">
                If your item arrived damaged or has a manufacturing defect, we want to know immediately.
                Contact us at <a href="mailto:hello@backnineshop.com" className="text-emerald-700 hover:text-emerald-800">hello@backnineshop.com</a> within
                48 hours of delivery with:
              </p>
              <ul className="space-y-2 text-stone-600 text-sm">
                <li>• Your order number</li>
                <li>• Photos of the damage or defect</li>
                <li>• Brief description of the issue</li>
              </ul>
              <p className="text-stone-600 leading-relaxed mt-4">
                We'll send a replacement at no additional cost, or issue a full refund - your choice.
              </p>
            </div>

            {/* Refund Info */}
            <div>
              <h2 className="text-xl font-bold text-stone-900 mb-4 pb-2 border-b border-stone-200">
                Refund Information
              </h2>
              <ul className="space-y-3 text-stone-600">
                <li><strong>Processing Time:</strong> 5-7 business days after we receive your return</li>
                <li><strong>Refund Method:</strong> Original payment method</li>
                <li><strong>Original Shipping:</strong> Original shipping costs are non-refundable unless the return is due to our error</li>
                <li><strong>Return Shipping:</strong> We provide prepaid return labels for all eligible returns within the US</li>
              </ul>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-stone-600 mb-4">Questions about returns?</p>
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
