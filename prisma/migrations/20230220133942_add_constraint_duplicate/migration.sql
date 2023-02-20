/*
  Warnings:

  - A unique constraint covering the columns `[userId,documentId]` on the table `DocumentReceiveDetail` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[groupId,documentId]` on the table `DocumentReceiveGroup` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "DocumentReceiveDetail_userId_documentId_key" ON "DocumentReceiveDetail"("userId", "documentId");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentReceiveGroup_groupId_documentId_key" ON "DocumentReceiveGroup"("groupId", "documentId");
