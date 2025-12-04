import Link from "next/link";

export default function CheckoutSuccess() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-emerald-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-semibold text-stone-900 mb-4">
          Order Confirmed!
        </h1>
        <p className="text-stone-600 mb-8">
          Thank you for your purchase. You&apos;ll receive a confirmation email
          shortly with your order details and tracking information.
        </p>
        <Link
          href="/"
          className="inline-block bg-stone-900 text-white px-8 py-4 font-medium hover:bg-stone-800 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
