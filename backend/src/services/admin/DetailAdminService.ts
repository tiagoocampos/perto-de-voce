import prismaClient from "../../prisma/index.js";
import { AdminNotFoundError } from "../../exceptions/AdminErrors.js";

class DetailAdminService {
  async execute(admin_id: string) {
    const admin = await prismaClient.admin.findUnique({
      where: { id: admin_id },
      select: {
        id: true,
        nome: true,
        email: true,
        criadoEm: true,
      },
    });

    if (!admin) {
      throw new AdminNotFoundError();
    }

    return admin;
  }
}

export { DetailAdminService };
