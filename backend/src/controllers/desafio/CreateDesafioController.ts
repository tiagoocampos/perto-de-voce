import { Request, Response } from "express";
import { CreateDesafioService } from "../../services/desafio/CreateDesafioService.js";

class CreateDesafioController {
  async handle(req: Request, res: Response) {
    const { titulo, descricao, ordem, ativo } = req.body;

    const createDesafioService = new CreateDesafioService();
    const desafio = await createDesafioService.execute({ titulo, descricao, ordem, ativo });

    return res.status(201).json(desafio);
  }
}

export { CreateDesafioController };
