import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { adminDb, tx, id } from "@/lib/instant-admin";

const resend = new Resend(process.env.RESEND_API_KEY);

// Generate a unique discount code
function generateDiscountCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "WELCOME10-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await adminDb.query({
      subscribers: {
        $: {
          where: { email: email.toLowerCase() },
        },
      },
    });

    if (existing.subscribers && existing.subscribers.length > 0) {
      return NextResponse.json(
        { error: "Email already subscribed", alreadySubscribed: true },
        { status: 400 }
      );
    }

    // Generate discount code
    const discountCode = generateDiscountCode();

    // Save subscriber to InstantDB
    await adminDb.transact(
      tx.subscribers[id()].update({
        email: email.toLowerCase(),
        discountCode,
        subscribedAt: Date.now(),
        hasUsedDiscount: false,
      })
    );

    // Send welcome email with discount code
    try {
      await resend.emails.send({
      from: "Back Nine Apparel <onboarding@resend.dev>",
      replyTo: "back9apparel2025@gmail.com",
      to: email,
      subject: "Welcome to Back Nine! Here's your 10% discount",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #fafaf9;">
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <div style="background-color: #1e3a5f; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px; letter-spacing: 2px;">BACK NINE</h1>
              <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0; font-size: 12px; letter-spacing: 3px;">APPAREL</p>
            </div>

            <div style="background-color: white; padding: 40px 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #1c1917; margin: 0 0 20px; font-size: 24px;">Welcome to the Club!</h2>

              <p style="color: #57534e; line-height: 1.6; margin: 0 0 20px;">
                Thanks for joining the Back Nine family. As a welcome gift, here's your exclusive 10% discount on your first order:
              </p>

              <div style="background-color: #fafaf9; border: 2px dashed #d6d3d1; padding: 20px; text-align: center; margin: 30px 0; border-radius: 8px;">
                <p style="color: #78716c; font-size: 12px; margin: 0 0 10px; text-transform: uppercase; letter-spacing: 1px;">Your Discount Code</p>
                <p style="color: #1c1917; font-size: 28px; font-weight: bold; margin: 0; letter-spacing: 2px;">${discountCode}</p>
              </div>

              <p style="color: #57534e; line-height: 1.6; margin: 0 0 30px;">
                Use this code at checkout to save 10% on your first purchase. Whether you're hitting the links or just enjoying the lifestyle, we've got you covered.
              </p>

              <a href="https://backnineapparel.com/#shop" style="display: inline-block; background-color: #1c1917; color: white; padding: 15px 30px; text-decoration: none; font-weight: 500; border-radius: 4px;">Shop Now</a>

              <p style="color: #a8a29e; font-size: 14px; margin: 30px 0 0; line-height: 1.6;">
                As a subscriber, you'll get early access to new drops, exclusive offers, and golf lifestyle content.
              </p>
            </div>

            <div style="text-align: center; padding: 30px 20px;">
              <p style="color: #a8a29e; font-size: 12px; margin: 0;">
                &copy; 2025 Back Nine Apparel. All rights reserved.
              </p>
              <p style="color: #a8a29e; font-size: 12px; margin: 10px 0 0;">
                <a href="https://backnineapparel.com/privacy" style="color: #78716c;">Privacy Policy</a> |
                <a href="https://backnineapparel.com/terms" style="color: #78716c;">Terms of Service</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      });
    } catch (emailError) {
      // Email failed but subscription was saved - log it but don't fail the request
      console.error("Email sending failed (domain not verified?):", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed! Check your email for your discount code.",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
