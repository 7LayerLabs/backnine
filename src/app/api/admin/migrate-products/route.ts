import { NextResponse } from "next/server";
import { adminDb, tx, id } from "@/lib/instant-admin";
import { products as staticProducts } from "@/data/products";

export async function POST() {
  try {
    // Check if products already exist in database
    const existing = await adminDb.query({ products: {} });
    if (existing.products && existing.products.length > 0) {
      return NextResponse.json({
        message: `Migration skipped - ${existing.products.length} products already exist in database`,
        count: existing.products.length,
      });
    }

    // Migrate each product from static file to database
    const transactions = staticProducts.map((product, index) => {
      const productId = id();
      const now = Date.now();

      return tx.products[productId].update({
        name: product.name,
        description: product.description,
        longDescription: product.longDescription || "",
        price: product.price,
        image: product.image,
        category: product.category,
        badge: product.badge || "",
        colors: JSON.stringify(product.colors || []),
        sizes: JSON.stringify(product.sizes || []),
        features: JSON.stringify(product.features || []),
        careInstructions: JSON.stringify(product.careInstructions || []),
        shipping: product.shipping || "5-7 business days",
        isDigitalProduct: product.id === "rocky-roast",
        published: true,
        sortOrder: index,
        createdAt: now,
        updatedAt: now,
      });
    });

    await adminDb.transact(transactions);

    return NextResponse.json({
      message: `Successfully migrated ${staticProducts.length} products to database`,
      count: staticProducts.length,
    });
  } catch (error) {
    console.error("Migration error:", error);
    return NextResponse.json(
      { error: "Failed to migrate products" },
      { status: 500 }
    );
  }
}
