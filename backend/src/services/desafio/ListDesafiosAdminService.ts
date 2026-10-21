import prismaClient from "../../prisma/index.js";

class ListDesafiosAdminService {
  async execute() {
    // Admin vê tudo, inclusive os desafios inativos
    const desafios = await prismaClient.desafio.findMany({
      orderBy: [{ ordem: "asc" }, { criadoEm: "desc" }],
    });

    return desafios;
  }
}

export { ListDesafiosAdminService };
