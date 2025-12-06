"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/lib/instant";

interface Order {
  id: string;
  items: string;
  total: number;
  status: string;
  customerEmail: string;
  customerName?: string;
  createdAt: number;
}

interface InventoryItem {
  id: string;
  productId: string;
  color: string;
  size: string;
  stock: number;
  lowStockThreshold: number;
}

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  revenueToday: number;
  ordersToday: number;
  revenueThisWeek: number;
  ordersThisWeek: number;
  revenueThisMonth: number;
  ordersThisMonth: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
}

interface TopProduct {
  name: string;
  quantity: number;
  revenue: number;
}

function StatCard({ title, value, subtitle, trend, icon }: {
  title: string;
  value: string;
  subtitle?: string;
  trend?: { value: string; positive: boolean };
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-stone-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-stone-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-stone-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-stone-400 mt-1">{subtitle}</p>}
          {trend && (
            <p className={`text-xs mt-2 font-medium ${trend.positive ? "text-emerald-600" : "text-red-600"}`}>
              {trend.positive ? "+" : ""}{trend.value}
            </p>
          )}
        </div>
        <div className="text-stone-400">{icon}</div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { isLoading: ordersLoading, data: ordersData } = db.useQuery({ orders: {} });
  const { isLoading: inventoryLoading, data: inventoryData } = db.useQuery({ inventory: {} });

  const orders = (ordersData?.orders || []) as Order[];
  const inventory = (inventoryData?.inventory || []) as InventoryItem[];

  const calculateStats = (): DashboardStats => {
    const now = Date.now();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();

    const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const monthAgo = now - 30 * 24 * 60 * 60 * 1000;

    const paidOrders = orders.filter(o => o.status !== "cancelled");

    const todayOrders = paidOrders.filter(o => o.createdAt >= todayStart);
    const weekOrders = paidOrders.filter(o => o.createdAt >= weekAgo);
    const monthOrders = paidOrders.filter(o => o.createdAt >= monthAgo);

    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const revenueToday = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const revenueThisWeek = weekOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const revenueThisMonth = monthOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    return {
      totalRevenue,
      totalOrders: paidOrders.length,
      averageOrderValue: paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0,
      revenueToday,
      ordersToday: todayOrders.length,
      revenueThisWeek,
      ordersThisWeek: weekOrders.length,
      revenueThisMonth,
      ordersThisMonth: monthOrders.length,
      pendingOrders: orders.filter(o => o.status === "paid").length,
      shippedOrders: orders.filter(o => o.status === "shipped").length,
      deliveredOrders: orders.filter(o => o.status === "delivered").length,
    };
  };

  const getTopProducts = (): TopProduct[] => {
    const productMap = new Map<string, { quantity: number; revenue: number }>();

    orders.filter(o => o.status !== "cancelled").forEach(order => {
      try {
        const items = JSON.parse(order.items);
        items.forEach((item: { name: string; quantity: number; price: number }) => {
          const existing = productMap.get(item.name) || { quantity: 0, revenue: 0 };
          productMap.set(item.name, {
            quantity: existing.quantity + item.quantity,
            revenue: existing.revenue + item.price,
          });
        });
      } catch {}
    });

    return Array.from(productMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  const getLowStockItems = () => {
    return inventory.filter(item => item.stock <= item.lowStockThreshold);
  };

  const getRecentOrders = () => {
    return [...orders]
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 5);
  };

  const stats = calculateStats();
  const topProducts = getTopProducts();
  const lowStockItems = getLowStockItems();
  const recentOrders = getRecentOrders();

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (ordersLoading || inventoryLoading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <p className="text-stone-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Dashboard</h1>
            <p className="text-stone-500 mt-1">Overview of your store performance</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/orders"
              className="px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              View Orders
            </Link>
            <Link
              href="/admin/inventory"
              className="px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              Manage Inventory
            </Link>
            <Link
              href="/admin/analytics"
              className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800"
            >
              Full Analytics
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Revenue Today"
            value={formatCurrency(stats.revenueToday)}
            subtitle={`${stats.ordersToday} orders`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            title="This Week"
            value={formatCurrency(stats.revenueThisWeek)}
            subtitle={`${stats.ordersThisWeek} orders`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
          <StatCard
            title="This Month"
            value={formatCurrency(stats.revenueThisMonth)}
            subtitle={`${stats.ordersThisMonth} orders`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
          <StatCard
            title="Avg Order Value"
            value={formatCurrency(stats.averageOrderValue)}
            subtitle={`${stats.totalOrders} total orders`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            }
          />
        </div>

        {/* Order Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-700 font-medium">Needs Shipping</p>
                <p className="text-3xl font-bold text-amber-800">{stats.pendingOrders}</p>
              </div>
              <Link
                href="/admin/orders"
                className="text-amber-600 hover:text-amber-800 text-sm font-medium"
              >
                View &rarr;
              </Link>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">In Transit</p>
                <p className="text-3xl font-bold text-blue-800">{stats.shippedOrders}</p>
              </div>
              <span className="text-blue-400 text-sm">Shipped</span>
            </div>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-700 font-medium">Delivered</p>
                <p className="text-3xl font-bold text-emerald-800">{stats.deliveredOrders}</p>
              </div>
              <span className="text-emerald-400 text-sm">Complete</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-stone-200">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between">
              <h2 className="font-semibold text-stone-900">Recent Orders</h2>
              <Link href="/admin/orders" className="text-sm text-stone-500 hover:text-stone-900">
                View all &rarr;
              </Link>
            </div>
            <div className="divide-y divide-stone-100">
              {recentOrders.length === 0 ? (
                <div className="p-8 text-center text-stone-500">No orders yet</div>
              ) : (
                recentOrders.map((order) => (
                  <div key={order.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-stone-900">
                        {order.customerName || order.customerEmail}
                      </p>
                      <p className="text-sm text-stone-500">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-stone-900">{formatCurrency(order.total)}</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        order.status === "paid" ? "bg-amber-100 text-amber-700" :
                        order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                        order.status === "delivered" ? "bg-emerald-100 text-emerald-700" :
                        "bg-stone-100 text-stone-700"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Top Products */}
            <div className="bg-white rounded-lg shadow-sm border border-stone-200">
              <div className="p-4 border-b border-stone-200">
                <h2 className="font-semibold text-stone-900">Top Products</h2>
              </div>
              <div className="divide-y divide-stone-100">
                {topProducts.length === 0 ? (
                  <div className="p-4 text-center text-stone-500 text-sm">No sales data yet</div>
                ) : (
                  topProducts.map((product, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-stone-900 text-sm">{product.name}</p>
                        <p className="text-xs text-stone-500">{product.quantity} sold</p>
                      </div>
                      <p className="font-medium text-stone-900">{formatCurrency(product.revenue)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Low Stock Alert */}
            <div className="bg-white rounded-lg shadow-sm border border-stone-200">
              <div className="p-4 border-b border-stone-200 flex items-center justify-between">
                <h2 className="font-semibold text-stone-900">Low Stock Alert</h2>
                <Link href="/admin/inventory" className="text-sm text-stone-500 hover:text-stone-900">
                  Manage &rarr;
                </Link>
              </div>
              <div className="divide-y divide-stone-100">
                {lowStockItems.length === 0 ? (
                  <div className="p-4 text-center text-emerald-600 text-sm">
                    All stock levels OK
                  </div>
                ) : (
                  lowStockItems.slice(0, 5).map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-stone-900 text-sm">{item.productId}</p>
                        <p className="text-xs text-stone-500">{item.color} / {item.size}</p>
                      </div>
                      <span className={`text-sm font-medium ${
                        item.stock === 0 ? "text-red-600" : "text-amber-600"
                      }`}>
                        {item.stock === 0 ? "Out of stock" : `${item.stock} left`}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/admin/orders"
            className="bg-white rounded-lg p-4 border border-stone-200 hover:border-stone-400 transition-colors text-center"
          >
            <svg className="w-6 h-6 mx-auto text-stone-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm font-medium text-stone-700">Orders</p>
          </Link>
          <Link
            href="/admin/inventory"
            className="bg-white rounded-lg p-4 border border-stone-200 hover:border-stone-400 transition-colors text-center"
          >
            <svg className="w-6 h-6 mx-auto text-stone-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-sm font-medium text-stone-700">Inventory</p>
          </Link>
          <Link
            href="/admin/analytics"
            className="bg-white rounded-lg p-4 border border-stone-200 hover:border-stone-400 transition-colors text-center"
          >
            <svg className="w-6 h-6 mx-auto text-stone-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="text-sm font-medium text-stone-700">Analytics</p>
          </Link>
          <Link
            href="/admin/errors"
            className="bg-white rounded-lg p-4 border border-stone-200 hover:border-stone-400 transition-colors text-center"
          >
            <svg className="w-6 h-6 mx-auto text-stone-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm font-medium text-stone-700">Errors</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
