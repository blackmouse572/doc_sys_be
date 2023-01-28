/*
  Warnings:

  - You are about to drop the column `data_available` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `date_expired` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `date_release` on the `Document` table. All the data in the column will be lost.
  - Added the required column `dataAvailable` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateExpired` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateRelease` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "data_available",
DROP COLUMN "date_expired",
DROP COLUMN "date_release",
ADD COLUMN     "dataAvailable" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dateExpired" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dateRelease" TIMESTAMP(3) NOT NULL;
