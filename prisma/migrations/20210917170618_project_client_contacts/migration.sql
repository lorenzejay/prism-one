/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `isPrivate` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `ownerId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `client_email` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `client_name` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner_id` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `project_status` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('Euro', 'United_States_Dollar', 'Canadian_Dollar', 'Polish_zloty', 'Norwegian_Krone');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('Inquiry', 'Proposal', 'Proposal_Status', 'Deposit', 'Completed');

-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_ownerId_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "createdAt",
DROP COLUMN "isPrivate",
DROP COLUMN "ownerId",
ADD COLUMN     "amount_due" TEXT,
ADD COLUMN     "amount_paid" TEXT,
ADD COLUMN     "client_email" TEXT NOT NULL,
ADD COLUMN     "client_name" TEXT NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expected_revenue" TEXT,
ADD COLUMN     "goals" TEXT,
ADD COLUMN     "is_private" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "owner_id" TEXT NOT NULL,
ADD COLUMN     "project_status" "ProjectStatus" NOT NULL,
ADD COLUMN     "tags" TEXT[];

-- DropTable
DROP TABLE "Users";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "profile_color" TEXT,
    "company_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "company_address" TEXT NOT NULL,
    "currency" "Currency" NOT NULL
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT,
    "address" TEXT,
    "postal_code" TEXT,
    "city" TEXT,
    "State" TEXT,
    "company_name" TEXT,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
