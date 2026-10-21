import prismaClient from "../../prisma/index.js";
import { DesafioNotFoundError } from "../../exceptions/DesafioErrors.js";

export async function findDesafioOrFail(id: string) {
  const desafio = await prismaClient.desafio.findUnique({
    where: { id },
  });

  if (!desafio) {
    throw new DesafioNotFoundError();
  }

  return desafio;
}
