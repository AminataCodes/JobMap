import { uploadFile } from "../services/upload.service.js";
import {
  createCandidature,
  getAllCandidatures,
  getCandidaturesByAnnonce,
  getCandidatureById,
  accepterCandidature,
  rejeterCandidature,
} from "../services/candidature-service.js";
import prisma from "../lib/prisma.js";

export async function addCandidature(req, res) {
  try {
    const { annonceId } = req.params;
    const etudiantId = req.user.uid;

    // ✅ Seulement la lettre de motivation — plus de CV
    const lettreFile = req.files?.lettreMotivation?.[0];

    if (!lettreFile) {
      return res.status(400).json({ error: "Lettre de motivation requise" });
    }

    const lettreMotivationUrl = await uploadFile(lettreFile, "lettres");

    const candidature = await createCandidature({
      ...req.body,
      annonceId,
      etudiantId,
      lettreMotivationUrl,
      // ✅ cvUrl vient automatiquement de la table Etudiant dans le service
    });

    res.status(201).json({ message: "Candidature envoyée", candidature });

  } catch (error) {
    console.error(error);

    // ✅ Renvoie le message d'erreur si pas de CV sur le profil
    if (error.message.includes("CV")) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Erreur serveur" });
  }
}

// ... reste des fonctions inchangées

export async function fetchCandidatures(req, res) {
  try {
    const candidatures =
      await getAllCandidatures();

    res.status(200).json(candidatures);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erreur serveur",
    });
  }
}

export async function fetchCandidaturesByAnnonce(
  req, 
  res
) {
  try {
    const { annonceId } = req.params;

    const candidatures =
      await getCandidaturesByAnnonce(
        annonceId
      );

    res.status(200).json(candidatures);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Erreur serveur",
    });
  }
}

// ── NOUVEAU : récupère une candidature par ID avec étudiant + annonce ──
export async function fetchCandidatureById(req, res) {
  try {
    const { id } = req.params;
    const candidature = await prisma.candidature.findUnique({
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

    if (!candidature) {
      return res.status(404).json({ error: "Candidature introuvable" });
    }

    res.status(200).json(candidature);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

// ── NOUVEAU : mise à jour du statut par l'entreprise ──
export async function updateStatut(req, res) {
  try {
    const { id } = req.params;
    const { statut } = req.body;

    const validStatuts = ['EN_ATTENTE', 'ACCEPTEE', 'REJETEE'];
    if (!validStatuts.includes(statut)) {
      return res.status(400).json({ error: "Statut invalide" });
    }

    const candidature = await prisma.candidature.update({
      where: { id },
      data: { statut }
    });

    res.status(200).json({ message: "Statut mis à jour", candidature });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function accepter(req, res) {
  try {
    const { id } = req.params;
    const candidature = await accepterCandidature(id);
    res.status(200).json({ message: "Candidature acceptée", candidature });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

export async function rejeter(req, res) {
  try {
    const { id } = req.params;
    const candidature = await rejeterCandidature(id);
    res.status(200).json({ message: "Candidature rejetée", candidature });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}