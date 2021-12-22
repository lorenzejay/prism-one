/*
  Warnings:

  - Added the required column `company_email` to the `CompanyDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompanyDetails" ADD COLUMN     "company_email" TEXT NOT NULL;
