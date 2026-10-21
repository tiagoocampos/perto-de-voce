import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EstadoCarregando } from "@/components/app/EstadoCarregando";
import { EstadoErro } from "@/components/app/EstadoErro";
import { NaoEncontrado } from "@/components/app/NaoEncontrado";
import { useCarregar } from "@/hooks/useCarregar";
import { usePageMeta } from "@/hooks/usePageMeta";
import { buscarConteudo } from "@/services/publico";

export function MaterialLeitura() {
    const { id = "" } = useParams();
    const buscar = useCallback(() => buscarConteudo(id), [id]);
    const { carga, recarregar } = useCarregar(buscar);

    const material = carga.status === "ok" && carga.dados.tipo === "MATERIAL" ? carga.dados : null;

    usePageMeta({
        title: material ? `${material.titulo} — Perto de Você` : null,
        description: material?.descricao ?? null,
    });

    const voltar = (
        <Link to="/materiais" className="mb-2 inline-flex min-h-11 items-center gap-1.5 font-semibold">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Materiais
        </Link>
    );

    function conteudo() {
        if (carga.status === "carregando") {
            return <EstadoCarregando forma="detalhe" />;
        }

        const naoExiste = carga.status === "erro" && axios.isAxiosError(carga.erro) && carga.erro.response?.status === 404;
        if (naoExiste || (carga.status === "ok" && !material)) {
            return (
                <NaoEncontrado
                    mensagem="Este material não está mais disponível."
                    voltarPara="/materiais"
                    rotuloVoltar="Ver todos os materiais"
                />
            );
        }

        if (carga.status === "erro" || !material) {
            return <EstadoErro onTentarDeNovo={recarregar} />;
        }

        // Parágrafos separados por linha em branco; quebras simples dentro do parágrafo são mantidas
        const paragrafos = (material.texto ?? "").split(/\n{2,}/).filter((p) => p.trim() !== "");

        return (
            <>
                <h1 className="text-3xl">{material.titulo}</h1>
                <p className="mt-2 text-grafite">{material.descricao}</p>

                {material.arquivoUrl && (
                    <Button asChild size="lg" className="mt-4">
                        <a href={material.arquivoUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink aria-hidden="true" />
                            Abrir PDF
                            <span className="sr-only">(abre em nova aba)</span>
                        </a>
                    </Button>
                )}

                {/* Texto para ler: serifa, entrelinha folgada e linhas de até ~65 caracteres */}
                {paragrafos.length > 0 && (
                    <div className="mt-6 max-w-[65ch] space-y-4 font-serif text-[1.0625rem] leading-[1.65]">
                        {paragrafos.map((paragrafo, i) => (
                            <p key={i} className="whitespace-pre-line">
                                {paragrafo}
                            </p>
                        ))}
                    </div>
                )}
            </>
        );
    }

    return (
        <div className="px-5 py-4 pb-8">
            {voltar}
            {conteudo()}
        </div>
    );
}
