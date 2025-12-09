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
  productName: string;
  color: string;
  size: string;
  stock: number;
  lowStockThreshold: number;
}

interface AbandonedCart {
  id: string;
  email: string;
  total: number;
  recovered: boolean;
  createdAt: number;
}

interface ErrorLog {
  id: string;
  resolved: boolean;
  severity: string;
  createdAt: number;
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

function StatCard({ title, value, subtitle, trend, icon, alert }: {
  title: string;
  value: string;
  subtitle?: string;
  trend?: { value: string; positive: boolean };
  icon: React.ReactNode;
  alert?: boolean;
}) {
  return (
    <div className={`bg-white rounded-lg p-6 shadow-sm border ${alert ? 'border-red-300 bg-red-50' : 'border-stone-200'}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-stone-500 font-medium">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${alert ? 'text-red-600' : 'text-stone-900'}`}>{value}</p>
          {subtitle && <p className="text-xs text-stone-400 mt-1">{subtitle}</p>}
          {trend && (
            <p className={`text-xs mt-2 font-medium ${trend.positive ? "text-emerald-600" : "text-red-600"}`}>
              {trend.positive ? "+" : ""}{trend.value}
            </p>
          )}
        </div>
        <div className={alert ? 'text-red-400' : 'text-stone-400'}>{icon}</div>
      </div>
    </div>
  );
}

function ExternalLink({ href, icon, title, description, color }: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-4 p-4 rounded-lg border border-stone-200 hover:border-stone-400 hover:shadow-sm transition-all bg-white group`}
    >
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-stone-900 group-hover:text-stone-700">{title}</p>
        <p className="text-xs text-stone-500 truncate">{description}</p>
      </div>
      <svg className="w-4 h-4 text-stone-400 group-hover:text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
    </a>
  );
}

export default function AdminDashboard() {
  const { isLoading: ordersLoading, data: ordersData } = db.useQuery({ orders: {} });
  const { isLoading: inventoryLoading, data: inventoryData } = db.useQuery({ inventory: {} });
  const { isLoading: cartsLoading, data: cartsData } = db.useQuery({ abandonedCarts: {} });
  const { isLoading: errorsLoading, data: errorsData } = db.useQuery({ errors: {} });

  const orders = (ordersData?.orders || []) as Order[];
  const inventory = (inventoryData?.inventory || []) as InventoryItem[];
  const abandonedCarts = (cartsData?.abandonedCarts || []) as AbandonedCart[];
  const errors = (errorsData?.errors || []) as ErrorLog[];

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

  const getUnresolvedErrors = () => {
    return errors.filter(e => !e.resolved);
  };

  const getActiveAbandonedCarts = () => {
    return abandonedCarts.filter(c => !c.recovered);
  };

  const stats = calculateStats();
  const topProducts = getTopProducts();
  const lowStockItems = getLowStockItems();
  const recentOrders = getRecentOrders();
  const unresolvedErrors = getUnresolvedErrors();
  const activeAbandonedCarts = getActiveAbandonedCarts();

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const isLoading = ordersLoading || inventoryLoading || cartsLoading || errorsLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900 mx-auto mb-4"></div>
          <p className="text-stone-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Admin Hub</h1>
            <p className="text-stone-500 mt-1">Back Nine Apparel Command Center</p>
          </div>
          <div className="flex gap-3">
            <a
              href="https://www.backnineshop.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Store
            </a>
          </div>
        </div>

        {/* Live Mode Banner */}
        <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-4 mb-6 flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-medium text-emerald-800">Stripe is LIVE</p>
            <p className="text-sm text-emerald-700">Accepting real payments. All systems operational.</p>
          </div>
          <a
            href="https://dashboard.stripe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 flex-shrink-0"
          >
            View Stripe
          </a>
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

        {/* Order Status + Alerts Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-700 font-medium">Needs Shipping</p>
                <p className="text-3xl font-bold text-amber-800">{stats.pendingOrders}</p>
              </div>
              <Link href="/admin/orders" className="text-amber-600 hover:text-amber-800 text-sm font-medium">
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
          <div className={`rounded-lg p-4 ${unresolvedErrors.length > 0 ? 'bg-red-50 border border-red-200' : 'bg-stone-50 border border-stone-200'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium ${unresolvedErrors.length > 0 ? 'text-red-700' : 'text-stone-600'}`}>Errors</p>
                <p className={`text-3xl font-bold ${unresolvedErrors.length > 0 ? 'text-red-800' : 'text-stone-800'}`}>{unresolvedErrors.length}</p>
              </div>
              <Link href="/admin/errors" className={`text-sm font-medium ${unresolvedErrors.length > 0 ? 'text-red-600 hover:text-red-800' : 'text-stone-500 hover:text-stone-700'}`}>
                View &rarr;
              </Link>
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700 font-medium">Abandoned Carts</p>
                <p className="text-3xl font-bold text-purple-800">{activeAbandonedCarts.length}</p>
              </div>
              <span className="text-purple-400 text-sm">${activeAbandonedCarts.reduce((s, c) => s + c.total, 0).toFixed(0)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
                        <p className="font-medium text-stone-900 text-sm">{item.productName || item.productId}</p>
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

        {/* External Services Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-stone-900 mb-4">External Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Stripe */}
            <ExternalLink
              href="https://dashboard.stripe.com"
              title="Stripe Dashboard"
              description="Payments, refunds, disputes"
              color="bg-purple-100"
              icon={
                <svg className="w-5 h-5 text-purple-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/>
                </svg>
              }
            />

            {/* InstantDB */}
            <ExternalLink
              href="https://instantdb.com/dash"
              title="InstantDB"
              description="Database, orders, inventory data"
              color="bg-blue-100"
              icon={
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              }
            />

            {/* Resend */}
            <ExternalLink
              href="https://resend.com/emails"
              title="Resend"
              description="Email delivery logs"
              color="bg-stone-800"
              icon={
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />

            {/* Vercel */}
            <ExternalLink
              href="https://vercel.com/7layerlabs-projects/backnine"
              title="Vercel"
              description="Deployments, logs, settings"
              color="bg-black"
              icon={
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 22.525H0l12-21.05 12 21.05z"/>
                </svg>
              }
            />

            {/* GitHub */}
            <ExternalLink
              href="https://github.com/7LayerLabs/backnine"
              title="GitHub"
              description="Source code repository"
              color="bg-stone-900"
              icon={
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              }
            />

            {/* Gmail */}
            <ExternalLink
              href="https://mail.google.com"
              title="Gmail"
              description="Business email"
              color="bg-red-100"
              icon={
                <svg className="w-5 h-5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
                </svg>
              }
            />

            {/* Privateemail */}
            <ExternalLink
              href="https://privateemail.com"
              title="Privateemail"
              description="hello@backnineshop.com"
              color="bg-orange-100"
              icon={
                <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
            />

            {/* Namecheap */}
            <ExternalLink
              href="https://www.namecheap.com/myaccount/domain-list/"
              title="Namecheap"
              description="Domain management"
              color="bg-orange-500"
              icon={
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              }
            />

            {/* Google Analytics (if used) */}
            <ExternalLink
              href="https://analytics.google.com"
              title="Google Analytics"
              description="Website traffic & behavior"
              color="bg-yellow-100"
              icon={
                <svg className="w-5 h-5 text-yellow-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.84 2.9982v17.9987c.0086.5366-.2018 1.0534-.5852 1.4368-.3833.3834-.9.5765-1.4367.5369H3.1818c-1.0927 0-2.0454-.8727-2.0454-1.9736V3.1818c0-1.0927.9527-2.0454 2.0454-2.0454h17.6363c1.1009 0 2.0219.9527 2.0219 2.0454v-.1836zM7.5 19.0909c.9545 0 1.7045-.75 1.7045-1.7045V6.6136c0-.9545-.75-1.7045-1.7045-1.7045-.9546 0-1.7046.75-1.7046 1.7045v10.7728c0 .9545.75 1.7045 1.7046 1.7045zm4.7727 0c.9546 0 1.7046-.75 1.7046-1.7045v-6.8182c0-.9545-.75-1.7046-1.7046-1.7046-.9545 0-1.7045.7501-1.7045 1.7046v6.8182c0 .9545.75 1.7045 1.7045 1.7045zm4.7728 0c.9545 0 1.7045-.75 1.7045-1.7045v-3.4091c0-.9546-.75-1.7046-1.7045-1.7046-.9546 0-1.7046.75-1.7046 1.7046v3.4091c0 .9545.75 1.7045 1.7046 1.7045z"/>
                </svg>
              }
            />

            {/* Project Documentation */}
            <ExternalLink
              href="https://github.com/7LayerLabs/backnine/blob/main/BACKNINESHOP.md"
              title="Documentation"
              description="Project docs & go-live checklist"
              color="bg-emerald-100"
              icon={
                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
            />
          </div>
        </div>

        {/* Admin Pages Quick Links */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-stone-900 mb-4">Admin Pages</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link
              href="/admin/products"
              className="bg-white rounded-lg p-4 border border-stone-200 hover:border-stone-400 hover:shadow-sm transition-all text-center group"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-sm font-medium text-stone-700">Products</p>
            </Link>

            <Link
              href="/admin/orders"
              className="bg-white rounded-lg p-4 border border-stone-200 hover:border-stone-400 hover:shadow-sm transition-all text-center group"
            >
              <div className="w-12 h-12 bg-amber-100 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-sm font-medium text-stone-700">Orders</p>
              {stats.pendingOrders > 0 && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full">
                  {stats.pendingOrders} pending
                </span>
              )}
            </Link>

            <Link
              href="/admin/inventory"
              className="bg-white rounded-lg p-4 border border-stone-200 hover:border-stone-400 hover:shadow-sm transition-all text-center group"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="text-sm font-medium text-stone-700">Inventory</p>
              {lowStockItems.length > 0 && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                  {lowStockItems.length} low
                </span>
              )}
            </Link>

            <Link
              href="/admin/analytics"
              className="bg-white rounded-lg p-4 border border-stone-200 hover:border-stone-400 hover:shadow-sm transition-all text-center group"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-stone-700">Analytics</p>
            </Link>

            <Link
              href="/admin/errors"
              className="bg-white rounded-lg p-4 border border-stone-200 hover:border-stone-400 hover:shadow-sm transition-all text-center group"
            >
              <div className={`w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center transition-colors ${unresolvedErrors.length > 0 ? 'bg-red-100 group-hover:bg-red-200' : 'bg-stone-100 group-hover:bg-stone-200'}`}>
                <svg className={`w-6 h-6 ${unresolvedErrors.length > 0 ? 'text-red-600' : 'text-stone-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-stone-700">Errors</p>
              {unresolvedErrors.length > 0 && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded-full">
                  {unresolvedErrors.length} unresolved
                </span>
              )}
            </Link>

            <a
              href="https://www.backnineshop.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-lg p-4 border border-stone-200 hover:border-stone-400 hover:shadow-sm transition-all text-center group"
            >
              <div className="w-12 h-12 bg-stone-900 rounded-lg mx-auto mb-3 flex items-center justify-center group-hover:bg-stone-800 transition-colors">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-stone-700">View Store</p>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-stone-400 text-sm pt-4 border-t border-stone-200">
          <p>Back Nine Apparel Admin Hub</p>
        </div>
      </div>
    </div>
  );
}
