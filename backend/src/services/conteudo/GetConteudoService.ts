import prismaClient from "../../prisma/index.js";
import { ConteudoNotFoundError } from "../../exceptions/ConteudoErrors.js";

interface GetConteudoServiceProps {
  conteudo_id: string;
}

class GetConteudoService {
  async execute({ conteudo_id }: GetConteudoServiceProps) {
    // Não publicado responde 404, igual a um id que não existe: não revela rascunhos
    const conteudo = await prismaClient.conteudo.findFirst({
      where: { id: conteudo_id, publicado: true },
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

    if (!conteudo) {
      throw new ConteudoNotFoundError();
    }

    return conteudo;
  }
}

export { GetConteudoService };
