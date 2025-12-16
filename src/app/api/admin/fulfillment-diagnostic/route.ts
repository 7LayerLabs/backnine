import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/instant-admin";
import { products } from "@/data/products";
import { getProductMapping, productMappings } from "@/lib/product-mapping";

const PRINTIFY_API_URL = 'https://api.printify.com/v1';
const PRINTFUL_API_URL = 'https://api.printful.com';

interface DiagnosticResult {
  timestamp: string;
  envVars: {
    printifyToken: boolean;
    printifyShopId: string | null;
    printfulToken: boolean;
  };
  apiTests: {
    printify: { success: boolean; message: string; shopInfo?: unknown };
    printful: { success: boolean; message: string; storeInfo?: unknown };
  };
  productMappingStatus: {
    totalProducts: number;
    mappedProducts: number;
    unmappedProducts: string[];
  };
  recentOrders?: {
    orderId: string;
    status: string;
    fulfillmentStatus: string | null;
    items: string;
    createdAt: number;
  }[];
  orderParsingTest?: {
    orderId: string;
    items: {
      originalName: string;
      parsedProduct: string | null;
      parsedColor: string | null;
      parsedSize: string | null;
      mappingFound: boolean;
      variantFound: boolean;
      provider: string | null;
      variantId: number | null;
      error: string | null;
    }[];
  };
}

// Parse product details from Stripe line item name (same logic as fulfillment.ts)
function parseLineItem(itemName: string): { productId: string; productName: string; color: string; size?: string } | null {
  for (const product of products) {
    if (itemName.toLowerCase().includes(product.name.toLowerCase())) {
      const parts = itemName.split(' - ');
      let color = '';
      let size: string | undefined;

      if (parts.length >= 2) {
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
        productName: product.name,
        color: color || 'Default',
        size,
      };
    }
  }
  return null;
}

export async function GET(request: NextRequest) {
  // Check admin auth
  const authHeader = request.headers.get("authorization");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || authHeader !== `Bearer ${adminPassword}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result: DiagnosticResult = {
    timestamp: new Date().toISOString(),
    envVars: {
      printifyToken: !!process.env.PRINTIFY_API_TOKEN,
      printifyShopId: process.env.PRINTIFY_SHOP_ID || null,
      printfulToken: !!process.env.PRINTFUL_API_TOKEN,
    },
    apiTests: {
      printify: { success: false, message: 'Not tested' },
      printful: { success: false, message: 'Not tested' },
    },
    productMappingStatus: {
      totalProducts: products.filter(p => p.category !== 'digital').length,
      mappedProducts: 0,
      unmappedProducts: [],
    },
  };

  // Test Printify API connection
  if (process.env.PRINTIFY_API_TOKEN) {
    try {
      const shopId = process.env.PRINTIFY_SHOP_ID || '25407792';
      const response = await fetch(`${PRINTIFY_API_URL}/shops/${shopId}.json`, {
        headers: {
          'Authorization': `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
        },
      });

      if (response.ok) {
        const shopInfo = await response.json();
        result.apiTests.printify = {
          success: true,
          message: `Connected to shop: ${shopInfo.title || 'Unknown'}`,
          shopInfo: { id: shopInfo.id, title: shopInfo.title, sales_channel: shopInfo.sales_channel },
        };
      } else {
        const errorText = await response.text();
        result.apiTests.printify = {
          success: false,
          message: `API error ${response.status}: ${errorText}`,
        };
      }
    } catch (error) {
      result.apiTests.printify = {
        success: false,
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  } else {
    result.apiTests.printify = {
      success: false,
      message: 'PRINTIFY_API_TOKEN not configured',
    };
  }

  // Test Printful API connection
  if (process.env.PRINTFUL_API_TOKEN) {
    try {
      const response = await fetch(`${PRINTFUL_API_URL}/store`, {
        headers: {
          'Authorization': `Bearer ${process.env.PRINTFUL_API_TOKEN}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        result.apiTests.printful = {
          success: true,
          message: `Connected to store: ${data.result?.name || 'Unknown'}`,
          storeInfo: { id: data.result?.id, name: data.result?.name },
        };
      } else {
        const errorText = await response.text();
        result.apiTests.printful = {
          success: false,
          message: `API error ${response.status}: ${errorText}`,
        };
      }
    } catch (error) {
      result.apiTests.printful = {
        success: false,
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      };
    }
  } else {
    result.apiTests.printful = {
      success: false,
      message: 'PRINTFUL_API_TOKEN not configured',
    };
  }

  // Check product mapping coverage
  for (const product of products) {
    if (product.category === 'digital') continue;

    const mapping = getProductMapping(product.id);
    if (mapping && mapping.provider !== 'none' && mapping.variants.length > 0) {
      result.productMappingStatus.mappedProducts++;
    } else {
      result.productMappingStatus.unmappedProducts.push(`${product.name} (${product.id})`);
    }
  }

  // Get recent orders
  try {
    const ordersResult = await adminDb.query({ orders: {} });
    interface Order {
      id: string;
      status: string;
      fulfillmentStatus?: string;
      items: string;
      createdAt: number;
    }
    const orders = (ordersResult.orders || []) as Order[];
    result.recentOrders = orders
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 10)
      .map(order => ({
        orderId: order.id,
        status: order.status,
        fulfillmentStatus: order.fulfillmentStatus || null,
        items: order.items,
        createdAt: order.createdAt,
      }));
  } catch {
    // Orders query failed
  }

  return NextResponse.json(result);
}

// POST: Test parsing for a specific order
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || authHeader !== `Bearer ${adminPassword}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await request.json();

  if (!orderId) {
    return NextResponse.json({ error: "orderId required" }, { status: 400 });
  }

  // Get the order
  const ordersResult = await adminDb.query({ orders: {} });
  interface Order {
    id: string;
    items: string;
  }
  const orders = (ordersResult.orders || []) as Order[];
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Parse the items
  let items: { name: string; quantity: number }[] = [];
  try {
    items = JSON.parse(order.items);
  } catch {
    return NextResponse.json({ error: "Failed to parse order items" }, { status: 500 });
  }

  const parsingResults = items.map(item => {
    const parsed = parseLineItem(item.name);

    if (!parsed) {
      return {
        originalName: item.name,
        parsedProduct: null,
        parsedColor: null,
        parsedSize: null,
        mappingFound: false,
        variantFound: false,
        provider: null,
        variantId: null,
        error: 'Could not match product name to any known product',
      };
    }

    const mapping = getProductMapping(parsed.productId);

    if (!mapping) {
      return {
        originalName: item.name,
        parsedProduct: parsed.productName,
        parsedColor: parsed.color,
        parsedSize: parsed.size || null,
        mappingFound: false,
        variantFound: false,
        provider: null,
        variantId: null,
        error: `No fulfillment mapping found for product: ${parsed.productId}`,
      };
    }

    if (mapping.provider === 'none') {
      return {
        originalName: item.name,
        parsedProduct: parsed.productName,
        parsedColor: parsed.color,
        parsedSize: parsed.size || null,
        mappingFound: true,
        variantFound: false,
        provider: 'none (digital product)',
        variantId: null,
        error: null,
      };
    }

    // Find the variant
    const variant = mapping.variants.find(v => {
      const colorMatch = v.color.toLowerCase() === parsed.color.toLowerCase();
      const sizeMatch = !parsed.size || !v.size || v.size.toLowerCase() === parsed.size.toLowerCase();
      return colorMatch && sizeMatch;
    });

    if (!variant) {
      // List available variants for debugging
      const availableColors = [...new Set(mapping.variants.map(v => v.color))].join(', ');
      return {
        originalName: item.name,
        parsedProduct: parsed.productName,
        parsedColor: parsed.color,
        parsedSize: parsed.size || null,
        mappingFound: true,
        variantFound: false,
        provider: mapping.provider,
        variantId: null,
        error: `No variant found for color "${parsed.color}" size "${parsed.size}". Available colors: ${availableColors}`,
      };
    }

    return {
      originalName: item.name,
      parsedProduct: parsed.productName,
      parsedColor: parsed.color,
      parsedSize: parsed.size || null,
      mappingFound: true,
      variantFound: true,
      provider: mapping.provider,
      variantId: mapping.provider === 'printify'
        ? variant.printifyVariantId
        : (variant.printfulSyncVariantId || null),
      printfulSku: variant.printfulSku || null,
      error: null,
    };
  });

  return NextResponse.json({
    orderId,
    items: parsingResults,
    canFulfill: parsingResults.every(r => r.error === null || r.provider === 'none (digital product)'),
  });
}
