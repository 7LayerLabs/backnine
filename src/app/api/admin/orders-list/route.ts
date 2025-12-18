import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/instant-admin";

interface Order {
  id: string;
  status: string;
  fulfillmentStatus?: string;
  items: string;
  total: number;
  customerName?: string;
  customerEmail: string;
  shippingAddress?: string;
  createdAt: number;
}

export async function GET(request: NextRequest) {
  try {
    // Get admin password from query params for auth
    const searchParams = request.nextUrl.searchParams;
    const adminPassword = searchParams.get("adminPassword");

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all orders
    const ordersResult = await adminDb.query({ orders: {} });
    const orders = (ordersResult.orders || []) as Order[];

    // Sort by creation date (newest first)
    const sortedOrders = orders.sort((a, b) => b.createdAt - a.createdAt);

    // Format for easy reading
    const formattedOrders = sortedOrders.map((order) => {
      let items: any[] = [];
      try {
        items = JSON.parse(order.items);
      } catch (e) {
        items = [{ name: "[Parse Error]", quantity: 0 }];
      }

      let shippingInfo: any = {};
      try {
        if (order.shippingAddress) {
          shippingInfo = JSON.parse(order.shippingAddress);
        }
      } catch (e) {
        shippingInfo = { error: "Parse error" };
      }

      return {
        orderNumber: order.id.slice(-8).toUpperCase(),
        fullId: order.id,
        customer: order.customerName || "Unknown",
        email: order.customerEmail,
        status: order.status,
        fulfillmentStatus: order.fulfillmentStatus || "none",
        total: `$${order.total.toFixed(2)}`,
        items: items.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          color: i.color || null,
          size: i.size || null,
        })),
        shippingCity: shippingInfo.city || null,
        shippingState: shippingInfo.state || null,
        createdAt: new Date(order.createdAt).toLocaleString(),
      };
    });

    // Find orders with "paid" status that haven't been fulfilled
    const stuckOrders = formattedOrders.filter(
      (o) => o.status === "paid" && (o.fulfillmentStatus === "none" || o.fulfillmentStatus === "failed")
    );

    return NextResponse.json({
      totalOrders: formattedOrders.length,
      stuckOrders: stuckOrders.length,
      stuck: stuckOrders,
      allOrders: formattedOrders,
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
