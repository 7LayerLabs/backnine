"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";

interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  size: string;
  color?: string;
}

function RecoverCartContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { restoreCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartData, setCartData] = useState<{ items: CartItem[]; total: number } | null>(null);
  const [restored, setRestored] = useState(false);

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("No recovery token provided");
      setLoading(false);
      return;
    }

    const fetchCart = async () => {
      try {
        const response = await fetch(`/api/cart/save?token=${token}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Cart not found");
          return;
        }

        if (data.recovered) {
          setError("This cart has already been recovered or completed");
          return;
        }

        setCartData({ items: data.items, total: data.total });
      } catch {
        setError("Failed to retrieve cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token]);

  const handleRestoreCart = () => {
    if (cartData) {
      restoreCart(cartData.items);
      setRestored(true);
      // Redirect to home with cart indicator
      setTimeout(() => {
        router.push("/");
      }, 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto mb-4"></div>
          <p className="text-stone-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-stone-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-stone-900 mb-2">Cart Not Found</h1>
          <p className="text-stone-600 mb-8">{error}</p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (restored) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-stone-900 mb-2">Cart Restored!</h1>
          <p className="text-stone-600 mb-4">Redirecting you to continue shopping...</p>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-stone-900 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-semibold text-stone-900 mb-2">Welcome Back!</h1>
          <p className="text-stone-600">We saved your cart for you. Ready to complete your order?</p>
        </div>

        {/* Cart Items */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="font-semibold text-stone-900 mb-4">Your Items</h2>
          <div className="space-y-4">
            {cartData?.items.map((item, index) => (
              <div key={index} className="flex gap-4 pb-4 border-b border-stone-100 last:border-0 last:pb-0">
                <div className="relative w-16 h-16 bg-stone-100 flex-shrink-0 rounded-lg overflow-hidden">
                  <Image
                    src={item.productImage}
                    alt={item.productName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-stone-900">{item.productName}</h3>
                  <p className="text-sm text-stone-500">
                    Size: {item.size}
                    {item.color && ` | ${item.color}`}
                    {" | "}Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-stone-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-stone-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-stone-900">Subtotal</span>
              <span className="text-xl font-bold text-stone-900">
                ${cartData?.total.toFixed(2)}
              </span>
            </div>
            <p className="text-sm text-stone-500 mt-1">Shipping calculated at checkout</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={handleRestoreCart}
            className="w-full py-4 bg-stone-900 text-white font-medium rounded-lg hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
          >
            Restore Cart & Continue Shopping
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>

          <Link
            href="/"
            className="block w-full py-3 text-center text-stone-600 hover:text-stone-900 transition-colors"
          >
            No thanks, I&apos;ll start fresh
          </Link>
        </div>

        {/* Trust Badge */}
        <div className="mt-8 text-center">
          <p className="text-xs text-stone-400">
            Free shipping on orders over $75 | Easy returns within 30 days
          </p>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-900 mx-auto mb-4"></div>
        <p className="text-stone-600">Loading...</p>
      </div>
    </div>
  );
}

export default function RecoverCartPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RecoverCartContent />
    </Suspense>
  );
}
