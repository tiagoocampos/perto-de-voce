import { Request, Response } from "express";
import { AuthAdminService } from "../../services/admin/AuthAdminService.js";

class AuthAdminController {
  async handle(req: Request, res: Response) {
    const { email, senha } = req.body;

    const authAdminService = new AuthAdminService();
    const session = await authAdminService.execute({ email, senha });

    return res.json(session);
  }
}

export { AuthAdminController };
