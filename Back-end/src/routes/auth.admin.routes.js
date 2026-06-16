import express from 'express'
import { register, login, getProfil } from '../controllers/auth.admin.controller.js'
import { ajouterFormation, supprimerFormation } from '../controllers/formation.controller.js'
import {
  createOffre,
  getAllOffres,
  getOffreById,
  updateOffre,
  deleteOffre,
} from "../controllers/offre-controller.js";
import { verifyToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

// ── Public ──
router.post('/register', register)
router.post('/login',    login)

// ── Protégé ──
router.get('/profil',            verifyToken, getProfil)
router.post('/formations',       verifyToken, ajouterFormation)
router.delete('/formations/:id', verifyToken, supprimerFormation)
router.post('/offres',           verifyToken, createOffre)
router.get('/offres',            verifyToken, getAllOffres)
router.get('/offres/:id',        verifyToken, getOffreById)
router.put('/offres/:id',         verifyToken, updateOffre)
router.delete('/offres/:id',     verifyToken, deleteOffre)

export default router