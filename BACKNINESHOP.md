# Back Nine Apparel - Project Documentation

## Overview
Back Nine Apparel is a golf apparel e-commerce site built with Next.js, Stripe, InstantDB, and Resend.

**Live Site:** https://www.backnineshop.com
**Admin Dashboard:** https://www.backnineshop.com/admin/dashboard

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 15 | React framework (App Router) |
| TypeScript | Type safety |
| Tailwind CSS | Styling |
| Stripe | Payments & checkout |
| InstantDB | Database (orders, inventory, errors, abandoned carts) |
| Resend | Transactional emails |
| Vercel | Hosting & deployment |

---

## Environment Variables

### Required in `.env.local` (local) and Vercel (production):

```bash
# Stripe
STRIPE_SECRET_KEY=sk_test_xxx          # Use sk_live_xxx for production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx  # Use pk_live_xxx for production
STRIPE_WEBHOOK_SECRET=whsec_xxx

# InstantDB
INSTANT_APP_ID=your_app_id
INSTANTDB_ADMIN_TOKEN=your_admin_token

# Resend
RESEND_API_KEY=re_xxx

# Base URL (for image URLs in Stripe checkout)
NEXT_PUBLIC_BASE_URL=https://www.backnineshop.com
```

### Vercel Environment Variables Status:
- [x] STRIPE_SECRET_KEY
- [x] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- [x] STRIPE_WEBHOOK_SECRET
- [x] INSTANT_APP_ID
- [x] INSTANTDB_ADMIN_TOKEN
- [x] RESEND_API_KEY
- [x] NEXT_PUBLIC_BASE_URL

---

## External Services & Logins

Access all from Admin Dashboard → External Services section

| Service | URL | Purpose |
|---------|-----|---------|
| Stripe | https://dashboard.stripe.com | Payments, orders, coupons |
| InstantDB | https://instantdb.com/dash | Database management |
| Resend | https://resend.com | Email delivery & logs |
| Vercel | https://vercel.com/7layerlabs-projects/backnine | Deployments, env vars, logs |
| GitHub | https://github.com/7LayerLabs/backnine | Source code |
| Gmail | https://mail.google.com | Business email |
| Privateemail | https://privateemail.com | Domain email |
| Namecheap | https://namecheap.com | Domain management |
| Google Analytics | https://analytics.google.com | Traffic analytics |

---

## Admin Pages

| Page | URL | Purpose |
|------|-----|---------|
| Dashboard | /admin/dashboard | Central hub, stats, quick links |
| Orders | /admin/orders | View & manage orders |
| Inventory | /admin/inventory | Stock management |
| Analytics | /admin/analytics | Sales analytics |
| Errors | /admin/errors | Error logs |

**Secret access:** Click "2025 Back Nine Apparel" in footer → goes to dashboard

---

## Key Features

### Checkout Flow
1. Customer adds items to cart
2. Clicks checkout → email capture modal
3. Email saved for abandoned cart recovery
4. Redirects to Stripe checkout
5. Stripe webhook fires on completion:
   - Order saved to InstantDB
   - Notification email sent to hello@backnineshop.com
   - Confirmation email sent to customer
   - Abandoned cart marked as recovered

### Abandoned Cart Recovery
- Cron job runs daily at 9 AM UTC
- Configured in `vercel.json`
- Sends reminder email to customers who didn't complete checkout
- Endpoint: `/api/cron/abandoned-cart`

### Inventory System
- Track stock per product/color/size combination
- Low stock threshold alerts
- Out of stock tracking
- Manual stock adjustment (+/-)
- Data stored in InstantDB `inventory` collection

### Payment Methods
- Visa, Mastercard, American Express
- Klarna (buy now, pay later)
- Promo codes enabled (`allow_promotion_codes: true`)

### Promo Codes
- **WELCOME10** - 10% off first order (create in Stripe Dashboard → Coupons)
- Banner displays on site via `FeaturedBanner` component
- Also sent in newsletter signup confirmation

---

## Stripe Configuration

### Webhook Endpoint
- URL: `https://www.backnineshop.com/api/webhooks/stripe`
- Events: `checkout.session.completed`
- Signing secret: Set in `STRIPE_WEBHOOK_SECRET`

### Shipping Options
1. **Free Shipping** - $0, 5-7 business days
2. **Express Shipping** - $9.99, 2-3 business days

### Allowed Countries
- United States (US)
- Canada (CA)

---

## Email Templates

### Order Notification (to owner)
- From: hello@backnineshop.com
- To: hello@backnineshop.com
- Contains: Order total, customer info, shipping address, items

### Order Confirmation (to customer)
- From: hello@backnineshop.com
- Contains: Order number, items, shipping address, tracking link

### Abandoned Cart Recovery
- From: hello@backnineshop.com
- Contains: Cart items, recovery link with discount

### Newsletter Welcome
- From: hello@backnineshop.com
- Contains: Welcome message, WELCOME10 promo code

---

## Database Schema (InstantDB)

### orders
```
{
  id: string
  stripeSessionId: string
  stripePaymentIntentId: string
  items: string (JSON)
  total: number
  subtotal: number
  shippingCost: number
  status: "paid" | "shipped" | "delivered"
  customerEmail: string
  customerName: string
  shippingAddress: string (JSON)
  trackingNumber?: string
  trackingCarrier?: string
  createdAt: number
}
```

### inventory
```
{
  id: string
  productId: string
  productName: string
  color: string
  size: string
  stock: number
  lowStockThreshold: number
  updatedAt: number
}
```

### abandonedCarts
```
{
  id: string
  email: string
  items: string (JSON)
  recovered: boolean
  emailSent: boolean
  createdAt: number
}
```

### errors
```
{
  id: string
  error: string
  context: string
  severity: "low" | "medium" | "high" | "critical"
  metadata: string (JSON)
  createdAt: number
}
```

---

## Deployment

### Automatic (GitHub push)
Push to `main` branch → Vercel auto-deploys

### Manual (CLI)
```bash
cd backnine
npx vercel --prod
```

### Force deploy (bypass cache)
```bash
npx vercel --prod --force
```

---

## File Structure (Key Files)

```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── admin/
│   │   ├── dashboard/page.tsx      # Admin hub
│   │   ├── orders/page.tsx         # Order management
│   │   ├── inventory/page.tsx      # Stock management
│   │   ├── analytics/page.tsx      # Sales analytics
│   │   └── errors/page.tsx         # Error logs
│   ├── api/
│   │   ├── checkout/route.ts       # Create Stripe session
│   │   ├── webhooks/stripe/route.ts # Handle Stripe webhooks
│   │   ├── cart/save/route.ts      # Save cart for recovery
│   │   ├── cron/abandoned-cart/route.ts # Daily recovery emails
│   │   ├── admin/inventory/route.ts # Inventory CRUD
│   │   └── newsletter/route.ts     # Newsletter signup
│   ├── checkout/
│   │   ├── success/page.tsx        # Post-purchase page
│   │   └── cancel/page.tsx         # Cancelled checkout
│   └── orders/page.tsx             # Customer order lookup
├── components/
│   ├── Header.tsx                  # Site header
│   ├── Footer.tsx                  # Site footer (admin link)
│   ├── CartDrawer.tsx              # Shopping cart
│   ├── PaymentIcons.tsx            # Payment method logos
│   └── FeaturedBanner.tsx          # Promo banner
├── context/
│   └── CartContext.tsx             # Cart state management
├── data/
│   └── products.ts                 # Product catalog
├── lib/
│   ├── instant-admin.ts            # InstantDB admin client
│   └── error-logger.ts             # Error logging utility
└── public/
    ├── payment-logos/              # Visa, MC, Amex, Klarna
    └── products/                   # Product images
```

---

## Go-Live Checklist

### Before Launch:
- [ ] Switch Stripe to live mode (replace test keys in Vercel)
- [ ] Create WELCOME10 promo code in Stripe Dashboard
- [ ] Test a real purchase end-to-end
- [ ] Verify webhook receives events
- [ ] Check emails send correctly
- [ ] Review shipping rates

### Stripe Keys to Update in Vercel:
1. `STRIPE_SECRET_KEY` → `sk_live_xxx`
2. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → `pk_live_xxx`
3. `STRIPE_WEBHOOK_SECRET` → New webhook for production endpoint

### Post-Launch:
- [ ] Monitor error logs at /admin/errors
- [ ] Check abandoned cart recovery is working
- [ ] Set up Google Analytics tracking
- [ ] Add products to inventory system (if holding stock)

---

## Common Tasks

### Add a new product
1. Edit `src/data/products.ts`
2. Add product images to `public/products/`
3. Deploy

### Change shipping rates
1. Edit `src/app/api/checkout/route.ts`
2. Modify `shipping_options` array
3. Deploy

### Update promo banner
1. Edit `src/components/FeaturedBanner.tsx`
2. Modify the messages array
3. Deploy

### Check webhook logs
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click your endpoint
3. View recent deliveries

### View email delivery
1. Go to Resend dashboard
2. Check logs for sent/failed emails

---

## Troubleshooting

### Orders not saving
- Check webhook is active in Stripe
- Verify `STRIPE_WEBHOOK_SECRET` matches
- Check /admin/errors for logged issues

### Emails not sending
- Verify `RESEND_API_KEY` is set
- Check Resend dashboard for errors
- Confirm domain is verified in Resend

### Images broken in Stripe checkout
- Ensure `NEXT_PUBLIC_BASE_URL` is set in Vercel
- Redeploy after adding env var

### Vercel not auto-deploying
- Check GitHub webhook in repo settings
- Use `npx vercel --prod` to manually deploy

---

## Support & Resources

- **Stripe Docs:** https://stripe.com/docs
- **InstantDB Docs:** https://instantdb.com/docs
- **Resend Docs:** https://resend.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs

---

*Last updated: December 2024*
