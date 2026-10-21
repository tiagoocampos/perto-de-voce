import { Request, Response } from "express";
import { UpdateConteudoService } from "../../services/conteudo/UpdateConteudoService.js";

class UpdateConteudoController {
  async handle(req: Request, res: Response) {
    const { tipo, titulo, descricao, link, texto, ordem, publicado, categoriaId } = req.body;

    const updateConteudoService = new UpdateConteudoService();
    const conteudo = await updateConteudoService.execute({
      conteudo_id: req.params.id as string,
      tipo,
      titulo,
      descricao,
      link,
      texto,
      ordem,
      publicado,
      categoriaId,
      arquivo: req.file ? { buffer: req.file.buffer, nome: req.file.originalname } : undefined,
    });

    return res.json(conteudo);
  }
}

export { UpdateConteudoController };
