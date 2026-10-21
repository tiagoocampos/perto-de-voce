import type { TipoConteudo } from "../../generated/prisma/enums.js";
import prismaClient from "../../prisma/index.js";

interface ListConteudosAdminServiceProps {
  tipo?: TipoConteudo | undefined;
}

class ListConteudosAdminService {
  async execute({ tipo }: ListConteudosAdminServiceProps) {
    // Admin vê tudo, inclusive os não publicados
    const conteudos = await prismaClient.conteudo.findMany({
      where: {
        ...(tipo !== undefined && { tipo }),
      },
      orderBy: [{ ordem: "asc" }, { criadoEm: "desc" }],
    });

    return conteudos;
  }
}

export { ListConteudosAdminService };
