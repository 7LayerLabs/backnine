import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { adminDb, tx, id } from "@/lib/instant-admin";

const resend = new Resend(process.env.RESEND_API_KEY);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Retrieve the full session with line items
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items.data.price.product"],
      });

      // Build order items from line items
      const orderItems = fullSession.line_items?.data.map((item) => {
        const product = item.price?.product as Stripe.Product;
        return {
          name: product?.name || item.description || "Unknown Product",
          description: product?.description || "",
          quantity: item.quantity || 1,
          price: (item.amount_total || 0) / 100, // Convert from cents
        };
      }) || [];

      // Get shipping details - use fullSession which has the expanded data
      const shipping = (fullSession as unknown as { shipping_details?: { name?: string; address?: { line1?: string; line2?: string; city?: string; state?: string; postal_code?: string; country?: string } } }).shipping_details;
      const customerEmail = fullSession.customer_details?.email;
      const customerName = fullSession.customer_details?.name;

      // Save order to InstantDB
      const orderId = id();
      await adminDb.transact([
        tx.orders[orderId].update({
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent as string,
          items: JSON.stringify(orderItems),
          total: (session.amount_total || 0) / 100,
          subtotal: (session.amount_subtotal || 0) / 100,
          shippingCost: (session.shipping_cost?.amount_total || 0) / 100,
          status: "paid",
          customerEmail: customerEmail || "",
          customerName: customerName || "",
          shippingAddress: shipping ? JSON.stringify({
            name: shipping.name,
            line1: shipping.address?.line1,
            line2: shipping.address?.line2,
            city: shipping.address?.city,
            state: shipping.address?.state,
            postalCode: shipping.address?.postal_code,
            country: shipping.address?.country,
          }) : "",
          createdAt: Date.now(),
        }),
      ]);

      console.log(`Order ${orderId} saved for session ${session.id}`);

      // Send notification email to you
      const itemsList = orderItems.map(item =>
        `• ${item.quantity}x ${item.name} - $${item.price.toFixed(2)}`
      ).join('\n');

      const shippingText = shipping ?
        `${shipping.name}\n${shipping.address?.line1}${shipping.address?.line2 ? '\n' + shipping.address.line2 : ''}\n${shipping.address?.city}, ${shipping.address?.state} ${shipping.address?.postal_code}`
        : 'No shipping address';

      await resend.emails.send({
        from: "Back Nine Orders <hello@backnineshop.com>",
        to: "hello@backnineshop.com",
        subject: `New Order! $${((session.amount_total || 0) / 100).toFixed(2)} from ${customerName || customerEmail}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"></head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background: #f5f5f4;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px;">
              <h1 style="color: #1e3a5f; margin-top: 0;">New Order Received!</h1>

              <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 24px; font-weight: bold; color: #059669;">$${((session.amount_total || 0) / 100).toFixed(2)}</p>
              </div>

              <h3 style="color: #44403c;">Customer</h3>
              <p>${customerName || 'No name'}<br>${customerEmail}</p>

              <h3 style="color: #44403c;">Ship To</h3>
              <p style="white-space: pre-line;">${shippingText}</p>

              <h3 style="color: #44403c;">Items</h3>
              <pre style="background: #fafaf9; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${itemsList}</pre>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e7e5e4;">
                <a href="https://www.backnineshop.com/admin/orders" style="display: inline-block; background: #1e3a5f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Order</a>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      console.log(`Notification email sent for order ${orderId}`);
    } catch (error) {
      console.error("Error saving order to database:", error);
      // Return 200 anyway to acknowledge receipt - we don't want Stripe to retry
      // Log the error for manual investigation
    }
  }

  return NextResponse.json({ received: true });
}
