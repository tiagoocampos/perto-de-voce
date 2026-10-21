import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ExternalLink, FileText, Flame, LogOut } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Cruz } from "@/components/app/Cruz";
import { clearAuth, getStoredAdmin } from "@/lib/auth";
import { cn } from "@/lib/utils";

const ITENS = [
    { para: "/admin", rotulo: "Conteúdos", Icone: FileText, fim: true },
    { para: "/admin/desafios", rotulo: "Desafios", Icone: Flame, fim: false },
];

const CLASSE_ITEM = "flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold";

// Mesmos links na barra lateral (tablet/desktop) e na barra do topo (celular)
function Navegacao({ coluna }: { coluna: boolean }) {
    return (
        <nav aria-label="Painel" className={cn("flex gap-1", coluna && "flex-col")}>
            {ITENS.map(({ para, rotulo, Icone, fim }) => (
                <NavLink
                    key={para}
                    to={para}
                    end={fim}
                    className={({ isActive }) => cn(CLASSE_ITEM, isActive ? "bg-papel/15" : "hover:bg-papel/10")}
                >
                    <Icone className="size-4" aria-hidden="true" />
                    {rotulo}
                </NavLink>
            ))}
        </nav>
    );
}

export function AdminLayout() {
    const navigate = useNavigate();
    const admin = getStoredAdmin();

    function sair() {
        clearAuth();
        toast.success("Você saiu do painel");
        navigate("/admin/login", { replace: true });
    }

    return (
        <ProtectedRoute>
            <div className="min-h-dvh bg-nevoa md:flex">
                {/* tablet e desktop: barra lateral */}
                <aside className="sobre-noite hidden w-56 shrink-0 flex-col bg-noite p-4 text-papel md:sticky md:top-0 md:flex md:h-dvh">
                    <Link to="/admin" className="mb-6 flex min-h-11 items-center gap-2 rounded-lg px-2">
                        <Cruz className="size-6 text-luz" />
                        <span className="font-extrabold tracking-tight">Painel</span>
                    </Link>

                    <Navegacao coluna />

                    <div className="mt-auto space-y-1 border-t border-papel/15 pt-4">
                        {admin && <p className="truncate px-3 pb-2 text-sm text-papel/80">{admin.nome}</p>}
                        <Link to="/" target="_blank" className={cn(CLASSE_ITEM, "hover:bg-papel/10")}>
                            <ExternalLink className="size-4" aria-hidden="true" />
                            Ver o app
                            <span className="sr-only">(abre em nova aba)</span>
                        </Link>
                        <button type="button" onClick={sair} className={cn(CLASSE_ITEM, "w-full hover:bg-papel/10")}>
                            <LogOut className="size-4" aria-hidden="true" />
                            Sair
                        </button>
                    </div>
                </aside>

                <div className="min-w-0 flex-1">
                    {/* celular: barra no topo */}
                    <header className="sobre-noite flex items-center justify-between gap-2 bg-noite px-3 py-1 text-papel md:hidden">
                        <Navegacao coluna={false} />
                        <button type="button" onClick={sair} className={CLASSE_ITEM}>
                            <LogOut className="size-4" aria-hidden="true" />
                            Sair
                        </button>
                    </header>

                    <main className="mx-auto max-w-5xl p-4 md:p-8">
                        <Outlet />
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
