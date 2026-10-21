# Perto de Você — Frontend

App cristão de evangelização (PWA, pensado para o celular) e painel admin, no mesmo projeto.
React 19 + Vite + TypeScript, Tailwind v4, shadcn/ui, `react-router-dom` e `axios`. A API é o projeto `backend/`.

- **App público** em `/`: panfletos (PDF), vídeos (YouTube), materiais (texto ou PDF) e desafios.
- **Painel** em `/admin`: login, conteúdos (com upload de PDF) e desafios.

## Como rodar

```bash
npm install
cp .env.example .env      # ajuste VITE_API_URL se a API não estiver em localhost:3000
npm run dev               # http://localhost:5173
```

O backend precisa estar no ar (`npm run dev` na pasta `backend/`) e a origem do front (`http://localhost:5173`)
precisa estar em `FRONTEND_URLS` no `.env` do backend, senão o navegador bloqueia as chamadas (CORS).

| Script | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Confere os tipos (`tsc -b`) e gera `dist/` (inclui o service worker) |
| `npm run preview` | Serve o `dist/` já pronto, útil para testar o PWA |
| `npm run lint` | ESLint |

## Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `VITE_API_URL` | URL da API, sem barra no final. Ex.: `http://localhost:3000` ou `https://sua-api.up.railway.app` |

O valor entra no código **na hora do build**: mudou a URL, é preciso um novo build/deploy.

## Rotas

| Rota | Tela |
|---|---|
| `/` | Início: slogan e as quatro seções |
| `/panfletos` | Panfletos em PDF (toque abre o arquivo em nova aba) |
| `/videos`, `/videos/:id` | Lista e detalhe com o player do YouTube (link que não é do YouTube abre em nova aba) |
| `/materiais`, `/materiais/:id` | Lista e leitura (material com PDF abre o arquivo direto) |
| `/desafios` | Cartão de selos; o progresso fica no `localStorage` do aparelho |
| `/admin/login` | Entrar no painel |
| `/admin` | Conteúdos: abas por tipo, publicar/despublicar, criar, editar e excluir |
| `/admin/desafios` | Desafios: ativar/desativar, criar, editar e excluir |

Qualquer chamada do painel que devolva 401 limpa a sessão e volta ao login.

## Estrutura

```
src/
  routes.tsx           rotas (app público dentro do AppLayout; painel em /admin)
  pages/               telas do app; pages/admin/ = telas do painel
  components/
    app/               casca do app (cabeçalho, barra inferior), cartões, selos e estados
                       (EstadoCarregando, EstadoVazio, EstadoErro); app/home/ = seções da home
    admin/             formulários de conteúdo e de desafio
    ui/                componentes do shadcn (confirm-delete.tsx é nosso)
  hooks/               useCarregar (busca + tentar de novo), useProgressoDesafios, usePageMeta
  services/            api.ts (axios + token + 401), publico.ts e admin.ts (chamadas da API)
  lib/                 auth (sessão no localStorage), youtube (extrai o id do vídeo), utils-api (erros)
  types/               tipos conforme as respostas da API
  index.css            cores e tipografia (tokens), animação do carimbo
public/icons/          ícones do PWA
```

## Visual

Cores (tokens em `src/index.css`): **Noite** `#13264A`, **Luz** `#F4B63F`, **Névoa** `#EEF1F7`, **Papel** `#FFFFFF`,
**Grafite** `#4A5670`, **Brasa** `#B3401A`. Fontes: Libre Franklin (interface e títulos) e Source Serif 4 (slogan e
texto dos materiais), servidas pelo `@fontsource-variable`.

Luz só tem contraste suficiente sobre fundo Noite (8,3:1); sobre fundo claro dá 1,6:1. Por isso o anel de foco é Noite
nas áreas claras e vira Luz dentro de `.sobre-noite`.

## PWA

O app é instalável ("Adicionar à tela inicial") e a casca (HTML, JS, CSS, ícones e fontes) abre **sem internet**.
Respostas da API e PDFs **não** ficam em cache: offline, as listas mostram o aviso de conexão com o botão
"Tentar de novo". O service worker se atualiza sozinho a cada deploy.

> **Os ícones são provisórios** (uma cruz em Luz sobre Noite), até o cliente mandar o logo. Para trocar, substitua os
> arquivos de `public/icons/` mantendo os nomes e os tamanhos: `icon-192.png` (192×192), `icon-512.png` (512×512),
> `icon-maskable-512.png` (512×512, com o desenho dentro dos 80% centrais) e `apple-touch-icon.png` (180×180).
> Troque também `public/favicon.svg`.

Para testar o PWA localmente use `npm run build && npm run preview` (em `npm run dev` o service worker fica desligado).

## Deploy na Vercel

1. Importe o repositório e defina o **Root Directory** como a pasta deste projeto (`frontend/`).
2. Framework: Vite. Build: `npm run build`. Saída: `dist`.
3. Variável de ambiente: `VITE_API_URL` com a URL pública da API (https).
4. **No backend**, inclua a URL da Vercel em `FRONTEND_URLS` (separada por vírgula das outras), senão o CORS bloqueia.

O `vercel.json` já reescreve qualquer caminho para `/index.html`, o que faz links diretos como `/videos/abc` funcionarem.

## Acessibilidade e mobile

- Funciona a partir de 360px, sem rolagem horizontal da página (a fileira de panfletos rola dentro dela).
- Alvos de toque de pelo menos 44px, foco visível no teclado e link "Pular para o conteúdo".
- `prefers-reduced-motion` respeitado: o carimbo do selo vira instantâneo.
- Auditoria automática com axe-core (WCAG 2.x A/AA) sem violações no app e no painel, inclusive com os diálogos abertos.
