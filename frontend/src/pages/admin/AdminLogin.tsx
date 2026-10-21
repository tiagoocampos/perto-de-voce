import { useState, type FormEvent } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Campo } from "@/components/admin/Campo";
import { Cruz } from "@/components/app/Cruz";
import { usePageMeta } from "@/hooks/usePageMeta";
import { getToken, saveSession } from "@/lib/auth";
import { applyFieldErrors, getApiErrorMessage } from "@/lib/utils-api";
import { entrar } from "@/services/admin";

const ERROS_VAZIOS = { email: "", senha: "" };

export function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erros, setErros] = useState(ERROS_VAZIOS);
    const [erroGeral, setErroGeral] = useState("");
    const [enviando, setEnviando] = useState(false);

    usePageMeta({ title: "Entrar no painel — Perto de Você" });

    // Quem já está logado vai direto para o painel
    if (getToken()) {
        return <Navigate to="/admin" replace />;
    }

    async function enviar(evento: FormEvent) {
        evento.preventDefault();
        setErros(ERROS_VAZIOS);
        setErroGeral("");
        setEnviando(true);

        try {
            const sessao = await entrar(email.trim(), senha);
            saveSession(sessao);
            navigate("/admin", { replace: true });
        } catch (error) {
            const outros = applyFieldErrors(error, ERROS_VAZIOS, setErros);
            if (outros === null) {
                // Ex.: "E-mail ou senha inválidos" (401) ou falha de conexão
                setErroGeral(getApiErrorMessage(error, "Não foi possível entrar. Confira sua conexão e tente de novo."));
            } else if (outros.length > 0) {
                setErroGeral(outros.join(" "));
            }
        } finally {
            setEnviando(false);
        }
    }

    return (
        <main className="grid min-h-dvh place-items-center bg-nevoa px-5 py-10">
            <div className="w-full max-w-sm">
                <div className="mb-6 flex items-center gap-2">
                    <Cruz className="size-7" />
                    <span className="text-lg font-extrabold tracking-tight">Perto de Você</span>
                </div>

                <form onSubmit={enviar} noValidate className="space-y-5 rounded-folha border border-border bg-papel p-6">
                    <h1 className="text-2xl">Entrar no painel</h1>

                    <Campo id="email" rotulo="E-mail" erro={erros.email}>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="username"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            aria-invalid={!!erros.email}
                            aria-describedby={erros.email ? "email-erro" : undefined}
                            className="h-11"
                        />
                    </Campo>

                    <Campo id="senha" rotulo="Senha" erro={erros.senha}>
                        <Input
                            id="senha"
                            type="password"
                            autoComplete="current-password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            aria-invalid={!!erros.senha}
                            aria-describedby={erros.senha ? "senha-erro" : undefined}
                            className="h-11"
                        />
                    </Campo>

                    {erroGeral && (
                        <p role="alert" className="text-sm font-semibold text-brasa">
                            {erroGeral}
                        </p>
                    )}

                    <Button type="submit" size="lg" className="w-full" disabled={enviando}>
                        {enviando ? "Entrando…" : "Entrar"}
                    </Button>
                </form>
            </div>
        </main>
    );
}
