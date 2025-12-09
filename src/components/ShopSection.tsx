"use client";

import { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import QuickViewModal from "./QuickViewModal";
import { products as staticProducts, Product, ColorVariant } from "@/data/products";
import { db, Product as DbProduct } from "@/lib/instant";
import { useShopFilter, Category } from "@/context/ShopFilterContext";

// Convert database product to display product format
function convertDbProduct(dbProduct: DbProduct): Product {
  return {
    id: dbProduct.id,
    name: dbProduct.name,
    description: dbProduct.description,
    longDescription: dbProduct.longDescription,
    price: dbProduct.price,
    image: dbProduct.image,
    category: dbProduct.category,
    badge: dbProduct.badge as Product["badge"],
    colors: dbProduct.colors ? JSON.parse(dbProduct.colors) : undefined,
    sizes: dbProduct.sizes ? JSON.parse(dbProduct.sizes) : undefined,
    features: dbProduct.features ? JSON.parse(dbProduct.features) : undefined,
    careInstructions: dbProduct.careInstructions ? JSON.parse(dbProduct.careInstructions) : undefined,
    shipping: dbProduct.shipping,
  };
}

export default function ShopSection() {
  const { activeCategory, subFilter, setFilter } = useShopFilter();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<ColorVariant | undefined>(undefined);

  // Fetch products from database
  const { data: dbData, isLoading } = db.useQuery({ products: {} });

  // Use database products if available and published, otherwise fall back to static
  const products = useMemo(() => {
    const dbProducts = (dbData?.products || []) as DbProduct[];
    const publishedDbProducts = dbProducts.filter(p => p.published);

    if (publishedDbProducts.length > 0) {
      // Sort by sortOrder and convert to display format
      return publishedDbProducts
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
        .map(convertDbProduct);
    }

    // Fall back to static products if database is empty
    return staticProducts;
  }, [dbData]);

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
    <section id="shop" className="py-12 sm:py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-xs sm:text-sm tracking-[0.3em] text-stone-500 uppercase font-montserrat">
            The Lineup
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-montserrat font-bold tracking-wide text-stone-900 mt-2 uppercase">
            Gear Up
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-3 sm:mt-4 max-w-xl mx-auto px-4">
            Clean fits that work on the course and after. No country club vibes - just good gear.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value, null)}
              className={`px-4 sm:px-6 py-2 text-xs sm:text-sm font-medium transition-colors ${
                activeCategory === cat.value && !subFilter
                  ? "bg-stone-900 text-white"
                  : "bg-white text-stone-700 hover:bg-stone-100"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
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
