import { UploadApiResponse } from "cloudinary";
import cloudinary from "../../config/cloudinary.js";
import { generateSlug } from "../../utils/generateSlug.js";
import { ArquivoInvalidoError, UploadArquivoError } from "../../exceptions/ConteudoErrors.js";

export interface ArquivoEnviado {
  buffer: Buffer;
  nome: string;
}

export interface PdfSalvo {
  url: string;
  publicId: string;
}

export async function uploadPdf({ buffer, nome }: ArquivoEnviado): Promise<PdfSalvo> {
  // O mimetype vem do cliente e pode ser falsificado: todo PDF de verdade começa com "%PDF-"
  if (buffer.subarray(0, 5).toString("latin1") !== "%PDF-") {
    throw new ArquivoInvalidoError();
  }

  const nomeSemExtensao = nome.replace(/\.[^.]+$/, "");
  const nomeSeguro = generateSlug(nomeSemExtensao) || "arquivo";

  try {
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "conteudos",
            // PDF vai como "raw" (não "image"), e no raw o public_id precisa levar o .pdf
            resource_type: "raw",
            public_id: `${Date.now()}-${nomeSeguro}.pdf`,
          },
          (error, result) => {
            if (error || !result) {
              reject(error ?? new Error("Cloudinary não devolveu resultado"));
            } else {
              resolve(result);
            }
          },
        )
        .end(buffer);
    });

    return { url: result.secure_url, publicId: result.public_id };
  } catch (error) {
    console.error("Falha no upload para o Cloudinary:", error instanceof Error ? error.message : error);
    throw new UploadArquivoError();
  }
}

// Apagar é "melhor esforço": se o Cloudinary falhar, não quebra a operação do admin
export async function apagarPdf(publicId: string) {
  try {
    // invalidate: limpa também o cache da CDN, senão a URL antiga continua abrindo por um tempo
    await cloudinary.uploader.destroy(publicId, { resource_type: "raw", invalidate: true });
  } catch (error) {
    console.error("Falha ao apagar arquivo no Cloudinary:", publicId, error instanceof Error ? error.message : error);
  }
}
