/*
  Warnings:

  - You are about to drop the column `firebase_ref` on the `Contract` table. All the data in the column will be lost.
  - Added the required column `firebase_path` to the `Contract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "firebase_ref",
ADD COLUMN     "firebase_path" TEXT NOT NULL;
