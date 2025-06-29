import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
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
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "You must be logged in to submit a testimonial" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { message, rating, plan } = body;

    if (!message || !rating || !plan) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Verify meal plan exists
    const mealPlan = await prisma.mealPlan.findUnique({
      where: { id: plan },
    });

    if (!mealPlan) {
      return NextResponse.json(
        { error: "Invalid meal plan selected" },
        { status: 400 },
      );
    }

    // Create testimonial using the authenticated user
    const testimonial = await prisma.testimonial.create({
      data: {
        userId: session.user.id,
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
  } catch {
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 },
    );
  }
}
