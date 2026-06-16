import prisma from "../lib/prisma.js";

export const createCandidature = async (data) => {
  return await prisma.candidature.create({
    data,
  });
};

export const getAllCandidatures = async (etudiantId) => {
  return prisma.candidature.findMany({
    where: { etudiantId },
    include: {
      offre: true
    },
    orderBy: {
      createdAt: "desc"
    }
  })
}

export const getCandidatureById = async (id, userId) => {
  return await prisma.candidature.findUnique({
    where: {
      id,
      etudiantId: userId,
    },
  });
};