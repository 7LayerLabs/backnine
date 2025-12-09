"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Product, ColorVariant } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface QuickViewModalProps {
  product: Product;
  initialColor?: ColorVariant;
  onClose: () => void;
}

const defaultSizes = ["S", "M", "L", "XL", "XXL"];

export default function QuickViewModal({
  product,
  initialColor,
  onClose
}: QuickViewModalProps) {
  const availableSizes = product.sizes || defaultSizes;
  const [selectedSize, setSelectedSize] = useState(availableSizes[Math.floor(availableSizes.length / 2)] || "M");
  const [selectedColor, setSelectedColor] = useState<ColorVariant | undefined>(
    initialColor ?? product.colors?.[0]
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "features" | "care">("details");
  const { addItem } = useCart();

  const currentImage = selectedColor?.image ?? product.image;

  // Check if product is available for purchase
  const isUnavailable = product.available === false;

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
    if (isUnavailable) return;
    addItem({
      productId: product.id,
      productName: product.name,
      productImage: currentImage,
      price: product.price,
      quantity: quantity,
      size: selectedSize,
      color: selectedColor?.name,
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
        className="bg-white max-w-4xl w-full max-h-[90vh] overflow-y-auto relative mx-2 sm:mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 text-2xl sm:text-3xl text-stone-400 hover:text-stone-600 bg-white/80 rounded-full w-8 h-8 sm:w-auto sm:h-auto flex items-center justify-center"
        >
          &times;
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative aspect-square bg-stone-100">
            <Image
              src={currentImage}
              alt={product.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-5 sm:p-8 flex flex-col">
            {/* Unavailable Notice */}
            {isUnavailable && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 mb-4">
                <p className="text-sm font-medium text-amber-800">Unavailable - Check Back Soon</p>
                <p className="text-xs text-amber-600 mt-1">This item is temporarily out of stock.</p>
              </div>
            )}
            <h2 className="text-2xl font-semibold text-stone-900 mb-2">
              {product.name}
            </h2>
            <p className="text-stone-500 mb-4">{product.description}</p>
            <p className="text-2xl font-semibold text-stone-900 mb-6">
              ${product.price.toFixed(2)}
            </p>

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-stone-700 mb-2">
                  Color: {selectedColor?.name}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      title={color.name}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor?.name === color.name
                          ? "border-stone-900 scale-110 ring-2 ring-stone-900 ring-offset-2"
                          : "border-stone-300 hover:border-stone-500"
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Size
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium transition-colors ${
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

            {isUnavailable ? (
              <button
                disabled
                className="w-full py-4 text-sm font-medium bg-stone-300 text-stone-500 cursor-not-allowed"
              >
                Unavailable
              </button>
            ) : (
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
            )}

            {/* Detailed Product Information */}
            <div className="mt-6 pt-6 border-t border-stone-200">
              {/* Long Description */}
              {product.longDescription && (
                <p className="text-sm text-stone-600 mb-4 leading-relaxed">
                  {product.longDescription}
                </p>
              )}

              {/* Tabs for Features/Care/Shipping */}
              {(product.features || product.careInstructions || product.shipping) && (
                <div>
                  <div className="flex gap-1 border-b border-stone-200 mb-4">
                    {product.features && product.features.length > 0 && (
                      <button
                        onClick={() => setActiveTab("details")}
                        className={`px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                          activeTab === "details"
                            ? "border-b-2 border-stone-900 text-stone-900"
                            : "text-stone-500 hover:text-stone-700"
                        }`}
                      >
                        Features
                      </button>
                    )}
                    {product.careInstructions && product.careInstructions.length > 0 && (
                      <button
                        onClick={() => setActiveTab("care")}
                        className={`px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                          activeTab === "care"
                            ? "border-b-2 border-stone-900 text-stone-900"
                            : "text-stone-500 hover:text-stone-700"
                        }`}
                      >
                        Care
                      </button>
                    )}
                  </div>

                  {/* Tab Content */}
                  <div className="min-h-[80px]">
                    {activeTab === "details" && product.features && (
                      <ul className="text-sm text-stone-600 space-y-1.5">
                        {product.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-600 mt-0.5">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {activeTab === "care" && product.careInstructions && (
                      <ul className="text-sm text-stone-600 space-y-1.5">
                        {product.careInstructions.map((instruction, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-stone-400">•</span>
                            <span>{instruction}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Shipping Info */}
                  {product.shipping && (
                    <div className="mt-4 pt-4 border-t border-stone-100">
                      <p className="text-xs text-stone-500 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                        {product.shipping}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Fallback if no detailed info */}
              {!product.longDescription && !product.features && !product.careInstructions && (
                <div>
                  <h4 className="font-medium text-stone-900 mb-3">Product Details</h4>
                  <ul className="text-sm text-stone-600 space-y-2">
                    <li>Premium quality materials</li>
                    <li>Comfortable fit</li>
                    <li>Machine washable</li>
                    <li>Back Nine Apparel branding</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
