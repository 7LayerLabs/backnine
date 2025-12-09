import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { logError } from "@/lib/error-logger";
import { products } from "@/data/products";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover", // Ensure this matches your Stripe dashboard version or keep as is
});

interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  size: string;
  color?: string;
  // Metadata for Rocky Roast or other custom items
  roastMessage?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { items } = (await request.json()) as { items: CartItem[] };

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items in cart" },
        { status: 400 }
      );
    }

    // Create line items for Stripe with trustworthy prices
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    // Collect metadata for Rocky Roast if present
    const sessionMetadata: Record<string, string> = {};

    for (const item of items) {
      // 1. Find the real product
      const product = products.find((p) => p.id === item.productId);

      if (!product) {
        console.error(`Attempt to purchase invalid product: ${item.productId}`);
        continue;
      }

      // 2. Use the REAL price from the database/file
      const realPrice = product.price;

      // 3. Verify price integrity (Optional logging)
      if (Math.abs(item.price - realPrice) > 0.01) {
        console.warn(`Price mismatch for ${product.name}. Client: ${item.price}, Server: ${realPrice}. Using Server price.`);
      }

      // Handle Rocky Roast Metadata logic
      if (product.id === 'rocky-roast' && item.roastMessage) {
        sessionMetadata.isRockyRoast = 'true';
        // Split message if needed to fit metadata limits (500 chars per key)
        const chunks = item.roastMessage.match(/.{1,500}/g) || [];
        if (chunks[0]) sessionMetadata.roastMessage = chunks[0];
        if (chunks[1]) sessionMetadata.roastMessagePart2 = chunks[1];
        if (chunks[2]) sessionMetadata.roastMessagePart3 = chunks[2];
        if (chunks[3]) sessionMetadata.roastMessagePart4 = chunks[3];
      }

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: `Size: ${item.size}${item.color ? ` | Color: ${item.color}` : ""}`,
            images: [
              product.image.startsWith("http")
                ? product.image
                : `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3002"}${product.image}`
            ],
            metadata: {
              productId: product.id,
              size: item.size,
              color: item.color || ""
            }
          },
          unit_amount: Math.round(realPrice * 100),
        },
        quantity: item.quantity,
      });
    }

    if (lineItems.length === 0) {
      return NextResponse.json(
        { error: "No valid items found from server records" },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "klarna"],
      line_items: lineItems,
      mode: "payment",
      allow_promotion_codes: true,
      success_url: `${request.headers.get("origin")}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.headers.get("origin")}/checkout/cancel`,
      shipping_address_collection: {
        allowed_countries: ["US", "CA"],
      },
      metadata: sessionMetadata,
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "usd",
            },
            display_name: "Free Shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 999,
              currency: "usd",
            },
            display_name: "Express Shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 2,
              },
              maximum: {
                unit: "business_day",
                value: 3,
              },
            },
          },
        },
      ],
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    await logError({
      error,
      context: "checkout",
      severity: "high",
      metadata: { stage: "create-session" },
    });
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
