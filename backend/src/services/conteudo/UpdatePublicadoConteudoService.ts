import prismaClient from "../../prisma/index.js";
import { findConteudoOrFail } from "./findConteudoOrFail.js";

interface UpdatePublicadoConteudoServiceProps {
  conteudo_id: string;
  publicado: boolean;
}

class UpdatePublicadoConteudoService {
  async execute({ conteudo_id, publicado }: UpdatePublicadoConteudoServiceProps) {
    await findConteudoOrFail(conteudo_id);

    const conteudo = await prismaClient.conteudo.update({
      where: { id: conteudo_id },
      data: { publicado },
    });

    return conteudo;
  }
}

export { UpdatePublicadoConteudoService };
