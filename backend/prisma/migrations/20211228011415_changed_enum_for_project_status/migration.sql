/*
  Warnings:

  - The values [Inquiry,Proposal,Proposal_Status,Deposit] on the enum `ProjectStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ProjectStatus_new" AS ENUM ('Lead', 'Booked', 'Fulfillment', 'Completed');
ALTER TABLE "Project" ALTER COLUMN "project_status" DROP DEFAULT;
ALTER TABLE "Project" ALTER COLUMN "project_status" TYPE "ProjectStatus_new" USING ("project_status"::text::"ProjectStatus_new");
ALTER TYPE "ProjectStatus" RENAME TO "ProjectStatus_old";
ALTER TYPE "ProjectStatus_new" RENAME TO "ProjectStatus";
DROP TYPE "ProjectStatus_old";
ALTER TABLE "Project" ALTER COLUMN "project_status" SET DEFAULT 'Lead';
COMMIT;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "project_status" SET DEFAULT E'Lead';
