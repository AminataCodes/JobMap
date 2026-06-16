import prisma from '../lib/prisma.js'

// ── POST /api/auth/admin/formations ──
// NOTE : le modèle Formation n'existe pas encore dans le schema.
// Cette route renvoie 501 jusqu'à ce que tu l'ajoutes.
export const ajouterFormation = async (req, res) => {
  try {
    const { nom } = req.body
    if (!nom?.trim()) {
      return res.status(400).json({ message: 'Le nom est requis' })
    }


    // TODO : ajouter le modèle Formation dans schema.prisma
    // model Formation {
    //   id      String @id @default(uuid())
    //   nom     String
    //   adminId String
    //   admin   Admin  @relation(fields: [adminId], references: [uid])
    // }
    // Puis relancer : npx prisma migrate dev --name add_formation
    return res.status(501).json({
      message: 'Fonctionnalité Formation pas encore migrée en base'
    })


  } catch (err) {
    console.error('ajouterFormation:', err)
    return res.status(500).json({ message: 'Erreur serveur' })
  }
}

// ── DELETE /api/auth/admin/formations/:id ──
export const supprimerFormation = async (req, res) => {
  try {

    return res.status(501).json({
      message: 'Fonctionnalité Formation pas encore migrée en base'
    })

  } catch (err) {
    console.error('supprimerFormation:', err)
    return res.status(500).json({ message: 'Erreur serveur' })
  }
}