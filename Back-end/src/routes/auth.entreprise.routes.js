import express from 'express'
import { register, login, verifyEmail } from '../controllers/auth.entreprise.controller.js'
import { upload } from '../middlewares/upload.middleware.js'
import prisma from '../lib/prisma.js'

const router = express.Router()

router.post('/register', upload.single('logo'), register)
router.post('/login', login)
router.get('/verify-email/:token', verifyEmail)

//  À supprimer en production
router.get('/verify-dev/:email', async (req, res) => {
    try {
        await prisma.entreprise.update({
            where: { email: req.params.email },
            data: { emailVerified: true, verifyToken: null }
        })
        res.json({ message: 'Email vérifié (mode dev)' })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export default router