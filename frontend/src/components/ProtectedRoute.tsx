import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "../lib/auth";

interface ProtectedRouteProps {
    children: ReactNode;
}

// Só existe um tipo de usuário logado (o admin), então basta ter token.
// Se o token estiver vencido, o interceptor do api.ts limpa a sessão no primeiro 401.
export function ProtectedRoute({ children }: ProtectedRouteProps) {
    if (!getToken()) {
        return <Navigate to="/admin/login" replace />;
    }

    return <>{children}</>;
}
