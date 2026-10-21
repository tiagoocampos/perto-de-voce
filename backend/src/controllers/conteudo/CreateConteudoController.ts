import { Request, Response } from "express";
import { CreateConteudoService } from "../../services/conteudo/CreateConteudoService.js";

class CreateConteudoController {
  async handle(req: Request, res: Response) {
    const { tipo, titulo, descricao, link, texto, ordem, publicado, categoriaId } = req.body;

    const createConteudoService = new CreateConteudoService();
    const conteudo = await createConteudoService.execute({
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

    return res.status(201).json(conteudo);
  }
}

export { CreateConteudoController };
