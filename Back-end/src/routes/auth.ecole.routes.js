import express from 'express'
import { register, login, getProfil } from '../controllers/auth.ecole.controller.js'
import { ajouterFormation, supprimerFormation } from '../controllers/formation.controller.js'
import { ajouterOffre, supprimerOffre } from '../controllers/offre.controller.js'
import { verifyToken } from '../middlewares/auth.middleware.js'

const router = express.Router()

// ── Public ──
router.post('/register', register)
router.post('/login',    login)

// ── Protégé ──
router.get('/profil',            verifyToken, getProfil)
router.post('/formations',       verifyToken, ajouterFormation)
router.delete('/formations/:id', verifyToken, supprimerFormation)
router.post('/offres',           verifyToken, ajouterOffre)
router.delete('/offres/:id',     verifyToken, supprimerOffre)

export default router