/*
  Warnings:

  - Made the column `lienPostulation` on table `Offre` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Offre" ALTER COLUMN "lienPostulation" SET NOT NULL;
