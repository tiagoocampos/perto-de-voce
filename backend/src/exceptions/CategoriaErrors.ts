export class CategoriaNotFoundError extends Error {
  public statusCode: number = 404;
  constructor() {
    super("Categoria não encontrada");
    this.name = "CategoriaNotFoundError";
    Object.setPrototypeOf(this, CategoriaNotFoundError.prototype);
  }
}
