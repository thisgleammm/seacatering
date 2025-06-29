/*
  Warnings:

  - You are about to drop the column `deliveryTime` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `mealPlanId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `specialRequests` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Subscription` table. All the data in the column will be lost.
  - The `status` column on the `Subscription` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `planId` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_mealPlanId_fkey";

-- First, add nullable columns
ALTER TABLE "User" 
ADD COLUMN "emailVerified" TIMESTAMP(3),
ADD COLUMN "image" TEXT,
ADD COLUMN "role" "Role" NOT NULL DEFAULT 'USER',
ADD COLUMN "password" TEXT;

-- Update existing users with a temporary password (they will need to reset it)
UPDATE "User"
SET "password" = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2NRlaSL0xe'; -- This is a hashed version of 'ChangeMe123!'

-- Now make password required
ALTER TABLE "User"
ALTER COLUMN "password" SET NOT NULL;

-- Handle subscription changes safely
ALTER TABLE "Subscription" 
ADD COLUMN "allergies" TEXT,
ADD COLUMN "mealTypes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN "planId" TEXT;

-- Copy existing mealPlanId to planId
UPDATE "Subscription"
SET "planId" = "mealPlanId"
WHERE "mealPlanId" IS NOT NULL;

-- Now make planId required and drop old column
ALTER TABLE "Subscription"
ALTER COLUMN "planId" SET NOT NULL;

ALTER TABLE "Subscription" 
DROP COLUMN "deliveryTime",
DROP COLUMN "endDate",
DROP COLUMN "specialRequests",
DROP COLUMN "startDate",
DROP COLUMN "mealPlanId";

-- Handle status change
ALTER TABLE "Subscription"
DROP COLUMN "status",
ADD COLUMN "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE';

-- Create new tables for auth
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- Create indexes
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- Add foreign keys
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "MealPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
