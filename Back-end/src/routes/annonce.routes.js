import express from 'express'
import {
    create,
    getAll,
    getAnnonceById,
    deleteAnnonce
} from '../controllers/annonce.controller.js'
import { verifyToken, isEntreprise } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.get('/', getAll)
router.get('/:id', getAnnonceById)
router.post('/', verifyToken, isEntreprise, create)
router.delete('/:id', verifyToken, isEntreprise, deleteAnnonce)

export default router