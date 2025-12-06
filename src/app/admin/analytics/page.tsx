"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

interface Order {
  id: string;
  items: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  status: string;
  customerEmail: string;
  customerName: string;
  createdAt: number;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

interface DailyData {
  date: string;
  revenue: number;
  orders: number;
}

interface ProductStats {
  productId: string;
  name: string;
  quantity: number;
  revenue: number;
}

type TimeRange = "7d" | "30d" | "90d" | "all";

export default function AnalyticsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("30d");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/admin/orders");
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders by time range
  const filteredOrders = useMemo(() => {
    const now = Date.now();
    const ranges: Record<TimeRange, number> = {
      "7d": 7 * 24 * 60 * 60 * 1000,
      "30d": 30 * 24 * 60 * 60 * 1000,
      "90d": 90 * 24 * 60 * 60 * 1000,
      all: Infinity,
    };

    return orders.filter((order) => {
      if (timeRange === "all") return true;
      return now - order.createdAt < ranges[timeRange];
    });
  }, [orders, timeRange]);

  // Calculate key metrics
  const metrics = useMemo(() => {
    const totalRevenue = filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = filteredOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const shippedOrders = filteredOrders.filter((o) => o.status === "shipped" || o.status === "delivered").length;
    const fulfillmentRate = totalOrders > 0 ? (shippedOrders / totalOrders) * 100 : 0;

    // Unique customers
    const uniqueCustomers = new Set(filteredOrders.map((o) => o.customerEmail.toLowerCase())).size;

    // Repeat customers (more than one order)
    const customerOrderCount: Record<string, number> = {};
    filteredOrders.forEach((o) => {
      const email = o.customerEmail.toLowerCase();
      customerOrderCount[email] = (customerOrderCount[email] || 0) + 1;
    });
    const repeatCustomers = Object.values(customerOrderCount).filter((count) => count > 1).length;
    const repeatRate = uniqueCustomers > 0 ? (repeatCustomers / uniqueCustomers) * 100 : 0;

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      fulfillmentRate,
      uniqueCustomers,
      repeatCustomers,
      repeatRate,
    };
  }, [filteredOrders]);

  // Daily revenue data for chart
  const dailyData = useMemo(() => {
    const days: Record<string, DailyData> = {};

    filteredOrders.forEach((order) => {
      const date = new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (!days[date]) {
        days[date] = { date, revenue: 0, orders: 0 };
      }
      days[date].revenue += order.total || 0;
      days[date].orders += 1;
    });

    return Object.values(days).sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  }, [filteredOrders]);

  // Top products
  const topProducts = useMemo(() => {
    const products: Record<string, ProductStats> = {};

    filteredOrders.forEach((order) => {
      try {
        const items: OrderItem[] = JSON.parse(order.items || "[]");
        items.forEach((item) => {
          if (!products[item.id]) {
            products[item.id] = {
              productId: item.id,
              name: item.name,
              quantity: 0,
              revenue: 0,
            };
          }
          products[item.id].quantity += item.quantity;
          products[item.id].revenue += item.price * item.quantity;
        });
      } catch {
        // Skip invalid items
      }
    });

    return Object.values(products)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [filteredOrders]);

  // Orders by status
  const ordersByStatus = useMemo(() => {
    const statuses: Record<string, number> = {
      paid: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    filteredOrders.forEach((order) => {
      const status = order.status || "paid";
      statuses[status] = (statuses[status] || 0) + 1;
    });

    return statuses;
  }, [filteredOrders]);

  // Revenue by day of week
  const revenueByDayOfWeek = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayRevenue: Record<string, number> = {};
    days.forEach((d) => (dayRevenue[d] = 0));

    filteredOrders.forEach((order) => {
      const day = days[new Date(order.createdAt).getDay()];
      dayRevenue[day] += order.total || 0;
    });

    return days.map((day) => ({ day, revenue: dayRevenue[day] }));
  }, [filteredOrders]);

  // Calculate max values for chart scaling
  const maxDailyRevenue = Math.max(...dailyData.map((d) => d.revenue), 1);
  const maxDayOfWeekRevenue = Math.max(...revenueByDayOfWeek.map((d) => d.revenue), 1);
  const maxProductRevenue = Math.max(...topProducts.map((p) => p.revenue), 1);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics</h1>
            <p className="text-stone-400">Track your store performance</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Time Range Selector */}
            <div className="flex bg-stone-800 rounded-lg p-1">
              {(["7d", "30d", "90d", "all"] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    timeRange === range
                      ? "bg-amber-500 text-black"
                      : "text-stone-400 hover:text-white"
                  }`}
                >
                  {range === "all" ? "All Time" : range.toUpperCase()}
                </button>
              ))}
            </div>

            <Link
              href="/admin/dashboard"
              className="px-4 py-2 bg-stone-800 text-stone-300 rounded-lg hover:bg-stone-700 transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-stone-800 rounded-xl p-6">
            <p className="text-stone-400 text-sm mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-green-400">{formatCurrency(metrics.totalRevenue)}</p>
          </div>
          <div className="bg-stone-800 rounded-xl p-6">
            <p className="text-stone-400 text-sm mb-1">Total Orders</p>
            <p className="text-3xl font-bold text-white">{metrics.totalOrders}</p>
          </div>
          <div className="bg-stone-800 rounded-xl p-6">
            <p className="text-stone-400 text-sm mb-1">Avg Order Value</p>
            <p className="text-3xl font-bold text-amber-400">{formatCurrency(metrics.averageOrderValue)}</p>
          </div>
          <div className="bg-stone-800 rounded-xl p-6">
            <p className="text-stone-400 text-sm mb-1">Fulfillment Rate</p>
            <p className="text-3xl font-bold text-blue-400">{metrics.fulfillmentRate.toFixed(1)}%</p>
          </div>
        </div>

        {/* Customer Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-stone-800 rounded-xl p-6">
            <p className="text-stone-400 text-sm mb-1">Unique Customers</p>
            <p className="text-2xl font-bold text-white">{metrics.uniqueCustomers}</p>
          </div>
          <div className="bg-stone-800 rounded-xl p-6">
            <p className="text-stone-400 text-sm mb-1">Repeat Customers</p>
            <p className="text-2xl font-bold text-white">{metrics.repeatCustomers}</p>
          </div>
          <div className="bg-stone-800 rounded-xl p-6">
            <p className="text-stone-400 text-sm mb-1">Repeat Rate</p>
            <p className="text-2xl font-bold text-purple-400">{metrics.repeatRate.toFixed(1)}%</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Over Time */}
          <div className="bg-stone-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Revenue Over Time</h2>
            {dailyData.length > 0 ? (
              <div className="space-y-2">
                {dailyData.slice(-14).map((day) => (
                  <div key={day.date} className="flex items-center gap-3">
                    <span className="text-stone-400 text-sm w-16">{day.date}</span>
                    <div className="flex-1 bg-stone-700 rounded-full h-6 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-400 h-full rounded-full flex items-center justify-end pr-2"
                        style={{ width: `${Math.max((day.revenue / maxDailyRevenue) * 100, 5)}%` }}
                      >
                        <span className="text-xs font-medium text-white">
                          {formatCurrency(day.revenue)}
                        </span>
                      </div>
                    </div>
                    <span className="text-stone-500 text-sm w-12 text-right">{day.orders} ord</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-stone-500 text-center py-8">No data for this period</p>
            )}
          </div>

          {/* Revenue by Day of Week */}
          <div className="bg-stone-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Revenue by Day of Week</h2>
            <div className="flex items-end justify-between h-48 gap-2">
              {revenueByDayOfWeek.map((day) => (
                <div key={day.day} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-amber-500 to-amber-400 rounded-t-lg transition-all"
                    style={{
                      height: `${Math.max((day.revenue / maxDayOfWeekRevenue) * 160, 4)}px`,
                    }}
                  />
                  <span className="text-stone-400 text-sm mt-2">{day.day}</span>
                  <span className="text-stone-500 text-xs">{formatCurrency(day.revenue)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <div className="bg-stone-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Top Products</h2>
            {topProducts.length > 0 ? (
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div key={product.productId} className="flex items-center gap-3">
                    <span className="text-stone-500 text-sm w-6">{index + 1}.</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white text-sm truncate">{product.name}</span>
                        <span className="text-green-400 text-sm font-medium">
                          {formatCurrency(product.revenue)}
                        </span>
                      </div>
                      <div className="bg-stone-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-400 h-full rounded-full"
                          style={{ width: `${(product.revenue / maxProductRevenue) * 100}%` }}
                        />
                      </div>
                      <span className="text-stone-500 text-xs">{product.quantity} units sold</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-stone-500 text-center py-8">No product data available</p>
            )}
          </div>

          {/* Orders by Status */}
          <div className="bg-stone-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Orders by Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-amber-500" />
                  <span className="text-white">Paid (Pending Shipment)</span>
                </div>
                <span className="text-2xl font-bold text-amber-500">{ordersByStatus.paid}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-blue-500" />
                  <span className="text-white">Shipped</span>
                </div>
                <span className="text-2xl font-bold text-blue-500">{ordersByStatus.shipped}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-green-500" />
                  <span className="text-white">Delivered</span>
                </div>
                <span className="text-2xl font-bold text-green-500">{ordersByStatus.delivered}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-red-500" />
                  <span className="text-white">Cancelled</span>
                </div>
                <span className="text-2xl font-bold text-red-500">{ordersByStatus.cancelled}</span>
              </div>
            </div>

            {/* Visual Pie-ish Chart */}
            <div className="mt-6 pt-6 border-t border-stone-700">
              <div className="flex h-4 rounded-full overflow-hidden bg-stone-700">
                {metrics.totalOrders > 0 && (
                  <>
                    <div
                      className="bg-amber-500"
                      style={{ width: `${(ordersByStatus.paid / metrics.totalOrders) * 100}%` }}
                    />
                    <div
                      className="bg-blue-500"
                      style={{ width: `${(ordersByStatus.shipped / metrics.totalOrders) * 100}%` }}
                    />
                    <div
                      className="bg-green-500"
                      style={{ width: `${(ordersByStatus.delivered / metrics.totalOrders) * 100}%` }}
                    />
                    <div
                      className="bg-red-500"
                      style={{ width: `${(ordersByStatus.cancelled / metrics.totalOrders) * 100}%` }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Footer */}
        <div className="mt-8 p-4 bg-stone-800/50 rounded-xl">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <p className="text-stone-500 text-sm">Avg Items/Order</p>
              <p className="text-white font-semibold">
                {filteredOrders.length > 0
                  ? (
                      filteredOrders.reduce((sum, o) => {
                        try {
                          const items: OrderItem[] = JSON.parse(o.items || "[]");
                          return sum + items.reduce((s, i) => s + i.quantity, 0);
                        } catch {
                          return sum;
                        }
                      }, 0) / filteredOrders.length
                    ).toFixed(1)
                  : "0"}
              </p>
            </div>
            <div>
              <p className="text-stone-500 text-sm">Avg Shipping Cost</p>
              <p className="text-white font-semibold">
                {formatCurrency(
                  filteredOrders.length > 0
                    ? filteredOrders.reduce((sum, o) => sum + (o.shippingCost || 0), 0) /
                        filteredOrders.length
                    : 0
                )}
              </p>
            </div>
            <div>
              <p className="text-stone-500 text-sm">Total Shipping Revenue</p>
              <p className="text-white font-semibold">
                {formatCurrency(filteredOrders.reduce((sum, o) => sum + (o.shippingCost || 0), 0))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
