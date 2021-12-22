-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "header_img" DROP NOT NULL,
ALTER COLUMN "project_status" SET DEFAULT E'Inquiry';
