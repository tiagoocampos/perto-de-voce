import prismaClient from "../../prisma/index.js";

class ListCategoriasService {
  async execute() {
    const categorias = await prismaClient.categoria.findMany({
      orderBy: { nome: "asc" },
      select: {
        id: true,
        nome: true,
        slug: true,
      },
    });

    return categorias;
  }
}

export { ListCategoriasService };
