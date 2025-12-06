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
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Main dashboard
│   │   ├── orders/
│   │   │   └── page.tsx        # Orders management
│   │   ├── inventory/
│   │   │   └── page.tsx        # Inventory tracking
│   │   ├── analytics/
│   │   │   └── page.tsx        # Analytics & metrics
│   │   └── errors/
│   │       └── page.tsx        # Error logs
│   ├── orders/
│   │   └── page.tsx            # Customer order tracking
│   ├── api/
│   │   ├── admin/
│   │   │   ├── auth/
│   │   │   │   └── route.ts    # Password check
│   │   │   ├── orders/
│   │   │   │   └── route.ts    # Get all orders
│   │   │   ├── inventory/
│   │   │   │   └── route.ts    # Inventory CRUD
│   │   │   └── ship-order/
│   │   │       └── route.ts    # Ship & notify
│   │   ├── orders/
│   │   │   └── lookup/
│   │   │       └── route.ts    # Customer order lookup
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

## 13. Admin Dashboard

**URL:** `https://www.backnineshop.com/admin/dashboard`

**File:** `src/app/admin/dashboard/page.tsx`

Your central hub for managing the store. Quick overview of everything happening.

**Features:**
- Revenue stats (today, this week, this month)
- Order status breakdown (pending, shipped, delivered)
- Recent orders list with quick actions
- Top products by revenue
- Low stock alerts
- Quick links to all admin pages

### Using the Dashboard
1. Go to `www.backnineshop.com/admin/dashboard`
2. See at-a-glance metrics
3. Click any card to drill into details
4. Use quick links to navigate to other admin pages

---

## 14. Inventory Management

**URL:** `https://www.backnineshop.com/admin/inventory`

**Files:**
- `src/app/admin/inventory/page.tsx` - UI
- `src/app/api/admin/inventory/route.ts` - API

Track stock levels for all products. Get alerts when inventory is low.

**Features:**
- Stock counts by product/color/size combination
- Low stock threshold warnings
- Quick +/- buttons for stock adjustments
- Filter by: All items, Low Stock, Out of Stock
- Search products
- Add new inventory entries

### Database Schema

**Collection:** `inventory`

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique inventory ID |
| `productId` | string | Links to product |
| `productName` | string | Product display name |
| `color` | string | Color variant (or empty) |
| `size` | string | Size (S, M, L, XL, etc.) |
| `stock` | number | Current quantity |
| `lowStockThreshold` | number | Alert threshold (default: 5) |
| `updatedAt` | number | Last update timestamp |

### Managing Inventory

1. Go to `www.backnineshop.com/admin/inventory`
2. Add items: Click "Add Inventory" → Select product, color, size → Set stock count
3. Adjust stock: Use +/- buttons or click to edit
4. View alerts: Yellow = low stock, Red = out of stock
5. Edit thresholds: Click on item to modify low stock threshold

**Note:** Inventory is tracked separately from orders. Stock is NOT automatically decremented when orders are placed. This is intentional for a new store to allow manual verification before shipping.

---

## 15. Analytics

**URL:** `https://www.backnineshop.com/admin/analytics`

**File:** `src/app/admin/analytics/page.tsx`

Comprehensive store analytics with visual charts and metrics.

**Time Ranges:** 7 days, 30 days, 90 days, All time

### Key Metrics
- **Total Revenue** - Sum of all orders in period
- **Total Orders** - Number of orders placed
- **Average Order Value** - Revenue ÷ Orders
- **Fulfillment Rate** - % of orders shipped/delivered

### Customer Metrics
- **Unique Customers** - Distinct email addresses
- **Repeat Customers** - Customers with 2+ orders
- **Repeat Rate** - % of customers who reorder

### Charts & Visualizations
- **Revenue Over Time** - Daily revenue bar chart
- **Revenue by Day of Week** - See which days perform best
- **Top Products** - Products ranked by revenue
- **Orders by Status** - Visual breakdown of order states

### Additional Stats
- Average items per order
- Average shipping cost
- Total shipping revenue

---

## 16. Customer Order Tracking

**URL:** `https://www.backnineshop.com/orders`

Customers can track their orders without logging in:

1. Enter email address used for order
2. Enter order number (8-character code from confirmation email)
3. View order status, items, tracking info

**Features:**
- Visual progress tracker (Order Placed → Shipped → Delivered)
- Direct links to carrier tracking (USPS, UPS, FedEx, DHL)
- Full order details and shipping address
- Auto-lookup when clicking "Track Your Order" from email

**Link in footer:** "Order Status" under Help section

---

## 17. GO-LIVE CHECKLIST

**IMPORTANT:** The site is currently in TEST MODE. Before accepting real payments, complete these steps:

### Step 1: Activate Stripe Account
1. Go to https://dashboard.stripe.com
2. Click "Activate your account" or complete the banner prompts
3. Fill in:
   - Business details (Back Nine Apparel)
   - Personal details (name, DOB, address, SSN for tax purposes)
   - Bank account for payouts
4. Wait for Stripe verification (usually instant, sometimes 1-2 days)

### Step 2: Create Live Webhook
1. In Stripe Dashboard, switch toggle from "Test mode" to "Live mode" (top right)
2. Go to Developers → Webhooks
3. Click "Add endpoint"
4. Enter URL: `https://www.backnineshop.com/api/webhooks/stripe`
5. Select event: `checkout.session.completed`
6. Click "Add endpoint"
7. Copy the **Signing secret** (starts with `whsec_`)

### Step 3: Update Vercel Environment Variables
1. Go to https://vercel.com/7layerlabs-projects/backnine/settings/environment-variables
2. Update `STRIPE_WEBHOOK_SECRET` with the new Live signing secret
3. Verify `STRIPE_SECRET_KEY` is the Live key (starts with `sk_live_`)
4. Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is the Live key (starts with `pk_live_`)
5. Click "Save"

### Step 4: Redeploy
1. Go to Deployments tab in Vercel
2. Click "..." on latest deployment → "Redeploy"
3. Wait for deployment to complete

### Step 5: Test Live Payment
1. Make a real $1 test purchase (you can refund it)
2. Verify order appears in `/admin/orders`
3. Verify you receive email notification
4. Verify customer receives confirmation email
5. Refund the test order in Stripe Dashboard

### Post-Launch Checklist
- [ ] Stripe account activated
- [ ] Live webhook created
- [ ] Vercel env vars updated with Live keys
- [ ] Site redeployed
- [ ] Test purchase successful
- [ ] Order notification email received
- [ ] Customer confirmation email received
- [ ] Test order refunded

---

## Quick Reference

| What | Where |
|------|-------|
| Admin dashboard | `backnineshop.com/admin/dashboard` |
| View orders | `backnineshop.com/admin/orders` |
| Manage inventory | `backnineshop.com/admin/inventory` |
| View analytics | `backnineshop.com/admin/analytics` |
| View errors | `backnineshop.com/admin/errors` |
| Customer order tracking | `backnineshop.com/orders` |
| Stripe payments | `dashboard.stripe.com/payments` |
| Vercel deployments | `vercel.com/7layerlabs-projects/backnine` |
| InstantDB data | Your InstantDB dashboard |
| Email logs | Resend dashboard |

| Login | Credential |
|-------|------------|
| Admin panel | `ADMIN_PASSWORD` env var |
| Stripe | Your Stripe account |
| Vercel | GitHub (7LayerLabs) |

---

*Last updated: December 6, 2025*
