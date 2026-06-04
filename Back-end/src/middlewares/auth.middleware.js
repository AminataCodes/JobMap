import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token manquant' })
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
        next()
    } catch (error) {
        return res.status(401).json({ message: 'Token invalide ou expiré' })
    }
}

export const isEtudiant = (req, res, next) => {
    if (req.user.role !== 'etudiant') {
        return res.status(403).json({ message: 'Accès réservé aux étudiants' })
    }
    next()
}

export const isEntreprise = (req, res, next) => {
    if (req.user.role !== 'entreprise') {
        return res.status(403).json({ message: 'Accès réservé aux entreprises' })
    }
    next()
}