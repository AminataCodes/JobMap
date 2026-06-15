import { Router } from 'express'
import {
  ajouterOffre,
  supprimerOffre,
  getOffres,
  getOffreById,
  modifierOffre,
} from '../controllers/offre.controller.js'
import { verifyToken, isEcole } from '../middlewares/auth.middleware.js'

const router = Router()

// PUBLIC
router.get('/', getOffres)
router.get('/:id', getOffreById)

// PROTÉGÉ (école seulement)
router.post('/', verifyToken, isEcole, ajouterOffre)
router.put('/:id', verifyToken, isEcole, modifierOffre)
router.delete('/:id', verifyToken, isEcole, supprimerOffre)

export default router
