# BackNine Backend - How It Works

## Overview

BackNine uses a serverless architecture with:
- **Next.js** - Frontend and API routes
- **Stripe** - Payment processing
- **InstantDB** - Real-time database for orders
- **Resend** - Transactional emails
- **Vercel** - Hosting and deployment

---

## Order Flow

```
Customer browses → Adds to cart → Checkout → Stripe payment → Order saved → You notified
                                                                    ↓
                                              You ship → Customer notified → Delivered
```

---

## 1. Checkout Process

**File:** `src/app/api/checkout/route.ts`

When customer clicks checkout:
1. Cart items sent to API
2. Stripe checkout session created with:
   - Line items (products, quantities, prices)
   - Shipping options (Free 5-7 days, Express $9.99 2-3 days)
   - Success/cancel redirect URLs
3. Customer redirected to Stripe's hosted checkout page
4. After payment, redirected to `/checkout/success`

---

## 2. Order Saved via Webhook

**File:** `src/app/api/webhooks/stripe/route.ts`

When Stripe payment completes:
1. Stripe sends `checkout.session.completed` event to webhook
2. Webhook verifies signature using `STRIPE_WEBHOOK_SECRET`
3. Order saved to InstantDB with:
   - `stripeSessionId` - Links to Stripe
   - `stripePaymentIntentId` - For refunds/disputes
   - `items` - JSON string of products ordered
   - `total`, `subtotal`, `shippingCost`
   - `status` - "paid", "shipped", or "delivered"
   - `customerEmail`, `customerName`
   - `shippingAddress` - JSON string
   - `createdAt` - Timestamp

4. **Email sent to you** at `hello@backnineshop.com` with:
   - Order total
   - Customer info
   - Shipping address
   - Items ordered
   - Link to admin panel

---

## 3. Admin Orders Page

**URL:** `https://www.backnineshop.com/admin/orders`

**File:** `src/app/admin/orders/page.tsx`

**Protected by:** Password login (`ADMIN_PASSWORD` env var)

**Features:**
- View all orders (sorted newest first)
- Click order to see full details
- See customer name, email, shipping address
- View line items with quantities and prices
- Link to Stripe dashboard for payment details
- Update order status

---

## 4. Shipping an Order

**File:** `src/app/api/admin/ship-order/route.ts`

When you click "Mark as Shipped":
1. Modal appears for tracking info
2. Enter carrier (USPS, UPS, FedEx, DHL)
3. Enter tracking number (optional)
4. Click "Ship & Notify Customer"

**What happens:**
1. Order status updated to "shipped" in InstantDB
2. Tracking number and carrier saved
3. Customer receives email with:
   - "Your order has shipped!" message
   - Items they ordered
   - Tracking info (if provided)
   - Reply-to for questions

---

## 5. Database Schema (InstantDB)

**Collection:** `orders`

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique order ID |
| `stripeSessionId` | string | Stripe checkout session |
| `stripePaymentIntentId` | string | Stripe payment intent |
| `items` | string | JSON array of items |
| `total` | number | Total charged |
| `subtotal` | number | Before shipping |
| `shippingCost` | number | Shipping fee |
| `status` | string | paid/shipped/delivered/cancelled |
| `customerEmail` | string | Customer email |
| `customerName` | string | Customer name |
| `shippingAddress` | string | JSON object |
| `trackingNumber` | string | Shipping tracking |
| `carrier` | string | USPS/UPS/FedEx/DHL |
| `shippedAt` | number | When shipped (timestamp) |
| `createdAt` | number | When ordered (timestamp) |

---

## 6. Environment Variables (Vercel)

| Variable | Purpose |
|----------|---------|
| `STRIPE_SECRET_KEY` | Stripe API access |
| `STRIPE_WEBHOOK_SECRET` | Verify webhook signatures |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Frontend Stripe |
| `RESEND_API_KEY` | Send emails |
| `NEXT_PUBLIC_INSTANT_APP_ID` | InstantDB app ID |
| `INSTANT_ADMIN_TOKEN` | InstantDB server writes |
| `ADMIN_PASSWORD` | Admin panel login |

---

## 7. Email Notifications

**Sent from:** `hello@backnineshop.com` (via Resend)

### Order Confirmation Email (to customer)
- **When:** Immediately after payment succeeds
- **Subject:** "Order Confirmed! #XXXXXXXX"
- **Contains:** Order number, items with prices, subtotal/shipping/total, shipping address, friendly message

### New Order Email (to you)
- **When:** Customer completes payment
- **Subject:** "New Order! $XX.XX from [Customer Name]"
- **Contains:** Total, customer info, shipping address, items, link to admin

### Shipped Email (to customer)
- **When:** You mark order as shipped
- **Subject:** "Your Back Nine order has shipped!"
- **Contains:** Items, tracking info, friendly message

### Contact Form (existing)
- **File:** `src/app/api/contact/route.ts`
- Sends customer inquiries to `hello@backnineshop.com`

### Newsletter (existing)
- **File:** `src/app/api/newsletter/route.ts`
- Handles email signups

---

## 8. Key Files Summary

```
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx          # Admin auth wrapper
│   │   └── orders/
│   │       └── page.tsx        # Orders dashboard
│   ├── api/
│   │   ├── admin/
│   │   │   ├── auth/
│   │   │   │   └── route.ts    # Password check
│   │   │   └── ship-order/
│   │   │       └── route.ts    # Ship & notify
│   │   ├── checkout/
│   │   │   ├── route.ts        # Create Stripe session
│   │   │   └── session/
│   │   │       └── route.ts    # Get session details
│   │   ├── webhooks/
│   │   │   └── stripe/
│   │   │       └── route.ts    # Handle Stripe events
│   │   ├── contact/
│   │   │   └── route.ts        # Contact form
│   │   └── newsletter/
│   │       └── route.ts        # Email signups
│   └── checkout/
│       ├── success/
│       │   └── page.tsx        # Order confirmation
│       └── cancel/
│           └── page.tsx        # Cancelled checkout
├── lib/
│   ├── instant.ts              # InstantDB client
│   ├── instant-admin.ts        # InstantDB server SDK
│   └── stripe.ts               # Stripe config
└── context/
    └── CartContext.tsx         # Shopping cart state
```

---

## 9. Stripe Dashboard

**Webhook endpoint:** `https://www.backnineshop.com/api/webhooks/stripe`

**Event listened for:** `checkout.session.completed`

**To view payments:** https://dashboard.stripe.com/payments

---

## 10. Common Tasks

### View Orders
1. Go to `www.backnineshop.com/admin/orders`
2. Enter admin password
3. Click any order to see details

### Ship an Order
1. Open order in admin
2. Click "Mark as Shipped"
3. Select carrier, enter tracking (optional)
4. Click "Ship & Notify Customer"

### Check Payment Details
1. Open order in admin
2. Click "View in Stripe" link
3. See full payment, customer, refund options

### Issue Refund
1. Go to Stripe Dashboard
2. Find payment
3. Click "Refund"

---

## 11. Error Logging

**URL:** `https://www.backnineshop.com/admin/errors`

**File:** `src/lib/error-logger.ts`

All critical errors are:
1. Logged to console (Vercel function logs)
2. Saved to InstantDB `errors` collection
3. Emailed to `hello@backnineshop.com` for critical severity

### Error Severity Levels

| Level | When Used | Email? |
|-------|-----------|--------|
| `low` | Minor issues, logging only | No |
| `medium` | Recoverable errors | No |
| `high` | Failed operations (checkout, shipping) | No |
| `critical` | Payment failures, webhook errors | Yes |

### Viewing Errors

1. Go to `www.backnineshop.com/admin/errors`
2. Filter by: Unresolved, All, or Resolved
3. Click error to see full details, stack trace, context
4. Mark as resolved or delete when fixed

### Key Error Contexts

| Context | What It Means |
|---------|---------------|
| `stripe-webhook` | Payment processing failed |
| `checkout` | Checkout session creation failed |
| `ship-order` | Shipping update/notification failed |

---

## 12. Troubleshooting

### Orders not appearing?
- Check Stripe webhook is active in dashboard
- Verify `STRIPE_WEBHOOK_SECRET` in Vercel matches Stripe
- Check Vercel function logs for errors

### Emails not sending?
- Verify `RESEND_API_KEY` in Vercel
- Check Resend dashboard for delivery status
- Ensure `hello@backnineshop.com` domain is verified in Resend

### Can't login to admin?
- Check `ADMIN_PASSWORD` is set in Vercel
- Redeploy if recently changed
- Clear browser session storage

---

*Last updated: December 6, 2025*
