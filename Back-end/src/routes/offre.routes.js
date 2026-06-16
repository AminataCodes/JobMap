
import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  createOffre,
  getAllOffres,
  getOffreById,
  updateOffre,
  deleteOffre,
} from "../controllers/offre-controller.js";

const router = express.Router();

router.get("/", getAllOffres);
router.get("/:id", getOffreById);

router.post("/", verifyToken, createOffre);
router.put("/:id", verifyToken, updateOffre);
router.delete("/:id", verifyToken, deleteOffre);

export default router;