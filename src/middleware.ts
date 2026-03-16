import { NextRequest, NextResponse } from "next/server";
import {
  checkRateLimit,
  getClientIp,
  API_RATE_LIMIT,
  AUTH_RATE_LIMIT,
} from "@/lib/rate-limit";
import { generateRequestId } from "@/lib/logger";

// ============================================
// CORS Configuration
// ============================================
const ALLOWED_ORIGINS = [
  "https://llmtrust.com",
  "https://www.llmtrust.com",
  // Allow localhost in development
  ...(process.env.NODE_ENV === "development"
    ? ["http://localhost:3000", "http://localhost:3001"]
    : []),
];

function getCorsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {};

  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] =
      "Content-Type, Authorization, X-API-Key";
    headers["Access-Control-Max-Age"] = "86400";
    headers["Access-Control-Allow-Credentials"] = "true";
  }

  return headers;
}

// ============================================
// Content Security Policy
// ============================================
const CSP_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.sentry.io https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://*.sentry.io https://vitals.vercel-insights.com wss: https:",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

// ============================================
// Security Headers
// ============================================
function getSecurityHeaders(): Record<string, string> {
  return {
    "Content-Security-Policy": CSP_DIRECTIVES,
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy":
      "camera=(), microphone=(), geolocation=(), payment=()",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
  };
}

// ============================================
// Middleware
// ============================================
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const origin = req.headers.get("origin");
  const ip = getClientIp(req as unknown as Request);

  // Generate request ID for correlation across logs, traces, and responses
  const requestId = generateRequestId();

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    const corsHeaders = getCorsHeaders(origin);
    if (corsHeaders["Access-Control-Allow-Origin"]) {
      return new NextResponse(null, {
        status: 204,
        headers: corsHeaders,
      });
    }
    return new NextResponse(null, { status: 403 });
  }

  // -------------------------------------------
  // Rate Limiting
  // -------------------------------------------

  // Auth endpoints: stricter rate limit
  if (pathname.startsWith("/api/auth")) {
    const result = checkRateLimit(`auth:${ip}`, AUTH_RATE_LIMIT);
    if (!result.allowed) {
      return new NextResponse(
        JSON.stringify({ error: "Too many authentication attempts", requestId }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(result.retryAfter ?? 60),
            "X-Request-ID": requestId,
            ...getSecurityHeaders(),
          },
        },
      );
    }
  }

  // General API rate limit (excluding auth, which has its own)
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth")) {
    const result = checkRateLimit(`api:${ip}`, API_RATE_LIMIT);
    if (!result.allowed) {
      return new NextResponse(
        JSON.stringify({ error: "Rate limit exceeded", requestId }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(result.retryAfter ?? 60),
            "X-Request-ID": requestId,
            ...getSecurityHeaders(),
          },
        },
      );
    }
  }

  // -------------------------------------------
  // Build response
  // -------------------------------------------
  const response = NextResponse.next();

  // Attach correlation ID to every response
  response.headers.set("X-Request-ID", requestId);

  // Apply security headers
  const securityHeaders = getSecurityHeaders();
  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }

  // Apply CORS headers
  const corsHeaders = getCorsHeaders(origin);
  for (const [key, value] of Object.entries(corsHeaders)) {
    response.headers.set(key, value);
  }

  return response;
}

export const config = {
  matcher: [
    // Match all API routes
    "/api/:path*",
    // Match all pages except static files
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
