import { NextRequest, NextResponse } from "next/server";
import { adminDb, tx } from "@/lib/instant-admin";
import { fulfillOrder } from "@/lib/fulfillment";
import { logError } from "@/lib/error-logger";

interface Order {
  id: string;
  items: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
  shippingCost?: number;
  fulfillmentStatus?: string;
}

/**
 * POST /api/admin/manual-fulfill
 * Manually re-trigger fulfillment for orders that were stuck
 *
 * Body: { orderId: string, adminPassword: string }
 */
export async function POST(request: NextRequest) {
  try {
    const { orderId, adminPassword } = await request.json();

    // Basic auth check
    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!orderId) {
      return NextResponse.json({ error: "orderId required" }, { status: 400 });
    }

    // Get the order from database
    const ordersResult = await adminDb.query({ orders: {} });
    const orders = (ordersResult.orders || []) as Order[];
    const order = orders.find((o) => o.id === orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Parse order data
    let items: { name: string; quantity: number; color?: string; size?: string }[] = [];
    let shippingAddress: any = {};

    try {
      items = JSON.parse(order.items);
    } catch (e) {
      return NextResponse.json(
        { error: "Failed to parse order items" },
        { status: 400 }
      );
    }

    try {
      shippingAddress = JSON.parse(order.shippingAddress);
    } catch (e) {
      return NextResponse.json(
        { error: "Failed to parse shipping address" },
        { status: 400 }
      );
    }

    console.log(`[Manual Fulfill] Re-triggering fulfillment for order ${orderId}`);
    console.log(`[Manual Fulfill] Items:`, JSON.stringify(items));

    // Attempt fulfillment
    const fulfillmentResults = await fulfillOrder(
      orderId,
      items,
      order.customerName,
      order.customerEmail,
      shippingAddress,
      (order.shippingCost || 0) > 0 // isExpressShipping
    );

    console.log(`[Manual Fulfill] Results:`, JSON.stringify(fulfillmentResults));

    // Update order with fulfillment status
    const successfulFulfillments = fulfillmentResults.filter((r) => r.success);
    const failedFulfillments = fulfillmentResults.filter((r) => !r.success);

    if (successfulFulfillments.length > 0) {
      await adminDb.transact([
        tx.orders[orderId].update({
          fulfillmentStatus: failedFulfillments.length > 0 ? "partial" : "submitted",
          fulfillmentProviders: JSON.stringify(
            successfulFulfillments.map((r) => ({
              provider: r.provider,
              orderId: r.orderId,
            }))
          ),
        }),
      ]);

      console.log(`[Manual Fulfill] Order ${orderId} fulfillment status updated to submitted`);

      return NextResponse.json({
        success: true,
        orderId,
        message: `Order successfully sent to ${successfulFulfillments.map((r) => r.provider).join(", ")}`,
        results: fulfillmentResults,
      });
    } else {
      // All failed
      const errors = failedFulfillments.map((f) => f.error).join("; ");
      await adminDb.transact([
        tx.orders[orderId].update({
          fulfillmentStatus: "failed",
          fulfillmentError: errors,
        }),
      ]);

      await logError({
        error: new Error(`Manual fulfillment failed: ${errors}`),
        context: "manual-fulfill",
        severity: "high",
        metadata: { orderId, errors: failedFulfillments },
      });

      return NextResponse.json(
        {
          success: false,
          orderId,
          message: "Failed to fulfill order",
          errors: failedFulfillments.map((f) => ({
            provider: f.provider,
            error: f.error,
          })),
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("[Manual Fulfill] Error:", error);

    await logError({
      error,
      context: "manual-fulfill",
      severity: "high",
    });

    return NextResponse.json(
      { error: "Failed to process manual fulfillment" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/manual-fulfill?orderId=xxx&adminPassword=xxx
 * Check if an order can be manually fulfilled (testing endpoint)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get("orderId");
    const adminPassword = searchParams.get("adminPassword");

    if (adminPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!orderId) {
      return NextResponse.json({ error: "orderId required" }, { status: 400 });
    }

    const ordersResult = await adminDb.query({ orders: {} });
    const orders = (ordersResult.orders || []) as Order[];
    const order = orders.find((o) => o.id === orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Parse items to show what will be sent
    let items: any[] = [];
    try {
      items = JSON.parse(order.items);
    } catch (e) {
      return NextResponse.json(
        { error: "Failed to parse order items" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      orderId,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      status: order.fulfillmentStatus || "none",
      items: items,
      readyToFulfill: true,
      message: "Order is ready to be manually fulfilled. POST to this endpoint with adminPassword to trigger.",
    });
  } catch (error) {
    console.error("[Manual Fulfill GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to check order" },
      { status: 500 }
    );
  }
}
