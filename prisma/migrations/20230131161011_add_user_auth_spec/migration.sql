-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailConfirmCode" TEXT,
ADD COLUMN     "emailConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "phoneNumberConfirmCode" TEXT,
ADD COLUMN     "phoneNumberConfirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resetPasswordCode" TEXT;
