import { Link } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";

export function NotFound() {
    usePageMeta({ title: "Página não encontrada — Perto de Você" });

    return (
        <div className="px-5 py-6">
            <h1 className="text-3xl">Página não encontrada</h1>
            <p className="mt-2 text-grafite">O endereço que você abriu não existe.</p>
            <Link to="/" className="mt-4 inline-flex min-h-11 items-center font-semibold underline">
                Voltar ao início
            </Link>
        </div>
    );
}
