import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma.js'

// ── POST /api/auth/admin/register ──
export const register = async (req, res) => {
  try {
    const {
      email,
      nomAdmin,
      description,
      photoProfilUrl,
      motDePasse,
    } = req.body

    if (!email || !nomAdmin || !motDePasse) {
      return res.status(400).json({
        message: 'Champs obligatoires manquants',
      })
    }

    const adminExistant = await prisma.admin.findUnique({
      where: { email },
    })

    if (adminExistant) {
      return res.status(409).json({
        message: 'Email déjà utilisé',
      })
    }

    const hash = await bcrypt.hash(motDePasse, 10)

    const admin = await prisma.admin.create({
      data: {
        email,
        nomAdmin,
        description: description || null,
        photoProfilUrl: photoProfilUrl || null,
        motDePasse: hash,
      },
    })

    const token = jwt.sign(
      {
        id: admin.uid,
        role: 'admin',
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    )

    const { motDePasse: _, ...adminData } = admin

    return res.status(201).json({
      token,
      admin: adminData,
    })
  } catch (err) {
    console.error('register admin:', err)
    return res.status(500).json({
      message: 'Erreur serveur',
    })
  }
}

// ── POST /api/auth/admin/login ──
export const login = async (req, res) => {
  try {
    const { email, motDePasse } = req.body

    if (!email || !motDePasse) {
      return res.status(400).json({
        message: 'Champs manquants',
      })
    }

    const admin = await prisma.admin.findUnique({
      where: { email },
    })

    if (!admin) {
      return res.status(401).json({
        message: 'Identifiants incorrects',
      })
    }

    const valide = await bcrypt.compare(
      motDePasse,
      admin.motDePasse
    )

    if (!valide) {
      return res.status(401).json({
        message: 'Identifiants incorrects',
      })
    }

    const token = jwt.sign(
      {
        id: admin.uid,
        role: 'admin',
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
      }
    )

    const { motDePasse: _, ...adminData } = admin

    return res.json({
      token,
      admin: adminData,
    })
  } catch (err) {
    console.error('login admin:', err)
    return res.status(500).json({
      message: 'Erreur serveur',
    })
  }
}

// ── GET /api/auth/admin/profil ──
export const getProfil = async (req, res) => {
  try {
    const admin = await prisma.admin.findUnique({
      where: {
        uid: req.user.id,
      },
      include: {
        offres: {
          orderBy: {
            datePublication: 'desc',
          },
        },
      },
    })

    if (!admin) {
      return res.status(404).json({
        message: 'Admin introuvable',
      })
    }

    const { motDePasse, ...adminData } = admin

    return res.json(adminData)
  } catch (err) {
    console.error('getProfil admin:', err)
    return res.status(500).json({
      message: 'Erreur serveur',
    })
  }
}