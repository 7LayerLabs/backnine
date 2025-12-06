"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

interface OrderDetails {
  id: string;
  email: string;
  total: number;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionId) {
      // Fetch order details from Stripe session
      fetch(`/api/checkout/session?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.email) {
            setOrder({
              id: sessionId.slice(-8).toUpperCase(),
              email: data.email,
              total: data.total,
            });
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [sessionId]);

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

        {loading ? (
          <p className="text-stone-600 mb-8">Loading order details...</p>
        ) : order ? (
          <div className="bg-white border border-stone-200 rounded-lg p-6 mb-8 text-left">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-stone-500">Order ID</span>
                <span className="font-mono font-medium text-stone-900">#{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Total</span>
                <span className="font-medium text-stone-900">${order.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Confirmation sent to</span>
                <span className="text-stone-900">{order.email}</span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-stone-600 mb-8">
            Thank you for your purchase. You&apos;ll receive a confirmation email
            shortly with your order details and tracking information.
          </p>
        )}

        <p className="text-stone-500 text-sm mb-6">
          A confirmation email has been sent with your order details and tracking information.
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

export default function CheckoutSuccess() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <p className="text-stone-600">Loading...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
