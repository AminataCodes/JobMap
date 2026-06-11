/*
  Warnings:

  - You are about to drop the column `dateDepot` on the `Candidature` table. All the data in the column will be lost.
  - You are about to drop the column `nomEntreprise` on the `Candidature` table. All the data in the column will be lost.
  - You are about to drop the column `nomPoste` on the `Candidature` table. All the data in the column will be lost.
  - You are about to drop the column `plateforme` on the `Candidature` table. All the data in the column will be lost.
  - You are about to drop the column `sourceUrl` on the `Candidature` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Candidature` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Etudiant` table. All the data in the column will be lost.
  - You are about to drop the column `emailConnecte` on the `Etudiant` table. All the data in the column will be lost.
  - You are about to drop the column `providerMail` on the `Etudiant` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Etudiant` table. All the data in the column will be lost.
  - Added the required column `lettreMotivationUrl` to the `Candidature` table without a default value. This is not possible if the table is not empty.
  - Added the required column `offreId` to the `Candidature` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Candidature" DROP COLUMN "dateDepot",
DROP COLUMN "nomEntreprise",
DROP COLUMN "nomPoste",
DROP COLUMN "plateforme",
DROP COLUMN "sourceUrl",
DROP COLUMN "updatedAt",
ADD COLUMN     "lettreMotivationUrl" TEXT NOT NULL,
ADD COLUMN     "messageAdditionnel" TEXT,
ADD COLUMN     "offreId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Etudiant" DROP COLUMN "createdAt",
DROP COLUMN "emailConnecte",
DROP COLUMN "providerMail",
DROP COLUMN "updatedAt",
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "competences" TEXT[],
ADD COLUMN     "cvUrl" TEXT,
ADD COLUMN     "niveauEtude" TEXT;

-- DropEnum
DROP TYPE "MailProvider";

-- CreateTable
CREATE TABLE "Admin" (
    "uid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nomAdmin" TEXT NOT NULL,
    "description" TEXT,
    "photoProfilUrl" TEXT,
    "motDePasse" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifyToken" TEXT,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Offre" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "nomEntreprise" TEXT NOT NULL,
    "nomPoste" TEXT NOT NULL,
    "datePublication" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT NOT NULL,
    "lieu" TEXT NOT NULL,
    "competencesObligatoires" TEXT,
    "competencesSouhaitables" TEXT,
    "dateDeDebut" TIMESTAMP(3),
    "lienPostulation" TEXT,

    CONSTRAINT "Offre_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- AddForeignKey
ALTER TABLE "Offre" ADD CONSTRAINT "Offre_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidature" ADD CONSTRAINT "Candidature_offreId_fkey" FOREIGN KEY ("offreId") REFERENCES "Offre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
