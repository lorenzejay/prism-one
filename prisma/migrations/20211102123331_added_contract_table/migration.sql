-- CreateTable
CREATE TABLE "Contract" (
    "id" SERIAL NOT NULL,
    "contract_name" TEXT NOT NULL,
    "attachment_file" TEXT,
    "custom_contract" BOOLEAN NOT NULL DEFAULT false,
    "text_field_response" TEXT,

    CONSTRAINT "Contract_pkey" PRIMARY KEY ("id")
);
