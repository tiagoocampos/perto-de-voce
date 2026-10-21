import { Request, Response } from "express";
import { GetConteudoService } from "../../services/conteudo/GetConteudoService.js";

class GetConteudoController {
  async handle(req: Request, res: Response) {
    const getConteudoService = new GetConteudoService();
    const conteudo = await getConteudoService.execute({
      conteudo_id: req.params.id as string,
    });

    return res.json(conteudo);
  }
}

export { GetConteudoController };
