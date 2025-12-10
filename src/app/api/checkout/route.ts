import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { logError } from "@/lib/error-logger";
import { products as staticProducts } from "@/data/products";
import { adminDb } from "@/lib/instant-admin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  size: string;
  color?: string;
  roastMessage?: string;
}

interface DbProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  isDigitalProduct?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { items, customerEmail } = (await request.json()) as {
      items: CartItem[];
      customerEmail?: string;
    };

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items in cart" },
        { status: 400 }
      );
    }

    // Fetch products from database
    let dbProducts: DbProduct[] = [];
    try {
      const dbData = await adminDb.query({ products: {} });
      dbProducts = (dbData?.products || []) as DbProduct[];
    } catch (dbError) {
      console.error("Database query failed, using static products only:", dbError);
    }

    // Create line items for Stripe with trustworthy prices
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

    // Collect metadata for Rocky Roast if present
    const sessionMetadata: Record<string, string> = {};

    for (const item of items) {
      // 1. Find the real product - check database first, then static file
      let product: { id: string; name: string; price: number; image: string; isDigitalProduct?: boolean } | undefined;

      // Check database products first
      const dbProduct = dbProducts.find((p) => p.id === item.productId);
      if (dbProduct) {
        product = {
          id: dbProduct.id,
          name: dbProduct.name,
          price: dbProduct.price,
          image: dbProduct.image,
          isDigitalProduct: dbProduct.isDigitalProduct,
        };
      } else {
        // Fall back to static products
        const staticProduct = staticProducts.find((p) => p.id === item.productId);
        if (staticProduct) {
          product = {
            id: staticProduct.id,
            name: staticProduct.name,
            price: staticProduct.price,
            image: staticProduct.image,
            isDigitalProduct: staticProduct.id === "rocky-roast",
          };
        }
      }

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

      // Build image URL - Stripe requires publicly accessible URLs
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://www.backnineshop.com";
      let imageUrl: string | undefined;

      if (product.image.startsWith("http")) {
        imageUrl = product.image;
      } else {
        // Encode the path to handle spaces and special characters
        const encodedPath = product.image.split('/').map(segment => encodeURIComponent(segment)).join('/');
        imageUrl = `${baseUrl}${encodedPath}`;
      }

      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: `Size: ${item.size}${item.color ? ` | Color: ${item.color}` : ""}`,
            // Only include images if we have a valid production URL (Stripe can't access localhost)
            ...(baseUrl.includes("localhost") ? {} : { images: [imageUrl] }),
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
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      allow_promotion_codes: true,
      customer_email: customerEmail,
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
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Checkout error details:", errorMessage);

    await logError({
      error,
      context: "checkout",
      severity: "high",
      metadata: {
        stage: "create-session",
        errorMessage,
        stripeError: error instanceof Error && 'type' in error ? (error as unknown as { type: string }).type : undefined,
      },
    });
    return NextResponse.json(
      { error: "Failed to create checkout session", details: errorMessage },
      { status: 500 }
    );
  }
}
