"use client";

// Client-side CSRF token management
let csrfToken: string | null = null;

export async function getCSRFToken(): Promise<string | null> {
  if (csrfToken) {
    return csrfToken;
  }

  try {
    const response = await fetch("/api/csrf-token");

    if (response.ok) {
      const data = await response.json();

      csrfToken = data.csrfToken;

      return csrfToken;
    }
  } catch {
    // CSRF token fetch failed - return null
  }

  return null;
}

export function clearCSRFToken() {
  csrfToken = null;
}

// Enhanced fetch wrapper with CSRF protection and input sanitization
export async function securedFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const {
    method = "GET",
    headers: customHeaders = {},
    body,
    ...otherOptions
  } = options;

  const headers = new Headers(customHeaders as HeadersInit);

  // Add CSRF token for state-changing operations
  if (["POST", "PUT", "DELETE", "PATCH"].includes(method.toUpperCase())) {
    const token = await getCSRFToken();

    if (token) {
      headers.set("X-CSRF-Token", token);
    }
  }

  // Sanitize request body if it's JSON
  let sanitizedBody = body;

  if (body && headers.get("content-type")?.includes("application/json")) {
    try {
      const parsed = JSON.parse(body as string);

      sanitizedBody = JSON.stringify(sanitizeClientInput(parsed));
    } catch {
      // Body sanitization failed - use original body
    }
  }

  return fetch(url, {
    method,
    headers,
    body: sanitizedBody,
    ...otherOptions,
  });
}

// Client-side input sanitization (basic)
function sanitizeClientInput(input: any): any {
  if (typeof input === "string") {
    // Remove potential script tags and dangerous content
    return input
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/vbscript:/gi, "")
      .replace(/onload\s*=/gi, "")
      .replace(/onerror\s*=/gi, "")
      .replace(/onclick\s*=/gi, "")
      .trim();
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeClientInput);
  }

  if (typeof input === "object" && input !== null) {
    const sanitized: any = {};

    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeClientInput(value);
    }

    return sanitized;
  }

  return input;
}

// Form validation helpers
export function validateEmailClient(email: string): {
  isValid: boolean;
  error?: string;
} {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return { isValid: false, error: "Email is required" };
  }

  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Invalid email format" };
  }

  if (email.length > 254) {
    return { isValid: false, error: "Email is too long" };
  }

  return { isValid: true };
}

export function validatePasswordClient(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!password) {
    errors.push("Password is required");
  } else {
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }
    if (password.length > 128) {
      errors.push("Password is too long");
    }
    if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    if (!/(?=.*\d)/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(password)) {
      errors.push("Password must contain at least one special character");
    }
  }

  return { isValid: errors.length === 0, errors };
}

export function validateNameClient(name: string): {
  isValid: boolean;
  error?: string;
} {
  if (!name) {
    return { isValid: false, error: "Name is required" };
  }

  if (name.length < 2) {
    return { isValid: false, error: "Name must be at least 2 characters long" };
  }

  if (name.length > 100) {
    return { isValid: false, error: "Name is too long" };
  }

  if (!/^[a-zA-Z\s\-'\.]+$/.test(name)) {
    return { isValid: false, error: "Name contains invalid characters" };
  }

  return { isValid: true };
}

export function validateRatingClient(rating: number): {
  isValid: boolean;
  error?: string;
} {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { isValid: false, error: "Rating must be between 1 and 5" };
  }

  return { isValid: true };
}

export function validateTextClient(
  text: string,
  maxLength = 1000,
  fieldName = "Text",
): { isValid: boolean; error?: string } {
  if (text && text.length > maxLength) {
    return {
      isValid: false,
      error: `${fieldName} is too long (maximum ${maxLength} characters)`,
    };
  }

  // Check for potentially malicious content
  const suspiciousPatterns = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /vbscript:/gi,
    /onload\s*=/gi,
    /onerror\s*=/gi,
    /onclick\s*=/gi,
    /onmouseover\s*=/gi,
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(text)) {
      return {
        isValid: false,
        error: `${fieldName} contains potentially malicious content`,
      };
    }
  }

  return { isValid: true };
}
