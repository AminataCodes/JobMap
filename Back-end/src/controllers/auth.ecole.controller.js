import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma.js'

// ── POST /api/auth/ecole/register ──
export const register = async (req, res) => {
  try {
    const {
      nomEtablissement, typeEtablissement, logo, siteWeb,
      emailPro, telephone, adresse, ville, codePostal,
      pays, description, password,
    } = req.body

    if (!nomEtablissement || !emailPro || !password || !typeEtablissement) {
      return res.status(400).json({ message: 'Champs obligatoires manquants' })
    }

    const existant = await prisma.ecole.findUnique({ where: { emailPro } })
    if (existant) {
      return res.status(409).json({ message: 'Email déjà utilisé' })
    }

    const hash = await bcrypt.hash(password, 10)

    const ecole = await prisma.ecole.create({
      data: {
        nomEtablissement,
        typeEtablissement,
        logo:        logo        || null,
        siteWeb:     siteWeb     || null,
        emailPro,
        telephone,
        adresse,
        ville,
        codePostal,
        pays,
        description,
        password: hash,
      },
    })

    const token = jwt.sign(
      { id: ecole.id, role: 'ecole' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    const { password: _, ...ecoleData } = ecole
    return res.status(201).json({ token, ecole: ecoleData })

  } catch (err) {
    console.error('register ecole:', err)
    return res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── POST /api/auth/ecole/login ──
export const login = async (req, res) => {
  try {
    const { emailPro, password } = req.body

    if (!emailPro || !password) {
      return res.status(400).json({ message: 'Champs manquants' })
    }

    const ecole = await prisma.ecole.findUnique({ where: { emailPro } })
    if (!ecole) {
      return res.status(401).json({ message: 'Identifiants incorrects' })
    }

    const valide = await bcrypt.compare(password, ecole.password)
    if (!valide) {
      return res.status(401).json({ message: 'Identifiants incorrects' })
    }

    const token = jwt.sign(
      { id: ecole.id, role: 'ecole' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    const { password: _, ...ecoleData } = ecole
    return res.json({ token, ecole: ecoleData })

  } catch (err) {
    console.error('login ecole:', err)
    return res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── GET /api/auth/ecole/profil ──
export const getProfil = async (req, res) => {
  try {
    const ecole = await prisma.ecole.findUnique({
      where: { id: req.user.id },
      include: {
        formations: true,
        offres:     { orderBy: { createdAt: 'desc' } },
      },
    })

    if (!ecole) {
      return res.status(404).json({ message: 'École introuvable' })
    }

    const { password, ...data } = ecole
    return res.json(data)

  } catch (err) {
    console.error('getProfil ecole:', err)
    return res.status(500).json({ message: 'Erreur serveur' })
  }
}