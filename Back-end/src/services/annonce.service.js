import prisma from '../lib/prisma.js'

export const createAnnonce = async (data) => {
  console.log('DATA reçue dans service:', JSON.stringify(data)) // 👈 ajoute ça

  const entreprise = await prisma.entreprise.findUnique({
    where: { uid: data.entrepriseId },
  });
  // ...
    

    return await prisma.annonce.create({
  data: {
    entrepriseId: data.entrepriseId,
    nomPoste: data.nomPoste,
    description: data.description,
    lieu: data.lieu,
    competencesObligatoires: data.competencesObligatoires,
    competencesSouhaitables: data.competencesSouhaitables,
    dateDeDebut: data.dateDeDebut ? new Date(data.dateDeDebut) : null, // 👈 fix ici
  },
  include: {
  entreprise: {
    select: {
      uid: true,
      email: true,
      nomEntreprise: true,
      logoUrl: true,
      secteur: true,
    }
  }
},
})};


export const getAllAnnonces =
  async () => {

    return await prisma.annonce.findMany({

      include: {
        entreprise: true,
      },

      orderBy: {
        datePublication: "desc",
      },
    });
  };

export const getAnnonceById = async (id) => {
    return await prisma.annonce.findUnique({
        where: { id },
        include: { entreprise: true, candidatures: true },
    })
}

export const deleteAnnonce = async (id) => {
    await prisma.annonce.delete({ where: { id } })
    return { message: 'Annonce supprimée' }
}