import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";

import prisma from "@/lib/prisma";
import { validateRegistrationData, sanitizeInput } from "@/lib/validation";
import { checkRateLimit, getClientIP, securityHeaders } from "@/lib/security";

export async function POST(request: NextRequest) {
  // Add security headers
  const headers = new Headers();

  Object.entries(securityHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  try {
    // Rate limiting
    const clientIP = getClientIP(request);

    if (!checkRateLimit(`register_${clientIP}`, 5, 300000)) {
      // 5 requests per 5 minutes
      return NextResponse.json(
        { message: "Too many registration attempts. Please try again later." },
        { status: 429, headers },
      );
    }

    const rawData = await request.json();

    // Sanitize input first
    const sanitizedInput = sanitizeInput(rawData);

    // Comprehensive validation
    const validation = validateRegistrationData(sanitizedInput);

    if (!validation.isValid) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: validation.errors,
        },
        { status: 400, headers },
      );
    }

    const { name, email, password } = validation.sanitizedData;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400, headers },
      );
    }

    // Hash password with a secure number of rounds
    const hashedPassword = await hash(password, 12);

    // Create user with sanitized data
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Return response without sensitive data
    return NextResponse.json(
      {
        message: "User registered successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201, headers },
    );
  } catch {
    return NextResponse.json(
      { message: "Registration failed. Please try again." },
      { status: 500, headers },
    );
  }
}
