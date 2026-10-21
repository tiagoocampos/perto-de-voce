import { Request, Response } from "express";
import { ListDesafiosService } from "../../services/desafio/ListDesafiosService.js";

class ListDesafiosController {
  async handle(req: Request, res: Response) {
    const listDesafiosService = new ListDesafiosService();
    const desafios = await listDesafiosService.execute();

    return res.json(desafios);
  }
}

export { ListDesafiosController };
