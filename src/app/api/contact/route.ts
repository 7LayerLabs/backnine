import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Send email to hello@backnineshop.com
    const result = await resend.emails.send({
      from: "Back Nine Contact Form <hello@backnineshop.com>",
      to: "hello@backnineshop.com",
      replyTo: email,
      subject: `New Contact Form Message from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: #f5f5f4; padding: 30px; border-radius: 8px;">
            <h2 style="color: #1e3a5f; margin-top: 0;">New Contact Form Submission</h2>
            <div style="background: white; padding: 20px; border-radius: 8px; margin-top: 20px;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Message:</strong></p>
              <p style="white-space: pre-wrap; background: #fafaf9; padding: 15px; border-radius: 4px;">${message}</p>
            </div>
            <p style="color: #78716c; font-size: 12px; margin-top: 20px;">
              Reply directly to this email to respond to ${name}.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Resend result:", result);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
