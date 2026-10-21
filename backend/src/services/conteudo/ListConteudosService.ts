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
      // Só o que o app precisa: sem arquivoPublicId, publicado nem categoriaId.
      // O texto em si vem só no detalhe; aqui ele é lido apenas para virar `temTexto`.
      select: {
        id: true,
        tipo: true,
        titulo: true,
        descricao: true,
        arquivoUrl: true,
        link: true,
        texto: true,
        ordem: true,
        criadoEm: true,
        categoria: {
          select: { id: true, nome: true, slug: true },
        },
      },
    });

    // O app precisa saber se o material tem texto para ler, sem baixar o texto de todos
    return conteudos.map(({ texto, ...conteudo }) => ({
      ...conteudo,
      temTexto: !!texto?.trim(),
    }));
  }
}

export { ListConteudosService };
