// Printify API Client for Back Nine Apparel
// Handles order fulfillment for: Hoodies, Sweatshirts, T-Shirts, Polos, Pullovers, Golf Towel

const PRINTIFY_API_URL = 'https://api.printify.com/v1';
const PRINTIFY_SHOP_ID = '25407792'; // Etsy shop with products

interface PrintifyAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country: string;
  region: string; // state
  address1: string;
  address2?: string;
  city: string;
  zip: string;
}

interface PrintifyLineItem {
  product_id: string;
  variant_id: number;
  quantity: number;
}

interface PrintifyOrderRequest {
  external_id: string;
  label?: string;
  line_items: PrintifyLineItem[];
  shipping_method: number; // 1 = standard, 2 = express
  send_shipping_notification: boolean;
  address_to: PrintifyAddress;
}

interface PrintifyOrderResponse {
  id: string;
  status: string;
  created_at: string;
}

export async function createPrintifyOrder(
  orderId: string,
  items: PrintifyLineItem[],
  shippingAddress: PrintifyAddress,
  isExpress: boolean = false
): Promise<PrintifyOrderResponse> {
  const token = process.env.PRINTIFY_API_TOKEN;

  if (!token) {
    throw new Error('PRINTIFY_API_TOKEN is not configured');
  }

  const orderRequest: PrintifyOrderRequest = {
    external_id: orderId,
    label: `BackNine Order ${orderId}`,
    line_items: items,
    shipping_method: isExpress ? 2 : 1,
    send_shipping_notification: true,
    address_to: shippingAddress,
  };

  const response = await fetch(
    `${PRINTIFY_API_URL}/shops/${PRINTIFY_SHOP_ID}/orders.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderRequest),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Printify API error: ${response.status} - ${errorText}`);
  }

  return response.json();
}

// Get product details from Printify
export async function getPrintifyProduct(productId: string) {
  const token = process.env.PRINTIFY_API_TOKEN;

  if (!token) {
    throw new Error('PRINTIFY_API_TOKEN is not configured');
  }

  const response = await fetch(
    `${PRINTIFY_API_URL}/shops/${PRINTIFY_SHOP_ID}/products/${productId}.json`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get Printify product: ${response.status}`);
  }

  return response.json();
}

// Convert BackNine shipping address to Printify format
export function formatAddressForPrintify(
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
): PrintifyAddress {
  const nameParts = customerName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || firstName;

  return {
    first_name: firstName,
    last_name: lastName,
    email: customerEmail,
    country: shipping.country || 'US',
    region: shipping.state || '',
    address1: shipping.line1 || '',
    address2: shipping.line2,
    city: shipping.city || '',
    zip: shipping.postal_code || '',
  };
}
