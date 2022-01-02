/*
  Warnings:

  - You are about to drop the column `firebase_path` on the `Contract` table. All the data in the column will be lost.
  - Added the required column `firebase_ref` to the `Contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location_bucket` to the `Contract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "firebase_path",
ADD COLUMN     "firebase_ref" TEXT NOT NULL,
ADD COLUMN     "location_bucket" TEXT NOT NULL;
