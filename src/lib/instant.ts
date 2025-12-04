import { init } from "@instantdb/react";

// Define your schema types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "tops" | "headwear" | "accessories";
  badge?: "Bestseller" | "New";
  inStock: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  size: string;
}

export interface Order {
  id: string;
  items: string; // JSON stringified cart items
  total: number;
  status: "pending" | "paid" | "shipped" | "delivered";
  createdAt: number;
}

export interface Subscriber {
  id: string;
  email: string;
  discountCode: string;
  subscribedAt: number;
  hasUsedDiscount: boolean;
}

// InstantDB schema
const schema = {
  products: {
    name: "string",
    description: "string",
    price: "number",
    image: "string",
    category: "string",
    badge: "string",
    inStock: "boolean",
  },
  cartItems: {
    productId: "string",
    quantity: "number",
    size: "string",
  },
  orders: {
    items: "string",
    total: "number",
    status: "string",
    createdAt: "number",
  },
  subscribers: {
    email: "string",
    discountCode: "string",
    subscribedAt: "number",
    hasUsedDiscount: "boolean",
  },
} as const;

// Initialize InstantDB
const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID!;

export const db = init({ appId: APP_ID });
