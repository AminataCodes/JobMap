import prisma from "../lib/prisma.js";

export const createCandidature = async (data) => {
  return await prisma.candidature.create({
    data,
  });
};

export const getAllCandidatures = async (userId) => {
  return await prisma.candidature.findMany({
    where: {
      etudiantId: userId,
    },
    orderBy: {
      dateDepot: "desc",
    },
  });
};

export const getCandidatureById = async (id, userId) => {
  return await prisma.candidature.findUnique({
    where: {
      id,
      etudiantId: userId,
    },
  });
};