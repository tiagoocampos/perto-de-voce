import { NavLink } from "react-router-dom";
import { BookOpen, CirclePlay, FileText, Flame, House } from "lucide-react";
import { cn } from "@/lib/utils";

const ITENS = [
    { para: "/", rotulo: "Início", Icone: House },
    { para: "/panfletos", rotulo: "Panfletos", Icone: FileText },
    { para: "/videos", rotulo: "Vídeos", Icone: CirclePlay },
    { para: "/materiais", rotulo: "Materiais", Icone: BookOpen },
    { para: "/desafios", rotulo: "Desafios", Icone: Flame },
];

export function BarraInferior() {
    return (
        // Reta (sem arredondar) e respeitando a área segura do iPhone
        <nav
            aria-label="Navegação principal"
            className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-[480px] border-x border-t border-border bg-papel pb-[env(safe-area-inset-bottom)]"
        >
            <ul className="grid grid-cols-5">
                {ITENS.map(({ para, rotulo, Icone }) => (
                    <li key={para}>
                        <NavLink
                            to={para}
                            end={para === "/"}
                            className={({ isActive }) =>
                                cn(
                                    "relative flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs font-semibold",
                                    isActive ? "text-noite" : "text-grafite",
                                )
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {/* A página atual aparece em Noite com uma barra no topo, não só pela cor */}
                                    {isActive && <span className="absolute inset-x-4 top-0 h-[3px] bg-noite" />}
                                    <Icone className="size-6" strokeWidth={isActive ? 2.5 : 2} aria-hidden="true" />
                                    {rotulo}
                                </>
                            )}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
