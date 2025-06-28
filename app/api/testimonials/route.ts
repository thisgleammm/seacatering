import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET() {
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

    return NextResponse.json(testimonials);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Failed to fetch testimonials", details: errorMessage },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, message, rating, plan } = body;

    if (!name || !message || !rating || !plan) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Create or find user
    const user = await prisma.user.create({
      data: {
        name,
        email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`, // Temporary email
        phone: null,
      },
    });

    // Create testimonial
    const testimonial = await prisma.testimonial.create({
      data: {
        userId: user.id,
        mealPlanId: plan,
        rating,
        message,
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

    return NextResponse.json(testimonial);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Failed to create testimonial", details: errorMessage },
      { status: 500 },
    );
  }
}
