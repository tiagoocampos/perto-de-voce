import "dotenv/config";
import { hash } from "bcrypt";
import prismaClient from "../src/prisma/index.js";
import { generateSlug } from "../src/utils/generateSlug.js";

const CATEGORIAS = ["Evangelismo", "Estudos", "Abordagem", "Plano da Salvação"];

async function main() {
  const nome = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL;
  const senha = process.env.ADMIN_PASSWORD;

  if (!nome || !email || !senha) {
    throw new Error("Defina ADMIN_NAME, ADMIN_EMAIL e ADMIN_PASSWORD no .env");
  }

  // upsert: rodar o seed de novo atualiza o admin em vez de duplicar
  const senhaHash = await hash(senha, 10);
  await prismaClient.admin.upsert({
    where: { email },
    update: { nome, senha: senhaHash },
    create: { nome, email, senha: senhaHash },
  });
  console.log(`Admin pronto: ${email}`);

  for (const nomeCategoria of CATEGORIAS) {
    const slug = generateSlug(nomeCategoria);
    await prismaClient.categoria.upsert({
      where: { slug },
      update: { nome: nomeCategoria },
      create: { nome: nomeCategoria, slug },
    });
  }
  console.log(`Categorias prontas: ${CATEGORIAS.join(", ")}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prismaClient.$disconnect());
