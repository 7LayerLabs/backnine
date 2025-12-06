"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Product, ColorVariant } from "@/data/products";

export type { Product, ColorVariant };

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product, selectedColor?: ColorVariant) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState<ColorVariant | undefined>(
    product.colors?.[0]
  );
  const { addItem } = useCart();

  const currentImage = selectedColor?.image ?? product.image;
  const maxVisibleColors = 5;
  const hasMoreColors = product.colors && product.colors.length > maxVisibleColors;

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: currentImage,
      price: product.price,
      quantity: 1,
      size: "M",
      color: selectedColor?.name,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="group h-full flex flex-col">
      <div className="relative aspect-square overflow-hidden bg-stone-100 mb-4">
        <Image
          src={currentImage}
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
            onClick={() => onQuickView(product, selectedColor)}
            className="bg-white text-stone-900 px-6 py-3 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity hover:bg-stone-100"
          >
            Quick View
          </button>
        </div>
      </div>
      <div className="flex flex-col flex-grow">
        <h3 className="font-medium text-stone-900">{product.name}</h3>
        <p className="text-sm text-stone-500 mt-2">{product.description}</p>

        {/* Color Swatches */}
        <div className="h-8 flex items-center gap-1.5 mt-2">
          {product.colors && product.colors.length > 0 ? (
            <>
              {product.colors.slice(0, maxVisibleColors).map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color)}
                  title={color.name}
                  className={`w-5 h-5 rounded-full border-2 transition-all ${
                    selectedColor?.name === color.name
                      ? "border-stone-900 scale-110"
                      : "border-stone-300 hover:border-stone-500"
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
              {hasMoreColors && (
                <span className="text-xs text-stone-500 ml-1">
                  +{product.colors.length - maxVisibleColors}
                </span>
              )}
            </>
          ) : null}
        </div>

        <div className="mt-auto pt-2">
          <p className="font-semibold text-stone-900 mb-2">${product.price.toFixed(2)}</p>
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
    </div>
  );
}
