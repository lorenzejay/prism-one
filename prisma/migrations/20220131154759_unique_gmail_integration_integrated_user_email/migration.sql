/*
  Warnings:

  - A unique constraint covering the columns `[email,integrated_user]` on the table `GmailIntegrationRefreshTokens` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "GmailIntegrationRefreshTokens_email_integrated_user_key" ON "GmailIntegrationRefreshTokens"("email", "integrated_user");
