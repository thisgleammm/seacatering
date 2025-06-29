import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import jwt from "jsonwebtoken";

import { authOptions } from "./authOptions";

const CSRF_SECRET = process.env.NEXTAUTH_SECRET || "fallback-secret";

// Generate CSRF token
export function generateCSRFToken(sessionId: string): string {
  const payload = {
    sessionId,
    timestamp: Date.now(),
    type: "csrf",
  };

  return jwt.sign(payload, CSRF_SECRET, { expiresIn: "1h" });
}

// Verify CSRF token
export function verifyCSRFToken(token: string, sessionId: string): boolean {
  try {
    const decoded = jwt.verify(token, CSRF_SECRET) as any;

    // Check if token is for this session
    if (decoded.sessionId !== sessionId) {
      return false;
    }

    // Check if token is not too old (additional check beyond JWT expiry)
    const tokenAge = Date.now() - decoded.timestamp;
    const maxAge = 60 * 60 * 1000; // 1 hour

    return tokenAge <= maxAge && decoded.type === "csrf";
  } catch {
    return false;
  }
}

// Middleware to check CSRF token for state-changing operations
export async function validateCSRFToken(
  request: NextRequest,
): Promise<{ isValid: boolean; error?: string }> {
  // Only check CSRF for state-changing methods
  const method = request.method;

  if (!["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
    return { isValid: true };
  }

  try {
    // Get session
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return { isValid: false, error: "No session found" };
    }

    // Get CSRF token from header or body
    const csrfToken =
      request.headers.get("x-csrf-token") || request.headers.get("csrf-token");

    if (!csrfToken) {
      return { isValid: false, error: "CSRF token missing" };
    }

    // Verify token
    const isValid = verifyCSRFToken(csrfToken, session.user.id);

    return {
      isValid,
      error: isValid ? undefined : "Invalid CSRF token",
    };
  } catch {
    return { isValid: false, error: "CSRF validation failed" };
  }
}

// Rate limiting state (in-memory for simplicity, use Redis in production)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Simple rate limiting
export function checkRateLimit(
  identifier: string,
  maxRequests = 10,
  windowMs = 60000,
): boolean {
  const now = Date.now();
  const current = requestCounts.get(identifier);

  if (!current || now > current.resetTime) {
    // New window or expired
    requestCounts.set(identifier, { count: 1, resetTime: now + windowMs });

    return true;
  }

  if (current.count >= maxRequests) {
    return false;
  }

  current.count++;

  return true;
}

// Get client IP for rate limiting
export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfIP = request.headers.get("cf-connecting-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  return realIP || cfIP || "unknown";
}

// Security headers
export const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'",
};
