// Printful API Client for Back Nine Apparel
// Handles order fulfillment for: Rope Hat, Beanie (headwear)

const PRINTFUL_API_URL = 'https://api.printful.com';

interface PrintfulRecipient {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state_code: string;
  country_code: string;
  zip: string;
  email: string;
  phone?: string;
}

interface PrintfulOrderItem {
  sync_variant_id?: number;
  sku?: string;
  quantity: number;
}

interface PrintfulOrderRequest {
  external_id: string;
  recipient: PrintfulRecipient;
  items: PrintfulOrderItem[];
}

interface PrintfulOrderResponse {
  code: number;
  result: {
    id: number;
    external_id: string;
    status: string;
    created: number;
  };
}

export async function createPrintfulOrder(
  orderId: string,
  items: PrintfulOrderItem[],
  recipient: PrintfulRecipient
): Promise<PrintfulOrderResponse> {
  const token = process.env.PRINTFUL_API_TOKEN;

  if (!token) {
    throw new Error('PRINTFUL_API_TOKEN is not configured');
  }

  const orderRequest: PrintfulOrderRequest = {
    external_id: orderId,
    recipient,
    items,
  };

  const response = await fetch(`${PRINTFUL_API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderRequest),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Printful API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// Confirm and submit order for fulfillment
export async function confirmPrintfulOrder(orderId: number): Promise<PrintfulOrderResponse> {
  const token = process.env.PRINTFUL_API_TOKEN;

  if (!token) {
    throw new Error('PRINTFUL_API_TOKEN is not configured');
  }

  const response = await fetch(`${PRINTFUL_API_URL}/orders/${orderId}/confirm`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Printful confirm error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// Get store products from Printful
export async function getPrintfulProducts() {
  const token = process.env.PRINTFUL_API_TOKEN;

  if (!token) {
    throw new Error('PRINTFUL_API_TOKEN is not configured');
  }

  const response = await fetch(`${PRINTFUL_API_URL}/store/products`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get Printful products: ${response.status}`);
  }

  return response.json();
}

// Convert BackNine shipping address to Printful format
export function formatAddressForPrintful(
  customerName: string,
  customerEmail: string,
  shipping: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  }
): PrintfulRecipient {
  return {
    name: customerName,
    email: customerEmail,
    address1: shipping.line1 || '',
    address2: shipping.line2,
    city: shipping.city || '',
    state_code: shipping.state || '',
    country_code: shipping.country || 'US',
    zip: shipping.postal_code || '',
  };
}
