import { z } from "zod";

// No multipart/form-data tudo chega como texto. Aqui o Zod converte, e o validateSchema
// regrava o body convertido para o controller receber número/boolean de verdade.

const tipo = z.enum(["PANFLETO", "VIDEO", "MATERIAL"], {
  message: "O tipo deve ser PANFLETO, VIDEO ou MATERIAL",
});

// Aceita boolean (JSON) ou "true"/"false" (multipart). z.coerce.boolean() não serve:
// ele transformaria o texto "false" em true.
const booleano = z.union([
  z.boolean(),
  z.enum(["true", "false"]).transform((valor) => valor === "true"),
], { message: "O valor deve ser true ou false" });

// Texto vazio vira null: é assim que o admin limpa um campo na edição
const textoOuNulo = z.string().transform((valor) => (valor.trim() === "" ? null : valor));

// Só http/https, para nunca guardar algo como "javascript:..." que o app renderiza como link
const linkOuNulo = z
  .string()
  .trim()
  .transform((valor) => (valor === "" ? null : valor))
  .pipe(z.url({ protocol: /^https?$/, message: "O link deve ser uma URL http ou https válida" }).nullable());

const ordem = z.coerce
  .number({ message: "A ordem deve ser um número" })
  .int({ message: "A ordem deve ser um número inteiro" })
  .min(0, { message: "A ordem não pode ser negativa" });

export const createConteudoSchema = z.object({
  body: z.object({
    tipo,
    titulo: z.string({ message: "O título é obrigatório" }).trim().min(1, { message: "O título é obrigatório" }),
    descricao: z.string({ message: "A descrição é obrigatória" }).trim().min(1, { message: "A descrição é obrigatória" }),
    link: linkOuNulo.optional(),
    texto: textoOuNulo.optional(),
    ordem: ordem.optional(),
    publicado: booleano.optional(),
    categoriaId: textoOuNulo.optional(),
  }),
});

// Edição parcial: o que não vier fica como está
export const updateConteudoSchema = z.object({
  params: z.object({
    id: z.string().min(1, { message: "O id é obrigatório" }),
  }),
  body: z.object({
    tipo: tipo.optional(),
    titulo: z.string().trim().min(1, { message: "O título não pode ser vazio" }).optional(),
    descricao: z.string().trim().min(1, { message: "A descrição não pode ser vazia" }).optional(),
    link: linkOuNulo.optional(),
    texto: textoOuNulo.optional(),
    ordem: ordem.optional(),
    publicado: booleano.optional(),
    categoriaId: textoOuNulo.optional(),
  }),
});

export const updatePublicadoSchema = z.object({
  params: z.object({
    id: z.string().min(1, { message: "O id é obrigatório" }),
  }),
  body: z.object({
    publicado: booleano,
  }),
});

export const listConteudosSchema = z.object({
  query: z.object({
    tipo: tipo.optional(),
    categoria: z.string().optional(), // slug da categoria
  }),
});

export const listConteudosAdminSchema = z.object({
  query: z.object({
    tipo: tipo.optional(),
  }),
});
