import express from "express";

import {
  createCandidature,
  getAllCandidatures,
  getCandidatureById,
} from "../controllers/candidature-controller.js";

const router = express.Router();

router.post("/", createCandidature);

router.get("/", getAllCandidatures);

router.get("/:id", getCandidatureById);

export default router;