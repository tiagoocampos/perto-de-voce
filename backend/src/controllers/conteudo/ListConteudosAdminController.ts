import { Request, Response } from "express";
import type { TipoConteudo } from "../../generated/prisma/enums.js";
import { ListConteudosAdminService } from "../../services/conteudo/ListConteudosAdminService.js";

class ListConteudosAdminController {
  async handle(req: Request, res: Response) {
    // O valor já foi validado pelo Zod (listConteudosAdminSchema)
    const tipo = req.query.tipo as TipoConteudo | undefined;

    const listConteudosAdminService = new ListConteudosAdminService();
    const conteudos = await listConteudosAdminService.execute({ tipo });

    return res.json(conteudos);
  }
}

export { ListConteudosAdminController };
