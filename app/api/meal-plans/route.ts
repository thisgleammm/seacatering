import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
