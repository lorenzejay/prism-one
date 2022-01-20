-- CreateTable
CREATE TABLE "ThreadIds" (
    "id" SERIAL NOT NULL,
    "threadId" TEXT NOT NULL,
    "project_associated" INTEGER,

    CONSTRAINT "ThreadIds_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ThreadIds" ADD CONSTRAINT "ThreadIds_project_associated_fkey" FOREIGN KEY ("project_associated") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
