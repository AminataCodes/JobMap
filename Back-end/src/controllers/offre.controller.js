import prisma from '../lib/prisma.js'

// ── POST /api/auth/ecole/offres ──
export const ajouterOffre = async (req, res) => {
  try {
    const { titre, description } = req.body

    if (!titre || !titre.trim()) {
      return res.status(400).json({ message: 'Le titre est requis' })
    }

    const offre = await prisma.offre.create({
      data: {
        titre:       titre.trim(),
        description: description?.trim() || null,
        ecoleId:     req.user.id,
      },
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

    if (!offre) {
      return res.status(404).json({ message: 'Offre introuvable' })
    }

    if (offre.ecoleId !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé' })
    }

    await prisma.offre.delete({ where: { id } })
    return res.json({ message: 'Offre supprimée' })

  } catch (err) {
    console.error('supprimerOffre:', err)
    return res.status(500).json({ message: 'Erreur serveur' })
  }
}