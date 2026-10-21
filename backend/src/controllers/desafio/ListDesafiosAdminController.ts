import { Request, Response } from "express";
import { ListDesafiosAdminService } from "../../services/desafio/ListDesafiosAdminService.js";

class ListDesafiosAdminController {
  async handle(req: Request, res: Response) {
    const listDesafiosAdminService = new ListDesafiosAdminService();
    const desafios = await listDesafiosAdminService.execute();

    return res.json(desafios);
  }
}

export { ListDesafiosAdminController };
