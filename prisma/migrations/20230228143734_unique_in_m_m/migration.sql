/*
  Warnings:

  - You are about to drop the column `issueGroupId` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `issueRoleId` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `sentDepartment` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `sentOrganization` on the `Document` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,documentId]` on the table `DocumentReceiveDetail` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Group` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,roleId,departmentId,organizationId]` on the table `UserWorkPlaceDetails` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,groupId]` on the table `User_Group` will be added. If there are existing duplicate values, this will fail.

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

-- CreateTable
CREATE TABLE "DocumentReceiveGroup" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "date_receive" TIMESTAMP(3) NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentReceiveGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DocumentReceiveGroup_groupId_documentId_key" ON "DocumentReceiveGroup"("groupId", "documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentReceiveDetail_userId_documentId_key" ON "DocumentReceiveDetail"("userId", "documentId");

-- CreateIndex
CREATE UNIQUE INDEX "Group_name_key" ON "Group"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserWorkPlaceDetails_userId_roleId_departmentId_organizatio_key" ON "UserWorkPlaceDetails"("userId", "roleId", "departmentId", "organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "User_Group_userId_groupId_key" ON "User_Group"("userId", "groupId");

-- AddForeignKey
ALTER TABLE "DocumentReceiveGroup" ADD CONSTRAINT "DocumentReceiveGroup_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentReceiveGroup" ADD CONSTRAINT "DocumentReceiveGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
