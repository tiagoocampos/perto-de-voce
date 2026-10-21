export class ConteudoNotFoundError extends Error {
  public statusCode: number = 404;
  constructor() {
    super("Conteúdo não encontrado");
    this.name = "ConteudoNotFoundError";
    Object.setPrototypeOf(this, ConteudoNotFoundError.prototype);
  }
}

// Quebra das regras por tipo (ex.: panfleto sem PDF). A mensagem diz qual regra falhou.
export class ConteudoInvalidoError extends Error {
  public statusCode: number = 400;
  constructor(message: string) {
    super(message);
    this.name = "ConteudoInvalidoError";
    Object.setPrototypeOf(this, ConteudoInvalidoError.prototype);
  }
}

export class ArquivoInvalidoError extends Error {
  public statusCode: number = 400;
  constructor() {
    super("O arquivo deve ser um PDF");
    this.name = "ArquivoInvalidoError";
    Object.setPrototypeOf(this, ArquivoInvalidoError.prototype);
  }
}

export class UploadArquivoError extends Error {
  public statusCode: number = 502;
  constructor() {
    super("Erro ao enviar o arquivo para o Cloudinary");
    this.name = "UploadArquivoError";
    Object.setPrototypeOf(this, UploadArquivoError.prototype);
  }
}
