import { Request, Response } from "express";
import { UpdateDesafioService } from "../../services/desafio/UpdateDesafioService.js";

class UpdateDesafioController {
  async handle(req: Request, res: Response) {
    const { titulo, descricao, ordem, ativo } = req.body;

    const updateDesafioService = new UpdateDesafioService();
    const desafio = await updateDesafioService.execute({
      desafio_id: req.params.id as string,
      titulo,
      descricao,
      ordem,
      ativo,
    });

    return res.json(desafio);
  }
}

export { UpdateDesafioController };
