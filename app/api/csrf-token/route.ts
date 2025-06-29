import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { generateCSRFToken, securityHeaders } from "@/lib/security";

export async function GET() {
  // Add security headers
  const headers = new Headers();

  Object.entries(securityHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers },
      );
    }

    const csrfToken = generateCSRFToken(session.user.id);

    return NextResponse.json({ csrfToken }, { headers });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate CSRF token" },
      { status: 500, headers },
    );
  }
}
