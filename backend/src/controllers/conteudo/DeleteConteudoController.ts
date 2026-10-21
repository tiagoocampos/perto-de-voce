import { Request, Response } from "express";
import { DeleteConteudoService } from "../../services/conteudo/DeleteConteudoService.js";

class DeleteConteudoController {
  async handle(req: Request, res: Response) {
    const deleteConteudoService = new DeleteConteudoService();
    const resultado = await deleteConteudoService.execute({
      conteudo_id: req.params.id as string,
    });

    return res.json(resultado);
  }
}

export { DeleteConteudoController };
