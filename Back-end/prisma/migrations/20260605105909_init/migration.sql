-- CreateEnum
CREATE TYPE "MailProvider" AS ENUM ('GMAIL', 'OUTLOOK');

-- CreateTable
CREATE TABLE "Etudiant" (
    "uid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifyToken" TEXT,
    "emailConnecte" BOOLEAN NOT NULL DEFAULT false,
    "providerMail" "MailProvider",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Etudiant_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Candidature" (
    "id" TEXT NOT NULL,
    "nomPoste" TEXT NOT NULL,
    "nomEntreprise" TEXT NOT NULL,
    "plateforme" TEXT,
    "dateDepot" TIMESTAMP(3) NOT NULL,
    "sourceUrl" TEXT,
    "etudiantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Etudiant_email_key" ON "Etudiant"("email");

-- AddForeignKey
ALTER TABLE "Candidature" ADD CONSTRAINT "Candidature_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "Etudiant"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
