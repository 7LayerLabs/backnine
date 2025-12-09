"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { db, ColorVariant } from "@/lib/instant";
import { id } from "@instantdb/react";

interface ProductForm {
  name: string;
  description: string;
  longDescription: string;
  price: string;
  category: "tops" | "headwear" | "accessories" | "digital";
  badge: "" | "Bestseller" | "New";
  image: string;
  colors: ColorVariant[];
  sizes: string[];
  features: string[];
  careInstructions: string[];
  shipping: string;
  isDigitalProduct: boolean;
  published: boolean;
  available: boolean;
}

const defaultForm: ProductForm = {
  name: "",
  description: "",
  longDescription: "",
  price: "",
  category: "tops",
  badge: "",
  image: "",
  colors: [],
  sizes: [],
  features: [],
  careInstructions: [],
  shipping: "5-7 business days",
  isDigitalProduct: false,
  published: false,
  available: true,
};

const commonSizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "One Size"];

export default function NewProduct() {
  const router = useRouter();
  const [form, setForm] = useState<ProductForm>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newFeature, setNewFeature] = useState("");
  const [newCareInstruction, setNewCareInstruction] = useState("");
  const [newColor, setNewColor] = useState({ name: "", hex: "#000000", image: "" });
  const [uploadingColorImage, setUploadingColorImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const { url } = await res.json();
        setForm({ ...form, image: url });
      } else {
        const { error } = await res.json();
        alert(error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    }
    setUploading(false);
  };

  const handleColorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingColorImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const { url } = await res.json();
        setNewColor({ ...newColor, image: url });
      } else {
        const { error } = await res.json();
        alert(error || "Failed to upload image");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image");
    }
    setUploadingColorImage(false);
  };

  const addColor = () => {
    if (!newColor.name || !newColor.image) {
      alert("Please enter a color name and upload an image");
      return;
    }
    setForm({ ...form, colors: [...form.colors, { ...newColor }] });
    setNewColor({ name: "", hex: "#000000", image: "" });
  };

  const removeColor = (index: number) => {
    setForm({ ...form, colors: form.colors.filter((_, i) => i !== index) });
  };

  const toggleSize = (size: string) => {
    if (form.sizes.includes(size)) {
      setForm({ ...form, sizes: form.sizes.filter((s) => s !== size) });
    } else {
      setForm({ ...form, sizes: [...form.sizes, size] });
    }
  };

  const addFeature = () => {
    if (!newFeature.trim()) return;
    setForm({ ...form, features: [...form.features, newFeature.trim()] });
    setNewFeature("");
  };

  const removeFeature = (index: number) => {
    setForm({ ...form, features: form.features.filter((_, i) => i !== index) });
  };

  const addCareInstruction = () => {
    if (!newCareInstruction.trim()) return;
    setForm({ ...form, careInstructions: [...form.careInstructions, newCareInstruction.trim()] });
    setNewCareInstruction("");
  };

  const removeCareInstruction = (index: number) => {
    setForm({ ...form, careInstructions: form.careInstructions.filter((_, i) => i !== index) });
  };

  const saveProduct = async () => {
    if (!form.name || !form.price || !form.image) {
      alert("Please fill in the name, price, and upload an image");
      return;
    }

    setSaving(true);
    try {
      const productId = id();
      const now = Date.now();

      await db.transact([
        db.tx.products[productId].update({
          name: form.name,
          description: form.description,
          longDescription: form.longDescription,
          price: parseFloat(form.price),
          image: form.image,
          category: form.category,
          badge: form.badge || "",
          colors: JSON.stringify(form.colors),
          sizes: JSON.stringify(form.sizes),
          features: JSON.stringify(form.features),
          careInstructions: JSON.stringify(form.careInstructions),
          shipping: form.shipping,
          isDigitalProduct: form.isDigitalProduct,
          published: form.published,
          available: form.available,
          sortOrder: now,
          createdAt: now,
          updatedAt: now,
        }),
      ]);

      router.push("/admin/products");
    } catch (error) {
      console.error("Failed to save product:", error);
      alert("Failed to save product");
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Add Product</h1>
            <p className="text-stone-500 mt-1">Create a new product for your store</p>
          </div>
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            &larr; Back
          </Link>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-stone-200">
            <h2 className="text-lg font-semibold text-stone-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Classic Rope Hat"
                  className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g., Classic rope snapback"
                  className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Long Description
                </label>
                <textarea
                  value={form.longDescription}
                  onChange={(e) => setForm({ ...form, longDescription: e.target.value })}
                  placeholder="Detailed product description..."
                  rows={4}
                  className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stone-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-stone-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      placeholder="0.00"
                      className="w-full border border-stone-200 rounded-lg pl-8 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as ProductForm["category"] })}
                    className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stone-900"
                  >
                    <option value="tops">Tops</option>
                    <option value="headwear">Headwear</option>
                    <option value="accessories">Accessories</option>
                    <option value="digital">Digital</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Badge (optional)
                  </label>
                  <select
                    value={form.badge}
                    onChange={(e) => setForm({ ...form, badge: e.target.value as ProductForm["badge"] })}
                    className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stone-900"
                  >
                    <option value="">None</option>
                    <option value="New">New</option>
                    <option value="Bestseller">Bestseller</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Shipping Info
                  </label>
                  <input
                    type="text"
                    value={form.shipping}
                    onChange={(e) => setForm({ ...form, shipping: e.target.value })}
                    placeholder="e.g., 5-7 business days"
                    className="w-full border border-stone-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stone-900"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="digitalProduct"
                  checked={form.isDigitalProduct}
                  onChange={(e) => setForm({ ...form, isDigitalProduct: e.target.checked })}
                  className="w-4 h-4 rounded border-stone-300"
                />
                <label htmlFor="digitalProduct" className="text-sm text-stone-700">
                  This is a digital product (no shipping required)
                </label>
              </div>
            </div>
          </div>

          {/* Main Image */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-stone-200">
            <h2 className="text-lg font-semibold text-stone-900 mb-4">Main Image *</h2>
            <div className="flex items-start gap-6">
              <div className="w-40 h-40 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                {form.image ? (
                  <Image
                    src={form.image}
                    alt="Product"
                    width={160}
                    height={160}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="block">
                  <span className="sr-only">Choose product image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-stone-900 file:text-white hover:file:bg-stone-800 file:cursor-pointer disabled:opacity-50"
                  />
                </label>
                <p className="text-xs text-stone-500 mt-2">
                  {uploading ? "Uploading..." : "JPEG, PNG, WebP up to 5MB"}
                </p>
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-stone-200">
            <h2 className="text-lg font-semibold text-stone-900 mb-4">Sizes</h2>
            <div className="flex flex-wrap gap-2">
              {commonSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    form.sizes.includes(size)
                      ? "bg-stone-900 text-white border-stone-900"
                      : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Color Variants */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-stone-200">
            <h2 className="text-lg font-semibold text-stone-900 mb-4">Color Variants</h2>

            {/* Existing Colors */}
            {form.colors.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                {form.colors.map((color, index) => (
                  <div key={index} className="relative bg-stone-50 rounded-lg p-3">
                    <button
                      onClick={() => removeColor(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <div className="w-full aspect-square bg-stone-200 rounded-lg overflow-hidden mb-2">
                      <Image
                        src={color.image}
                        alt={color.name}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-stone-300"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-sm font-medium text-stone-700">{color.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Color */}
            <div className="border border-dashed border-stone-300 rounded-lg p-4">
              <h3 className="text-sm font-medium text-stone-700 mb-3">Add Color Variant</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Color Name</label>
                  <input
                    type="text"
                    value={newColor.name}
                    onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                    placeholder="e.g., Navy Blue"
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-500 mb-1">Color Hex</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={newColor.hex}
                      onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
                      className="w-10 h-10 rounded border border-stone-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newColor.hex}
                      onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
                      className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-xs text-stone-500 mb-1">Color Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleColorImageUpload}
                    disabled={uploadingColorImage}
                    className="block w-full text-sm text-stone-500 file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200 file:cursor-pointer disabled:opacity-50"
                  />
                </div>
                {newColor.image && (
                  <div className="w-12 h-12 bg-stone-100 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={newColor.image}
                      alt="Preview"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <button
                  onClick={addColor}
                  disabled={!newColor.name || !newColor.image}
                  className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-stone-200">
            <h2 className="text-lg font-semibold text-stone-900 mb-4">Features</h2>
            {form.features.length > 0 && (
              <ul className="space-y-2 mb-4">
                {form.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 bg-stone-50 rounded-lg px-3 py-2">
                    <span className="flex-1 text-sm text-stone-700">{feature}</span>
                    <button
                      onClick={() => removeFeature(index)}
                      className="text-stone-400 hover:text-red-500"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addFeature()}
                placeholder="e.g., 100% cotton construction"
                className="flex-1 border border-stone-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
              <button
                onClick={addFeature}
                className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-200"
              >
                Add
              </button>
            </div>
          </div>

          {/* Care Instructions */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-stone-200">
            <h2 className="text-lg font-semibold text-stone-900 mb-4">Care Instructions</h2>
            {form.careInstructions.length > 0 && (
              <ul className="space-y-2 mb-4">
                {form.careInstructions.map((instruction, index) => (
                  <li key={index} className="flex items-center gap-2 bg-stone-50 rounded-lg px-3 py-2">
                    <span className="flex-1 text-sm text-stone-700">{instruction}</span>
                    <button
                      onClick={() => removeCareInstruction(index)}
                      className="text-stone-400 hover:text-red-500"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={newCareInstruction}
                onChange={(e) => setNewCareInstruction(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addCareInstruction()}
                placeholder="e.g., Machine wash cold"
                className="flex-1 border border-stone-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
              <button
                onClick={addCareInstruction}
                className="px-4 py-2 bg-stone-100 text-stone-700 rounded-lg text-sm font-medium hover:bg-stone-200"
              >
                Add
              </button>
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-stone-900">Availability</h2>
                <p className="text-sm text-stone-500 mt-1">
                  {form.available
                    ? "Product can be purchased"
                    : "Shows \"Unavailable - Check Back Soon\" on store"}
                </p>
              </div>
              <button
                onClick={() => setForm({ ...form, available: !form.available })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  form.available ? "bg-blue-500" : "bg-amber-500"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    form.available ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Publish Status */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-stone-900">Publish Status</h2>
                <p className="text-sm text-stone-500 mt-1">
                  {form.published
                    ? "Product will be visible on your store"
                    : "Product will be saved as a draft"}
                </p>
              </div>
              <button
                onClick={() => setForm({ ...form, published: !form.published })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  form.published ? "bg-emerald-500" : "bg-stone-200"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    form.published ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href="/admin/products"
              className="px-6 py-2 border border-stone-200 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              Cancel
            </Link>
            <button
              onClick={saveProduct}
              disabled={saving || !form.name || !form.price || !form.image}
              className="px-6 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Product
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
