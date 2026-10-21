import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../exceptions/AdminErrors.js";
import prismaClient from "../prisma/index.js";

// Só existe admin no sistema: basta o token ser válido e o admin ainda existir no banco
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const admin = await prismaClient.admin.findUnique({
    where: { id: req.user_id },
    select: { id: true },
  });

  if (!admin) {
    throw new ForbiddenError();
  }

  return next();
};
