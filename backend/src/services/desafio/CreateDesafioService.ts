import prismaClient from "../../prisma/index.js";

interface CreateDesafioServiceProps {
  titulo: string;
  descricao: string;
  ordem?: number | undefined;
  ativo?: boolean | undefined;
}

class CreateDesafioService {
  async execute({ titulo, descricao, ordem, ativo }: CreateDesafioServiceProps) {
    const desafio = await prismaClient.desafio.create({
      data: {
        titulo,
        descricao,
        ordem: ordem ?? 0,
        ativo: ativo ?? true,
      },
    });

    return desafio;
  }
}

export { CreateDesafioService };
