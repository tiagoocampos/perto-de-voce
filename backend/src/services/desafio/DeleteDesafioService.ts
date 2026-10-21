import prismaClient from "../../prisma/index.js";
import { findDesafioOrFail } from "./findDesafioOrFail.js";

interface DeleteDesafioServiceProps {
  desafio_id: string;
}

class DeleteDesafioService {
  async execute({ desafio_id }: DeleteDesafioServiceProps) {
    await findDesafioOrFail(desafio_id);

    await prismaClient.desafio.delete({
      where: { id: desafio_id },
    });

    return { message: "Desafio removido com sucesso" };
  }
}

export { DeleteDesafioService };
