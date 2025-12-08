"use client";

import Link from "next/link";

export default function RockyRoastSuccessPage() {
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex items-center justify-center">
      <div className="max-w-lg mx-auto px-4 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg
            className="w-10 h-10 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          Roast Delivered.
        </h1>

        <p className="text-xl text-stone-400 mb-8">
          Rocky just got his email. He&apos;s probably reading it right now, questioning every life decision that led to this moment.
        </p>

        <div className="bg-stone-900 rounded-xl p-6 border border-stone-800 mb-8">
          <p className="text-stone-300 italic">
            &quot;Someone paid real money to tell me this...&quot;
          </p>
          <p className="text-stone-500 text-sm mt-2">— Rocky, probably</p>
        </div>

        <div className="space-y-4">
          <Link
            href="/rocky-roast"
            className="block bg-green-600 hover:bg-green-500 text-white font-bold px-8 py-3 rounded-xl transition-colors"
          >
            Send Another Roast
          </Link>

          <Link
            href="/"
            className="block text-stone-400 hover:text-stone-200 transition-colors"
          >
            Browse Back Nine Apparel
          </Link>
        </div>

        <p className="text-stone-600 text-sm mt-12">
          Thanks for keeping Rocky humble.
        </p>
      </div>
    </div>
  );
}
