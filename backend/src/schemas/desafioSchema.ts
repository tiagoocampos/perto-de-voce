import { z } from "zod";

// Desafios usam JSON (sem upload), então número e boolean já chegam com o tipo certo
const ordem = z
  .number({ message: "A ordem deve ser um número" })
  .int({ message: "A ordem deve ser um número inteiro" })
  .min(0, { message: "A ordem não pode ser negativa" });

const ativo = z.boolean({ message: "O campo ativo deve ser true ou false" });

export const createDesafioSchema = z.object({
  body: z.object({
    titulo: z.string({ message: "O título é obrigatório" }).trim().min(1, { message: "O título é obrigatório" }),
    descricao: z.string({ message: "A descrição é obrigatória" }).trim().min(1, { message: "A descrição é obrigatória" }),
    ordem: ordem.optional(),
    ativo: ativo.optional(),
  }),
});

// Edição parcial: o que não vier fica como está
export const updateDesafioSchema = z.object({
  params: z.object({
    id: z.string().min(1, { message: "O id é obrigatório" }),
  }),
  body: z.object({
    titulo: z.string().trim().min(1, { message: "O título não pode ser vazio" }).optional(),
    descricao: z.string().trim().min(1, { message: "A descrição não pode ser vazia" }).optional(),
    ordem: ordem.optional(),
    ativo: ativo.optional(),
  }),
});
