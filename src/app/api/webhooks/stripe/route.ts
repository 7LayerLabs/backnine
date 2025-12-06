import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { adminDb, tx, id } from "@/lib/instant-admin";

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
    } catch (error) {
      console.error("Error saving order to database:", error);
      // Return 200 anyway to acknowledge receipt - we don't want Stripe to retry
      // Log the error for manual investigation
    }
  }

  return NextResponse.json({ received: true });
}
