// Mesma mensagem para e-mail inexistente e senha errada: não revela quais e-mails existem
export class InvalidCredentialsError extends Error {
  public statusCode: number = 401;
  constructor() {
    super("E-mail ou senha inválidos");
    this.name = "InvalidCredentialsError";
    Object.setPrototypeOf(this, InvalidCredentialsError.prototype);
  }
}

export class AdminNotFoundError extends Error {
  public statusCode: number = 404;
  constructor() {
    super("Admin não encontrado");
    this.name = "AdminNotFoundError";
    Object.setPrototypeOf(this, AdminNotFoundError.prototype);
  }
}

export class ForbiddenError extends Error {
  public statusCode: number = 403;
  constructor() {
    super("Acesso negado");
    this.name = "ForbiddenError";
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}
