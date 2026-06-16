import * as etudiantService from '../services/etudiant-service.js'

export const getAllEtudiants = async (req, res) => {
  try {
    const etudiants = await etudiantService.getAllEtudiants()

    res.status(200).json(etudiants)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Erreur lors de la récupération des étudiants",
    })
  }
}

export const getEtudiantById = async (req, res) => {
  try {
    const etudiant = await etudiantService.getEtudiantById(req.params.id)

    if (!etudiant) {
      return res.status(404).json({
        message: "Étudiant introuvable",
      })
    }

    res.status(200).json(etudiant)
  } catch (error) {
    console.error(error)

    res.status(500).json({
      message: "Erreur lors de la récupération de l'étudiant",
    })
  }
}