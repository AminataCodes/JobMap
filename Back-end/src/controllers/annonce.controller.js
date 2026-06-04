/*import * as annonceService from '../services/annonce.service.js'*/

import {

  createAnnonce,

  getAllAnnonces,

} from "../services/annonce.service.js";

export const create =
  async (req, res) => {

    try {

      const entrepriseId =
        req.user.uid;

      const annonce =
        await createAnnonce({

          ...req.body,

          entrepriseId,
        });

      res.status(201).json(
        annonce
      );

    } catch (error) {

      res.status(500).json({
        error: error.message,
      });
    }
  };

export const getAll =
  async (req, res) => {

    try {

      const annonces =
        await getAllAnnonces();

      res.json(annonces);

    } catch (error) {

      res.status(500).json({
        error: error.message,
      });
    }
  };

export const getAnnonceById = async (req, res) => {
    try {
        const annonce = await annonceService.getAnnonceById(req.params.id)
        if (!annonce) {
            return res.status(404).json({ message: 'Annonce introuvable' })
        }
        res.json(annonce)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const deleteAnnonce = async (req, res) => {
    try {
        const result = await annonceService.deleteAnnonce(req.params.id)
        res.json(result)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}