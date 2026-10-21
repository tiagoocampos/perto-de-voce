import { Link } from "react-router-dom";
import { BookOpen, ExternalLink } from "lucide-react";
import type { Conteudo } from "@/types";

interface LinhaMaterialProps {
    conteudo: Conteudo;
    // Na home: só o título, em uma linha
    compacta?: boolean;
}

const CLASSES_DA_LINHA = "flex min-h-14 items-center gap-3 px-4 py-3";

export function LinhaMaterial({ conteudo, compacta }: LinhaMaterialProps) {
    const abrePdf = !conteudo.temTexto && !!conteudo.arquivoUrl;
    const acao = abrePdf ? "Abrir PDF" : "Ler material";
    const Icone = abrePdf ? ExternalLink : BookOpen;

    const corpo = (
        <>
            <span className="min-w-0 flex-1">
                <span className={compacta ? "block truncate font-bold" : "block font-bold"}>{conteudo.titulo}</span>
                {!compacta && <span className="mt-0.5 block text-grafite">{conteudo.descricao}</span>}
            </span>
            <span className="flex shrink-0 items-center gap-1.5 text-sm font-semibold">
                <Icone className="size-4" aria-hidden="true" />
                {acao}
            </span>
        </>
    );

    // Com texto: página de leitura. Só com PDF: abre o arquivo direto, em nova aba.
    if (abrePdf) {
        return (
            <a href={conteudo.arquivoUrl!} target="_blank" rel="noopener noreferrer" className={CLASSES_DA_LINHA}>
                {corpo}
                <span className="sr-only">(abre em nova aba)</span>
            </a>
        );
    }

    return (
        <Link to={`/materiais/${conteudo.id}`} className={CLASSES_DA_LINHA}>
            {corpo}
        </Link>
    );
}
