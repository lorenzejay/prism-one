-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "associatedProjectId" INTEGER,
ALTER COLUMN "phone_number" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_associatedProjectId_fkey" FOREIGN KEY ("associatedProjectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
