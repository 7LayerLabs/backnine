import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { adminDb, tx, id } from "@/lib/instant-admin";
import { logError } from "@/lib/error-logger";
import { fulfillOrder } from "@/lib/fulfillment";

const resend = new Resend(process.env.RESEND_API_KEY);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    await logError({
      error: err,
      context: "stripe-webhook",
      severity: "critical",
      metadata: { stage: "signature-verification" },
    });
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Retrieve the full session with line items
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items.data.price.product"],
      });

      // Build order items from line items
      const orderItems = fullSession.line_items?.data.map((item) => {
        const product = item.price?.product as Stripe.Product;
        return {
          name: product?.name || item.description || "Unknown Product",
          description: product?.description || "",
          quantity: item.quantity || 1,
          price: (item.amount_total || 0) / 100, // Convert from cents
        };
      }) || [];

      // Get shipping details - use fullSession which has the expanded data
      const shipping = (fullSession as unknown as { shipping_details?: { name?: string; address?: { line1?: string; line2?: string; city?: string; state?: string; postal_code?: string; country?: string } } }).shipping_details;
      const customerEmail = fullSession.customer_details?.email;
      const customerName = fullSession.customer_details?.name;

      // Check if this is a Rocky Roast (digital product) - auto-complete these
      // Check both session objects for metadata (belt and suspenders approach)
      const isRockyRoast = fullSession.metadata?.isRockyRoast === "true" || session.metadata?.isRockyRoast === "true";

      console.log(`[Rocky Roast Debug] Session ID: ${session.id}`);
      console.log(`[Rocky Roast Debug] Original session metadata:`, JSON.stringify(session.metadata));
      console.log(`[Rocky Roast Debug] Full session metadata:`, JSON.stringify(fullSession.metadata));
      console.log(`[Rocky Roast Debug] isRockyRoast: ${isRockyRoast}`);

      // Save order to InstantDB
      const orderId = id();
      await adminDb.transact([
        tx.orders[orderId].update({
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent as string,
          items: JSON.stringify(orderItems),
          total: (session.amount_total || 0) / 100,
          subtotal: (session.amount_subtotal || 0) / 100,
          shippingCost: (session.shipping_cost?.amount_total || 0) / 100,
          status: isRockyRoast ? "delivered" : "paid", // Digital products auto-complete
          customerEmail: customerEmail || "",
          customerName: customerName || "",
          shippingAddress: shipping ? JSON.stringify({
            name: shipping.name,
            line1: shipping.address?.line1,
            line2: shipping.address?.line2,
            city: shipping.address?.city,
            state: shipping.address?.state,
            postalCode: shipping.address?.postal_code,
            country: shipping.address?.country,
          }) : "",
          isDigitalProduct: isRockyRoast, // Flag for digital products
          createdAt: Date.now(),
        }),
      ]);

      console.log(`Order ${orderId} saved for session ${session.id}`);

      // Send notification email to you
      const itemsList = orderItems.map(item =>
        `• ${item.quantity}x ${item.name} - $${item.price.toFixed(2)}`
      ).join('\n');

      const shippingText = shipping ?
        `${shipping.name}\n${shipping.address?.line1}${shipping.address?.line2 ? '\n' + shipping.address.line2 : ''}\n${shipping.address?.city}, ${shipping.address?.state} ${shipping.address?.postal_code}`
        : 'No shipping address';

      await resend.emails.send({
        from: "Back Nine Orders <hello@backnineshop.com>",
        to: "hello@backnineshop.com",
        subject: `New Order! $${((session.amount_total || 0) / 100).toFixed(2)} from ${customerName || customerEmail}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head><meta charset="utf-8"></head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background: #f5f5f4;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px;">
              <h1 style="color: #1e3a5f; margin-top: 0;">New Order Received!</h1>

              <div style="background: #ecfdf5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 24px; font-weight: bold; color: #059669;">$${((session.amount_total || 0) / 100).toFixed(2)}</p>
              </div>

              <h3 style="color: #44403c;">Customer</h3>
              <p>${customerName || 'No name'}<br>${customerEmail}</p>

              <h3 style="color: #44403c;">Ship To</h3>
              <p style="white-space: pre-line;">${shippingText}</p>

              <h3 style="color: #44403c;">Items</h3>
              <pre style="background: #fafaf9; padding: 15px; border-radius: 4px; white-space: pre-wrap;">${itemsList}</pre>

              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e7e5e4;">
                <a href="https://www.backnineshop.com/admin/orders" style="display: inline-block; background: #1e3a5f; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">View Order</a>
              </div>
            </div>
          </body>
          </html>
        `,
      });

      console.log(`Notification email sent for order ${orderId}`);

      // Send order confirmation email to customer
      if (customerEmail) {
        const orderNumber = orderId.slice(-8).toUpperCase();

        // Special confirmation email for Rocky Roast purchases
        if (isRockyRoast) {
          // Get the roast message for the buyer's confirmation
          const buyerMetadata = fullSession.metadata || session.metadata || {};
          const buyerRoastMessage = [
            buyerMetadata.roastMessage || "",
            buyerMetadata.roastMessagePart2 || "",
            buyerMetadata.roastMessagePart3 || "",
            buyerMetadata.roastMessagePart4 || "",
          ].join("");

          await resend.emails.send({
            from: "Back Nine Apparel <hello@backnineshop.com>",
            to: customerEmail,
            subject: `Roast Delivered! Rocky has been notified.`,
            html: `
              <!DOCTYPE html>
              <html>
              <head><meta charset="utf-8"></head>
              <body style="font-family: Georgia, serif; padding: 40px; background: #1a1a1a; color: #e5e5e5;">
                <div style="max-width: 600px; margin: 0 auto; background: #0d0d0d; padding: 40px; border-radius: 8px; border: 1px solid #333;">
                  <h1 style="color: #22c55e; margin-top: 0; text-align: center;">Roast Delivered!</h1>

                  <p style="text-align: center; color: #888; font-size: 16px;">
                    Rocky just received your roast. He has no idea who sent it.<br>
                    Your identity remains completely anonymous.
                  </p>

                  <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">

                  <h3 style="color: #e5e5e5; margin-bottom: 15px;">Here's what you sent:</h3>

                  <div style="background: #1a1a1a; padding: 20px; border-radius: 8px; border-left: 3px solid #22c55e;">
                    <pre style="white-space: pre-wrap; font-family: Georgia, serif; color: #ccc; margin: 0; font-size: 14px; line-height: 1.6;">${buyerRoastMessage}</pre>
                  </div>

                  <hr style="border: none; border-top: 1px solid #333; margin: 30px 0;">

                  <p style="text-align: center; color: #666; font-size: 14px;">
                    Want to roast Rocky again?<br>
                    <a href="https://www.backnineshop.com/rocky-roast" style="color: #22c55e;">Send another roast</a>
                  </p>

                  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #333;">
                    <a href="https://www.backnineshop.com" style="color: #888; text-decoration: none; font-size: 14px;">Back Nine Apparel</a>
                  </div>
                </div>
              </body>
              </html>
            `,
          });

          console.log(`Rocky Roast confirmation email sent to ${customerEmail}`);
        } else {
          // Regular order confirmation for non-roast purchases
          const itemsHtml = orderItems.map(item =>
            `<tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e7e5e4;">
                <strong>${item.name}</strong><br>
                <span style="color: #78716c;">Qty: ${item.quantity}</span>
              </td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e7e5e4; text-align: right;">$${item.price.toFixed(2)}</td>
            </tr>`
          ).join('');

          const shippingHtml = shipping ? `
            <p style="margin: 0;">
              ${shipping.name}<br>
              ${shipping.address?.line1}<br>
              ${shipping.address?.line2 ? shipping.address.line2 + '<br>' : ''}
              ${shipping.address?.city}, ${shipping.address?.state} ${shipping.address?.postal_code}
            </p>
          ` : '';

          await resend.emails.send({
            from: "Back Nine Apparel <hello@backnineshop.com>",
            to: customerEmail,
            subject: `Order Confirmed! #${orderNumber}`,
            html: `
              <!DOCTYPE html>
              <html>
              <head><meta charset="utf-8"></head>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background: #f5f5f4;">
                <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px;">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #1e3a5f; margin: 0;">Thanks for your order!</h1>
                    <p style="color: #78716c; margin-top: 10px;">Order #${orderNumber}</p>
                  </div>

                  <p>Hey ${customerName || 'there'},</p>

                  <p>We've received your order and are getting it ready. You'll receive another email when it ships.</p>

                  <div style="background: #fafaf9; padding: 20px; border-radius: 8px; margin: 25px 0;">
                    <h3 style="margin-top: 0; color: #44403c;">Order Summary</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                      ${itemsHtml}
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e7e5e4; color: #78716c;">Subtotal</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e7e5e4; text-align: right;">$${((session.amount_subtotal || 0) / 100).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e7e5e4; color: #78716c;">Shipping</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #e7e5e4; text-align: right;">${(session.shipping_cost?.amount_total || 0) === 0 ? 'Free' : '$' + ((session.shipping_cost?.amount_total || 0) / 100).toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 12px 0; font-weight: bold;">Total</td>
                        <td style="padding: 12px 0; text-align: right; font-weight: bold;">$${((session.amount_total || 0) / 100).toFixed(2)}</td>
                      </tr>
                    </table>
                  </div>

                  ${shipping ? `
                  <div style="margin: 25px 0;">
                    <h3 style="margin-bottom: 10px; color: #44403c;">Shipping To</h3>
                    ${shippingHtml}
                  </div>
                  ` : ''}

                  <div style="text-align: center; margin-top: 30px;">
                    <a href="https://www.backnineshop.com/orders?email=${encodeURIComponent(customerEmail)}&order=${orderNumber}" style="display: inline-block; background: #1e3a5f; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 500;">Track Your Order</a>
                  </div>

                  <p style="color: #78716c; font-size: 14px; margin-top: 30px;">
                    Questions about your order? Just reply to this email and we'll help you out.
                  </p>

                  <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e7e5e4;">
                    <a href="https://www.backnineshop.com" style="color: #1e3a5f; text-decoration: none; font-weight: 500;">www.backnineshop.com</a>
                  </div>
                </div>
              </body>
              </html>
            `,
          });

          console.log(`Order confirmation email sent to ${customerEmail}`);
        }

        // === FULFILLMENT: Route order to Printify/Printful ===
        // Skip fulfillment for digital products (Rocky Roast)
        if (!isRockyRoast && shipping) {
          try {
            console.log(`[Fulfillment] Starting fulfillment for order ${orderId}`);

            const isExpressShipping = (session.shipping_cost?.amount_total || 0) > 0;

            const fulfillmentResults = await fulfillOrder(
              orderId,
              orderItems,
              customerName || '',
              customerEmail || '',
              {
                name: shipping.name,
                line1: shipping.address?.line1,
                line2: shipping.address?.line2,
                city: shipping.address?.city,
                state: shipping.address?.state,
                postal_code: shipping.address?.postal_code,
                country: shipping.address?.country,
              },
              isExpressShipping
            );

            // Log fulfillment results
            for (const result of fulfillmentResults) {
              if (result.success) {
                console.log(`[Fulfillment] ${result.provider} order created: ${result.orderId}`);
              } else {
                console.error(`[Fulfillment] ${result.provider} order failed: ${result.error}`);
              }
            }

            // Update order with fulfillment status
            const successfulFulfillments = fulfillmentResults.filter(r => r.success);
            const failedFulfillments = fulfillmentResults.filter(r => !r.success);

            if (successfulFulfillments.length > 0) {
              await adminDb.transact([
                tx.orders[orderId].update({
                  fulfillmentStatus: failedFulfillments.length > 0 ? 'partial' : 'submitted',
                  fulfillmentProviders: JSON.stringify(
                    successfulFulfillments.map(r => ({
                      provider: r.provider,
                      orderId: r.orderId,
                    }))
                  ),
                }),
              ]);
              console.log(`[Fulfillment] Order ${orderId} fulfillment status updated`);
            }

            // Handle failed fulfillments (items that couldn't be sent to POD)
            if (failedFulfillments.length > 0 && successfulFulfillments.length === 0) {
              // ALL items failed - this is critical
              await adminDb.transact([
                tx.orders[orderId].update({
                  fulfillmentStatus: 'failed',
                  fulfillmentError: failedFulfillments.map(f => f.error).join('; '),
                }),
              ]);

              // Send alert email
              await resend.emails.send({
                from: "Back Nine Alerts <hello@backnineshop.com>",
                to: "hello@backnineshop.com",
                subject: `FULFILLMENT FAILED - Order ${orderId.slice(-8).toUpperCase()}`,
                html: `
                  <h2 style="color: #dc2626;">Fulfillment Failed!</h2>
                  <p>An order was paid but could NOT be sent to Printify/Printful.</p>
                  <p><strong>Order ID:</strong> ${orderId}</p>
                  <p><strong>Customer:</strong> ${customerName || customerEmail}</p>
                  <p><strong>Errors:</strong></p>
                  <ul>${failedFulfillments.map(f => `<li>${f.provider}: ${f.error}</li>`).join('')}</ul>
                  <p><strong>Items:</strong></p>
                  <ul>${orderItems.map(item => `<li>${item.quantity}x ${item.name}</li>`).join('')}</ul>
                  <hr>
                  <p>Go to <a href="https://www.backnineshop.com/admin/orders">Admin Orders</a> to investigate.</p>
                `,
              });
            } else if (failedFulfillments.length > 0) {
              // Some items failed - partial fulfillment
              console.warn(`[Fulfillment] Partial fulfillment for order ${orderId}:`, failedFulfillments);
            }
          } catch (fulfillmentError) {
            console.error('[Fulfillment] Error:', fulfillmentError);

            // Update order with failed fulfillment status
            try {
              await adminDb.transact([
                tx.orders[orderId].update({
                  fulfillmentStatus: 'failed',
                  fulfillmentError: fulfillmentError instanceof Error ? fulfillmentError.message : 'Unknown error',
                }),
              ]);
            } catch (updateError) {
              console.error('[Fulfillment] Failed to update order status:', updateError);
            }

            // Log the error
            await logError({
              error: fulfillmentError,
              context: 'fulfillment',
              severity: 'critical', // Upgraded to critical so it sends email
              metadata: {
                orderId,
                sessionId: session.id,
                customerEmail: customerEmail || '',
                itemCount: orderItems.length,
              },
            });

            // Send explicit fulfillment failure alert
            try {
              await resend.emails.send({
                from: "Back Nine Alerts <hello@backnineshop.com>",
                to: "hello@backnineshop.com",
                subject: `FULFILLMENT FAILED - Order ${orderId.slice(-8).toUpperCase()}`,
                html: `
                  <h2 style="color: #dc2626;">Fulfillment Failed!</h2>
                  <p>An order was paid but could NOT be sent to Printify/Printful.</p>
                  <p><strong>Order ID:</strong> ${orderId}</p>
                  <p><strong>Customer:</strong> ${customerName || customerEmail}</p>
                  <p><strong>Error:</strong> ${fulfillmentError instanceof Error ? fulfillmentError.message : 'Unknown error'}</p>
                  <p><strong>Items:</strong></p>
                  <ul>${orderItems.map(item => `<li>${item.quantity}x ${item.name}</li>`).join('')}</ul>
                  <hr>
                  <p>Go to <a href="https://www.backnineshop.com/admin/orders">Admin Orders</a> to manually fulfill.</p>
                  <p>Run diagnostic: <code>GET /api/admin/fulfillment-diagnostic</code></p>
                `,
              });
            } catch (emailError) {
              console.error('[Fulfillment] Failed to send alert email:', emailError);
            }
          }
        }

        // Mark any abandoned cart as recovered
        try {
          const cartsResult = await adminDb.query({ abandonedCarts: {} });
          interface AbandonedCart {
            id: string;
            email: string;
            recovered: boolean;
          }
          const abandonedCarts = (cartsResult.abandonedCarts || []) as AbandonedCart[];
          const matchingCart = abandonedCarts.find(
            (cart) => cart.email.toLowerCase() === customerEmail.toLowerCase() && !cart.recovered
          );

          if (matchingCart) {
            await adminDb.transact([
              tx.abandonedCarts[matchingCart.id].update({
                recovered: true,
              }),
            ]);
            console.log(`Marked abandoned cart ${matchingCart.id} as recovered`);
          }
        } catch (cartError) {
          // Non-critical - just log it
          console.error("Failed to mark abandoned cart as recovered:", cartError);
        }
      }

      // Send Rocky Roast email if this is a digital roast purchase
      // NOTE: This is OUTSIDE the customerEmail check to ensure Rocky always gets his roast
      console.log(`[Rocky Roast] Checking if should send roast email. isRockyRoast: ${isRockyRoast}`);

      if (isRockyRoast) {
        console.log(`[Rocky Roast] YES - This is a Rocky Roast purchase! Preparing to send email...`);

        // Reconstruct the roast message from metadata parts (check both session objects)
        const metadata = fullSession.metadata || session.metadata || {};
        const roastMessage = [
          metadata.roastMessage || "",
          metadata.roastMessagePart2 || "",
          metadata.roastMessagePart3 || "",
          metadata.roastMessagePart4 || "",
        ].join("");

        console.log(`[Rocky Roast] Roast message length: ${roastMessage.length}`);
        console.log(`[Rocky Roast] Roast message preview: ${roastMessage.substring(0, 100)}...`);

        if (!roastMessage || roastMessage.trim().length === 0) {
          console.error(`[Rocky Roast] ERROR: Roast message is empty! Metadata:`, JSON.stringify(metadata));
          await logError({
            error: new Error("Rocky Roast message was empty"),
            context: "rocky-roast-email",
            severity: "high",
            metadata: {
              sessionId: session.id,
              fullSessionMetadata: JSON.stringify(fullSession.metadata),
              originalSessionMetadata: JSON.stringify(session.metadata),
            },
          });
        }

        // Convert newlines to <br> tags and wrap in paragraphs
        const formattedRoast = roastMessage
          .split("\n\n")
          .filter(p => p.trim())
          .map(p => `<p style="font-size: 18px; line-height: 1.8; margin-bottom: 25px;">${p.replace(/\n/g, "<br>")}</p>`)
          .join("");

        try {
          // Send the roast email to Rocky
          const rockyEmailResult = await resend.emails.send({
            from: "Back Nine Apparel <hello@backnineshop.com>",
            to: "rrburke2018@gmail.com",
            subject: "Someone Paid Real Money to Tell You This",
            html: `
              <!DOCTYPE html>
              <html>
              <head><meta charset="utf-8"></head>
              <body style="font-family: Georgia, serif; padding: 40px; background: #1a1a1a; color: #e5e5e5;">
                <div style="max-width: 600px; margin: 0 auto; background: #0d0d0d; padding: 40px; border-radius: 8px; border: 1px solid #333;">

                  ${formattedRoast}

                  <p style="font-size: 18px; line-height: 1.8; font-style: italic; color: #888; margin-top: 40px;">
                    — Delivered by Back Nine Apparel<br>
                    <span style="font-size: 14px;">Someone paid $1 to send you this. Let that sink in.</span>
                  </p>

                </div>
              </body>
              </html>
            `,
          });

          console.log(`Rocky Roast email sent successfully! Resend ID: ${rockyEmailResult.data?.id}`);

          // Also send a notification to admin that a roast was sent
          await resend.emails.send({
            from: "Back Nine Apparel <hello@backnineshop.com>",
            to: "hello@backnineshop.com",
            subject: `🔥 Rocky Roast Sent! (Resend ID: ${rockyEmailResult.data?.id})`,
            html: `
              <h2>A Rocky Roast was just delivered!</h2>
              <p><strong>Resend Email ID:</strong> ${rockyEmailResult.data?.id}</p>
              <p><strong>Session ID:</strong> ${session.id}</p>
              <p><strong>Customer:</strong> ${customerName || customerEmail || 'Unknown'}</p>
              <hr>
              <h3>Roast Preview:</h3>
              <pre style="background: #f5f5f5; padding: 15px; white-space: pre-wrap;">${roastMessage.substring(0, 500)}...</pre>
            `,
          });
        } catch (rockyEmailError) {
          console.error(`Failed to send Rocky Roast email:`, rockyEmailError);
          await logError({
            error: rockyEmailError,
            context: "rocky-roast-email",
            severity: "high",
            metadata: {
              sessionId: session.id,
              roastMessageLength: roastMessage.length,
            },
          });
        }
      }
    } catch (error) {
      await logError({
        error,
        context: "stripe-webhook",
        severity: "critical",
        metadata: {
          stage: "order-save",
          sessionId: session.id,
          paymentIntent: session.payment_intent,
          customerEmail: session.customer_details?.email,
        },
      });
      // Return 200 anyway to acknowledge receipt - we don't want Stripe to retry
      // Error logged for manual investigation
    }
  }

  return NextResponse.json({ received: true });
}
