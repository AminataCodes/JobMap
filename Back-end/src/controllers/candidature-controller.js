import * as candidatureService from "../services/candidature-service.js";

export const createCandidature = async (req, res) => {
  try {
    const candidature = await candidatureService.createCandidature(
      {
        ...req.body,
        etudiantId: req.user.uid,
      }
    );

    res.status(201).json(candidature);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur lors de la création de la candidature",
    });
  }
};

export const getAllCandidatures = async (req, res) => {
  try {
    const candidatures =
      await candidatureService.getAllCandidatures(req.user.uid);

    res.status(200).json(candidatures);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur lors de la récupération des candidatures",
    });
  }
};

export const getCandidatureById = async (req, res) => {
  try {
    const candidature =
      await candidatureService.getCandidatureById(
        req.params.id,
        req.user.uid
      );

    if (!candidature) {
      return res.status(404).json({
        message: "Candidature introuvable",
      });
    }
    
    res.status(200).json(candidature);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Erreur lors de la récupération de la candidature",
    });
  }
};