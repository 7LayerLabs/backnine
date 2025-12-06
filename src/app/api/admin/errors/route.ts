import { NextRequest, NextResponse } from "next/server";
import { adminDb, tx } from "@/lib/instant-admin";

interface ErrorRecord {
  id: string;
  context: string;
  severity: string;
  message: string;
  stack?: string;
  metadata?: string;
  createdAt: number;
  resolved: boolean;
  resolvedAt?: number;
}

export async function GET() {
  try {
    const result = await adminDb.query({ errors: {} });
    const errors = (result.errors || []) as ErrorRecord[];

    // Sort by createdAt descending (newest first)
    const sortedErrors = errors.sort((a, b) => b.createdAt - a.createdAt);

    return NextResponse.json({ errors: sortedErrors });
  } catch (error) {
    console.error("Failed to fetch errors:", error);
    return NextResponse.json({ error: "Failed to fetch errors" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { errorId, resolved } = await request.json();

    if (!errorId) {
      return NextResponse.json({ error: "Error ID required" }, { status: 400 });
    }

    await adminDb.transact([
      tx.errors[errorId].update({
        resolved: resolved ?? true,
        resolvedAt: resolved ? Date.now() : null,
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update error:", error);
    return NextResponse.json({ error: "Failed to update error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { errorId } = await request.json();

    if (!errorId) {
      return NextResponse.json({ error: "Error ID required" }, { status: 400 });
    }

    await adminDb.transact([
      tx.errors[errorId].delete(),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete error:", error);
    return NextResponse.json({ error: "Failed to delete error" }, { status: 500 });
  }
}
