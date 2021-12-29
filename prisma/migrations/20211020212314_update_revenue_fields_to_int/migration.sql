/*
  Warnings:

  - The `amount_due` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `amount_paid` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `expected_revenue` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "amount_due",
ADD COLUMN     "amount_due" INTEGER,
DROP COLUMN "amount_paid",
ADD COLUMN     "amount_paid" INTEGER,
DROP COLUMN "expected_revenue",
ADD COLUMN     "expected_revenue" INTEGER;
