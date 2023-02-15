/*
  Warnings:

  - You are about to drop the column `issueGroupId` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `issueRoleId` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `sentDepartment` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `sentOrganization` on the `Document` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_issueGroupId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_issueRoleId_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_sentDepartment_fkey";

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_sentOrganization_fkey";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "issueGroupId",
DROP COLUMN "issueRoleId",
DROP COLUMN "sentDepartment",
DROP COLUMN "sentOrganization";
