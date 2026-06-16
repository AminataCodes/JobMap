import * as offreService from "../services/offre-service.js";

export const createOffre = async (req, res) => {
  try {

    const adminId = req.user.id;
    const offre = await offreService.createOffre({ ...req.body, adminId });
    res.status(201).json(offre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la création de l'offre" });
  }
};

export const getAllOffres = async (req, res) => {
  try {
    const offres = await offreService.getAllOffres();
    res.status(200).json(offres);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des offres" });
  }
};

export const getOffreById = async (req, res) => {
  try {
    const offre = await offreService.getOffreById(req.params.id);
    if (!offre) {
      return res.status(404).json({ message: "Offre introuvable" });
    }
    res.status(200).json(offre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération de l'offre" });
  }
};

export const updateOffre = async (req, res) => {
  try {
    const offre = await offreService.updateOffre(req.params.id, req.body);
    res.status(200).json(offre);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'offre" });
  }
};

export const deleteOffre = async (req, res) => {
  try {
    await offreService.deleteOffre(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la suppression de l'offre" });
  }
};