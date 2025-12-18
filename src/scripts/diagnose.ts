import { adminDb } from "@/lib/instant-admin";

// This script diagnoses fulfillment issues by checking:
// 1. Recent errors (especially fulfillment-related)
// 2. Orders with failed fulfillment status
// 3. Order item parsing

interface ErrorRecord {
  id: string;
  context: string;
  severity: string;
  message: string;
  metadata?: string;
  createdAt: number;
  resolved: boolean;
}

interface Order {
  id: string;
  status: string;
  fulfillmentStatus?: string;
  fulfillmentError?: string;
  items: string;
  createdAt: number;
  customerEmail?: string;
  customerName?: string;
}

async function diagnose() {
  console.log("🔍 Back Nine Fulfillment Diagnostic\n");
  console.log(`Timestamp: ${new Date().toISOString()}\n`);

  try {
    // 1. Get all errors
    console.log("📋 RECENT ERRORS");
    console.log("================\n");
    const errorsResult = await adminDb.query({ errors: {} });
    const errors = (errorsResult.errors || []) as ErrorRecord[];
    const sortedErrors = errors
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 20);

    const fulfillmentErrors = sortedErrors.filter(
      (e) => e.context.includes("fulfillment") || e.severity === "critical"
    );

    if (fulfillmentErrors.length > 0) {
      console.log(`Found ${fulfillmentErrors.length} fulfillment-related errors:\n`);
      fulfillmentErrors.forEach((err, idx) => {
        console.log(
          `${idx + 1}. [${err.severity.toUpperCase()}] ${err.context}`
        );
        console.log(`   Message: ${err.message}`);
        console.log(`   Time: ${new Date(err.createdAt).toLocaleString()}`);
        if (err.metadata) {
          try {
            const meta = JSON.parse(err.metadata);
            console.log(`   Metadata: ${JSON.stringify(meta, null, 2)}`);
          } catch (e) {
            console.log(`   Metadata: ${err.metadata}`);
          }
        }
        console.log();
      });
    } else {
      console.log("✅ No fulfillment errors found!\n");
    }

    // 2. Get all orders
    console.log("\n📦 ORDER STATUS");
    console.log("================\n");
    const ordersResult = await adminDb.query({ orders: {} });
    const orders = (ordersResult.orders || []) as Order[];
    const sortedOrders = orders.sort((a, b) => b.createdAt - a.createdAt);

    console.log(`Total orders: ${orders.length}\n`);

    // Group by fulfillment status
    const byStatus = sortedOrders.reduce(
      (acc, order) => {
        const status = order.fulfillmentStatus || "none";
        if (!acc[status]) acc[status] = [];
        acc[status].push(order);
        return acc;
      },
      {} as Record<string, Order[]>
    );

    Object.entries(byStatus).forEach(([status, orders]) => {
      console.log(`${status.toUpperCase()}: ${orders.length} orders`);
      if (status === "failed" || status === "none") {
        // Show details for problematic orders
        orders.slice(0, 5).forEach((order) => {
          console.log(
            `  - ${order.id.slice(0, 8)} | ${order.customerEmail} | Created: ${new Date(order.createdAt).toLocaleString()}`
          );
          if (order.fulfillmentError) {
            console.log(`    Error: ${order.fulfillmentError}`);
          }
          // Parse items to show what was ordered
          try {
            const items = JSON.parse(order.items);
            console.log(
              `    Items: ${items.map((i: any) => `${i.quantity}x ${i.name}`).join(", ")}`
            );
          } catch (e) {
            console.log(`    Items: [parse error]`);
          }
        });
      }
      console.log();
    });

    // 3. Analysis
    console.log("\n📊 ANALYSIS");
    console.log("============\n");

    const failedOrders = sortedOrders.filter(
      (o) => o.fulfillmentStatus === "failed"
    );
    const noStatusOrders = sortedOrders.filter(
      (o) => !o.fulfillmentStatus || o.fulfillmentStatus === "none"
    );
    const submittedOrders = sortedOrders.filter(
      (o) => o.fulfillmentStatus === "submitted"
    );

    console.log(`✅ Successfully submitted: ${submittedOrders.length}`);
    console.log(`❌ Failed fulfillment: ${failedOrders.length}`);
    console.log(`⚠️  No fulfillment status: ${noStatusOrders.length}`);

    if (failedOrders.length > 0) {
      console.log(
        `\n🚨 ACTION NEEDED: ${failedOrders.length} orders failed fulfillment`
      );
      console.log("These need to be manually sent to Printify/Printful");
    }

    if (noStatusOrders.length > 0 && noStatusOrders[0].createdAt > Date.now() - 3600000) {
      // Created in last hour
      console.log(
        `\n⏳ WATCH: ${noStatusOrders.length} recent orders haven't been processed yet`
      );
      console.log("These may still be in progress or may have stalled");
    }
  } catch (error) {
    console.error("Diagnostic failed:", error);
    process.exit(1);
  }
}

diagnose().then(() => {
  console.log("\n✨ Diagnostic complete");
  process.exit(0);
});
