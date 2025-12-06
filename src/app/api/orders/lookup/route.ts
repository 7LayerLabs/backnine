import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/instant-admin";

interface Order {
  id: string;
  customerEmail: string;
  customerName?: string;
  items: string;
  total: number;
  subtotal?: number;
  shippingCost?: number;
  status: string;
  shippingAddress?: string;
  trackingNumber?: string;
  carrier?: string;
  createdAt: number;
  shippedAt?: number;
}

export async function POST(request: NextRequest) {
  try {
    const { email, orderNumber } = await request.json();

    if (!email || !orderNumber) {
      return NextResponse.json(
        { error: "Email and order number are required" },
        { status: 400 }
      );
    }

    // Normalize inputs
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedOrderNumber = orderNumber.toUpperCase().trim();

    // Get all orders and find matching one
    const result = await adminDb.query({ orders: {} });
    const orders = (result.orders || []) as Order[];

    // Find order where last 8 chars of ID match the order number AND email matches
    const order = orders.find((o) => {
      const orderIdSuffix = o.id.slice(-8).toUpperCase();
      const emailMatch = o.customerEmail?.toLowerCase() === normalizedEmail;
      return orderIdSuffix === normalizedOrderNumber && emailMatch;
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found. Please check your email and order number." },
        { status: 404 }
      );
    }

    // Parse items
    let items = [];
    try {
      items = JSON.parse(order.items);
    } catch {
      items = [];
    }

    // Parse shipping address
    let shippingAddress = null;
    try {
      if (order.shippingAddress) {
        shippingAddress = JSON.parse(order.shippingAddress);
      }
    } catch {
      shippingAddress = null;
    }

    // Return sanitized order data (no internal IDs)
    return NextResponse.json({
      order: {
        orderNumber: normalizedOrderNumber,
        status: order.status,
        customerName: order.customerName,
        items,
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
        total: order.total,
        shippingAddress,
        trackingNumber: order.trackingNumber,
        carrier: order.carrier,
        createdAt: order.createdAt,
        shippedAt: order.shippedAt,
      },
    });
  } catch (error) {
    console.error("Order lookup error:", error);
    return NextResponse.json(
      { error: "Failed to look up order" },
      { status: 500 }
    );
  }
}
