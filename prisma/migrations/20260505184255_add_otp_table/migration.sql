-- CreateEnum
CREATE TYPE "OtpSources" AS ENUM ('SIGNUP', 'FORTGOT_PASSWORD', 'RESET_PASSWORD');

-- CreateTable
CREATE TABLE "otps" (
    "id" SERIAL NOT NULL,
    "source" "OtpSources" NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "otps_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "otps_id_key" ON "otps"("id");

-- CreateIndex
CREATE UNIQUE INDEX "otps_email_key" ON "otps"("email");
