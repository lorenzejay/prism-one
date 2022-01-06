-- CreateTable
CREATE TABLE "GmailIntegrationDetails" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "integrated_user" TEXT NOT NULL,

    CONSTRAINT "GmailIntegrationDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GmailIntegrationDetails_integrated_user_key" ON "GmailIntegrationDetails"("integrated_user");

-- AddForeignKey
ALTER TABLE "GmailIntegrationDetails" ADD CONSTRAINT "GmailIntegrationDetails_integrated_user_fkey" FOREIGN KEY ("integrated_user") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
