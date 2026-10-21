# Perto de Você — Backend

API do app cristão de evangelização, com painel admin. Node + Express 5 + TypeScript, Prisma 7 (PostgreSQL), Zod, JWT e Cloudinary (PDFs).

## Como rodar

```bash
npm install
cp .env.example .env        # preencha as variáveis (tabela abaixo)
npx prisma migrate dev      # cria as tabelas
npm run seed                # cria o admin e as categorias (pode rodar várias vezes)
npm run dev                 # http://localhost:3000
```

| Script | O que faz |
|---|---|
| `npm run dev` | Servidor com recarga automática (`tsx watch`) |
| `npm run build` | `prisma generate` + `tsc` (gera `dist/`) |
| `npm start` | `prisma migrate deploy` e depois `node dist/server.js` |
| `npm run seed` | Cria/atualiza o admin (a partir do `.env`) e as categorias fixas |

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `PORT` | Porta da API (o Railway define sozinho) |
| `DATABASE_URL` | Conexão PostgreSQL, ex.: `postgresql://usuario:senha@localhost:5432/perto_de_voce` |
| `JWT_SECRET` | Texto longo e aleatório que assina o token do admin (validade de 7 dias) |
| `FRONTEND_URLS` | Origens liberadas no CORS, separadas por vírgula (painel e app). Vazio = nenhuma origem de navegador |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Credenciais do Cloudinary (upload dos PDFs) |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Admin criado pelo `npm run seed` |

> **Cloudinary:** contas novas bloqueiam a entrega de PDF (a URL dá 401). Ative em **Settings → Security → "PDF and ZIP files delivery"**.

## Rotas

Erros vêm como `{ "error": "mensagem" }`. Erros de validação (400) vêm como `{ "error": "Erro de validação", "details": [{ "message": "...", "path": "campo" }] }`.

### Públicas (sem login)

| Rota | Descrição |
|---|---|
| `GET /health` | `{ "status": "ok" }` |
| `GET /conteudos?tipo=&categoria=` | Só publicados. `tipo`: `PANFLETO`, `VIDEO` ou `MATERIAL`. `categoria`: slug. Ordem: `ordem` asc, `criadoEm` desc. Não traz o `texto` |
| `GET /conteudos/:id` | Um conteúdo publicado, com `texto`. Rascunho dá 404 |
| `GET /desafios` | Só ativos, por `ordem` |
| `GET /categorias` | Categorias fixas (`id`, `nome`, `slug`) |

```bash
curl "http://localhost:3000/conteudos?tipo=VIDEO&categoria=evangelismo"
```

### Admin (header `Authorization: Bearer <token>`; sem token = 401)

| Rota | Descrição |
|---|---|
| `POST /session` | Login: `{ "email", "senha" }` → `{ id, nome, email, token }` |
| `GET /me` | Dados do admin logado |
| `GET /admin/conteudos?tipo=` | Lista tudo, inclusive não publicados |
| `POST /admin/conteudos` | Cria (multipart, arquivo no campo `file`) |
| `PUT /admin/conteudos/:id` | Edita só o que for enviado; arquivo novo substitui o antigo. Campo de texto enviado vazio (`link=`) limpa o campo |
| `PATCH /admin/conteudos/:id/publicado` | `{ "publicado": true }` |
| `DELETE /admin/conteudos/:id` | Remove (e apaga o PDF no Cloudinary) |
| `GET /admin/desafios` | Lista todos, inclusive inativos |
| `POST /admin/desafios` | `{ "titulo", "descricao", "ordem"?, "ativo"? }` |
| `PUT /admin/desafios/:id` | Edita só o que for enviado |
| `DELETE /admin/desafios/:id` | Remove |

```bash
# login
curl -X POST http://localhost:3000/session \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@exemplo.com","senha":"sua-senha"}'

# criar panfleto com PDF
curl -X POST http://localhost:3000/admin/conteudos \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "tipo=PANFLETO" -F "titulo=Panfleto 1" -F "descricao=Descrição" \
  -F "publicado=true" -F "file=@panfleto.pdf;type=application/pdf"

# criar vídeo
curl -X POST http://localhost:3000/admin/conteudos \
  -H "Authorization: Bearer SEU_TOKEN" \
  -F "tipo=VIDEO" -F "titulo=Como abordar" -F "descricao=Descrição" \
  -F "link=https://youtu.be/abc"
```

### Regras por tipo

- `PANFLETO`: exige arquivo PDF (até 10 MB)
- `VIDEO`: exige `link` (http/https) e não aceita arquivo
- `MATERIAL`: exige arquivo PDF **ou** `texto`

Há um arquivo `requests.http` com todas as rotas (extensão *REST Client* do VS Code).

## Deploy no Railway

1. Crie um serviço PostgreSQL e um serviço para este repositório (pasta `backend`).
2. Configure as variáveis da tabela acima (`DATABASE_URL` pode referenciar o Postgres do Railway).
3. Build: `npm run build`. Start: `npm start` (aplica as migrations antes de subir).
4. Crie o admin uma vez: `npm run seed` (pelo shell do Railway ou localmente com a `DATABASE_URL` de produção).
5. Healthcheck do Railway: `/health`.

## Estrutura

```
src/
  routes.ts          rotas
  controllers/       só req/res
  services/          regra de negócio + Prisma (classe com execute)
  schemas/           Zod: valida { body, query, params }
  middlewares/       auth, validateSchema, errorHandler
  exceptions/        erros com statusCode
  config/            cloudinary, multer
prisma/              schema, migrations, seed
```
