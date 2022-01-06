/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `GmailIntegrationDetails` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "GmailIntegrationDetails_integrated_user_key";

-- CreateIndex
CREATE UNIQUE INDEX "GmailIntegrationDetails_email_key" ON "GmailIntegrationDetails"("email");
