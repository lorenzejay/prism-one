-- CreateTable
CREATE TABLE "LeadForms" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "formElements" JSONB[],
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadForms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadResponses" (
    "id" SERIAL NOT NULL,
    "lead_associated" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "response" JSONB[],

    CONSTRAINT "LeadResponses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LeadForms" ADD CONSTRAINT "LeadForms_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadResponses" ADD CONSTRAINT "LeadResponses_lead_associated_fkey" FOREIGN KEY ("lead_associated") REFERENCES "LeadForms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
