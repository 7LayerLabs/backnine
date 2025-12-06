"use client";

import { useState } from "react";
import Link from "next/link";
import { db } from "@/lib/instant";

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
  id: string;
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  items: string;
  total: number;
  subtotal?: number;
  shippingCost?: number;
  status: string;
  customerEmail: string;
  customerName?: string;
  shippingAddress?: string;
  trackingNumber?: string;
  carrier?: string;
  shippedAt?: number;
  createdAt: number;
}

const statusColors: Record<string, string> = {
  paid: "bg-blue-100 text-blue-800",
  shipped: "bg-amber-100 text-amber-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminOrders() {
  const { isLoading, error, data } = db.useQuery({ orders: {} });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);
  const [showShipModal, setShowShipModal] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [carrier, setCarrier] = useState("USPS");

  const orders = (data?.orders || []) as Order[];
  const sortedOrders = [...orders].sort((a, b) => b.createdAt - a.createdAt);

  const updateStatus = async (orderId: string, newStatus: string) => {
    if (newStatus === "shipped" && selectedOrder?.status === "paid") {
      // Show ship modal instead of directly updating
      setShowShipModal(true);
      return;
    }

    setUpdating(true);
    try {
      await db.transact([
        db.tx.orders[orderId].update({ status: newStatus }),
      ]);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
    setUpdating(false);
  };

  const shipOrder = async () => {
    if (!selectedOrder) return;

    setUpdating(true);
    try {
      const res = await fetch("/api/admin/ship-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          trackingNumber,
          carrier,
        }),
      });

      if (res.ok) {
        setSelectedOrder({
          ...selectedOrder,
          status: "shipped",
          trackingNumber,
          carrier,
        });
        setShowShipModal(false);
        setTrackingNumber("");
      } else {
        console.error("Failed to ship order");
      }
    } catch (err) {
      console.error("Failed to ship order:", err);
    }
    setUpdating(false);
  };

  const parseItems = (itemsJson: string): OrderItem[] => {
    try {
      return JSON.parse(itemsJson);
    } catch {
      return [];
    }
  };

  const parseAddress = (addressJson?: string): ShippingAddress | null => {
    if (!addressJson) return null;
    try {
      return JSON.parse(addressJson);
    } catch {
      return null;
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <p className="text-stone-600">Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <p className="text-red-600">Error loading orders: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-stone-900">Orders</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/errors"
              className="text-sm text-stone-500 hover:text-stone-900"
            >
              Error Log &rarr;
            </Link>
            <div className="text-sm text-stone-500">
              {orders.length} total order{orders.length !== 1 ? "s" : ""}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="lg:col-span-2 space-y-4">
            {sortedOrders.length === 0 ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-stone-500">No orders yet</p>
              </div>
            ) : (
              sortedOrders.map((order) => {
                const items = parseItems(order.items);
                return (
                  <div
                    key={order.id}
                    onClick={() => setSelectedOrder(order)}
                    className={`bg-white rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedOrder?.id === order.id
                        ? "ring-2 ring-stone-900"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-mono text-sm text-stone-500">
                          #{order.id.slice(-8).toUpperCase()}
                        </p>
                        <p className="font-medium text-stone-900">
                          {order.customerName || order.customerEmail}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          statusColors[order.status] || "bg-stone-100 text-stone-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-stone-500">
                        {items.length} item{items.length !== 1 ? "s" : ""}
                      </span>
                      <span className="font-medium text-stone-900">
                        ${order.total?.toFixed(2)}
                      </span>
                    </div>

                    <p className="text-xs text-stone-400 mt-2">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Order Details Panel */}
          <div className="lg:col-span-1">
            {selectedOrder ? (
              <div className="bg-white rounded-lg p-6 sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-stone-900">
                    Order Details
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-stone-400 hover:text-stone-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Order ID */}
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wide">Order ID</p>
                    <p className="font-mono text-sm">{selectedOrder.id.slice(-8).toUpperCase()}</p>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wide mb-2">Status</p>
                    {selectedOrder.status === "paid" ? (
                      <button
                        onClick={() => setShowShipModal(true)}
                        disabled={updating}
                        className="w-full bg-amber-500 text-white rounded px-3 py-2 text-sm font-medium hover:bg-amber-600 transition-colors disabled:opacity-50"
                      >
                        Mark as Shipped
                      </button>
                    ) : (
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                        disabled={updating}
                        className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                      >
                        <option value="paid">Paid</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    )}
                  </div>

                  {/* Tracking Info */}
                  {selectedOrder.trackingNumber && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <p className="text-xs text-amber-800 uppercase tracking-wide mb-1">Tracking</p>
                      <p className="text-sm font-medium text-amber-900">{selectedOrder.carrier || "USPS"}</p>
                      <p className="text-sm text-amber-800 font-mono">{selectedOrder.trackingNumber}</p>
                    </div>
                  )}

                  {/* Customer */}
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wide">Customer</p>
                    <p className="font-medium">{selectedOrder.customerName || "—"}</p>
                    <p className="text-sm text-stone-600">{selectedOrder.customerEmail}</p>
                  </div>

                  {/* Shipping Address */}
                  {(() => {
                    const address = parseAddress(selectedOrder.shippingAddress);
                    if (!address) return null;
                    return (
                      <div>
                        <p className="text-xs text-stone-500 uppercase tracking-wide">Ship To</p>
                        <div className="text-sm text-stone-700">
                          <p>{address.name}</p>
                          <p>{address.line1}</p>
                          {address.line2 && <p>{address.line2}</p>}
                          <p>
                            {address.city}, {address.state} {address.postalCode}
                          </p>
                          <p>{address.country}</p>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Items */}
                  <div>
                    <p className="text-xs text-stone-500 uppercase tracking-wide mb-2">Items</p>
                    <div className="space-y-2">
                      {parseItems(selectedOrder.items).map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-stone-700">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="text-stone-900">${item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="border-t border-stone-100 pt-4 space-y-1">
                    {selectedOrder.subtotal && (
                      <div className="flex justify-between text-sm">
                        <span className="text-stone-500">Subtotal</span>
                        <span>${selectedOrder.subtotal.toFixed(2)}</span>
                      </div>
                    )}
                    {selectedOrder.shippingCost !== undefined && (
                      <div className="flex justify-between text-sm">
                        <span className="text-stone-500">Shipping</span>
                        <span>
                          {selectedOrder.shippingCost === 0
                            ? "Free"
                            : `$${selectedOrder.shippingCost.toFixed(2)}`}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between font-medium text-stone-900">
                      <span>Total</span>
                      <span>${selectedOrder.total?.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Stripe Link */}
                  {selectedOrder.stripePaymentIntentId && (
                    <div className="pt-4">
                      <a
                        href={`https://dashboard.stripe.com/payments/${selectedOrder.stripePaymentIntentId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        View in Stripe
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  )}

                  {/* Date */}
                  <div className="text-xs text-stone-400 pt-2">
                    Ordered {formatDate(selectedOrder.createdAt)}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-8 text-center">
                <p className="text-stone-500">Select an order to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Ship Order Modal */}
      {showShipModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-stone-900 mb-4">
              Ship Order #{selectedOrder.id.slice(-8).toUpperCase()}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Carrier
                </label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                >
                  <option value="USPS">USPS</option>
                  <option value="UPS">UPS</option>
                  <option value="FedEx">FedEx</option>
                  <option value="DHL">DHL</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Tracking Number (optional)
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Enter tracking number"
                  className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                />
              </div>

              <p className="text-sm text-stone-500">
                The customer will receive an email notification with the tracking info.
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowShipModal(false);
                  setTrackingNumber("");
                }}
                className="flex-1 border border-stone-200 rounded px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={shipOrder}
                disabled={updating}
                className="flex-1 bg-amber-500 text-white rounded px-4 py-2 text-sm font-medium hover:bg-amber-600 disabled:opacity-50"
              >
                {updating ? "Sending..." : "Ship & Notify Customer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
