"use client";

import { CartProvider } from "@/context/CartContext";
import { ShopFilterProvider } from "@/context/ShopFilterContext";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <ShopFilterProvider>{children}</ShopFilterProvider>
    </CartProvider>
  );
}
