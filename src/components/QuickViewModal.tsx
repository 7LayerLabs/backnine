"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Product } from "./ProductCard";
import { useCart } from "@/context/CartContext";

interface QuickViewModalProps {
  product: Product;
  onClose: () => void;
}

const sizes = ["S", "M", "L", "XL", "XXL"];

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      price: product.price,
      quantity: quantity,
      size: selectedSize,
    });
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-3xl text-stone-400 hover:text-stone-600"
        >
          &times;
        </button>
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-square bg-stone-100">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-8 flex flex-col">
            <h2 className="text-2xl font-semibold text-stone-900 mb-2">
              {product.name}
            </h2>
            <p className="text-stone-500 mb-4">{product.description}</p>
            <p className="text-2xl font-semibold text-stone-900 mb-6">
              ${product.price.toFixed(2)}
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Size
              </label>
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? "bg-stone-900 text-white"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors text-xl"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors text-xl"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full py-4 text-sm font-medium transition-colors ${
                isAdded
                  ? "bg-emerald-600 text-white"
                  : "bg-stone-900 text-white hover:bg-stone-800"
              }`}
            >
              {isAdded ? "Added to Cart!" : "Add to Cart"}
            </button>

            <div className="mt-8 pt-6 border-t border-stone-200">
              <h4 className="font-medium text-stone-900 mb-3">Product Details</h4>
              <ul className="text-sm text-stone-600 space-y-2">
                <li>Premium quality materials</li>
                <li>Comfortable fit</li>
                <li>Machine washable</li>
                <li>Back Nine Apparel branding</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
