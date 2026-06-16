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
        const { email, nom, prenom, motDePasse } = req.body

        if (!email || !nom || !prenom || !motDePasse) {
            return res.status(400).json({
                message: 'Champs obligatoires manquants',
                recu: req.body
            })
        }

        const existing = await prisma.etudiant.findUnique({ where: { email } })
        if (existing) {
            return res.status(400).json({ message: 'Email déjà utilisé' })
        }

        const hash = await bcrypt.hash(motDePasse, 12)

        const verifyToken = uuidv4()

        const etudiant = await prisma.etudiant.create({
            data: {
                email,
                nom,
                prenom,
                motDePasse: hash,
                verifyToken,
                emailVerified: true,
            },
        })

        const token = jwt.sign(
            { uid: etudiant.uid, role: 'etudiant', email: etudiant.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.status(201).json({
            token,
            user: {
                uid: etudiant.uid,
                email: etudiant.email,
                nom: etudiant.nom,
                prenom: etudiant.prenom,
                cvUrl: etudiant.cvUrl,
                role: 'etudiant',
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

        const etudiant = await prisma.etudiant.findUnique({ where: { email } })
        if (!etudiant) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
        }

        if (!etudiant.emailVerified) {
            return res.status(403).json({ message: 'Vérifie ton email avant de te connecter' })
        }

        const valid = await bcrypt.compare(motDePasse, etudiant.motDePasse)
        if (!valid) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' })
        }

        const token = jwt.sign(
            { uid: etudiant.uid, role: 'etudiant', email: etudiant.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.json({
            token,
            user: {
                uid: etudiant.uid,
                email: etudiant.email,
                nom: etudiant.nom,
                prenom: etudiant.prenom,
                cvUrl: etudiant.cvUrl,
                role: 'etudiant',
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

        const etudiant = await prisma.etudiant.findFirst({
            where: { verifyToken: token },
        })

        if (!etudiant) {
            return res.status(400).json({ message: 'Token invalide ou expiré' })
        }

        await prisma.etudiant.update({
            where: { uid: etudiant.uid },
            data: { emailVerified: true, verifyToken: null },
        })

        res.json({ message: 'Email vérifié avec succès. Tu peux te connecter !' })
    } catch (error) {
        console.error('ERREUR verifyEmail:', error)
        res.status(500).json({ message: error.message })
    }
}

// ─── GET PROFIL ──────────────────────────────────────────────
export const getProfil = async (req, res) => {
    try {
        const etudiant = await prisma.etudiant.findUnique({
            where: { uid: req.user.uid },
            select: {
                uid: true,
                email: true,
                nom: true,
                prenom: true,
                niveauEtude: true,
                cvUrl: true,
                bio: true,
                competences: true
            },
        })

        if (!etudiant) {
            return res.status(404).json({ message: 'Étudiant introuvable' })
        }

        res.json(etudiant)
    } catch (error) {
        console.error('ERREUR getProfil:', error)
        res.status(500).json({ message: error.message })
    }
}

// ─── UPDATE PROFIL ───────────────────────────────────────────
export const updateProfil = async (req, res) => {
    try {
        const { nom, prenom, niveauEtude, bio, competences, experiences } = req.body

        const cvFile = req.files?.cv?.[0]
        const photoFile = req.files?.photoProfil?.[0]

        let cvUrl = undefined
        if (cvFile) {
            cvUrl = await uploadFile(cvFile, 'cv')
        }

        let photoProfilUrl = undefined
        if (photoFile) {
            photoProfilUrl = await uploadFile(photoFile, 'photos')
        }

        // competences et experiences arrivent en JSON string depuis FormData
        let competencesArray = undefined
        if (competences) {
            try {
                competencesArray = JSON.parse(competences)
            } catch {
                competencesArray = undefined
            }
        }

        let experiencesArray = undefined
        if (experiences) {
            try {
                experiencesArray = JSON.parse(experiences)
            } catch {
                experiencesArray = undefined
            }
        }

        const updated = await prisma.etudiant.update({
            where: { uid: req.user.uid },
            data: {
                ...(nom && { nom }),
                ...(prenom && { prenom }),
                ...(niveauEtude && { niveauEtude }),
                ...(cvUrl && { cvUrl }),
                ...(photoProfilUrl && { photoProfilUrl }),
                ...(bio !== undefined && { bio }),
                ...(competencesArray && { competences: competencesArray }),
                ...(experiencesArray && { experiences: experiencesArray }),
            },
            select: {
                uid: true,
                email: true,
                nom: true,
                prenom: true,
                niveauEtude: true,
                cvUrl: true,
                bio: true,
                competences: true,
                experiences: true,
                photoProfilUrl: true,
            },
        })

        res.json(updated)
    } catch (error) {
        console.error('ERREUR updateProfil:', error)
        res.status(500).json({ message: error.message })
    }
}