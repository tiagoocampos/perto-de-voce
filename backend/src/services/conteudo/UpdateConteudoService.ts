import type { TipoConteudo } from "../../generated/prisma/enums.js";
import prismaClient from "../../prisma/index.js";
import { CategoriaNotFoundError } from "../../exceptions/CategoriaErrors.js";
import { apagarPdf, uploadPdf, type ArquivoEnviado } from "./arquivoPdf.js";
import { findConteudoOrFail } from "./findConteudoOrFail.js";
import { validarRegrasDoTipo } from "./validarRegrasDoTipo.js";

// undefined = não mexe no campo; null = limpa o campo
interface UpdateConteudoServiceProps {
  conteudo_id: string;
  tipo?: TipoConteudo | undefined;
  titulo?: string | undefined;
  descricao?: string | undefined;
  link?: string | null | undefined;
  texto?: string | null | undefined;
  ordem?: number | undefined;
  publicado?: boolean | undefined;
  categoriaId?: string | null | undefined;
  arquivo?: ArquivoEnviado | undefined;
}

class UpdateConteudoService {
  async execute({
    conteudo_id,
    tipo,
    titulo,
    descricao,
    link,
    texto,
    ordem,
    publicado,
    categoriaId,
    arquivo,
  }: UpdateConteudoServiceProps) {
    const conteudo = await findConteudoOrFail(conteudo_id);

    // Estado final = o que já estava salvo + o que veio na requisição
    const tipoFinal = tipo ?? conteudo.tipo;
    const linkFinal = link !== undefined ? link : conteudo.link;
    const textoFinal = texto !== undefined ? texto : conteudo.texto;

    // Vídeo não tem arquivo: se o tipo virou VIDEO, o PDF antigo deixa de valer
    const mantemArquivoAntigo = !!conteudo.arquivoUrl && tipoFinal !== "VIDEO";

    validarRegrasDoTipo({
      tipo: tipoFinal,
      temArquivo: !!arquivo || mantemArquivoAntigo,
      link: linkFinal,
      texto: textoFinal,
    });

    if (categoriaId) {
      const categoria = await prismaClient.categoria.findUnique({
        where: { id: categoriaId },
      });

      if (!categoria) {
        throw new CategoriaNotFoundError();
      }
    }

    const novoPdf = arquivo ? await uploadPdf(arquivo) : null;
    const arquivoFicouSemUso = !!conteudo.arquivoPublicId && (novoPdf !== null || !mantemArquivoAntigo);

    try {
      const atualizado = await prismaClient.conteudo.update({
        where: { id: conteudo_id },
        data: {
          ...(tipo !== undefined && { tipo }),
          ...(titulo !== undefined && { titulo }),
          ...(descricao !== undefined && { descricao }),
          ...(link !== undefined && { link }),
          ...(texto !== undefined && { texto }),
          ...(ordem !== undefined && { ordem }),
          ...(publicado !== undefined && { publicado }),
          ...(categoriaId !== undefined && { categoriaId }),
          ...(novoPdf
            ? { arquivoUrl: novoPdf.url, arquivoPublicId: novoPdf.publicId }
            : !mantemArquivoAntigo
              ? { arquivoUrl: null, arquivoPublicId: null }
              : {}),
        },
      });

      // Só apaga o PDF antigo depois que o banco já aponta para o novo
      if (arquivoFicouSemUso && conteudo.arquivoPublicId) {
        await apagarPdf(conteudo.arquivoPublicId);
      }

      return atualizado;
    } catch (error) {
      if (novoPdf) {
        await apagarPdf(novoPdf.publicId);
      }
      throw error;
    }
  }
}

export { UpdateConteudoService };
