import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { validateSubscriptionData, sanitizeInput } from "@/lib/validation";
import {
  validateCSRFToken,
  checkRateLimit,
  securityHeaders,
} from "@/lib/security";

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
        { error: "Unauthorized" },
        { status: 401, headers },
      );
    }

    // Rate limiting
    if (!checkRateLimit(`subscription_${session.user.id}`, 5, 60000)) {
      // 5 requests per minute
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
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

    // Validate subscription data
    const validation = validateSubscriptionData(sanitizedInput);

    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.errors,
        },
        { status: 400, headers },
      );
    }

    const subscriptionData = validation.sanitizedData;

    // Validate that the user is subscribing for themselves
    if (
      subscriptionData.userId &&
      subscriptionData.userId !== session.user.id
    ) {
      return NextResponse.json(
        { error: "You can only create subscriptions for yourself" },
        { status: 403, headers },
      );
    }

    // Verify meal plan exists
    const mealPlan = await prisma.mealPlan.findUnique({
      where: { id: subscriptionData.planId },
    });

    if (!mealPlan) {
      return NextResponse.json(
        { error: "Invalid meal plan selected" },
        { status: 400, headers },
      );
    }

    // Create the subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId: session.user.id,
        planId: subscriptionData.planId,
        mealTypes: subscriptionData.mealTypes,
        deliveryDays: subscriptionData.deliveryDays,
        allergies: subscriptionData.allergies || "",
        status: "ACTIVE",
      },
    });

    return NextResponse.json(subscription, { headers });
  } catch {
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500, headers },
    );
  }
}

export async function GET(request: NextRequest) {
  // Add security headers
  const headers = new Headers();

  Object.entries(securityHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers },
      );
    }

    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");

    // Sanitize userId if provided
    let sanitizedUserId = null;

    if (userId) {
      const sanitized = sanitizeInput(userId);

      if (typeof sanitized === "string" && sanitized.length > 0) {
        sanitizedUserId = sanitized;
      }
    }

    // If userId is provided and user is not admin, check if they're requesting their own data
    if (
      sanitizedUserId &&
      session.user.role !== "ADMIN" &&
      sanitizedUserId !== session.user.id
    ) {
      return NextResponse.json(
        { error: "You can only view your own subscriptions" },
        { status: 403, headers },
      );
    }

    // Admin can view all subscriptions or specific user's subscriptions
    // Regular users can only view their own subscriptions
    const whereClause =
      session.user.role === "ADMIN"
        ? sanitizedUserId
          ? { userId: sanitizedUserId }
          : {}
        : { userId: session.user.id }; // Admin: all subscriptions or specific user
    // Regular user: only their own

    const subscriptions = await prisma.subscription.findMany({
      where: whereClause,
      include: {
        mealPlan: {
          select: {
            id: true,
            name: true,
            price: true,
            description: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(subscriptions, { headers });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500, headers },
    );
  }
}

export async function PUT(request: NextRequest) {
  // Add security headers
  const headers = new Headers();

  Object.entries(securityHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers },
      );
    }

    // Rate limiting
    if (!checkRateLimit(`subscription_update_${session.user.id}`, 10, 60000)) {
      // 10 updates per minute
      return NextResponse.json(
        { error: "Too many update requests. Please try again later." },
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
    const sanitizedData = sanitizeInput(rawData);
    const { subscriptionId, ...updateData } = sanitizedData;

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "Subscription ID is required" },
        { status: 400, headers },
      );
    }

    // Validate subscription ID format
    if (typeof subscriptionId !== "string" || subscriptionId.length === 0) {
      return NextResponse.json(
        { error: "Invalid subscription ID format" },
        { status: 400, headers },
      );
    }

    // Find the subscription first
    const existingSubscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!existingSubscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404, headers },
      );
    }

    // Check permissions: user can only update their own subscription, admin can update any
    if (
      session.user.role !== "ADMIN" &&
      existingSubscription.userId !== session.user.id
    ) {
      return NextResponse.json(
        { error: "You can only update your own subscriptions" },
        { status: 403, headers },
      );
    }

    // Validate update data if provided
    if (Object.keys(updateData).length > 0) {
      const validation = validateSubscriptionData({
        ...updateData,
        planId: updateData.planId || existingSubscription.planId,
      });

      if (!validation.isValid) {
        return NextResponse.json(
          {
            error: "Validation failed",
            details: validation.errors,
          },
          { status: 400, headers },
        );
      }
    }

    // Update the subscription
    const updatedSubscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: updateData,
      include: {
        mealPlan: {
          select: {
            id: true,
            name: true,
            price: true,
            description: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedSubscription, { headers });
  } catch {
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500, headers },
    );
  }
}

export async function DELETE(request: NextRequest) {
  // Add security headers
  const headers = new Headers();

  Object.entries(securityHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });

  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401, headers },
      );
    }

    // Rate limiting
    if (!checkRateLimit(`subscription_delete_${session.user.id}`, 5, 60000)) {
      // 5 deletes per minute
      return NextResponse.json(
        { error: "Too many delete requests. Please try again later." },
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

    const url = new URL(request.url);
    const subscriptionId = url.searchParams.get("id");

    if (!subscriptionId) {
      return NextResponse.json(
        { error: "Subscription ID is required" },
        { status: 400, headers },
      );
    }

    // Sanitize and validate subscription ID
    const sanitizedId = sanitizeInput(subscriptionId);

    if (typeof sanitizedId !== "string" || sanitizedId.length === 0) {
      return NextResponse.json(
        { error: "Invalid subscription ID format" },
        { status: 400, headers },
      );
    }

    // Find the subscription first
    const existingSubscription = await prisma.subscription.findUnique({
      where: { id: sanitizedId },
    });

    if (!existingSubscription) {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404, headers },
      );
    }

    // Check permissions: user can only delete their own subscription, admin can delete any
    if (
      session.user.role !== "ADMIN" &&
      existingSubscription.userId !== session.user.id
    ) {
      return NextResponse.json(
        { error: "You can only delete your own subscriptions" },
        { status: 403, headers },
      );
    }

    // Delete the subscription
    await prisma.subscription.delete({
      where: { id: sanitizedId },
    });

    return NextResponse.json(
      { message: "Subscription deleted successfully" },
      { headers },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to delete subscription" },
      { status: 500, headers },
    );
  }
}
