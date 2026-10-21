import prismaClient from "../../prisma/index.js";
import { ConteudoNotFoundError } from "../../exceptions/ConteudoErrors.js";

export async function findConteudoOrFail(id: string) {
  const conteudo = await prismaClient.conteudo.findUnique({
    where: { id },
  });

  if (!conteudo) {
    throw new ConteudoNotFoundError();
  }

  return conteudo;
}
