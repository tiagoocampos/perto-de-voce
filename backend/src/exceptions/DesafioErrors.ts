export class DesafioNotFoundError extends Error {
  public statusCode: number = 404;
  constructor() {
    super("Desafio não encontrado");
    this.name = "DesafioNotFoundError";
    Object.setPrototypeOf(this, DesafioNotFoundError.prototype);
  }
}
