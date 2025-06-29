import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { validateTestimonialData, sanitizeInput } from "@/lib/validation";
import {
  validateCSRFToken,
  checkRateLimit,
  securityHeaders,
} from "@/lib/security";

export async function GET() {
  // Add security headers
  const headers = new Headers();

  Object.entries(securityHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  try {
    const testimonials = await prisma.testimonial.findMany({
      include: {
        user: {
          select: {
            name: true,
          },
        },
        mealPlan: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(testimonials, { headers });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500, headers },
    );
  }
}

export async function POST(request: NextRequest) {
  // Add security headers
  const headers = new Headers();

  Object.entries(securityHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in to submit a testimonial" },
        { status: 401, headers },
      );
    }

    // Rate limiting
    if (!checkRateLimit(`testimonial_${session.user.id}`, 3, 300000)) {
      // 3 testimonials per 5 minutes
      return NextResponse.json(
        { error: "Too many testimonials submitted. Please try again later." },
        { status: 429, headers },
      );
    }

    // CSRF validation
    const csrfValidation = await validateCSRFToken(request);

    if (!csrfValidation.isValid) {
      return NextResponse.json(
        { error: csrfValidation.error || "CSRF validation failed" },
        { status: 403, headers },
      );
    }

    const rawData = await request.json();

    // Sanitize input
    const sanitizedInput = sanitizeInput(rawData);

    // Validate testimonial data
    const validation = validateTestimonialData(sanitizedInput);

    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.errors,
        },
        { status: 400, headers },
      );
    }

    const testimonialData = validation.sanitizedData;

    // Check if user has already submitted a testimonial for this meal plan
    const existingTestimonial = await prisma.testimonial.findFirst({
      where: {
        userId: session.user.id,
        mealPlanId: testimonialData.mealPlanId,
      },
    });

    if (existingTestimonial) {
      return NextResponse.json(
        {
          error: "You have already submitted a testimonial for this meal plan",
        },
        { status: 409, headers },
      );
    }

    // Verify meal plan exists
    const mealPlan = await prisma.mealPlan.findUnique({
      where: { id: testimonialData.mealPlanId },
    });

    if (!mealPlan) {
      return NextResponse.json(
        { error: "Invalid meal plan selected" },
        { status: 400, headers },
      );
    }

    // Create the testimonial
    const testimonial = await prisma.testimonial.create({
      data: {
        userId: session.user.id,
        mealPlanId: testimonialData.mealPlanId,
        message: testimonialData.message,
        rating: testimonialData.rating,
        date: new Date(),
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        mealPlan: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(testimonial, { headers });
  } catch {
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500, headers },
    );
  }
}
