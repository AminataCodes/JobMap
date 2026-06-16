import express from "express";
import multer from "multer";
import { verifyToken } from "../middlewares/auth.middleware.js"; // adapte le chemin
import {
  createCandidature,
  getAllCandidatures,
  getCandidatureById,
} from "../controllers/candidature-controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // adapte selon ta config Multer existante

router.post("/", verifyToken, upload.single("lettre"), createCandidature); // ✅ auth + fichier
router.get("/", verifyToken, getAllCandidatures);
router.get("/:id", verifyToken, getCandidatureById);

export default router;