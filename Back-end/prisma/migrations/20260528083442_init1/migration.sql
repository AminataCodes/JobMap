-- AlterTable
ALTER TABLE "Annonce" ADD COLUMN     "competencesObligatoires" TEXT,
ADD COLUMN     "competencesSouhaitables" TEXT,
ADD COLUMN     "dateDeDebut" TIMESTAMP(3);
