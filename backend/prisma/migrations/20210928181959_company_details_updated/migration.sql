/*
  Warnings:

  - You are about to drop the column `company_address` on the `CompanyDetails` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `CompanyDetails` table. All the data in the column will be lost.
  - You are about to drop the column `phone_number` on the `CompanyDetails` table. All the data in the column will be lost.
  - Added the required column `industry` to the `CompanyDetails` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Industry" AS ENUM ('Wedding_Videography', 'Wedding_Photography', 'Portrait_Photography', 'Commerical_Photography', 'Commerical_Video', 'Digital_Artist', 'Other');

-- AlterTable
ALTER TABLE "CompanyDetails" DROP COLUMN "company_address",
DROP COLUMN "currency",
DROP COLUMN "phone_number",
ADD COLUMN     "industry" "Industry" NOT NULL;
