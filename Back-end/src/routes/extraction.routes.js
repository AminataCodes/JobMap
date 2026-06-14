import { Router } from "express";
import { extractFromUrl } from "../controllers/extraction.controller.js";

const router = Router();

router.post("/", extractFromUrl);

export default router;
