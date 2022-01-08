/*
  Warnings:

  - You are about to drop the `GmailIntegrationDetails` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "GmailIntegrationDetails" DROP CONSTRAINT "GmailIntegrationDetails_integrated_user_fkey";

-- DropTable
DROP TABLE "GmailIntegrationDetails";

-- CreateTable
CREATE TABLE "GmailIntegrationRefreshTokens" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "refresh_token" TEXT NOT NULL,
    "integrated_user" TEXT NOT NULL,

    CONSTRAINT "GmailIntegrationRefreshTokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GmailIntegrationRefreshTokens_email_key" ON "GmailIntegrationRefreshTokens"("email");

-- AddForeignKey
ALTER TABLE "GmailIntegrationRefreshTokens" ADD CONSTRAINT "GmailIntegrationRefreshTokens_integrated_user_fkey" FOREIGN KEY ("integrated_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
