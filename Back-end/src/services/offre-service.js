import prisma from "../lib/prisma.js";

export const createOffre = async (data) => {
  return await prisma.offre.create({ data });
};

export const getAllOffres = async () => {
  return await prisma.offre.findMany({
    orderBy: { datePublication: "desc" },
  });
};

export const getOffreById = async (id) => {
  return await prisma.offre.findUnique({
    where: { id },
  });
};

export const updateOffre = async (id, data) => {
  return await prisma.offre.update({
    where: { id },
    data,
  });
};

export const deleteOffre = async (id) => {
  return await prisma.offre.delete({
    where: { id },
  });
};