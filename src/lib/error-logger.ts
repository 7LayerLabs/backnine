import { adminDb, tx, id } from "@/lib/instant-admin";
import { Resend } from "resend";

type ErrorSeverity = "low" | "medium" | "high" | "critical";

interface ErrorLogOptions {
  error: Error | unknown;
  context: string; // e.g., "stripe-webhook", "checkout", "ship-order"
  severity: ErrorSeverity;
  metadata?: Record<string, unknown>;
  notify?: boolean; // Send email notification (default: true for critical)
}

interface ErrorRecord {
  id: string;
  context: string;
  severity: ErrorSeverity;
  message: string;
  stack?: string;
  metadata?: string;
  createdAt: number;
  resolved: boolean;
}

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Log an error to InstantDB and optionally send email notification
 */
export async function logError({
  error,
  context,
  severity,
  metadata,
  notify,
}: ErrorLogOptions): Promise<string | null> {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const errorStack = error instanceof Error ? error.stack : undefined;
  const errorId = id();

  // Always log to console for Vercel's function logs
  console.error(`[${severity.toUpperCase()}] ${context}:`, errorMessage);
  if (errorStack) console.error(errorStack);
  if (metadata) console.error("Metadata:", JSON.stringify(metadata, null, 2));

  try {
    // Save to InstantDB
    await adminDb.transact([
      tx.errors[errorId].update({
        context,
        severity,
        message: errorMessage,
        stack: errorStack || "",
        metadata: metadata ? JSON.stringify(metadata) : "",
        createdAt: Date.now(),
        resolved: false,
      }),
    ]);

    // Send email notification for critical errors or when explicitly requested
    const shouldNotify = notify ?? severity === "critical";
    if (shouldNotify && process.env.RESEND_API_KEY) {
      await sendErrorNotification({
        errorId,
        context,
        severity,
        message: errorMessage,
        stack: errorStack,
        metadata,
      });
    }

    return errorId;
  } catch (logError) {
    // If logging fails, at least we have console output
    console.error("Failed to save error to database:", logError);
    return null;
  }
}

async function sendErrorNotification({
  errorId,
  context,
  severity,
  message,
  stack,
  metadata,
}: {
  errorId: string;
  context: string;
  severity: ErrorSeverity;
  message: string;
  stack?: string;
  metadata?: Record<string, unknown>;
}) {
  const severityColors: Record<ErrorSeverity, string> = {
    low: "#3b82f6",
    medium: "#f59e0b",
    high: "#ef4444",
    critical: "#dc2626",
  };

  const metadataHtml = metadata
    ? `<pre style="background: #f5f5f4; padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 12px;">${JSON.stringify(metadata, null, 2)}</pre>`
    : "";

  const stackHtml = stack
    ? `<pre style="background: #fef2f2; padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 11px; color: #991b1b;">${stack}</pre>`
    : "";

  try {
    await resend.emails.send({
      from: "Back Nine Alerts <hello@backnineshop.com>",
      to: "hello@backnineshop.com",
      subject: `[${severity.toUpperCase()}] Error in ${context}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; background: #f5f5f4;">
          <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px;">
              <span style="background: ${severityColors[severity]}; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold;">${severity.toUpperCase()}</span>
              <span style="color: #78716c; font-size: 14px;">${context}</span>
            </div>

            <h2 style="color: #1e3a5f; margin-top: 0;">Error Alert</h2>

            <div style="background: #fef2f2; border-left: 4px solid ${severityColors[severity]}; padding: 15px; margin-bottom: 20px;">
              <p style="margin: 0; color: #991b1b; font-weight: 500;">${message}</p>
            </div>

            ${metadataHtml ? `<h3 style="color: #44403c; margin-bottom: 10px;">Context</h3>${metadataHtml}` : ""}

            ${stackHtml ? `<h3 style="color: #44403c; margin-bottom: 10px;">Stack Trace</h3>${stackHtml}` : ""}

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e7e5e4;">
              <p style="color: #78716c; font-size: 12px; margin: 0;">
                Error ID: ${errorId}<br>
                Time: ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} ET
              </p>
              <a href="https://www.backnineshop.com/admin/errors" style="display: inline-block; margin-top: 15px; background: #1e3a5f; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 14px;">View All Errors</a>
            </div>
          </div>
        </body>
        </html>
      `,
    });
  } catch (emailError) {
    console.error("Failed to send error notification email:", emailError);
  }
}

/**
 * Mark an error as resolved
 */
export async function resolveError(errorId: string): Promise<boolean> {
  try {
    await adminDb.transact([
      tx.errors[errorId].update({
        resolved: true,
        resolvedAt: Date.now(),
      }),
    ]);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get recent errors from the database
 */
export async function getRecentErrors(limit = 50): Promise<ErrorRecord[]> {
  try {
    const result = await adminDb.query({ errors: {} });
    const errors = (result.errors || []) as ErrorRecord[];
    return errors
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, limit);
  } catch {
    return [];
  }
}
