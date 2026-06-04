import 'dotenv/config'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import prisma from '../lib/prisma.js'
import { uploadFile } from '../services/upload.service.js'
import { sendVerificationEmail } from '../services/email.service.js'

// ─── REGISTER ────────────────────────────────────────────────
export const register = async (req, res) => {
    try {
        console.log('BODY reçu:', req.body)
        console.log('FILE reçu:', req.file)

        const { email, nomEntreprise, description, secteur, motDePasse } = req.body

        if (!email || !nomEntreprise || !description || !motDePasse) {
            return res.status(400).json({
                message: 'Champs obligatoires manquants',
                recu: req.body
            })
        }

        const existing = await prisma.entreprise.findUnique({ where: { email } })
        if (existing) {
            return res.status(400).json({ message: 'Email déjà utilisé' })
        }

        const hash = await bcrypt.hash(motDePasse, 12)

        let logoUrl = null
        if (req.file) {
            logoUrl = await uploadFile(req.file, 'logos')
        }

        const verifyToken = uuidv4()

        const entreprise = await prisma.entreprise.create({
            data: {
                email,
                nomEntreprise,
                description,
                secteur: secteur || null,
                motDePasse: hash,
                logoUrl,
                verifyToken,
                emailVerified: true, // on skip la vérif email pour l'instant
            },
        })

        const token = jwt.sign(
            { uid: entreprise.uid, role: 'entreprise', email: entreprise.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.status(201).json({
            token,
            user: {
                uid: entreprise.uid,
                email: entreprise.email,
                nomEntreprise: entreprise.nomEntreprise,
                logoUrl: entreprise.logoUrl,
                secteur: entreprise.secteur,
                role: 'entreprise',
            }
        })
    } catch (error) {
        console.error('ERREUR register:', error)
        res.status(500).json({ message: error.message })
    }
}

// ─── LOGIN ───────────────────────────────────────────────────
export const login = async (req, res) => {
    try {
        const { email, motDePasse } = req.body

        if (!email || !motDePasse) {
            return res.status(400).json({ message: 'Email et mot de passe requis' })
        }

        const entreprise = await prisma.entreprise.findUnique({ where: { email } })
        if (!entreprise) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
        }

        if (!entreprise.emailVerified) {
            return res.status(403).json({ message: 'Vérifie ton email avant de te connecter' })
        }

        const valid = await bcrypt.compare(motDePasse, entreprise.motDePasse)
        if (!valid) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
        }

        const token = jwt.sign(
            { uid: entreprise.uid, role: 'entreprise', email: entreprise.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.json({
            token,
            user: {
                uid: entreprise.uid,
                email: entreprise.email,
                nomEntreprise: entreprise.nomEntreprise,
                logoUrl: entreprise.logoUrl,
                secteur: entreprise.secteur,
                role: 'entreprise',
            },
        })
    } catch (error) {
        console.error('ERREUR login:', error)
        res.status(500).json({ message: error.message })
    }
}

// ─── VERIFY EMAIL ────────────────────────────────────────────
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params

        const entreprise = await prisma.entreprise.findFirst({
            where: { verifyToken: token },
        })

        if (!entreprise) {
            return res.status(400).json({ message: 'Token invalide ou expiré' })
        }

        await prisma.entreprise.update({
            where: { uid: entreprise.uid },
            data: { emailVerified: true, verifyToken: null },
        })

        res.json({ message: 'Email vérifié avec succès. Tu peux te connecter !' })
    } catch (error) {
        console.error('ERREUR verifyEmail:', error)
        res.status(500).json({ message: error.message })
    }
}