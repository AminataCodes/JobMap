-- CreateTable
CREATE TABLE "Etudiant" (
    "uid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "niveauEtude" TEXT,
    "cvUrl" TEXT,
    "bio" TEXT,
    "competences" TEXT[],
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifyToken" TEXT,

    CONSTRAINT "Etudiant_pkey" PRIMARY KEY ("uid")
);

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

    CONSTRAINT "Offre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidature" (
    "id" TEXT NOT NULL,
    "offreId" TEXT NOT NULL,
    "etudiantId" TEXT NOT NULL,
    "lettreMotivationUrl" TEXT NOT NULL,
    "messageAdditionnel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Candidature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Etudiant_email_key" ON "Etudiant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- AddForeignKey
ALTER TABLE "Offre" ADD CONSTRAINT "Offre_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidature" ADD CONSTRAINT "Candidature_offreId_fkey" FOREIGN KEY ("offreId") REFERENCES "Offre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidature" ADD CONSTRAINT "Candidature_etudiantId_fkey" FOREIGN KEY ("etudiantId") REFERENCES "Etudiant"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
