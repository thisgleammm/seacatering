import validator from "validator";

// Server-side DOMPurify setup
let DOMPurify: any;

if (typeof window === "undefined") {
  // Server-side
  const { JSDOM } = require("jsdom");
  const createDOMPurify = require("dompurify");
  const window = new JSDOM("").window;

  DOMPurify = createDOMPurify(window);
} else {
  // Client-side
  const createDOMPurify = require("dompurify");

  DOMPurify = createDOMPurify(window);
}

// Input validation schemas
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedData?: any;
}

// Email validation
export function validateEmail(email: string): ValidationResult {
  const errors: string[] = [];

  if (!email) {
    errors.push("Email is required");
  } else if (!validator.isEmail(email)) {
    errors.push("Invalid email format");
  } else if (email.length > 254) {
    errors.push("Email is too long");
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: email
      ? validator.normalizeEmail(email, {
          gmail_remove_dots: false,
          gmail_remove_subaddress: false,
          outlookdotcom_remove_subaddress: false,
          yahoo_remove_subaddress: false,
          icloud_remove_subaddress: false,
        }) || email.toLowerCase().trim()
      : email,
  };
}

// Phone validation
export function validatePhone(phone: string): ValidationResult {
  const errors: string[] = [];

  if (phone && !validator.isMobilePhone(phone, "any", { strictMode: false })) {
    errors.push("Invalid phone number format");
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: phone ? phone.replace(/[^\d+\-\(\)\s]/g, "").trim() : phone,
  };
}

// Password validation
export function validatePassword(password: string): ValidationResult {
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

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: password, // Don't sanitize passwords, use as-is
  };
}

// Name validation and sanitization
export function validateName(name: string): ValidationResult {
  const errors: string[] = [];

  if (!name) {
    errors.push("Name is required");
  } else if (name.length < 2) {
    errors.push("Name must be at least 2 characters long");
  } else if (name.length > 100) {
    errors.push("Name is too long");
  } else if (!/^[a-zA-Z\s\-'\.]+$/.test(name)) {
    errors.push("Name contains invalid characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: name ? DOMPurify.sanitize(name.trim()) : name,
  };
}

// Text input sanitization (for testimonials, allergies, etc.)
export function validateAndSanitizeText(
  text: string,
  maxLength = 1000,
  fieldName = "Text",
): ValidationResult {
  const errors: string[] = [];

  if (text && text.length > maxLength) {
    errors.push(`${fieldName} is too long (maximum ${maxLength} characters)`);
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
      errors.push(`${fieldName} contains potentially malicious content`);
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: text
      ? DOMPurify.sanitize(text.trim(), {
          ALLOWED_TAGS: [], // Remove all HTML tags
          ALLOWED_ATTR: [],
          KEEP_CONTENT: true,
        })
      : text,
  };
}

// Array validation for meal types and delivery days
export function validateArray(
  arr: any[],
  allowedValues: string[],
  fieldName: string,
): ValidationResult {
  const errors: string[] = [];

  if (!Array.isArray(arr)) {
    errors.push(`${fieldName} must be an array`);

    return { isValid: false, errors };
  }

  if (arr.length === 0) {
    errors.push(`${fieldName} cannot be empty`);
  }

  const invalidValues = arr.filter((value) => !allowedValues.includes(value));

  if (invalidValues.length > 0) {
    errors.push(
      `${fieldName} contains invalid values: ${invalidValues.join(", ")}`,
    );
  }

  // Remove duplicates and sanitize
  const filteredArray = arr.filter(
    (value) => typeof value === "string" && allowedValues.includes(value),
  );
  const sanitizedArray = Array.from(new Set(filteredArray));

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: sanitizedArray,
  };
}

// ID validation (for UUIDs)
export function validateId(id: string, fieldName = "ID"): ValidationResult {
  const errors: string[] = [];

  if (!id) {
    errors.push(`${fieldName} is required`);
  } else if (!validator.isUUID(id)) {
    errors.push(`${fieldName} must be a valid UUID`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: id ? id.trim() : id,
  };
}

// Rating validation
export function validateRating(rating: any): ValidationResult {
  const errors: string[] = [];

  const numRating = Number(rating);

  if (isNaN(numRating) || !Number.isInteger(numRating)) {
    errors.push("Rating must be a number");
  } else if (numRating < 1 || numRating > 5) {
    errors.push("Rating must be between 1 and 5");
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: numRating,
  };
}

// SQL injection protection (additional layer)
export function detectSqlInjection(input: string): boolean {
  const sqlPatterns = [
    /('|(\\'))|(;)|(\\)|(\-\-)|(%27)|(%3D)|(\/\\*)/gi,
    /union[\s\w]*select/gi,
    /select[\s\w]*from/gi,
    /insert[\s\w]*into/gi,
    /delete[\s\w]*from/gi,
    /update[\s\w]*set/gi,
    /drop[\s\w]*table/gi,
    /create[\s\w]*table/gi,
    /alter[\s\w]*table/gi,
    /exec[\s\w]*\(/gi,
    /execute[\s\w]*\(/gi,
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
}

// XSS protection
export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br"],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
}

// General input sanitization
export function sanitizeInput(input: any): any {
  if (typeof input === "string") {
    // Check for SQL injection patterns
    if (detectSqlInjection(input)) {
      throw new Error("Potentially malicious input detected");
    }

    // Sanitize HTML and trim
    return DOMPurify.sanitize(input.trim(), {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true,
    });
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }

  if (typeof input === "object" && input !== null) {
    const sanitized: any = {};

    for (const [key, value] of Object.entries(input)) {
      sanitized[key] = sanitizeInput(value);
    }

    return sanitized;
  }

  return input;
}

// Comprehensive validation for registration
export function validateRegistrationData(data: any): ValidationResult {
  const errors: string[] = [];
  const sanitizedData: any = {};

  // Validate name
  const nameValidation = validateName(data.name);

  if (!nameValidation.isValid) {
    errors.push(...nameValidation.errors);
  } else {
    sanitizedData.name = nameValidation.sanitizedData;
  }

  // Validate email
  const emailValidation = validateEmail(data.email);

  if (!emailValidation.isValid) {
    errors.push(...emailValidation.errors);
  } else {
    sanitizedData.email = emailValidation.sanitizedData;
  }

  // Validate password
  const passwordValidation = validatePassword(data.password);

  if (!passwordValidation.isValid) {
    errors.push(...passwordValidation.errors);
  } else {
    sanitizedData.password = passwordValidation.sanitizedData;
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData,
  };
}

// Comprehensive validation for subscription data
export function validateSubscriptionData(data: any): ValidationResult {
  const errors: string[] = [];
  const sanitizedData: any = {};

  // Valid options
  const validMealTypes = ["breakfast", "lunch", "dinner"];
  const validDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  // Validate plan ID
  const planValidation = validateId(data.planId || data.plan, "Plan ID");

  if (!planValidation.isValid) {
    errors.push(...planValidation.errors);
  } else {
    sanitizedData.planId = planValidation.sanitizedData;
  }

  // Validate meal types
  if (data.mealTypes) {
    const mealTypesValidation = validateArray(
      data.mealTypes,
      validMealTypes,
      "Meal types",
    );

    if (!mealTypesValidation.isValid) {
      errors.push(...mealTypesValidation.errors);
    } else {
      sanitizedData.mealTypes = mealTypesValidation.sanitizedData;
    }
  }

  // Validate delivery days
  if (data.deliveryDays) {
    const deliveryDaysValidation = validateArray(
      data.deliveryDays,
      validDays,
      "Delivery days",
    );

    if (!deliveryDaysValidation.isValid) {
      errors.push(...deliveryDaysValidation.errors);
    } else {
      sanitizedData.deliveryDays = deliveryDaysValidation.sanitizedData;
    }
  }

  // Validate allergies (optional)
  if (data.allergies) {
    const allergiesValidation = validateAndSanitizeText(
      data.allergies,
      500,
      "Allergies",
    );

    if (!allergiesValidation.isValid) {
      errors.push(...allergiesValidation.errors);
    } else {
      sanitizedData.allergies = allergiesValidation.sanitizedData;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData,
  };
}

// Comprehensive validation for testimonial data
export function validateTestimonialData(data: any): ValidationResult {
  const errors: string[] = [];
  const sanitizedData: any = {};

  // Validate plan ID
  const planValidation = validateId(data.plan, "Plan ID");

  if (!planValidation.isValid) {
    errors.push(...planValidation.errors);
  } else {
    sanitizedData.mealPlanId = planValidation.sanitizedData;
  }

  // Validate rating
  const ratingValidation = validateRating(data.rating);

  if (!ratingValidation.isValid) {
    errors.push(...ratingValidation.errors);
  } else {
    sanitizedData.rating = ratingValidation.sanitizedData;
  }

  // Validate message
  const messageValidation = validateAndSanitizeText(
    data.message,
    1000,
    "Message",
  );

  if (!messageValidation.isValid) {
    errors.push(...messageValidation.errors);
  } else {
    sanitizedData.message = messageValidation.sanitizedData;
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData,
  };
}
