"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How long does shipping take?",
    answer: "Most orders ship within 5-7 business days. Since our products are made-to-order, production takes 2-5 business days before shipping. Once shipped, delivery typically takes 3-5 business days within the US. Some items qualify for FREE shipping - check individual product pages for details."
  },
  {
    question: "Do you ship internationally?",
    answer: "Currently, we only ship within the United States. We're working on expanding our shipping options to serve our international golf community soon!"
  },
  {
    question: "What is your return policy?",
    answer: "We accept returns within 30 days of delivery for unworn, unwashed items with original tags attached. Due to the made-to-order nature of our products, we cannot accept returns on customized items. Please visit our Returns page for full details."
  },
  {
    question: "How do I find my size?",
    answer: "Check out our Size Guide page for detailed measurements for all our products. Our tops (hoodies, sweatshirts, t-shirts, polos) run true to size. If you're between sizes, we recommend sizing up for a more relaxed fit. Headwear is one-size-fits-most with adjustable closures."
  },
  {
    question: "What materials are your products made from?",
    answer: "We use premium materials across our line: our t-shirts are 100% ring-spun cotton, hoodies and sweatshirts are cotton-poly blends (50/50 or 80/20), polos are 100% moisture-wicking polyester, and our headwear uses cotton twill or acrylic knit. Check individual product pages for specific materials."
  },
  {
    question: "Are your products true to size?",
    answer: "Yes! Our apparel runs true to size. Hoodies, sweatshirts, and t-shirts have a relaxed fit. Polos and quarter-zips have an athletic fit. If you prefer a looser fit or are between sizes, we recommend sizing up."
  },
  {
    question: "How should I care for my Back Nine gear?",
    answer: "For best results: machine wash cold, tumble dry low, and avoid ironing directly on prints or embroidery. Do not bleach. For headwear, we recommend spot cleaning or hand washing to maintain shape. Check product tags for specific care instructions."
  },
  {
    question: "Can I cancel or modify my order?",
    answer: "Since our items are made-to-order, we begin production quickly. Please contact us at hello@backnineshop.com within 2 hours of placing your order if you need to make changes. After that, we may not be able to modify or cancel."
  },
  {
    question: "Do you offer gift cards?",
    answer: "Gift cards are coming soon! Sign up for our newsletter to be the first to know when they're available."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express), as well as Klarna for buy-now-pay-later options. All transactions are secured with SSL encryption."
  },
  {
    question: "My order arrived damaged. What should I do?",
    answer: "We're sorry to hear that! Please contact us at hello@backnineshop.com within 48 hours of delivery with photos of the damage. We'll make it right with a replacement or refund."
  },
  {
    question: "Do you restock sold-out items?",
    answer: "Since we make items to order, products are rarely \"sold out.\" However, certain colors or styles may be discontinued. If you see something you like, grab it while it's available!"
  },
];

function FAQAccordion({ item, isOpen, onClick }: { item: FAQItem; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border-b border-stone-200">
      <button
        onClick={onClick}
        className="w-full py-5 flex items-center justify-between text-left hover:text-emerald-700 transition-colors"
      >
        <span className="font-medium text-stone-900 pr-4">{item.question}</span>
        <span className="text-2xl text-stone-400 flex-shrink-0">
          {isOpen ? "−" : "+"}
        </span>
      </button>
      {isOpen && (
        <div className="pb-5 pr-8">
          <p className="text-stone-600 leading-relaxed">{item.answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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

      {/* FAQ Content */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-bold tracking-wide text-stone-900 text-center mb-4 uppercase">
            FAQ
          </h1>
          <p className="text-center text-stone-600 mb-12 max-w-lg mx-auto">
            Got questions? We've got answers. If you don't find what you're looking for, hit us up.
          </p>

          <div className="divide-y divide-stone-200 border-t border-stone-200">
            {faqs.map((faq, index) => (
              <FAQAccordion
                key={index}
                item={faq}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-stone-600 mb-4">Still have questions?</p>
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
