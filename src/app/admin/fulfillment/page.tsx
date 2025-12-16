"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface DiagnosticResult {
  timestamp: string;
  envVars: {
    printifyToken: boolean;
    printifyShopId: string | null;
    printfulToken: boolean;
  };
  apiTests: {
    printify: { success: boolean; message: string; shopInfo?: { id: string; title: string } };
    printful: { success: boolean; message: string; storeInfo?: { id: number; name: string } };
  };
  productMappingStatus: {
    totalProducts: number;
    mappedProducts: number;
    unmappedProducts: string[];
  };
  recentOrders?: {
    orderId: string;
    status: string;
    fulfillmentStatus: string | null;
    items: string;
    createdAt: number;
  }[];
}

interface OrderParseResult {
  orderId: string;
  canFulfill: boolean;
  items: {
    originalName: string;
    parsedProduct: string | null;
    parsedColor: string | null;
    parsedSize: string | null;
    mappingFound: boolean;
    variantFound: boolean;
    provider: string | null;
    variantId: number | null;
    error: string | null;
  }[];
}

export default function FulfillmentDiagnostic() {
  const [loading, setLoading] = useState(true);
  const [diagnostic, setDiagnostic] = useState<DiagnosticResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [orderParseResult, setOrderParseResult] = useState<OrderParseResult | null>(null);
  const [parsingOrder, setParsingOrder] = useState(false);

  useEffect(() => {
    runDiagnostic();
  }, []);

  const runDiagnostic = async () => {
    setLoading(true);
    setError(null);
    try {
      const password = sessionStorage.getItem("adminPassword");
      const res = await fetch("/api/admin/fulfillment-diagnostic", {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to run diagnostic: ${res.status}`);
      }

      const data = await res.json();
      setDiagnostic(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to run diagnostic");
    } finally {
      setLoading(false);
    }
  };

  const testOrderParsing = async (orderId: string) => {
    setSelectedOrder(orderId);
    setParsingOrder(true);
    setOrderParseResult(null);

    try {
      const password = sessionStorage.getItem("adminPassword");
      const res = await fetch("/api/admin/fulfillment-diagnostic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ orderId }),
      });

      if (!res.ok) {
        throw new Error(`Failed to parse order: ${res.status}`);
      }

      const data = await res.json();
      setOrderParseResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse order");
    } finally {
      setParsingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse text-stone-500">Running fulfillment diagnostic...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Fulfillment Diagnostic</h1>
        <div className="flex gap-3">
          <button
            onClick={runDiagnostic}
            className="px-4 py-2 bg-navy-800 text-white rounded-lg hover:bg-navy-900"
            style={{ backgroundColor: "#1e3a5f" }}
          >
            Re-run Diagnostic
          </button>
          <Link
            href="/admin/orders"
            className="px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50"
          >
            Back to Orders
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {diagnostic && (
        <div className="space-y-6">
          {/* Environment Variables */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Environment Variables</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg ${diagnostic.envVars.printifyToken ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                <div className="text-sm text-stone-500">PRINTIFY_API_TOKEN</div>
                <div className={`font-semibold ${diagnostic.envVars.printifyToken ? "text-green-700" : "text-red-700"}`}>
                  {diagnostic.envVars.printifyToken ? "Set" : "MISSING"}
                </div>
              </div>
              <div className={`p-4 rounded-lg ${diagnostic.envVars.printifyShopId ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"}`}>
                <div className="text-sm text-stone-500">PRINTIFY_SHOP_ID</div>
                <div className={`font-semibold ${diagnostic.envVars.printifyShopId ? "text-green-700" : "text-amber-700"}`}>
                  {diagnostic.envVars.printifyShopId || "Using fallback"}
                </div>
              </div>
              <div className={`p-4 rounded-lg ${diagnostic.envVars.printfulToken ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                <div className="text-sm text-stone-500">PRINTFUL_API_TOKEN</div>
                <div className={`font-semibold ${diagnostic.envVars.printfulToken ? "text-green-700" : "text-red-700"}`}>
                  {diagnostic.envVars.printfulToken ? "Set" : "MISSING"}
                </div>
              </div>
            </div>
          </div>

          {/* API Connection Tests */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">API Connection Tests</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${diagnostic.apiTests.printify.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-2xl ${diagnostic.apiTests.printify.success ? "text-green-600" : "text-red-600"}`}>
                    {diagnostic.apiTests.printify.success ? "✓" : "✗"}
                  </span>
                  <span className="font-semibold">Printify</span>
                </div>
                <div className="text-sm text-stone-600">{diagnostic.apiTests.printify.message}</div>
                {diagnostic.apiTests.printify.shopInfo && (
                  <div className="text-xs text-stone-500 mt-2">
                    Shop ID: {diagnostic.apiTests.printify.shopInfo.id}
                  </div>
                )}
              </div>
              <div className={`p-4 rounded-lg ${diagnostic.apiTests.printful.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-2xl ${diagnostic.apiTests.printful.success ? "text-green-600" : "text-red-600"}`}>
                    {diagnostic.apiTests.printful.success ? "✓" : "✗"}
                  </span>
                  <span className="font-semibold">Printful</span>
                </div>
                <div className="text-sm text-stone-600">{diagnostic.apiTests.printful.message}</div>
                {diagnostic.apiTests.printful.storeInfo && (
                  <div className="text-xs text-stone-500 mt-2">
                    Store ID: {diagnostic.apiTests.printful.storeInfo.id}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Mapping Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Product Mapping</h2>
            <div className="flex gap-8 mb-4">
              <div>
                <span className="text-3xl font-bold text-green-600">{diagnostic.productMappingStatus.mappedProducts}</span>
                <span className="text-stone-500 ml-2">mapped</span>
              </div>
              <div>
                <span className="text-3xl font-bold text-stone-400">/ {diagnostic.productMappingStatus.totalProducts}</span>
                <span className="text-stone-500 ml-2">total products</span>
              </div>
            </div>
            {diagnostic.productMappingStatus.unmappedProducts.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="font-semibold text-amber-800 mb-2">Unmapped Products (will fail fulfillment):</div>
                <ul className="text-sm text-amber-700 list-disc list-inside">
                  {diagnostic.productMappingStatus.unmappedProducts.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Recent Orders */}
          {diagnostic.recentOrders && diagnostic.recentOrders.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Orders (click to test parsing)</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Order ID</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Fulfillment</th>
                      <th className="text-left p-2">Date</th>
                      <th className="text-left p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diagnostic.recentOrders.map((order) => (
                      <tr key={order.orderId} className="border-b hover:bg-stone-50">
                        <td className="p-2 font-mono text-xs">{order.orderId.slice(-8)}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            order.status === "paid" ? "bg-green-100 text-green-800" :
                            order.status === "shipped" ? "bg-blue-100 text-blue-800" :
                            "bg-stone-100 text-stone-800"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            order.fulfillmentStatus === "submitted" ? "bg-green-100 text-green-800" :
                            order.fulfillmentStatus === "failed" ? "bg-red-100 text-red-800" :
                            order.fulfillmentStatus === "partial" ? "bg-amber-100 text-amber-800" :
                            "bg-stone-100 text-stone-500"
                          }`}>
                            {order.fulfillmentStatus || "none"}
                          </span>
                        </td>
                        <td className="p-2 text-stone-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-2">
                          <button
                            onClick={() => testOrderParsing(order.orderId)}
                            className="text-blue-600 hover:underline text-xs"
                            disabled={parsingOrder}
                          >
                            Test Parsing
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Order Parse Result */}
          {orderParseResult && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">
                Parsing Result for Order {orderParseResult.orderId.slice(-8)}
                <span className={`ml-3 px-3 py-1 rounded text-sm ${orderParseResult.canFulfill ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {orderParseResult.canFulfill ? "Can Fulfill" : "Cannot Fulfill"}
                </span>
              </h2>
              <div className="space-y-3">
                {orderParseResult.items.map((item, i) => (
                  <div key={i} className={`p-4 rounded-lg border ${item.error ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
                    <div className="font-medium">{item.originalName}</div>
                    <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                      <div>
                        <span className="text-stone-500">Parsed Product:</span>{" "}
                        <span className={item.parsedProduct ? "text-green-700" : "text-red-700"}>
                          {item.parsedProduct || "NOT FOUND"}
                        </span>
                      </div>
                      <div>
                        <span className="text-stone-500">Color:</span>{" "}
                        {item.parsedColor || "-"}
                      </div>
                      <div>
                        <span className="text-stone-500">Size:</span>{" "}
                        {item.parsedSize || "-"}
                      </div>
                      <div>
                        <span className="text-stone-500">Provider:</span>{" "}
                        {item.provider || "-"}
                      </div>
                      <div>
                        <span className="text-stone-500">Variant ID:</span>{" "}
                        {item.variantId || "-"}
                      </div>
                      <div>
                        <span className="text-stone-500">Mapping Found:</span>{" "}
                        <span className={item.mappingFound ? "text-green-700" : "text-red-700"}>
                          {item.mappingFound ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                    {item.error && (
                      <div className="mt-2 text-red-700 text-sm font-medium">
                        Error: {item.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timestamp */}
          <div className="text-xs text-stone-400 text-right">
            Last run: {new Date(diagnostic.timestamp).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
