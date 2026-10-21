import { Request, Response } from "express";
import { DeleteDesafioService } from "../../services/desafio/DeleteDesafioService.js";

class DeleteDesafioController {
  async handle(req: Request, res: Response) {
    const deleteDesafioService = new DeleteDesafioService();
    const resultado = await deleteDesafioService.execute({
      desafio_id: req.params.id as string,
    });

    return res.json(resultado);
  }
}

export { DeleteDesafioController };
