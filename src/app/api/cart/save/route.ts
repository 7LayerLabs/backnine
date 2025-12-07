import { NextRequest, NextResponse } from "next/server";
import { adminDb, tx, id } from "@/lib/instant-admin";

interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  size: string;
  color?: string;
}

interface AbandonedCart {
  id: string;
  email: string;
  items: string;
  total: number;
  recoveryToken: string;
  recovered: boolean;
  emailsSent: number;
  lastEmailSent: number | null;
  createdAt: number;
}

// POST - Save cart with email for potential recovery
export async function POST(request: NextRequest) {
  try {
    const { email, items } = await request.json();

    if (!email || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Email and cart items are required" },
        { status: 400 }
      );
    }

    // Calculate total
    const total = items.reduce(
      (sum: number, item: CartItem) => sum + item.price * item.quantity,
      0
    );

    // Generate a unique recovery token
    const recoveryToken = id().slice(-12);

    // Check if there's already an unrecovered cart for this email
    const result = await adminDb.query({ abandonedCarts: {} });
    const carts = (result.abandonedCarts || []) as AbandonedCart[];

    const existingCart = carts.find(
      (cart) => cart.email.toLowerCase() === email.toLowerCase() && !cart.recovered
    );

    if (existingCart) {
      // Update existing cart
      await adminDb.transact([
        tx.abandonedCarts[existingCart.id].update({
          items: JSON.stringify(items),
          total,
          recoveryToken,
          createdAt: Date.now(),
        }),
      ]);

      return NextResponse.json({
        success: true,
        cartId: existingCart.id,
        recoveryToken,
        action: "updated",
      });
    }

    // Create new abandoned cart entry
    const cartId = id();
    await adminDb.transact([
      tx.abandonedCarts[cartId].update({
        email: email.toLowerCase(),
        items: JSON.stringify(items),
        total,
        recoveryToken,
        recovered: false,
        emailsSent: 0,
        lastEmailSent: null,
        createdAt: Date.now(),
      }),
    ]);

    return NextResponse.json({
      success: true,
      cartId,
      recoveryToken,
      action: "created",
    });
  } catch (error) {
    console.error("Failed to save cart:", error);
    return NextResponse.json(
      { error: "Failed to save cart" },
      { status: 500 }
    );
  }
}

// GET - Retrieve cart by recovery token
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Recovery token is required" },
        { status: 400 }
      );
    }

    const result = await adminDb.query({ abandonedCarts: {} });
    const carts = (result.abandonedCarts || []) as AbandonedCart[];

    const cart = carts.find((c) => c.recoveryToken === token);

    if (!cart) {
      return NextResponse.json(
        { error: "Cart not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      email: cart.email,
      items: JSON.parse(cart.items),
      total: cart.total,
      recovered: cart.recovered,
    });
  } catch (error) {
    console.error("Failed to retrieve cart:", error);
    return NextResponse.json(
      { error: "Failed to retrieve cart" },
      { status: 500 }
    );
  }
}
