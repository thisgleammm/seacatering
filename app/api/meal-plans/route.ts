import { NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import { securityHeaders } from "@/lib/security";

export async function GET() {
  // Add security headers
  const headers = new Headers();

  Object.entries(securityHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  try {
    const mealPlans = await prisma.mealPlan.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(mealPlans, { headers });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch meal plans" },
      { status: 500, headers },
    );
  }
}
