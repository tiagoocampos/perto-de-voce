import prismaClient from "../../prisma/index.js";
import { apagarPdf } from "./arquivoPdf.js";
import { findConteudoOrFail } from "./findConteudoOrFail.js";

interface DeleteConteudoServiceProps {
  conteudo_id: string;
}

class DeleteConteudoService {
  async execute({ conteudo_id }: DeleteConteudoServiceProps) {
    const conteudo = await findConteudoOrFail(conteudo_id);

    await prismaClient.conteudo.delete({
      where: { id: conteudo_id },
    });

    // Depois do banco: se o Cloudinary falhar, o conteúdo já foi removido e nada quebra
    if (conteudo.arquivoPublicId) {
      await apagarPdf(conteudo.arquivoPublicId);
    }

    return { message: "Conteúdo removido com sucesso" };
  }
}

export { DeleteConteudoService };
