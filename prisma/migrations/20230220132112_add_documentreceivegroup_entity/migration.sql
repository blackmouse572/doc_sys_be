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

-- AddForeignKey
ALTER TABLE "DocumentReceiveGroup" ADD CONSTRAINT "DocumentReceiveGroup_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentReceiveGroup" ADD CONSTRAINT "DocumentReceiveGroup_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
