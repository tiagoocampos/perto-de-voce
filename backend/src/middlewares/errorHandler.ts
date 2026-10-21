import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { ZodError } from "zod";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: "Erro de validação",
      details: error.issues.map((issue) => ({
        message: issue.message,
        path: issue.path[1],
      })),
    });
  }

  // Erros do próprio multer (arquivo grande demais, campo errado) viram 400, não 500
  if (error instanceof multer.MulterError) {
    const mensagem =
      error.code === "LIMIT_FILE_SIZE"
        ? "O arquivo deve ter no máximo 10 MB"
        : "Erro no envio do arquivo: use o campo 'file'";

    return res.status(400).json({ error: mensagem });
  }

  // Qualquer erro de domínio (classes em exceptions/) carrega o próprio statusCode
  const statusCode = (error as { statusCode?: unknown }).statusCode;
  if (typeof statusCode === "number") {
    return res.status(statusCode).json({
      error: error.message,
    });
  }

  console.error(error);
  return res.status(500).json({
    error: "Erro interno do servidor",
  });
};
