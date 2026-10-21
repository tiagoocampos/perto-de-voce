import axios from "axios";
import { clearAuth, getToken } from "../lib/auth";

const API_URL = import.meta.env.VITE_API_URL

export const api = axios.create({
  baseURL: API_URL,
});

// Injeta o token do admin em toda requisição, se existir
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Token inválido ou vencido: limpa a sessão e volta ao login.
// O próprio POST /session também pode dar 401 (senha errada): esse caso o formulário trata.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isLogin = error.config?.url === "/session";

    if (status === 401 && !isLogin) {
      clearAuth();
      if (!window.location.pathname.startsWith("/admin/login")) {
        window.location.assign("/admin/login");
      }
    }

    return Promise.reject(error);
  },
);
