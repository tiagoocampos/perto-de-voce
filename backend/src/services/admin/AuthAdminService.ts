import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import prismaClient from "../../prisma/index.js";
import { InvalidCredentialsError } from "../../exceptions/AdminErrors.js";

interface AuthAdminProps {
  email: string;
  senha: string;
}

class AuthAdminService {
  async execute({ email, senha }: AuthAdminProps) {
    const admin = await prismaClient.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new InvalidCredentialsError();
    }

    const senhaConfere = await compare(senha, admin.senha);

    if (!senhaConfere) {
      throw new InvalidCredentialsError();
    }

    const token = jwt.sign(
      { nome: admin.nome, email: admin.email },
      process.env.JWT_SECRET as string,
      { subject: admin.id, expiresIn: "7d" },
    );

    return {
      id: admin.id,
      nome: admin.nome,
      email: admin.email,
      token,
    };
  }
}

export { AuthAdminService };
