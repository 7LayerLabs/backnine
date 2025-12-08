import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { logError } from "@/lib/error-logger";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export async function POST(request: NextRequest) {
  try {
    const { roastMessage } = await request.json();

    if (!roastMessage || roastMessage.trim().length < 10) {
      return NextResponse.json(
        { error: "Roast message is required" },
        { status: 400 }
      );
    }

    // Create Stripe checkout session for Rocky Roast
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Rocky Roast",
              description: "Send Rocky a brutal roast about his golf game",
              images: [`${process.env.NEXT_PUBLIC_BASE_URL || "https://www.backnineshop.com"}/sellable items/rocky-roast.svg`],
            },
            unit_amount: 100, // $1.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${request.headers.get("origin")}/rocky-roast/success`,
      cancel_url: `${request.headers.get("origin")}/rocky-roast`,
      // Store the roast message in metadata
      metadata: {
        roastMessage: roastMessage.substring(0, 500), // Stripe metadata limit
        roastMessagePart2: roastMessage.length > 500 ? roastMessage.substring(500, 1000) : "",
        roastMessagePart3: roastMessage.length > 1000 ? roastMessage.substring(1000, 1500) : "",
        roastMessagePart4: roastMessage.length > 1500 ? roastMessage.substring(1500, 2000) : "",
        isRockyRoast: "true",
      },
      // No shipping for digital product
      billing_address_collection: "auto",
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    await logError({
      error,
      context: "rocky-roast-checkout",
      severity: "high",
      metadata: { stage: "create-session" },
    });
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
