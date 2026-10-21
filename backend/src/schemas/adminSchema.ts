import { z } from "zod";

export const authAdminSchema = z.object({
  body: z.object({
    email: z
      .string({ message: "O e-mail é obrigatório" })
      .email({ message: "E-mail inválido" }),
    senha: z
      .string({ message: "A senha é obrigatória" })
      .min(1, { message: "A senha é obrigatória" }),
  }),
});
