import prisma from '../lib/prisma.js'
import { sendRendezVousEmail } from '../services/email.service.js'

// ENTREPRISE — Proposer un RDV à un candidat
export const proposerRendezVous = async (req, res) => {
  try {
    const { dateProposee, lieu, lienVisio, message } = req.body
    const candidatureId = String(req.body.candidatureId)
    const entrepriseId = req.user.uid

    // Vérifier que la candidature appartient bien à cette entreprise
    const candidature = await prisma.candidature.findFirst({
      where: { id: candidatureId },
      include: {
        annonce: true,
        etudiant: true
      }
    })

    if (!candidature) {
      return res.status(404).json({ message: 'Candidature introuvable' })
    }

    if (candidature.annonce.entrepriseId !== entrepriseId) {
      return res.status(403).json({ message: 'Accès non autorisé' })
    }

    // Créer le rendez-vous
    const rdv = await prisma.rendezVous.create({
      data: {
        candidatureId,
        entrepriseId,
        etudiantId: candidature.etudiantId,
        dateProposee: new Date(dateProposee),
        lieu,
        lienVisio,
        message
      }
    })

    // Envoyer un email à l'étudiant
    await sendRendezVousEmail({
      to: candidature.etudiant.email,
      prenomEtudiant: candidature.etudiant.prenom,
      nomPoste: candidature.annonce.nomPoste,
      nomEntreprise: candidature.annonce.nomEntreprise,
      dateProposee,
      lieu,
      lienVisio,
      message,
      rdvId: rdv.id
    })

    return res.status(201).json({ message: 'Rendez-vous proposé avec succès', rdv })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ETUDIANT — Répondre à un RDV (accepter ou refuser)
export const repondreRendezVous = async (req, res) => {
  try {
    const { id } = req.params
    const { statut } = req.body // 'ACCEPTE' ou 'REFUSE'
    const etudiantId = req.user.uid

    if (!['ACCEPTE', 'REFUSE'].includes(statut)) {
      return res.status(400).json({ message: 'Statut invalide' })
    }

    const rdv = await prisma.rendezVous.findFirst({
      where: { id, etudiantId }
    })

    if (!rdv) {
      return res.status(404).json({ message: 'Rendez-vous introuvable' })
    }

    if (rdv.statut !== 'EN_ATTENTE') {
      return res.status(400).json({ message: 'Ce rendez-vous a déjà une réponse' })
    }

    const rdvMaj = await prisma.rendezVous.update({
      where: { id },
      data: { statut }
    })

    return res.status(200).json({ message: `Rendez-vous ${statut.toLowerCase()}`, rdv: rdvMaj })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ETUDIANT — Voir tous ses rendez-vous (pour le calendrier)
export const getMesRendezVous = async (req, res) => {
  try {
    const etudiantId = req.user.uid

    const rdvs = await prisma.rendezVous.findMany({
      where: { etudiantId },
      include: {
        candidature: {
          include: {
            annonce: {
              select: {
                nomPoste: true,
                nomEntreprise: true
              }
            }
          }
        }
      },
      orderBy: { dateProposee: 'asc' }
    })

    return res.status(200).json(rdvs)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ENTREPRISE — Voir tous ses RDV proposés
export const getRdvEntreprise = async (req, res) => {
  try {
    const entrepriseId = req.user.uid

    const rdvs = await prisma.rendezVous.findMany({
      where: { entrepriseId },
      include: {
        candidature: {
          include: {
            annonce: {
              select: { nomPoste: true }
            },
            etudiant: {
              select: { prenom: true, nom: true, email: true }
            }
          }
        }
      },
      orderBy: { dateProposee: 'asc' }
    })

    return res.status(200).json(rdvs)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Erreur serveur' })
  }
}