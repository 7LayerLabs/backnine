"use client";

import { createContext, useContext, ReactNode } from "react";
import { db } from "@/lib/instant";
import { tx, id } from "@instantdb/react";

interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  size: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  // Query cart items from InstantDB
  const { isLoading, error, data } = db.useQuery({ cartItems: {} });

  const items = (data?.cartItems ?? []) as CartItem[];

  const addItem = (item: Omit<CartItem, "id">) => {
    // Check if item already exists with same productId and size
    const existingItem = items.find(
      (i) => i.productId === item.productId && i.size === item.size
    );

    if (existingItem) {
      // Update quantity
      db.transact(
        tx.cartItems[existingItem.id].update({
          quantity: existingItem.quantity + item.quantity,
        })
      );
    } else {
      // Add new item
      db.transact(tx.cartItems[id()].update(item));
    }
  };

  const removeItem = (itemId: string) => {
    db.transact(tx.cartItems[itemId].delete());
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
    } else {
      db.transact(tx.cartItems[itemId].update({ quantity }));
    }
  };

  const clearCart = () => {
    items.forEach((item) => {
      db.transact(tx.cartItems[item.id].delete());
    });
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
