import express from 'express'
import { verifyToken, isEntreprise } from '../middlewares/auth.middleware.js'
import prisma from '../lib/prisma.js'

const router = express.Router()

router.get('/me', verifyToken, isEntreprise, async (req, res) => {
    try {
        const entreprise = await prisma.entreprise.findUnique({
            where: { uid: req.user.uid },
            select: {
                uid: true,
                email: true,
                nomEntreprise: true,
                description: true,
                logoUrl: true,
                secteur: true,
                annonces: true,
            },
        })
        res.json(entreprise)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

export default router