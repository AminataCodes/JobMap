import prisma from '../lib/prisma.js'

// ── POST /api/annonces (admin) ──
export const createOffre = async (req, res) => {
  try {
    const { nomEntreprise, nomPoste, description, lieu, lienPostulation } = req.body

    if (!lienPostulation) {
      return res.status(400).json({ message: "Lien requis" })
    }

    const offre = await prisma.offre.create({
      data: { nomEntreprise, nomPoste, description, lieu, lienPostulation, adminId: req.user.id }
    })

    res.status(201).json(offre)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ── GET /api/annonces ──
export const getOffres = async (req, res) => {
  try {
    const offres = await prisma.offre.findMany({ orderBy: { datePublication: 'desc' } })
    res.json(offres)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ── POST /api/auth/ecole/offres ──
export const ajouterOffre = async (req, res) => {
  try {
    const { titre, description } = req.body

    if (!titre || !titre.trim()) {
      return res.status(400).json({ message: 'Le titre est requis' })
    }

    const offre = await prisma.offre.create({
      data: { titre: titre.trim(), description: description?.trim() || null, ecoleId: req.user.id }
    })

    return res.status(201).json(offre)
  } catch (err) {
    console.error('ajouterOffre:', err)
    return res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── DELETE /api/auth/ecole/offres/:id ──
export const supprimerOffre = async (req, res) => {
  try {
    const { id } = req.params
    const offre = await prisma.offre.findUnique({ where: { id } })

    if (!offre) return res.status(404).json({ message: 'Offre introuvable' })
    if (offre.ecoleId !== req.user.id) return res.status(403).json({ message: 'Non autorisé' })

    await prisma.offre.delete({ where: { id } })
    return res.json({ message: 'Offre supprimée' })
  } catch (err) {
    console.error('supprimerOffre:', err)
    return res.status(500).json({ message: 'Erreur serveur' })
  }
}
