import prismaClient from "../../prisma/index.js";

class ListDesafiosService {
  async execute() {
    const desafios = await prismaClient.desafio.findMany({
      where: { ativo: true },
      orderBy: [{ ordem: "asc" }, { criadoEm: "desc" }],
      select: {
        id: true,
        titulo: true,
        descricao: true,
        ordem: true,
      },
    });

    return desafios;
  }
}

export { ListDesafiosService };
