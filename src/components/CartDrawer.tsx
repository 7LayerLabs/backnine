"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";

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

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
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
            <div className="flex items-center justify-center gap-3 pt-2">
              <span className="text-xs text-stone-400">Pay with</span>
              {/* Credit Card Icons */}
              <svg className="h-6 w-auto" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="38" height="24" rx="4" fill="#1A1F71"/>
                <path d="M15.5 16.5L17 7.5H19.5L18 16.5H15.5Z" fill="white"/>
                <path d="M24 7.5C23.5 7.3 22.7 7 21.7 7C19.2 7 17.5 8.3 17.5 10.1C17.5 11.5 18.8 12.2 19.8 12.7C20.8 13.2 21.1 13.5 21.1 13.9C21.1 14.5 20.4 14.8 19.7 14.8C18.7 14.8 18.2 14.6 17.4 14.3L17.1 14.2L16.8 16.1C17.4 16.4 18.4 16.6 19.5 16.6C22.2 16.6 23.8 15.3 23.8 13.4C23.8 12.3 23.1 11.5 21.6 10.8C20.7 10.4 20.2 10.1 20.2 9.6C20.2 9.2 20.7 8.8 21.6 8.8C22.4 8.8 23 9 23.4 9.2L23.6 9.3L24 7.5Z" fill="white"/>
                <path d="M28.5 7.5H26.5C25.9 7.5 25.5 7.7 25.2 8.3L21.5 16.5H24.2L24.7 15H28L28.3 16.5H30.7L28.5 7.5ZM25.4 13C25.6 12.4 26.5 10 26.5 10C26.5 10 26.7 9.4 26.8 9.1L27 10L27.6 13H25.4Z" fill="white"/>
                <path d="M13.5 7.5L11 13.5L10.7 12C10.2 10.5 8.8 8.8 7.2 8L9.5 16.5H12.2L16.2 7.5H13.5Z" fill="white"/>
                <path d="M9 7.5H5L5 7.7C8.2 8.5 10.3 10.5 11 12.5L10.2 8.3C10.1 7.7 9.6 7.5 9 7.5Z" fill="#F9A51A"/>
              </svg>
              {/* Mastercard */}
              <svg className="h-6 w-auto" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="38" height="24" rx="4" fill="#F5F5F5"/>
                <circle cx="15" cy="12" r="7" fill="#EB001B"/>
                <circle cx="23" cy="12" r="7" fill="#F79E1B"/>
                <path d="M19 6.8C20.3 7.9 21.1 9.5 21.1 11.3C21.1 13.1 20.3 14.7 19 15.8C17.7 14.7 16.9 13.1 16.9 11.3C16.9 9.5 17.7 7.9 19 6.8Z" fill="#FF5F00"/>
              </svg>
              {/* Klarna */}
              <svg className="h-6 w-auto" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="38" height="24" rx="4" fill="#FFB3C7"/>
                <path d="M8 8H10.2V16H8V8Z" fill="black"/>
                <path d="M11 8H13.2C13.2 9.5 12.6 10.8 11.6 11.8L14 16H11.4L9.2 12L10.2 11.2C11.2 10.4 11.8 9.2 11.8 8H11Z" fill="black"/>
                <path d="M14.5 8H16.7V16H14.5V8Z" fill="black"/>
                <path d="M21.5 8H19V16H21.2V13.2L23.7 16H26.5L23.3 12.5C24.4 11.9 25.2 10.8 25.2 9.5C25.2 8.1 24 7 22.3 7H19V8H21.5C22.3 8 23 8.6 23 9.5C23 10.4 22.3 11 21.5 11H21.2V8H21.5Z" fill="black"/>
                <path d="M27 8C27 8.8 27.7 9.5 28.5 9.5C29.3 9.5 30 8.8 30 8C30 7.2 29.3 6.5 28.5 6.5C27.7 6.5 27 7.2 27 8Z" fill="black"/>
                <path d="M27.4 10H29.6V16H27.4V10Z" fill="black"/>
              </svg>
            </div>
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
