import { Request, Response } from "express";
import type { TipoConteudo } from "../../generated/prisma/enums.js";
import { ListConteudosService } from "../../services/conteudo/ListConteudosService.js";

class ListConteudosController {
  async handle(req: Request, res: Response) {
    // Os valores já foram validados pelo Zod (listConteudosSchema)
    const tipo = req.query.tipo as TipoConteudo | undefined;
    const categoria = req.query.categoria as string | undefined;

    const listConteudosService = new ListConteudosService();
    const conteudos = await listConteudosService.execute({ tipo, categoria });

    return res.json(conteudos);
  }
}

export { ListConteudosController };
