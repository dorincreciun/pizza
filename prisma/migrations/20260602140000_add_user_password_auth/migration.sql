-- DropColumn
ALTER TABLE "User" DROP COLUMN "otpCode";

-- AlterTable
ALTER TABLE "User" ADD COLUMN "passwordHash" TEXT NOT NULL DEFAULT '';

-- Remove temporary default after migration
ALTER TABLE "User" ALTER COLUMN "passwordHash" DROP DEFAULT;
