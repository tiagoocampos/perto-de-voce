import { Request, Response } from "express";
import { ListCategoriasService } from "../../services/categoria/ListCategoriasService.js";

class ListCategoriasController {
  async handle(req: Request, res: Response) {
    const listCategoriasService = new ListCategoriasService();
    const categorias = await listCategoriasService.execute();

    return res.json(categorias);
  }
}

export { ListCategoriasController };
