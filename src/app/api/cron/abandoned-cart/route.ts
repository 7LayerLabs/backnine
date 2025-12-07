import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { adminDb, tx } from "@/lib/instant-admin";

const resend = new Resend(process.env.RESEND_API_KEY);

interface CartItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  size: string;
  color?: string;
}

interface AbandonedCart {
  id: string;
  email: string;
  items: string;
  total: number;
  recoveryToken: string;
  recovered: boolean;
  emailsSent: number;
  lastEmailSent: number | null;
  createdAt: number;
}

// Email timing configuration
const EMAIL_SCHEDULE = [
  { hoursAfterAbandon: 1, subject: "You left something behind..." },
  { hoursAfterAbandon: 24, subject: "Your cart is waiting for you" },
  { hoursAfterAbandon: 72, subject: "Last chance to complete your order" },
];

export async function GET(request: NextRequest) {
  // Verify cron secret for security
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = Date.now();
    const result = await adminDb.query({ abandonedCarts: {} });
    const carts = (result.abandonedCarts || []) as AbandonedCart[];

    let emailsSent = 0;
    const errors: string[] = [];

    for (const cart of carts) {
      // Skip if already recovered or all emails sent
      if (cart.recovered || cart.emailsSent >= EMAIL_SCHEDULE.length) {
        continue;
      }

      const hoursSinceAbandon = (now - cart.createdAt) / (1000 * 60 * 60);
      const nextEmail = EMAIL_SCHEDULE[cart.emailsSent];

      // Check if it's time to send the next email
      if (hoursSinceAbandon >= nextEmail.hoursAfterAbandon) {
        // Don't send if we just sent one (within last hour)
        if (cart.lastEmailSent && now - cart.lastEmailSent < 60 * 60 * 1000) {
          continue;
        }

        try {
          const items: CartItem[] = JSON.parse(cart.items);
          await sendRecoveryEmail(cart, items, nextEmail.subject, cart.emailsSent);

          // Update cart record
          await adminDb.transact([
            tx.abandonedCarts[cart.id].update({
              emailsSent: cart.emailsSent + 1,
              lastEmailSent: now,
            }),
          ]);

          emailsSent++;
        } catch (error) {
          errors.push(`Failed to send email to ${cart.email}: ${error}`);
          console.error(`Failed to send recovery email to ${cart.email}:`, error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      emailsSent,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Abandoned cart cron error:", error);
    return NextResponse.json(
      { error: "Cron job failed" },
      { status: 500 }
    );
  }
}

async function sendRecoveryEmail(
  cart: AbandonedCart,
  items: CartItem[],
  subject: string,
  emailNumber: number
) {
  const recoveryUrl = `https://www.backnineshop.com/cart/recover?token=${cart.recoveryToken}`;

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e7e5e4;">
          <div style="display: flex; align-items: center;">
            <img src="${item.productImage}" alt="${item.productName}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px; margin-right: 12px;" />
            <div>
              <strong style="color: #1c1917;">${item.productName}</strong><br>
              <span style="color: #78716c; font-size: 14px;">Size: ${item.size}${item.color ? ` | ${item.color}` : ""} | Qty: ${item.quantity}</span>
            </div>
          </div>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e7e5e4; text-align: right; vertical-align: top;">
          <strong style="color: #1c1917;">$${(item.price * item.quantity).toFixed(2)}</strong>
        </td>
      </tr>
    `
    )
    .join("");

  // Different messaging based on email number
  let headerMessage = "";
  let ctaText = "Complete Your Order";

  if (emailNumber === 0) {
    headerMessage = `
      <p style="font-size: 16px; color: #44403c; line-height: 1.6;">
        Looks like you left some great items in your cart. No worries - we've saved them for you.
      </p>
    `;
  } else if (emailNumber === 1) {
    headerMessage = `
      <p style="font-size: 16px; color: #44403c; line-height: 1.6;">
        Your cart is still waiting! These items are popular and selling fast.
      </p>
    `;
    ctaText = "Get Your Items";
  } else {
    headerMessage = `
      <p style="font-size: 16px; color: #44403c; line-height: 1.6;">
        Last reminder - your cart will expire soon. Don't miss out on these picks!
      </p>
    `;
    ctaText = "Finish Checkout Now";
  }

  await resend.emails.send({
    from: "Back Nine Apparel <hello@backnineshop.com>",
    to: cart.email,
    subject: subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background: #f5f5f4;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">

          <!-- Logo/Header -->
          <div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 1px solid #e7e5e4;">
            <h1 style="color: #1e3a5f; margin: 0; font-size: 24px;">Back Nine</h1>
            <p style="color: #78716c; margin: 5px 0 0;">Golf Apparel</p>
          </div>

          ${headerMessage}

          <!-- Cart Items -->
          <div style="background: #fafaf9; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              ${itemsHtml}
              <tr>
                <td style="padding: 16px 0 0; font-size: 18px; font-weight: bold; color: #1c1917;">Subtotal</td>
                <td style="padding: 16px 0 0; text-align: right; font-size: 18px; font-weight: bold; color: #1c1917;">$${cart.total.toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${recoveryUrl}" style="display: inline-block; background: #1c1917; color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">${ctaText}</a>
          </div>

          <!-- Trust Badges -->
          <div style="text-align: center; padding: 20px 0; border-top: 1px solid #e7e5e4; margin-top: 20px;">
            <p style="color: #78716c; font-size: 14px; margin: 0;">
              Free shipping on orders over $75 | Easy 30-day returns
            </p>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 20px;">
            <a href="https://www.backnineshop.com" style="color: #1e3a5f; text-decoration: none; font-weight: 500;">www.backnineshop.com</a>
            <p style="color: #a8a29e; font-size: 12px; margin-top: 15px;">
              Don't want these emails? <a href="https://www.backnineshop.com/unsubscribe?email=${encodeURIComponent(cart.email)}" style="color: #78716c;">Unsubscribe</a>
            </p>
          </div>

        </div>
      </body>
      </html>
    `,
  });
}
