import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate that the user is subscribing for themselves
    if (data.userId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only create subscriptions for yourself" },
        { status: 403 },
      );
    }

    // Create the subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId: data.userId,
        planId: data.plan,
        mealTypes: data.mealTypes,
        deliveryDays: data.deliveryDays,
        allergies: data.allergies || "",
        status: "ACTIVE",
      },
    });

    return NextResponse.json(subscription);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Failed to create subscription", details: errorMessage },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's subscriptions
    const subscriptions = await prisma.subscription.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        mealPlan: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(subscriptions);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Failed to fetch subscriptions", details: errorMessage },
      { status: 500 },
    );
  }
}
