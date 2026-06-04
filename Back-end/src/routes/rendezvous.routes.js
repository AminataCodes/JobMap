import express from 'express'
import {
  proposerRendezVous,
  repondreRendezVous,
  getMesRendezVous,
  getRdvEntreprise
} from '../controllers/rendezvous.controller.js'
import { verifyToken, isEntreprise, isEtudiant } from '../middlewares/auth.middleware.js'

const router = express.Router()

// Entreprise propose un RDV
router.post('/proposer', verifyToken, isEntreprise, proposerRendezVous)

// Entreprise voit ses RDVs proposés
router.get('/entreprise', verifyToken, isEntreprise, getRdvEntreprise)

// Etudiant répond à un RDV
router.patch('/:id/repondre', verifyToken, isEtudiant, repondreRendezVous)

// Etudiant voit son calendrier de RDVs
router.get('/mes-rdv', verifyToken, isEtudiant, getMesRendezVous)

export default router