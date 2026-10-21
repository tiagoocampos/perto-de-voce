import prismaClient from "../../prisma/index.js";
import { findDesafioOrFail } from "./findDesafioOrFail.js";

// undefined = não mexe no campo
interface UpdateDesafioServiceProps {
  desafio_id: string;
  titulo?: string | undefined;
  descricao?: string | undefined;
  ordem?: number | undefined;
  ativo?: boolean | undefined;
}

class UpdateDesafioService {
  async execute({ desafio_id, titulo, descricao, ordem, ativo }: UpdateDesafioServiceProps) {
    await findDesafioOrFail(desafio_id);

    const desafio = await prismaClient.desafio.update({
      where: { id: desafio_id },
      data: {
        ...(titulo !== undefined && { titulo }),
        ...(descricao !== undefined && { descricao }),
        ...(ordem !== undefined && { ordem }),
        ...(ativo !== undefined && { ativo }),
      },
    });

    return desafio;
  }
}

export { UpdateDesafioService };
