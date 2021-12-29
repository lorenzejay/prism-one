/*
  Warnings:

  - You are about to drop the `Tasks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_created_by_fkey";

-- DropForeignKey
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_project_associated_fkey";

-- DropTable
DROP TABLE "Tasks";

-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(150) NOT NULL,
    "due_date" TIMESTAMP(3),
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "project_associated" INTEGER,
    "status" "TaskStatus" NOT NULL DEFAULT E'Incomplete',

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_project_associated_fkey" FOREIGN KEY ("project_associated") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
