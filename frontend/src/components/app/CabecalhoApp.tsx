import { Link } from "react-router-dom";
import { Cruz } from "./Cruz";

export function CabecalhoApp() {
    return (
        // sobre-noite: o anel de foco vira Luz dentro de fundos Noite
        <header className="sobre-noite bg-noite pt-[env(safe-area-inset-top)] text-papel">
            <div className="flex h-14 items-center px-5">
                <Link to="/" className="flex min-h-11 items-center gap-2 rounded-sm">
                    <Cruz className="size-6 text-luz" />
                    <span className="text-lg font-extrabold tracking-tight">Perto de Você</span>
                </Link>
            </div>
        </header>
    );
}
