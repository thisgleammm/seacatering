import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const mealPlans = await prisma.mealPlan.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(mealPlans);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { error: "Failed to fetch meal plans", details: errorMessage },
      { status: 500 },
    );
  }
}
