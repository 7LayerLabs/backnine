"use client";

import { useState } from "react";
import ProductCard, { Product } from "./ProductCard";
import QuickViewModal from "./QuickViewModal";

const products: Product[] = [
  {
    id: "1",
    name: "Classic Crewneck",
    description: "Premium cotton blend sweatshirt",
    price: 65.0,
    image: "/apparel/b9_sweatshirt.jpeg",
    category: "tops",
  },
  {
    id: "2",
    name: "Classic Hoodie",
    description: "Comfortable pullover hoodie",
    price: 75.0,
    image: "/apparel/marketing/b9mkt6.png",
    category: "tops",
    badge: "Bestseller",
  },
  {
    id: "3",
    name: "Par-Tee Time Hoodie",
    description: "Light blue pullover hoodie",
    price: 75.0,
    image: "/apparel/marketing/b9_mkt2.png",
    category: "tops",
    badge: "New",
  },
  {
    id: "4",
    name: "Classic Tee",
    description: "Soft cotton comfort colors tee",
    price: 35.0,
    image: "/apparel/b9_tshirt.jpeg",
    category: "tops",
  },
  {
    id: "5",
    name: "Navy Rope Hat",
    description: "Classic rope snapback",
    price: 38.0,
    image: "/apparel/b9_cap3.jpeg",
    category: "headwear",
  },
  {
    id: "6",
    name: "Black Rope Hat - Teal",
    description: "Classic rope snapback",
    price: 38.0,
    image: "/apparel/b9_cap5.jpeg",
    category: "headwear",
    badge: "Bestseller",
  },
  {
    id: "7",
    name: "White Rope Hat - Green",
    description: "Classic rope snapback",
    price: 38.0,
    image: "/apparel/b9_cap1.jpeg",
    category: "headwear",
  },
  {
    id: "8",
    name: "White Rope Hat - Blue",
    description: "Classic rope snapback",
    price: 38.0,
    image: "/apparel/b9_cap2.jpeg",
    category: "headwear",
  },
  {
    id: "9",
    name: "Navy Rope Hat - Sunset",
    description: "Classic rope snapback",
    price: 38.0,
    image: "/apparel/b9_cap4.jpeg",
    category: "headwear",
  },
  {
    id: "10",
    name: "Black Rope Hat - Gold",
    description: "Classic rope snapback",
    price: 38.0,
    image: "/apparel/b9_cap6.jpeg",
    category: "headwear",
  },
  {
    id: "11",
    name: "Black Pom Beanie",
    description: "Warm knit beanie with pom",
    price: 32.0,
    image: "/apparel/b9_wintercap.jpeg",
    category: "headwear",
    badge: "New",
  },
  {
    id: "12",
    name: "Golf Towel",
    description: "Microfiber waffle towel with clip",
    price: 24.0,
    image: "/apparel/b9_golftowel.jpeg",
    category: "accessories",
  },
];

type Category = "all" | "tops" | "headwear" | "accessories";

export default function ShopSection() {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const categories: { value: Category; label: string }[] = [
    { value: "all", label: "All" },
    { value: "tops", label: "Tops" },
    { value: "headwear", label: "Headwear" },
    { value: "accessories", label: "Accessories" },
  ];

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
            Clean fits that work on the course and after. No country club vibes — just good gear.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-6 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat.value
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
              onQuickView={setSelectedProduct}
            />
          ))}
        </div>
      </div>

      {selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
