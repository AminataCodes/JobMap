import prisma from '../lib/prisma.js'

export const getAllEtudiants = async () => {
  const etudiants = await prisma.etudiant.findMany({
    select: {
      uid: true,
      email: true,
      nom: true,
      prenom: true,
      niveauEtude: true,
      cvUrl: true,
      bio: true,
      competences: true,
      candidatures: {
        select: {
          id: true,
          lettreMotivationUrl: true,
          messageAdditionnel: true,
          createdAt: true,
          offre: {
            select: {
              id: true,
              nomEntreprise: true,
              nomPoste: true,
              lieu: true,
              datePublication: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
    orderBy: {
      nom: 'asc',
    },
  })

  return etudiants
}

export const getEtudiantById = async (uid) => {
  const etudiant = await prisma.etudiant.findUnique({
    where: { uid },
    select: {
      uid: true,
      email: true,
      nom: true,
      prenom: true,
      niveauEtude: true,
      cvUrl: true,
      bio: true,
      competences: true,
      candidatures: {
        select: {
          id: true,
          lettreMotivationUrl: true,
          messageAdditionnel: true,
          createdAt: true,
          offre: {
            select: {
              id: true,
              nomEntreprise: true,
              nomPoste: true,
              lieu: true,
              datePublication: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  return etudiant
}