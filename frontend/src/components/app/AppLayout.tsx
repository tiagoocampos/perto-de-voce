import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { CabecalhoApp } from "./CabecalhoApp";
import { BarraInferior } from "./BarraInferior";

export function AppLayout() {
    const { pathname } = useLocation();

    // Ao trocar de página, volta ao topo
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="min-h-dvh bg-nevoa">
            <a
                href="#conteudo"
                className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-luz focus:px-3 focus:py-2 focus:font-semibold focus:text-noite"
            >
                Pular para o conteúdo
            </a>

            {/* No celular ocupa a tela toda; no desktop vira uma coluna de até 480px centralizada */}
            <div className="mx-auto min-h-dvh max-w-[480px] border-x border-border bg-nevoa">
                <CabecalhoApp />
                {/* O espaço embaixo evita que a barra inferior cubra o fim da página */}
                <main id="conteudo" tabIndex={-1} className="pb-[calc(5rem+env(safe-area-inset-bottom))] outline-none">
                    <Outlet />
                </main>
            </div>

            <BarraInferior />
        </div>
    );
}
