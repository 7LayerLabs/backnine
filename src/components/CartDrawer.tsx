"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import PaymentIcons from "./PaymentIcons";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

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
      if (e.key === "Escape") {
        if (showEmailCapture) {
          setShowEmailCapture(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose, showEmailCapture]);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleCheckoutClick = () => {
    setShowEmailCapture(true);
    setEmailError("");
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setEmailError("Please enter your email");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email");
      return;
    }

    setIsLoading(true);
    setEmailError("");

    try {
      // Save cart with email for recovery purposes
      await fetch("/api/cart/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, items }),
      });

      // Proceed to Stripe checkout
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items, customerEmail: email }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Checkout API error:", data);
        throw new Error(data.details || data.error || "Checkout failed");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      const message = error instanceof Error ? error.message : "Unknown error";
      alert(`Something went wrong: ${message}. Please try again or contact support.`);
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
        onClick={() => {
          if (showEmailCapture) {
            setShowEmailCapture(false);
          } else {
            onClose();
          }
        }}
      />

      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200">
          <h2 className="text-xl font-semibold text-stone-900">Your Cart</h2>
          <button
            onClick={() => {
              if (showEmailCapture) {
                setShowEmailCapture(false);
              } else {
                onClose();
              }
            }}
            className="text-2xl text-stone-400 hover:text-stone-600"
          >
            &times;
          </button>
        </div>

        {/* Email Capture Modal */}
        {showEmailCapture && (
          <div className="absolute inset-0 bg-white z-10 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-stone-200">
              <button
                onClick={() => setShowEmailCapture(false)}
                className="text-stone-500 hover:text-stone-700 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to cart
              </button>
            </div>

            <div className="flex-1 flex items-center justify-center p-8">
              <form onSubmit={handleEmailSubmit} className="w-full max-w-sm">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-stone-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-stone-900 mb-2">
                    Almost there!
                  </h3>
                  <p className="text-stone-500">
                    Enter your email to continue to checkout. We&apos;ll save your cart just in case.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="checkout-email" className="block text-sm font-medium text-stone-700 mb-2">
                      Email address
                    </label>
                    <input
                      type="email"
                      id="checkout-email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError("");
                      }}
                      placeholder="you@example.com"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 transition-colors ${
                        emailError ? "border-red-400" : "border-stone-300"
                      }`}
                      autoFocus
                    />
                    {emailError && (
                      <p className="mt-2 text-sm text-red-500">{emailError}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors disabled:bg-stone-400 disabled:cursor-not-allowed rounded-lg flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        Continue to Checkout
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-stone-400 text-center mt-6">
                  By continuing, you agree to receive order updates at this email.
                </p>
              </form>
            </div>
          </div>
        )}

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
                    <p className="text-sm text-stone-500">
                      Size: {item.size}
                      {item.color && ` | ${item.color}`}
                    </p>
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
        {items.length > 0 && !showEmailCapture && (
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
              onClick={handleCheckoutClick}
              disabled={isLoading}
              className="w-full py-4 bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors disabled:bg-stone-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Checkout"}
            </button>
            {/* Payment Methods */}
            <PaymentIcons size="sm" className="pt-2" />
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
