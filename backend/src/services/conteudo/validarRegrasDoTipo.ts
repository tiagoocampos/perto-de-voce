import type { TipoConteudo } from "../../generated/prisma/enums.js";
import { ConteudoInvalidoError } from "../../exceptions/ConteudoErrors.js";

interface RegrasDoTipoProps {
  tipo: TipoConteudo;
  temArquivo: boolean;
  link: string | null;
  texto: string | null;
}

// Recebe o estado FINAL do conteúdo (na edição, já misturado com o que estava salvo)
export function validarRegrasDoTipo({ tipo, temArquivo, link, texto }: RegrasDoTipoProps) {
  if (tipo === "PANFLETO" && !temArquivo) {
    throw new ConteudoInvalidoError("O panfleto exige um arquivo PDF");
  }

  if (tipo === "VIDEO") {
    if (!link) {
      throw new ConteudoInvalidoError("O vídeo exige um link");
    }
    if (temArquivo) {
      throw new ConteudoInvalidoError("O vídeo não aceita arquivo");
    }
  }

  if (tipo === "MATERIAL" && !temArquivo && !texto) {
    throw new ConteudoInvalidoError("O material exige um arquivo PDF ou um texto");
  }
}
