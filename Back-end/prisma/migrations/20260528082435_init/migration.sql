/*
  Warnings:

  - You are about to drop the column `descriptionEntreprise` on the `Annonce` table. All the data in the column will be lost.
  - You are about to drop the column `nomEntreprise` on the `Annonce` table. All the data in the column will be lost.
  - Added the required column `description` to the `Annonce` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lieu` to the `Annonce` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Annonce" DROP COLUMN "descriptionEntreprise",
DROP COLUMN "nomEntreprise",
ADD COLUMN     "datePublication" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "lieu" TEXT NOT NULL;
