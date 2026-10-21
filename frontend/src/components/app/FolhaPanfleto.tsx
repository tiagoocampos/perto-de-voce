import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Conteudo } from "@/types";

interface FolhaPanfletoProps {
    conteudo: Conteudo;
    className?: string;
}

// Uma folha de papel em pé (proporção A4) com o canto dobrado. Tocar nela abre o PDF em nova aba.
export function FolhaPanfleto({ conteudo, className }: FolhaPanfletoProps) {
    if (!conteudo.arquivoUrl) return null;

    return (
        <a
            href={conteudo.arquivoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "relative flex aspect-[210/297] flex-col overflow-hidden rounded-folha border border-border bg-papel p-3",
                className,
            )}
        >
            {/* Canto dobrado: um triângulo da cor do fundo "corta" a ponta e outro faz a aba */}
            <span
                aria-hidden="true"
                className="absolute -right-px -top-px size-6"
                style={{
                    background:
                        "linear-gradient(225deg, var(--nevoa) 0 49%, var(--border) 49% 54%, var(--secondary) 54%)",
                }}
            />

            <span className="mt-3 line-clamp-3 text-[0.95rem] font-extrabold leading-tight tracking-tight">
                {conteudo.titulo}
            </span>
            <span className="mt-1.5 line-clamp-2 text-[0.8rem] leading-snug text-grafite">{conteudo.descricao}</span>

            <span className="mt-auto flex min-h-11 items-center justify-center gap-1.5 rounded-lg bg-noite text-sm font-semibold text-papel">
                <Download className="size-4" aria-hidden="true" />
                Baixar PDF
            </span>
            <span className="sr-only">(abre em nova aba)</span>
        </a>
    );
}
