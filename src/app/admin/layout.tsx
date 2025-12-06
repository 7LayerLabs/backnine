"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if already authenticated via session storage
    const auth = sessionStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
    setChecking(false);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      sessionStorage.setItem("admin_auth", "true");
      setIsAuthenticated(true);
    } else {
      setError("Invalid password");
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <p className="text-stone-600">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg p-8 max-w-sm w-full shadow-sm">
          <h1 className="text-2xl font-semibold text-stone-900 mb-6 text-center">
            Admin Access
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full border border-stone-200 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-stone-900"
                autoFocus
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-stone-900 text-white py-3 rounded font-medium hover:bg-stone-800 transition-colors"
            >
              Enter
            </button>
          </form>
          <Link
            href="/"
            className="block text-center text-sm text-stone-500 mt-4 hover:text-stone-700"
          >
            Back to store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <nav className="bg-stone-900 text-white px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/admin/orders" className="font-semibold">
              BackNine Admin
            </Link>
            <Link
              href="/admin/orders"
              className="text-sm text-stone-300 hover:text-white"
            >
              Orders
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-stone-300 hover:text-white"
            >
              View Store
            </Link>
            <button
              onClick={() => {
                sessionStorage.removeItem("admin_auth");
                setIsAuthenticated(false);
              }}
              className="text-sm text-stone-400 hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
