import { NextResponse } from "next/server";
import { adminDb, tx } from "@/lib/instant-admin";
import { products as staticProducts } from "@/data/products";

// Sync colors and other product data from static file to database
export async function POST() {
  try {
    // Get all products from database
    const { products: dbProducts } = await adminDb.query({ products: {} });

    if (!dbProducts || dbProducts.length === 0) {
      return NextResponse.json({
        error: "No products found in database",
      }, { status: 404 });
    }

    const updates: string[] = [];
    const transactions: any[] = [];

    // For each database product, find matching static product and update colors
    for (const dbProduct of dbProducts as any[]) {
      // Match by name (most reliable since IDs might differ)
      const staticProduct = staticProducts.find(
        p => p.name.toLowerCase() === dbProduct.name?.toLowerCase()
      );

      if (staticProduct) {
        const staticColors = JSON.stringify(staticProduct.colors || []);
        const dbColors = dbProduct.colors || "[]";

        // Check if colors need updating
        if (staticColors !== dbColors) {
          transactions.push(
            tx.products[dbProduct.id].update({
              colors: staticColors,
              updatedAt: Date.now(),
            })
          );
          updates.push(`${dbProduct.name}: ${JSON.parse(dbColors).length || 0} → ${(staticProduct.colors || []).length} colors`);
        }
      }
    }

    if (transactions.length > 0) {
      await adminDb.transact(transactions);
    }

    return NextResponse.json({
      message: `Synced ${transactions.length} products`,
      updates,
    });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: "Failed to sync products", details: String(error) },
      { status: 500 }
    );
  }
}

// GET to preview what would be synced
export async function GET() {
  try {
    const { products: dbProducts } = await adminDb.query({ products: {} });

    if (!dbProducts || dbProducts.length === 0) {
      return NextResponse.json({ products: [], message: "No products in database" });
    }

    const comparison = [];

    for (const dbProduct of dbProducts as any[]) {
      const staticProduct = staticProducts.find(
        p => p.name.toLowerCase() === dbProduct.name?.toLowerCase()
      );

      if (staticProduct) {
        const staticColorCount = (staticProduct.colors || []).length;
        const dbColors = dbProduct.colors ? JSON.parse(dbProduct.colors) : [];
        const dbColorCount = dbColors.length;

        comparison.push({
          name: dbProduct.name,
          dbColors: dbColorCount,
          staticColors: staticColorCount,
          needsUpdate: staticColorCount !== dbColorCount,
          dbColorNames: dbColors.map((c: any) => c.name),
          staticColorNames: (staticProduct.colors || []).map(c => c.name),
        });
      }
    }

    return NextResponse.json({
      comparison,
      productsNeedingUpdate: comparison.filter(c => c.needsUpdate).length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to compare products", details: String(error) },
      { status: 500 }
    );
  }
}
