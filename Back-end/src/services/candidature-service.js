import prisma from "../lib/prisma.js";

export async function createCandidature(data) {
  // ✅ Récupère le cvUrl depuis la table Etudiant
  const etudiant = await prisma.etudiant.findUnique({
    where: { uid: data.etudiantId },
    select: { cvUrl: true },
  });

  if (!etudiant?.cvUrl) {
    throw new Error("Aucun CV trouvé sur votre profil. Veuillez d'abord uploader votre CV.");
  }

  return await prisma.candidature.create({
    data: {
      annonceId:           data.annonceId,
      etudiantId:          data.etudiantId,
      nomCandidat:         data.nomCandidat,
      prenom:              data.prenom,
      lettreMotivationUrl: data.lettreMotivationUrl,
      messageAdditionnel:  data.messageAdditionnel,
      statut:              "EN_ATTENTE",
      // ❌ plus de cvUrl ici — retiré du schema Candidature
    },
  });
}

// ... reste du service inchangé

export async function getAllCandidatures() {
  return prisma.candidature.findMany({
    include: {
      etudiant: true,
      annonce: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getCandidaturesByAnnonce(annonceId) {
  return prisma.candidature.findMany({
    where: {
      annonceId,
    },

    include: {
      etudiant: true,
    },
  });
}

// ── NOUVEAU : récupère une candidature par son ID ──
export async function getCandidatureById(id) {
  return await prisma.candidature.findUnique({
    where: { id },
    include: {
      etudiant: {
        select: {
          uid: true,
          prenom: true,
          nom: true,
          email: true,
          niveauEtude: true,
          bio: true,
          competences: true,
          cvUrl: true,
        }
      },
      annonce: {
        select: {
          nomPoste: true,
          nomEntreprise: true,
          entrepriseId: true,
        }
      }
    }
  });
}

export async function accepterCandidature(id) {
  return await prisma.candidature.update({
    where: { id },
    data: { statut: "ACCEPTEE" },
  });
}

export async function rejeterCandidature(id) {
  return await prisma.candidature.update({
    where: { id },
    data: { statut: "REJETEE" },
  });
}