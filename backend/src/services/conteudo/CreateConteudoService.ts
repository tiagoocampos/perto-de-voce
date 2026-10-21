import type { TipoConteudo } from "../../generated/prisma/enums.js";
import prismaClient from "../../prisma/index.js";
import { CategoriaNotFoundError } from "../../exceptions/CategoriaErrors.js";
import { apagarPdf, uploadPdf, type ArquivoEnviado } from "./arquivoPdf.js";
import { validarRegrasDoTipo } from "./validarRegrasDoTipo.js";

interface CreateConteudoServiceProps {
  tipo: TipoConteudo;
  titulo: string;
  descricao: string;
  link?: string | null | undefined;
  texto?: string | null | undefined;
  ordem?: number | undefined;
  publicado?: boolean | undefined;
  categoriaId?: string | null | undefined;
  arquivo?: ArquivoEnviado | undefined;
}

class CreateConteudoService {
  async execute({
    tipo,
    titulo,
    descricao,
    link,
    texto,
    ordem,
    publicado,
    categoriaId,
    arquivo,
  }: CreateConteudoServiceProps) {
    // Valida tudo ANTES de enviar o arquivo, para não deixar PDF órfão no Cloudinary
    validarRegrasDoTipo({
      tipo,
      temArquivo: !!arquivo,
      link: link ?? null,
      texto: texto ?? null,
    });

    if (categoriaId) {
      const categoria = await prismaClient.categoria.findUnique({
        where: { id: categoriaId },
      });

      if (!categoria) {
        throw new CategoriaNotFoundError();
      }
    }

    const pdf = arquivo ? await uploadPdf(arquivo) : null;

    try {
      const conteudo = await prismaClient.conteudo.create({
        data: {
          tipo,
          titulo,
          descricao,
          link: link ?? null,
          texto: texto ?? null,
          arquivoUrl: pdf?.url ?? null,
          arquivoPublicId: pdf?.publicId ?? null,
          publicado: publicado ?? false,
          ordem: ordem ?? 0,
          categoriaId: categoriaId ?? null,
        },
      });

      return conteudo;
    } catch (error) {
      // Se o banco falhou, o PDF recém-enviado ficaria sem dono
      if (pdf) {
        await apagarPdf(pdf.publicId);
      }
      throw error;
    }
  }
}

export { CreateConteudoService };
