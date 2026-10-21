import type { Admin, Sessao } from "../types";

const TOKEN_KEY = "pdv:token";
const ADMIN_KEY = "pdv:admin";

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function getStoredAdmin(): Admin | null {
    const stored = localStorage.getItem(ADMIN_KEY);
    if (!stored) return null;
    try {
        return JSON.parse(stored) as Admin;
    } catch {
        return null;
    }
}

// Guarda o token e os dados do admin devolvidos por POST /session
export function saveSession({ token, ...admin }: Sessao): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
}

export function clearAuth(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
}
