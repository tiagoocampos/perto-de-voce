import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { VitePWA } from "vite-plugin-pwa"

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // O service worker se atualiza sozinho: quem abre o app depois de um deploy recebe a versão nova
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "icons/apple-touch-icon.png"],
      manifest: {
        id: "/",
        name: "Perto de Você",
        short_name: "Perto de Você",
        description:
          "Panfletos, vídeos, roteiros e desafios para levar a mensagem de Jesus a quem está perto de você.",
        lang: "pt-BR",
        start_url: "/",
        scope: "/",
        display: "standalone",
        theme_color: "#13264A", // Noite
        background_color: "#EEF1F7", // Névoa
        icons: [
          { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
      workbox: {
        // Só a casca do app fica em cache (HTML, JS, CSS, ícones e fontes).
        // Não há runtimeCaching: respostas da API e PDFs nunca são guardados, então o app offline abre
        // mas mostra o aviso de conexão em vez de dados velhos.
        globPatterns: ["**/*.{js,css,html,svg,png,woff2}"],
        // Fontes de alfabetos que o português não usa (o Fontsource traz todos os subsets)
        globIgnores: ["**/*cyrillic*", "**/*greek*", "**/*vietnamese*"],
        navigateFallback: "/index.html",
        // O painel não é para uso offline: sempre vai à rede, para nunca abrir uma versão velha da casca
        navigateFallbackDenylist: [/^\/admin/],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
})
