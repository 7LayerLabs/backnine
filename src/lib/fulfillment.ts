// Fulfillment Service for Back Nine Apparel
// Routes orders to Printify (apparel) or Printful (headwear) based on product category

import { createPrintifyOrder, formatAddressForPrintify } from './printify';
import { createPrintfulOrder, confirmPrintfulOrder, formatAddressForPrintful } from './printful';
import { getProductMapping, getProviderForCategory, FulfillmentProvider } from './product-mapping';
import { products } from '@/data/products';
import { logError } from './error-logger';

interface OrderItem {
  name: string;
  description?: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
}

interface FulfillmentResult {
  success: boolean;
  provider: FulfillmentProvider;
  orderId?: string;
  error?: string;
}

// Parse product details from Stripe line item name
// Format: "Product Name - Color - Size" or "Product Name - Color"
function parseLineItem(itemName: string): { productId: string; color: string; size?: string } | null {
  // Try to match with our products
  for (const product of products) {
    if (itemName.toLowerCase().includes(product.name.toLowerCase())) {
      // Extract color and size from the item name
      const parts = itemName.split(' - ');

      let color = '';
      let size: string | undefined;

      if (parts.length >= 2) {
        // Last part might be size if it matches known sizes
        const lastPart = parts[parts.length - 1].trim();
        const knownSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', 'One Size', 'One Size Fits Most'];

        if (knownSizes.some(s => s.toLowerCase() === lastPart.toLowerCase())) {
          size = lastPart;
          color = parts.length >= 3 ? parts[parts.length - 2].trim() : '';
        } else {
          color = lastPart;
        }
      }

      return {
        productId: product.id,
        color: color || 'Default',
        size,
      };
    }
  }

  return null;
}

// Main function to fulfill an order
export async function fulfillOrder(
  orderId: string,
  items: OrderItem[],
  customerName: string,
  customerEmail: string,
  shippingAddress: ShippingAddress,
  isExpressShipping: boolean = false
): Promise<FulfillmentResult[]> {
  const results: FulfillmentResult[] = [];

  // Group items by fulfillment provider
  const printifyItems: { productId: string; variantId: number; quantity: number }[] = [];
  const printfulItems: { syncVariantId?: number; sku?: string; quantity: number }[] = [];
  const skippedItems: string[] = [];

  for (const item of items) {
    const parsed = parseLineItem(item.name);

    if (!parsed) {
      console.warn(`Could not parse item: ${item.name}`);
      skippedItems.push(item.name);
      continue;
    }

    // Find the product to get its category
    const product = products.find(p => p.id === parsed.productId);
    if (!product) {
      console.warn(`Product not found: ${parsed.productId}`);
      skippedItems.push(item.name);
      continue;
    }

    // Skip digital products
    if (product.category === 'digital') {
      console.log(`Skipping digital product: ${item.name}`);
      continue;
    }

    const mapping = getProductMapping(parsed.productId);
    if (!mapping) {
      console.warn(`No mapping found for product: ${parsed.productId}`);
      skippedItems.push(item.name);
      continue;
    }

    // Find the variant
    const variant = mapping.variants.find(v => {
      const colorMatch = v.color.toLowerCase() === parsed.color.toLowerCase();
      const sizeMatch = !parsed.size || !v.size || v.size.toLowerCase() === parsed.size.toLowerCase();
      return colorMatch && sizeMatch;
    });

    if (!variant) {
      console.warn(`No variant found for: ${parsed.productId} - ${parsed.color} - ${parsed.size}`);
      skippedItems.push(item.name);
      continue;
    }

    if (mapping.provider === 'printify' && variant.printifyVariantId) {
      printifyItems.push({
        productId: mapping.printifyProductId || '',
        variantId: variant.printifyVariantId,
        quantity: item.quantity,
      });
    } else if (mapping.provider === 'printful') {
      // Printful items can use either sync_variant_id or SKU
      if (variant.printfulSku) {
        printfulItems.push({
          sku: variant.printfulSku,
          quantity: item.quantity,
        });
      } else if (variant.printfulSyncVariantId) {
        printfulItems.push({
          syncVariantId: variant.printfulSyncVariantId,
          quantity: item.quantity,
        });
      }
    }
  }

  // Submit Printify order if there are items
  if (printifyItems.length > 0) {
    try {
      const printifyAddress = formatAddressForPrintify(
        customerName,
        customerEmail,
        shippingAddress
      );

      const printifyLineItems = printifyItems.map(item => ({
        product_id: item.productId,
        variant_id: item.variantId,
        quantity: item.quantity,
      }));

      const printifyOrder = await createPrintifyOrder(
        `BN-${orderId}`,
        printifyLineItems,
        printifyAddress,
        isExpressShipping
      );

      results.push({
        success: true,
        provider: 'printify',
        orderId: printifyOrder.id,
      });

      console.log(`Printify order created: ${printifyOrder.id}`);
    } catch (error) {
      console.error('Printify order failed:', error);
      await logError({
        error,
        context: 'fulfillment-printify',
        severity: 'high',
        metadata: {
          orderId,
          itemCount: printifyItems.length,
        },
      });

      results.push({
        success: false,
        provider: 'printify',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Submit Printful order if there are items
  if (printfulItems.length > 0) {
    try {
      const printfulRecipient = formatAddressForPrintful(
        customerName,
        customerEmail,
        shippingAddress
      );

      const printfulOrderItems = printfulItems.map(item => {
        if (item.sku) {
          return { sku: item.sku, quantity: item.quantity };
        }
        return { sync_variant_id: item.syncVariantId, quantity: item.quantity };
      });

      const printfulOrder = await createPrintfulOrder(
        `BN-${orderId}`,
        printfulOrderItems,
        printfulRecipient
      );

      // Confirm the order to start production
      if (printfulOrder.result?.id) {
        await confirmPrintfulOrder(printfulOrder.result.id);
      }

      results.push({
        success: true,
        provider: 'printful',
        orderId: String(printfulOrder.result?.id),
      });

      console.log(`Printful order created and confirmed: ${printfulOrder.result?.id}`);
    } catch (error) {
      console.error('Printful order failed:', error);
      await logError({
        error,
        context: 'fulfillment-printful',
        severity: 'high',
        metadata: {
          orderId,
          itemCount: printfulItems.length,
        },
      });

      results.push({
        success: false,
        provider: 'printful',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // Log skipped items - upgraded to high severity for visibility
  if (skippedItems.length > 0) {
    console.error(`[Fulfillment] SKIPPED ITEMS for order ${orderId}:`, skippedItems);
    await logError({
      error: new Error(`Items could not be fulfilled: ${skippedItems.join(', ')}`),
      context: 'fulfillment-skipped',
      severity: 'high', // Upgraded from medium - skipped items are a real problem
      metadata: {
        orderId,
        skippedItems,
        totalItems: items.length,
        skippedCount: skippedItems.length,
      },
    });

    // If ALL items were skipped, add a failure result so the webhook knows
    if (results.length === 0) {
      results.push({
        success: false,
        provider: 'none' as FulfillmentProvider,
        error: `All ${skippedItems.length} items could not be mapped to fulfillment providers: ${skippedItems.join(', ')}`,
      });
    }
  }

  return results;
}

// Check if all items in an order can be fulfilled
export function canFulfillOrder(items: OrderItem[]): {
  canFulfill: boolean;
  unfulfillableItems: string[];
} {
  const unfulfillableItems: string[] = [];

  for (const item of items) {
    const parsed = parseLineItem(item.name);

    if (!parsed) {
      unfulfillableItems.push(item.name);
      continue;
    }

    const product = products.find(p => p.id === parsed.productId);
    if (!product || product.category === 'digital') {
      continue; // Skip digital products
    }

    const mapping = getProductMapping(parsed.productId);
    if (!mapping || mapping.provider === 'none') {
      unfulfillableItems.push(item.name);
      continue;
    }

    const variant = mapping.variants.find(v => {
      const colorMatch = v.color.toLowerCase() === parsed.color.toLowerCase();
      const sizeMatch = !parsed.size || !v.size || v.size.toLowerCase() === parsed.size.toLowerCase();
      return colorMatch && sizeMatch;
    });

    if (!variant) {
      unfulfillableItems.push(item.name);
    }
  }

  return {
    canFulfill: unfulfillableItems.length === 0,
    unfulfillableItems,
  };
}
