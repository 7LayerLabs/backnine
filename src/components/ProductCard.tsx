"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "tops" | "headwear" | "accessories";
  badge?: "Bestseller" | "New";
}

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      price: product.price,
      quantity: 1,
      size: "M", // Default size
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="group">
      <div className="relative aspect-square overflow-hidden bg-stone-100 mb-4">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span
            className={`absolute top-3 left-3 px-3 py-1 text-xs font-medium ${
              product.badge === "New"
                ? "bg-emerald-600 text-white"
                : "bg-stone-900 text-white"
            }`}
          >
            {product.badge}
          </span>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <button
            onClick={() => onQuickView(product)}
            className="bg-white text-stone-900 px-6 py-3 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity hover:bg-stone-100"
          >
            Quick View
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-medium text-stone-900">{product.name}</h3>
        <p className="text-sm text-stone-500">{product.description}</p>
        <p className="font-semibold text-stone-900">${product.price.toFixed(2)}</p>
        <button
          onClick={handleAddToCart}
          className={`w-full py-3 text-sm font-medium transition-colors ${
            isAdded
              ? "bg-emerald-600 text-white"
              : "bg-stone-900 text-white hover:bg-stone-800"
          }`}
        >
          {isAdded ? "Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
