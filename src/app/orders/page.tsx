"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface OrderItem {
  name: string;
  description?: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

interface Order {
  orderNumber: string;
  status: string;
  customerName?: string;
  items: OrderItem[];
  subtotal?: number;
  shippingCost?: number;
  total: number;
  shippingAddress?: ShippingAddress;
  trackingNumber?: string;
  carrier?: string;
  createdAt: number;
  shippedAt?: number;
}

const statusSteps = [
  { key: "paid", label: "Order Placed", icon: "check" },
  { key: "shipped", label: "Shipped", icon: "truck" },
  { key: "delivered", label: "Delivered", icon: "home" },
];

function OrderStatusTracker({ status }: { status: string }) {
  const getStepStatus = (stepKey: string) => {
    const statusOrder = ["paid", "shipped", "delivered"];
    const currentIndex = statusOrder.indexOf(status);
    const stepIndex = statusOrder.indexOf(stepKey);

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  return (
    <div className="py-8">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-stone-200" />
        <div
          className="absolute top-4 left-0 h-0.5 bg-emerald-500 transition-all duration-500"
          style={{
            width: status === "paid" ? "0%" : status === "shipped" ? "50%" : "100%"
          }}
        />

        {statusSteps.map((step, index) => {
          const stepStatus = getStepStatus(step.key);
          const isActive = stepStatus === "completed" || stepStatus === "current";

          return (
            <div key={step.key} className="flex flex-col items-center relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                  isActive ? "bg-emerald-500" : "bg-stone-200"
                }`}
              >
                {stepStatus === "completed" ? (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className={`text-sm font-bold ${isActive ? "text-white" : "text-stone-400"}`}>
                    {index + 1}
                  </span>
                )}
              </div>
              <span className={`mt-2 text-xs font-medium ${isActive ? "text-stone-900" : "text-stone-400"}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrderLookupContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleLookup = useCallback(async (lookupEmail?: string, lookupOrder?: string) => {
    const emailToUse = lookupEmail || email;
    const orderToUse = lookupOrder || orderNumber;

    if (!emailToUse || !orderToUse) {
      setError("Please enter both email and order number");
      return;
    }

    setIsLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const response = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToUse, orderNumber: orderToUse }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Order not found");
        setOrder(null);
      } else {
        setOrder(data.order);
        setError("");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setOrder(null);
    } finally {
      setIsLoading(false);
    }
  }, [email, orderNumber]);

  // Pre-fill from URL params if available
  useEffect(() => {
    const emailParam = searchParams.get("email");
    const orderParam = searchParams.get("order");
    if (emailParam) setEmail(emailParam);
    if (orderParam) setOrderNumber(orderParam);

    // Auto-lookup if both params provided
    if (emailParam && orderParam) {
      handleLookup(emailParam, orderParam);
    }
  }, [searchParams, handleLookup]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLookup();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case "paid":
        return "We're preparing your order. You'll receive an email when it ships!";
      case "shipped":
        return "Your order is on the way! Check tracking below for updates.";
      case "delivered":
        return "Your order has been delivered. Enjoy your new gear!";
      case "cancelled":
        return "This order has been cancelled. Contact us if you have questions.";
      default:
        return "";
    }
  };

  const getTrackingUrl = (carrier?: string, trackingNumber?: string) => {
    if (!carrier || !trackingNumber) return null;

    const urls: Record<string, string> = {
      USPS: `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
      UPS: `https://www.ups.com/track?tracknum=${trackingNumber}`,
      FedEx: `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
      DHL: `https://www.dhl.com/us-en/home/tracking/tracking-express.html?submit=1&tracking-id=${trackingNumber}`,
    };

    return urls[carrier] || null;
  };

  return (
    <>
      {/* Lookup Form */}
      {!order && (
        <div className="bg-stone-50 rounded-lg p-6 sm:p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-stone-200 focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-900/10 rounded transition-colors"
              />
            </div>
            <div>
              <label htmlFor="orderNumber" className="block text-sm font-medium text-stone-700 mb-1">
                Order Number
              </label>
              <input
                id="orderNumber"
                type="text"
                placeholder="e.g., A1B2C3D4"
                required
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-white border border-stone-200 focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-900/10 rounded font-mono uppercase transition-colors"
              />
              <p className="text-xs text-stone-500 mt-1">
                You&apos;ll find this in your order confirmation email
              </p>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors disabled:bg-stone-400 disabled:cursor-not-allowed rounded"
            >
              {isLoading ? "Looking up..." : "Track Order"}
            </button>
          </form>

          {error && hasSearched && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm text-center">{error}</p>
              <p className="text-red-600 text-xs text-center mt-2">
                Can&apos;t find your order? <Link href="/contact" className="underline hover:text-red-800">Contact us</Link>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Order Details */}
      {order && (
        <div className="space-y-6">
          {/* Back button */}
          <button
            onClick={() => {
              setOrder(null);
              setHasSearched(false);
            }}
            className="text-sm text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Look up another order
          </button>

          {/* Order Header */}
          <div className="bg-stone-50 rounded-lg p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <p className="text-sm text-stone-500">Order</p>
                <p className="text-2xl font-mono font-bold text-stone-900">#{order.orderNumber}</p>
              </div>
              <div className={`inline-flex px-4 py-2 rounded-full text-sm font-medium ${
                order.status === "delivered" ? "bg-emerald-100 text-emerald-800" :
                order.status === "shipped" ? "bg-blue-100 text-blue-800" :
                order.status === "cancelled" ? "bg-red-100 text-red-800" :
                "bg-amber-100 text-amber-800"
              }`}>
                {order.status === "paid" ? "Processing" : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
            </div>
            <p className="text-stone-600">{getStatusMessage(order.status)}</p>
            <p className="text-sm text-stone-500 mt-2">
              Ordered on {formatDate(order.createdAt)}
            </p>
          </div>

          {/* Status Tracker */}
          {order.status !== "cancelled" && (
            <div className="bg-white border border-stone-200 rounded-lg p-6">
              <OrderStatusTracker status={order.status} />
            </div>
          )}

          {/* Tracking Info */}
          {order.trackingNumber && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
                Tracking Information
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div>
                  <p className="text-sm text-blue-700">Carrier: <span className="font-medium">{order.carrier}</span></p>
                  <p className="text-sm text-blue-700">Tracking: <span className="font-mono font-medium">{order.trackingNumber}</span></p>
                </div>
                {getTrackingUrl(order.carrier, order.trackingNumber) && (
                  <a
                    href={getTrackingUrl(order.carrier, order.trackingNumber)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Track Package
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
              {order.shippedAt && (
                <p className="text-xs text-blue-600 mt-3">
                  Shipped on {formatDate(order.shippedAt)}
                </p>
              )}
            </div>
          )}

          {/* Order Items */}
          <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-stone-200">
              <h3 className="font-semibold text-stone-900">Order Items</h3>
            </div>
            <div className="divide-y divide-stone-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="p-6 flex justify-between items-start">
                  <div>
                    <p className="font-medium text-stone-900">{item.name}</p>
                    <p className="text-sm text-stone-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-stone-900">${item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="bg-stone-50 p-6 space-y-2">
              {order.subtotal && (
                <div className="flex justify-between text-sm">
                  <span className="text-stone-600">Subtotal</span>
                  <span className="text-stone-900">${order.subtotal.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-stone-600">Shipping</span>
                <span className="text-stone-900">
                  {order.shippingCost === 0 ? "Free" : `$${order.shippingCost?.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-semibold pt-2 border-t border-stone-200">
                <span className="text-stone-900">Total</span>
                <span className="text-stone-900">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="bg-white border border-stone-200 rounded-lg p-6">
              <h3 className="font-semibold text-stone-900 mb-3">Shipping Address</h3>
              <div className="text-stone-600">
                <p className="font-medium text-stone-900">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && <p>{order.shippingAddress.line2}</p>}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>
          )}

          {/* Help Section */}
          <div className="text-center py-8 border-t border-stone-200">
            <p className="text-stone-600 mb-4">Questions about your order?</p>
            <Link
              href="/contact"
              className="inline-block bg-stone-900 text-white px-8 py-3 text-sm font-medium tracking-wide hover:bg-stone-800 transition-colors rounded"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="bg-stone-50 rounded-lg p-8 text-center">
      <div className="animate-pulse">
        <div className="h-4 bg-stone-200 rounded w-3/4 mx-auto mb-4"></div>
        <div className="h-10 bg-stone-200 rounded mb-4"></div>
        <div className="h-4 bg-stone-200 rounded w-1/2 mx-auto mb-4"></div>
        <div className="h-10 bg-stone-200 rounded mb-4"></div>
        <div className="h-12 bg-stone-300 rounded"></div>
      </div>
    </div>
  );
}

export default function OrderStatusPage() {
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

      {/* Main Content */}
      <section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-montserrat font-bold tracking-wide text-stone-900 text-center mb-4 uppercase">
            Order Status
          </h1>
          <p className="text-center text-stone-600 mb-12 max-w-lg mx-auto">
            Track your order using the email and order number from your confirmation email.
          </p>

          <Suspense fallback={<LoadingFallback />}>
            <OrderLookupContent />
          </Suspense>
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
