import prisma from '../lib/prisma.js'

// ── POST /api/auth/ecole/formations ──
export const ajouterFormation = async (req, res) => {
  try {
    const { nom } = req.body

    if (!nom || !nom.trim()) {
      return res.status(400).json({ message: 'Le nom est requis' })
    }

    const formation = await prisma.formation.create({
      data: {
        nom:     nom.trim(),
        ecoleId: req.user.id,
      },
    })

    return res.status(201).json(formation)

  } catch (err) {
    console.error('ajouterFormation:', err)
    return res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── DELETE /api/auth/ecole/formations/:id ──
export const supprimerFormation = async (req, res) => {
  try {
    const { id } = req.params

    const formation = await prisma.formation.findUnique({ where: { id } })

    if (!formation) {
      return res.status(404).json({ message: 'Formation introuvable' })
    }

    if (formation.ecoleId !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé' })
    }

    await prisma.formation.delete({ where: { id } })
    return res.json({ message: 'Formation supprimée' })

  } catch (err) {
    console.error('supprimerFormation:', err)
    return res.status(500).json({ message: 'Erreur serveur' })
  }
}