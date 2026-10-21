import { Request, Response } from "express";
import { DetailAdminService } from "../../services/admin/DetailAdminService.js";

class DetailAdminController {
  async handle(req: Request, res: Response) {
    const detailAdminService = new DetailAdminService();
    const admin = await detailAdminService.execute(req.user_id);

    return res.json(admin);
  }
}

export { DetailAdminController };
