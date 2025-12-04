"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { getStripe } from "@/lib/stripe";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else if (data.sessionId) {
        // Fallback: use Stripe.js to redirect
        const stripe = await getStripe();
        await stripe?.redirectToCheckout({ sessionId: data.sessionId });
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200">
          <h2 className="text-xl font-semibold text-stone-900">Your Cart</h2>
          <button
            onClick={onClose}
            className="text-2xl text-stone-400 hover:text-stone-600"
          >
            &times;
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-stone-500 mb-4">Your cart is empty</p>
              <button
                onClick={onClose}
                className="text-emerald-600 font-medium hover:text-emerald-700"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-20 h-20 bg-stone-100 flex-shrink-0">
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-stone-900">
                      {item.productName}
                    </h3>
                    <p className="text-sm text-stone-500">Size: {item.size}</p>
                    <p className="text-sm font-medium text-stone-900">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 bg-stone-100 text-stone-600 hover:bg-stone-200 text-sm"
                      >
                        -
                      </button>
                      <span className="text-sm w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 bg-stone-100 text-stone-600 hover:bg-stone-200 text-sm"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-sm text-red-600 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-stone-200 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-stone-600">Subtotal</span>
              <span className="text-xl font-semibold text-stone-900">
                ${total.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Shipping and taxes calculated at checkout
            </p>
            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full py-4 bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors disabled:bg-stone-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Checkout"}
            </button>
            <button
              onClick={clearCart}
              className="w-full py-2 text-stone-500 hover:text-stone-700 text-sm"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
