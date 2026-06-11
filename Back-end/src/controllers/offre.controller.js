import prisma from '../lib/prisma.js'

export const createOffre = async (req, res) => {
  try {
    const {
      nomEntreprise,
      nomPoste,
      description,
      lieu,
      lienPostulation
    } = req.body

    // 🔥 validation
    if (!lienPostulation) {
      return res.status(400).json({ message: "Lien requis" })
    }

    const offre = await prisma.offre.create({
      data: {
        nomEntreprise,
        nomPoste,
        description,
        lieu,
        lienPostulation,
        adminId: req.user.id
      }
    })

    res.status(201).json(offre)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


export const getOffres = async (req, res) => {
    try {

        const offres = await prisma.offre.findMany({
            orderBy: {
                datePublication: 'desc'
            }
        })

        res.json(offres)

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}