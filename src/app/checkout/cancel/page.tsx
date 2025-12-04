import Link from "next/link";

export default function CheckoutCancel() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-stone-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-semibold text-stone-900 mb-4">
          Order Cancelled
        </h1>
        <p className="text-stone-600 mb-8">
          Your order has been cancelled. No charges have been made. Your cart
          items are still saved if you&apos;d like to try again.
        </p>
        <Link
          href="/"
          className="inline-block bg-stone-900 text-white px-8 py-4 font-medium hover:bg-stone-800 transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    </div>
  );
}
