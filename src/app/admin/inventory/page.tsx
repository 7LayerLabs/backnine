"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { products, Product } from "@/data/products";

interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  color: string;
  size: string;
  stock: number;
  lowStockThreshold: number;
  updatedAt: number;
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Form state for adding/editing
  const [formColor, setFormColor] = useState("");
  const [formSize, setFormSize] = useState("");
  const [formStock, setFormStock] = useState(10);
  const [formThreshold, setFormThreshold] = useState(5);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/admin/inventory");
      const data = await res.json();
      setInventory(data.inventory || []);
    } catch (err) {
      console.error("Failed to fetch inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveInventoryItem = async () => {
    if (!selectedProduct || !formSize) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          color: formColor,
          size: formSize,
          stock: formStock,
          lowStockThreshold: formThreshold,
        }),
      });

      if (res.ok) {
        await fetchInventory();
        resetForm();
        setShowAddModal(false);
      }
    } catch (err) {
      console.error("Failed to save inventory:", err);
    } finally {
      setSaving(false);
    }
  };

  const adjustStock = async (inventoryId: string, adjustment: number) => {
    try {
      const res = await fetch("/api/admin/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inventoryId, adjustment }),
      });

      if (res.ok) {
        const data = await res.json();
        setInventory(inventory.map(item =>
          item.id === inventoryId ? { ...item, stock: data.newStock } : item
        ));
      }
    } catch (err) {
      console.error("Failed to adjust stock:", err);
    }
  };

  const deleteInventoryItem = async (inventoryId: string) => {
    if (!confirm("Delete this inventory entry?")) return;

    try {
      const res = await fetch("/api/admin/inventory", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inventoryId }),
      });

      if (res.ok) {
        setInventory(inventory.filter(item => item.id !== inventoryId));
      }
    } catch (err) {
      console.error("Failed to delete inventory:", err);
    }
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setFormColor("");
    setFormSize("");
    setFormStock(10);
    setFormThreshold(5);
  };

  const getProductById = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  const filteredInventory = inventory
    .filter(item => {
      if (filter === "low") return item.stock > 0 && item.stock <= item.lowStockThreshold;
      if (filter === "out") return item.stock === 0;
      return true;
    })
    .filter(item => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        item.productName.toLowerCase().includes(search) ||
        item.color.toLowerCase().includes(search) ||
        item.size.toLowerCase().includes(search)
      );
    })
    .sort((a, b) => {
      // Sort by stock level (lowest first)
      if (a.stock === 0 && b.stock > 0) return -1;
      if (b.stock === 0 && a.stock > 0) return 1;
      if (a.stock <= a.lowStockThreshold && b.stock > b.lowStockThreshold) return -1;
      if (b.stock <= b.lowStockThreshold && a.stock > a.lowStockThreshold) return 1;
      return a.productName.localeCompare(b.productName);
    });

  const stats = {
    total: inventory.length,
    outOfStock: inventory.filter(i => i.stock === 0).length,
    lowStock: inventory.filter(i => i.stock > 0 && i.stock <= i.lowStockThreshold).length,
    healthy: inventory.filter(i => i.stock > i.lowStockThreshold).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <p className="text-stone-600">Loading inventory...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Inventory</h1>
            <p className="text-stone-500 mt-1">Manage stock levels for all products</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900"
            >
              &larr; Dashboard
            </Link>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800"
            >
              + Add Stock Entry
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-stone-200">
            <p className="text-sm text-stone-500">Total SKUs</p>
            <p className="text-2xl font-bold text-stone-900">{stats.total}</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 border border-red-200">
            <p className="text-sm text-red-600">Out of Stock</p>
            <p className="text-2xl font-bold text-red-700">{stats.outOfStock}</p>
          </div>
          <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
            <p className="text-sm text-amber-600">Low Stock</p>
            <p className="text-2xl font-bold text-amber-700">{stats.lowStock}</p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
            <p className="text-sm text-emerald-600">Healthy</p>
            <p className="text-2xl font-bold text-emerald-700">{stats.healthy}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            {(["all", "low", "out"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  filter === f
                    ? "bg-stone-900 text-white"
                    : "bg-white text-stone-600 hover:bg-stone-50 border border-stone-200"
                }`}
              >
                {f === "all" ? "All" : f === "low" ? "Low Stock" : "Out of Stock"}
              </button>
            ))}
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 px-4 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10"
            />
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
          {filteredInventory.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-stone-500">
                {inventory.length === 0
                  ? "No inventory entries yet. Click 'Add Stock Entry' to get started."
                  : "No items match your filter."}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Product</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Variant</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Stock</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredInventory.map((item) => {
                  const product = getProductById(item.productId);
                  const isOutOfStock = item.stock === 0;
                  const isLowStock = item.stock > 0 && item.stock <= item.lowStockThreshold;

                  return (
                    <tr key={item.id} className={isOutOfStock ? "bg-red-50/50" : isLowStock ? "bg-amber-50/50" : ""}>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {product && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                          )}
                          <span className="font-medium text-stone-900">{item.productName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm text-stone-600">
                          {item.color && `${item.color} / `}{item.size}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => adjustStock(item.id, -1)}
                            className="w-8 h-8 rounded bg-stone-100 text-stone-600 hover:bg-stone-200 flex items-center justify-center"
                          >
                            -
                          </button>
                          <span className={`w-12 text-center font-mono font-bold ${
                            isOutOfStock ? "text-red-600" : isLowStock ? "text-amber-600" : "text-stone-900"
                          }`}>
                            {item.stock}
                          </span>
                          <button
                            onClick={() => adjustStock(item.id, 1)}
                            className="w-8 h-8 rounded bg-stone-100 text-stone-600 hover:bg-stone-200 flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`text-xs px-2 py-1 rounded font-medium ${
                          isOutOfStock
                            ? "bg-red-100 text-red-700"
                            : isLowStock
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}>
                          {isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "In Stock"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => deleteInventoryItem(item.id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick Add Section */}
        {inventory.length === 0 && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 mb-2">Get Started</h3>
            <p className="text-blue-700 text-sm mb-4">
              Add stock entries for your products. Each combination of product + color + size needs its own entry.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700"
            >
              Add Your First Stock Entry
            </button>
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-stone-900 mb-4">Add Stock Entry</h3>

            <div className="space-y-4">
              {/* Product Select */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Product</label>
                <select
                  value={selectedProduct?.id || ""}
                  onChange={(e) => {
                    const product = products.find(p => p.id === e.target.value);
                    setSelectedProduct(product || null);
                    setFormColor("");
                    setFormSize("");
                  }}
                  className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                >
                  <option value="">Select a product...</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color Select (if product has colors) */}
              {selectedProduct?.colors && selectedProduct.colors.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Color</label>
                  <select
                    value={formColor}
                    onChange={(e) => setFormColor(e.target.value)}
                    className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                  >
                    <option value="">Select a color...</option>
                    {selectedProduct.colors.map((color) => (
                      <option key={color.name} value={color.name}>
                        {color.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Size Select */}
              {selectedProduct && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">Size</label>
                  <select
                    value={formSize}
                    onChange={(e) => setFormSize(e.target.value)}
                    className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                  >
                    <option value="">Select a size...</option>
                    {(selectedProduct.sizes || ["One Size"]).map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Stock Quantity */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  value={formStock}
                  onChange={(e) => setFormStock(parseInt(e.target.value) || 0)}
                  className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                />
              </div>

              {/* Low Stock Threshold */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">Low Stock Alert At</label>
                <input
                  type="number"
                  min="0"
                  value={formThreshold}
                  onChange={(e) => setFormThreshold(parseInt(e.target.value) || 0)}
                  className="w-full border border-stone-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                />
                <p className="text-xs text-stone-500 mt-1">You'll see a warning when stock drops to this level</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="flex-1 border border-stone-200 rounded px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={saveInventoryItem}
                disabled={!selectedProduct || !formSize || saving}
                className="flex-1 bg-stone-900 text-white rounded px-4 py-2 text-sm font-medium hover:bg-stone-800 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Add Entry"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
