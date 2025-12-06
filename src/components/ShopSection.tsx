"use client";

import { useState } from "react";
import ProductCard from "./ProductCard";
import QuickViewModal from "./QuickViewModal";
import { products, Product, ColorVariant } from "@/data/products";
import { useShopFilter, Category } from "@/context/ShopFilterContext";

export default function ShopSection() {
  const { activeCategory, subFilter, setFilter } = useShopFilter();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorVariant | undefined>(undefined);

  // Filter products by category and sub-filter
  const filteredProducts = products.filter((p) => {
    // First filter by category
    if (activeCategory !== "all" && p.category !== activeCategory) {
      return false;
    }

    // Then apply sub-filter if set
    if (subFilter === "polos") {
      return p.id === "polo";
    }
    if (subFilter === "hoodies") {
      return p.id === "classic-hoodie" || p.id === "par-tee-hoodie" || p.id === "crewneck-sweatshirt";
    }

    return true;
  });

  // Categories in order: All, Headwear, Tops, Accessories
  const categories: { value: Category; label: string }[] = [
    { value: "all", label: "All" },
    { value: "headwear", label: "Headwear" },
    { value: "tops", label: "Tops" },
    { value: "accessories", label: "Accessories" },
  ];

  const handleQuickView = (product: Product, color?: ColorVariant) => {
    setSelectedProduct(product);
    setSelectedColor(color);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setSelectedColor(undefined);
  };

  return (
    <section id="shop" className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-sm tracking-[0.3em] text-stone-500 uppercase font-montserrat">
            The Lineup
          </span>
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold tracking-wide text-stone-900 mt-2 uppercase">
            Gear Up
          </h2>
          <p className="text-stone-600 mt-4 max-w-xl mx-auto">
            Clean fits that work on the course and after. No country club vibes - just good gear.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value, null)}
              className={`px-6 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat.value && !subFilter
                  ? "bg-stone-900 text-white"
                  : "bg-white text-stone-700 hover:bg-stone-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={handleQuickView}
            />
          ))}
        </div>
      </div>

      {selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          initialColor={selectedColor}
          onClose={handleCloseModal}
        />
      )}
    </section>
  );
}
