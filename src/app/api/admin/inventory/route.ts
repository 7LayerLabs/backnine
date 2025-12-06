import { NextRequest, NextResponse } from "next/server";
import { adminDb, tx, id } from "@/lib/instant-admin";

interface InventoryItem {
  id: string;
  productId: string;
  productName: string;
  color: string;
  size: string;
  stock: number;
  lowStockThreshold: number;
  updatedAt: number;
}

// GET - Fetch all inventory
export async function GET() {
  try {
    const result = await adminDb.query({ inventory: {} });
    const inventory = (result.inventory || []) as InventoryItem[];

    return NextResponse.json({ inventory });
  } catch (error) {
    console.error("Failed to fetch inventory:", error);
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}

// POST - Create or update inventory item
export async function POST(request: NextRequest) {
  try {
    const { productId, productName, color, size, stock, lowStockThreshold } = await request.json();

    if (!productId || !size) {
      return NextResponse.json({ error: "Product ID and size are required" }, { status: 400 });
    }

    // Check if this product/color/size combo already exists
    const result = await adminDb.query({ inventory: {} });
    const inventory = (result.inventory || []) as InventoryItem[];

    const existing = inventory.find(
      (item) =>
        item.productId === productId &&
        item.color === (color || "") &&
        item.size === size
    );

    if (existing) {
      // Update existing
      await adminDb.transact([
        tx.inventory[existing.id].update({
          stock: stock ?? existing.stock,
          lowStockThreshold: lowStockThreshold ?? existing.lowStockThreshold,
          productName: productName ?? existing.productName,
          updatedAt: Date.now(),
        }),
      ]);

      return NextResponse.json({ success: true, id: existing.id, action: "updated" });
    } else {
      // Create new
      const itemId = id();
      await adminDb.transact([
        tx.inventory[itemId].update({
          productId,
          productName: productName || productId,
          color: color || "",
          size,
          stock: stock ?? 0,
          lowStockThreshold: lowStockThreshold ?? 5,
          updatedAt: Date.now(),
        }),
      ]);

      return NextResponse.json({ success: true, id: itemId, action: "created" });
    }
  } catch (error) {
    console.error("Failed to update inventory:", error);
    return NextResponse.json({ error: "Failed to update inventory" }, { status: 500 });
  }
}

// PATCH - Adjust stock (increment/decrement)
export async function PATCH(request: NextRequest) {
  try {
    const { inventoryId, adjustment } = await request.json();

    if (!inventoryId || adjustment === undefined) {
      return NextResponse.json({ error: "Inventory ID and adjustment are required" }, { status: 400 });
    }

    const result = await adminDb.query({ inventory: {} });
    const inventory = (result.inventory || []) as InventoryItem[];
    const item = inventory.find((i) => i.id === inventoryId);

    if (!item) {
      return NextResponse.json({ error: "Inventory item not found" }, { status: 404 });
    }

    const newStock = Math.max(0, item.stock + adjustment);

    await adminDb.transact([
      tx.inventory[inventoryId].update({
        stock: newStock,
        updatedAt: Date.now(),
      }),
    ]);

    return NextResponse.json({ success: true, newStock });
  } catch (error) {
    console.error("Failed to adjust inventory:", error);
    return NextResponse.json({ error: "Failed to adjust inventory" }, { status: 500 });
  }
}

// DELETE - Remove inventory item
export async function DELETE(request: NextRequest) {
  try {
    const { inventoryId } = await request.json();

    if (!inventoryId) {
      return NextResponse.json({ error: "Inventory ID required" }, { status: 400 });
    }

    await adminDb.transact([tx.inventory[inventoryId].delete()]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete inventory:", error);
    return NextResponse.json({ error: "Failed to delete inventory" }, { status: 500 });
  }
}
