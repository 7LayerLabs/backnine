"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { db, Product } from "@/lib/instant";

export default function AdminProducts() {
  const { isLoading, data } = db.useQuery({ products: {} });
  const [deleting, setDeleting] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const products = (data?.products || []) as Product[];
  const sortedProducts = [...products].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  const deleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setDeleting(productId);
    try {
      await db.transact([db.tx.products[productId].delete()]);
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product");
    }
    setDeleting(null);
  };

  const togglePublished = async (product: Product) => {
    try {
      await db.transact([
        db.tx.products[product.id].update({ published: !product.published }),
      ]);
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const toggleAvailable = async (product: Product) => {
    try {
      await db.transact([
        db.tx.products[product.id].update({ available: !product.available }),
      ]);
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const moveProduct = async (productId: string, direction: "up" | "down") => {
    const currentIndex = sortedProducts.findIndex((p) => p.id === productId);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= sortedProducts.length) return;

    setSaving(true);
    try {
      const currentProduct = sortedProducts[currentIndex];
      const swapProduct = sortedProducts[newIndex];

      // Swap sort orders
      await db.transact([
        db.tx.products[currentProduct.id].update({ sortOrder: swapProduct.sortOrder || newIndex }),
        db.tx.products[swapProduct.id].update({ sortOrder: currentProduct.sortOrder || currentIndex }),
      ]);
    } catch (error) {
      console.error("Failed to reorder products:", error);
    }
    setSaving(false);
  };

  const handleDragStart = (e: React.DragEvent, productId: string) => {
    setDraggedId(productId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    const draggedIndex = sortedProducts.findIndex((p) => p.id === draggedId);
    const targetIndex = sortedProducts.findIndex((p) => p.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedId(null);
      return;
    }

    setSaving(true);
    try {
      // Create new order array
      const newOrder = [...sortedProducts];
      const [draggedProduct] = newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedProduct);

      // Update all sort orders
      const transactions = newOrder.map((product, index) =>
        db.tx.products[product.id].update({ sortOrder: index })
      );

      await db.transact(transactions);
    } catch (error) {
      console.error("Failed to reorder products:", error);
    }
    setSaving(false);
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

  const formatPrice = (price: number) => `$${price.toFixed(2)}`;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900 mx-auto mb-4"></div>
          <p className="text-stone-600">Loading products...</p>
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
            <h1 className="text-3xl font-bold text-stone-900">Products</h1>
            <p className="text-stone-500 mt-1">{products.length} products total</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/dashboard"
              className="px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              &larr; Dashboard
            </Link>
            <Link
              href="/admin/products/new"
              className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </Link>
          </div>
        </div>

        {/* Saving indicator */}
        {saving && (
          <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-sm text-blue-700">Saving order...</span>
          </div>
        )}

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <div className="w-16 h-16 bg-stone-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-stone-900 mb-2">No products yet</h3>
            <p className="text-stone-500 mb-6">Get started by adding your first product.</p>
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-stone-50 border-b border-stone-200">
                <tr>
                  <th className="w-20 text-left px-4 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Order</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Product</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Category</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Price</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Visibility</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Available</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-stone-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {sortedProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, product.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, product.id)}
                    onDragEnd={handleDragEnd}
                    className={`hover:bg-stone-50 ${
                      draggedId === product.id ? "opacity-50 bg-blue-50" : ""
                    } ${draggedId && draggedId !== product.id ? "border-t-2 border-transparent hover:border-blue-400" : ""}`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        {/* Drag handle */}
                        <div className="cursor-grab active:cursor-grabbing p-1 text-stone-400 hover:text-stone-600">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                          </svg>
                        </div>
                        {/* Up/Down arrows */}
                        <div className="flex flex-col">
                          <button
                            onClick={() => moveProduct(product.id, "up")}
                            disabled={index === 0 || saving}
                            className="p-0.5 text-stone-400 hover:text-stone-600 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => moveProduct(product.id, "down")}
                            disabled={index === sortedProducts.length - 1 || saving}
                            className="p-0.5 text-stone-400 hover:text-stone-600 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-400">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-stone-900">{product.name}</p>
                          <p className="text-sm text-stone-500 truncate max-w-xs">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-800 capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-stone-900">{formatPrice(product.price)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => togglePublished(product)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 ${
                          product.published
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {product.published ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleAvailable(product)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 ${
                          product.available !== false
                            ? "bg-blue-100 text-blue-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {product.available !== false ? "In Stock" : "Unavailable"}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          disabled={deleting === product.id}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg disabled:opacity-50"
                        >
                          {deleting === product.id ? (
                            <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">How to manage products:</h3>
          <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
            <li>Drag rows or use arrows to reorder products on the site</li>
            <li>Click &quot;Published&quot;/&quot;Draft&quot; to show/hide on store</li>
            <li>Click &quot;In Stock&quot;/&quot;Unavailable&quot; to toggle availability</li>
            <li>Add matching products to Stripe with same name/price</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
