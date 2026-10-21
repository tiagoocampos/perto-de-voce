import { Link, useLocation } from "react-router-dom";
import { InstallButton } from "@/components/pwa/InstallButton";
import { Cruz } from "./Cruz";

export function CabecalhoApp() {
    const { pathname } = useLocation();

    return (
        // sobre-noite: o anel de foco vira Luz dentro de fundos Noite
        <header className="sobre-noite bg-noite pt-[env(safe-area-inset-top)] text-papel">
            <div className="flex h-14 items-center justify-between gap-2 px-5">
                <Link to="/" className="flex min-h-11 shrink-0 items-center gap-2 rounded-sm">
                    <Cruz className="size-6 text-luz" />
                    <span className="text-lg font-extrabold tracking-tight">Perto de Você</span>
                </Link>

                {/* Sempre à vista até o app ser instalado (o botão some sozinho depois).
                    Na página /instalar já existe o botão grande, então aqui ele não se repete. */}
                {pathname !== "/instalar" && <InstallButton variante="compact" />}
            </div>
        </header>
    );
}
