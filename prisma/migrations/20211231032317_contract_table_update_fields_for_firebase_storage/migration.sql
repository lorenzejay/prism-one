/*
  Warnings:

  - You are about to drop the column `attachment_file` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `cloduinary_file_url` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `cloudinary_asset_id` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `cloudinary_public_id` on the `Contract` table. All the data in the column will be lost.
  - You are about to drop the column `cloudinary_secure_link` on the `Contract` table. All the data in the column will be lost.
  - Added the required column `download_url` to the `Contract` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firebase_ref` to the `Contract` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "attachment_file",
DROP COLUMN "cloduinary_file_url",
DROP COLUMN "cloudinary_asset_id",
DROP COLUMN "cloudinary_public_id",
DROP COLUMN "cloudinary_secure_link",
ADD COLUMN     "download_url" TEXT NOT NULL,
ADD COLUMN     "firebase_ref" TEXT NOT NULL;
