import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  createCandidature,
  getAllCandidatures,
  getCandidatureById,
} from "../controllers/candidature-controller.js";

const router = express.Router();

router.post("/", verifyToken, createCandidature);

router.get("/", verifyToken, getAllCandidatures);

router.get("/:id", verifyToken, getCandidatureById);

export default router;