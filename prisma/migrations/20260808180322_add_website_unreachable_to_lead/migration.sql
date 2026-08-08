-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "websiteCheckedAt" TIMESTAMP(3),
ADD COLUMN     "websiteUnreachable" BOOLEAN;
