import express from "express";
import { verifyToken, isEtudiant, isEntreprise } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import {
  addCandidature,
  fetchCandidatures,
  fetchCandidaturesByAnnonce,
  fetchCandidatureById,
  accepter,
  rejeter,
  updateStatut,
} from "../controllers/candidature-controller.js";

const router = express.Router();
 
router.post(
  "/annonce/:annonceId/candidature",
  verifyToken,
  isEtudiant,
  upload.fields([
    { name: 'lettreMotivation', maxCount: 1 }
  ]),
  addCandidature
);

router.get("/", fetchCandidatures);
router.get("/annonce/:annonceId", fetchCandidaturesByAnnonce);
router.get("/:id", fetchCandidatureById);                          // ← NOUVEAU
router.patch("/:id/accepter", isEntreprise, accepter);
router.patch("/:id/rejeter", isEntreprise, rejeter);
router.patch("/:id/statut", verifyToken, isEntreprise, updateStatut); // ← NOUVEAU

export default router;