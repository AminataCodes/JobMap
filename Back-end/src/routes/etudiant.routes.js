import express from 'express'
import { verifyToken, isEcole } from '../middlewares/auth.middleware.js'
import {
  getAllEtudiants,
  getEtudiantById,
} from '../controllers/etudiant.controller.js'

const router = express.Router()

router.get('/', verifyToken, isEcole, getAllEtudiants)
router.get('/:id', verifyToken, isEcole, getEtudiantById)

export default router