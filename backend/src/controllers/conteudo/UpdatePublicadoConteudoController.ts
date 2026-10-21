import { Request, Response } from "express";
import { UpdatePublicadoConteudoService } from "../../services/conteudo/UpdatePublicadoConteudoService.js";

class UpdatePublicadoConteudoController {
  async handle(req: Request, res: Response) {
    const { publicado } = req.body;

    const updatePublicadoConteudoService = new UpdatePublicadoConteudoService();
    const conteudo = await updatePublicadoConteudoService.execute({
      conteudo_id: req.params.id as string,
      publicado,
    });

    return res.json(conteudo);
  }
}

export { UpdatePublicadoConteudoController };
