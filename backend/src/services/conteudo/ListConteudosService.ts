import type { TipoConteudo } from "../../generated/prisma/enums.js";
import prismaClient from "../../prisma/index.js";

interface ListConteudosServiceProps {
  tipo?: TipoConteudo | undefined;
  categoria?: string | undefined; // slug
}

class ListConteudosService {
  async execute({ tipo, categoria }: ListConteudosServiceProps) {
    const conteudos = await prismaClient.conteudo.findMany({
      where: {
        publicado: true,
        ...(tipo !== undefined && { tipo }),
        ...(categoria !== undefined && { categoria: { slug: categoria } }),
      },
      orderBy: [{ ordem: "asc" }, { criadoEm: "desc" }],
      // Só o que o app precisa: sem arquivoPublicId, publicado, categoriaId nem o texto (vem no detalhe)
      select: {
        id: true,
        tipo: true,
        titulo: true,
        descricao: true,
        arquivoUrl: true,
        link: true,
        ordem: true,
        criadoEm: true,
        categoria: {
          select: { id: true, nome: true, slug: true },
        },
      },
    });

    return conteudos;
  }
}

export { ListConteudosService };
