/*
  Warnings:

  - You are about to drop the column `email` on the `otps` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user]` on the table `otps` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user` to the `otps` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "otps_email_key";

-- AlterTable
ALTER TABLE "otps" DROP COLUMN "email",
ADD COLUMN     "user" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "otps_user_key" ON "otps"("user");
