import prisma from '../lib/prisma.js'

// ── GET /api/offres ──
export const getOffres = async (req, res) => {
  try {
    const offres = await prisma.offre.findMany({
      orderBy: { createdAt: 'desc' },
      include: { ecole: { select: { nom: true, logo: true } } },
    })
    return res.json(offres)
  } catch (err) {
    console.error('getOffres:', err)
    return res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── GET /api/offres/:id ──
export const getOffreById = async (req, res) => {
  try {
    const offre = await prisma.offre.findUnique({
      where: { id: req.params.id },
      include: { ecole: { select: { nom: true, logo: true, email: true } } },
    })
    if (!offre) return res.status(404).json({ message: 'Offre introuvable' })
    return res.json(offre)
  } catch (err) {
    console.error('getOffreById:', err)
    return res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── POST /api/offres ──
export const ajouterOffre = async (req, res) => {
  try {
    const { titre, description } = req.body
    if (!titre?.trim()) return res.status(400).json({ message: 'Le titre est requis' })

    const offre = await prisma.offre.create({
      data: {
        titre: titre.trim(),
        description: description?.trim() || null,
        ecoleId: req.user.id,
      },
    })
    return res.status(201).json(offre)
  } catch (err) {
    console.error('ajouterOffre:', err)
    return res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── PUT /api/offres/:id ──
export const modifierOffre = async (req, res) => {
  try {
    const { id } = req.params
    const { titre, description } = req.body

    const offre = await prisma.offre.findUnique({ where: { id } })
    if (!offre) return res.status(404).json({ message: 'Offre introuvable' })
    if (offre.ecoleId !== req.user.id) return res.status(403).json({ message: 'Non autorisé' })

    const updated = await prisma.offre.update({
      where: { id },
      data: {
        titre: titre?.trim() || offre.titre,
        description: description?.trim() ?? offre.description,
      },
    })
    return res.json(updated)
  } catch (err) {
    console.error('modifierOffre:', err)
    return res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── DELETE /api/offres/:id ──
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
