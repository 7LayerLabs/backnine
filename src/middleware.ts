import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*"],
};

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get("authorization");
  const url = req.nextUrl;

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = atob(authValue).split(":");

    // TODO: Set these in your Vercel Environment Variables
    // USERNAME: admin
    // PASSWORD: (your secure password)
    const validUser = process.env.ADMIN_USER || "admin";
    const validPass = process.env.ADMIN_PASSWORD || "Rockyfore!";

    if (user === validUser && pwd === validPass) {
      return NextResponse.next();
    }
  }

  // Prompt for login
  url.pathname = "/api/auth";
  return new NextResponse("Auth Required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}
