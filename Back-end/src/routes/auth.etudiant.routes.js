import express from 'express'
import { register, login, verifyEmail, getProfil, updateProfil } from '../controllers/auth.etudiant.controller.js'
import { upload } from '../middlewares/upload.middleware.js'
import { verifyToken, isEtudiant } from '../middlewares/auth.middleware.js'
import prisma from '../lib/prisma.js'

const router = express.Router()

router.post('/register', upload.single('cv'), register)
router.post('/login', login)
router.get('/verify-email/:token', verifyEmail)

// ── Routes Profil protégées ────────────────────────────────
router.get('/profil',  verifyToken, isEtudiant, getProfil)
router.put('/profil',  verifyToken, isEtudiant, upload.single('cv'), updateProfil)

// ── Route dev uniquement ───────────────────────────────────
router.get('/verify-dev/:email', async (req, res) => {
    try {
        await prisma.etudiant.update({
            where: { email: req.params.email },
            data: { emailVerified: true, verifyToken: null }
        })
        res.json({ message: 'Email vérifié (mode dev)' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export default router