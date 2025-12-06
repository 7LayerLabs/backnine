import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { adminDb, tx } from "@/lib/instant-admin";

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export async function POST(request: NextRequest) {
  try {
    const { orderId, trackingNumber, carrier } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    // Get the order from InstantDB
    const result = await adminDb.query({ orders: {} });
    const order = result.orders?.find((o: { id: string }) => o.id === orderId) as {
      id: string;
      customerEmail: string;
      customerName: string;
      items: string;
      total: number;
      shippingAddress: string;
    } | undefined;

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update order status and tracking info
    await adminDb.transact([
      tx.orders[orderId].update({
        status: "shipped",
        trackingNumber: trackingNumber || "",
        carrier: carrier || "",
        shippedAt: Date.now(),
      }),
    ]);

    // Parse order items for email
    let items: OrderItem[] = [];
    try {
      items = JSON.parse(order.items);
    } catch {
      items = [];
    }

    const itemsList = items.map((item: OrderItem) =>
      `• ${item.quantity}x ${item.name}`
    ).join('<br>');

    // Send shipping notification to customer
    if (order.customerEmail) {
      const trackingSection = trackingNumber ? `
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #0369a1;">Tracking Information</h3>
          <p style="margin-bottom: 5px;"><strong>Carrier:</strong> ${carrier || 'USPS'}</p>
          <p style="margin-bottom: 0;"><strong>Tracking Number:</strong> ${trackingNumber}</p>
        </div>
      ` : '';

      await resend.emails.send({
        from: "Back Nine Apparel <hello@backnineshop.com>",
        to: order.customerEmail,
        subject: "Your Back Nine order has shipped!",
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"></head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background: #f5f5f4;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #1e3a5f; margin: 0;">Your Order Has Shipped!</h1>
              </div>

              <p>Hey ${order.customerName || 'there'},</p>

              <p>Great news! Your Back Nine order is on its way. Here's what's heading your way:</p>

              <div style="background: #fafaf9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                ${itemsList}
              </div>

              ${trackingSection}

              <p>Thanks for supporting Back Nine! We hope you love your gear.</p>

              <p style="color: #78716c; font-size: 14px; margin-top: 30px;">
                Questions? Just reply to this email and we'll help you out.
              </p>

              <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e7e5e4;">
                <a href="https://www.backnineshop.com" style="color: #1e3a5f; text-decoration: none;">www.backnineshop.com</a>
              </div>
            </div>
          </body>
          </html>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Ship order error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
