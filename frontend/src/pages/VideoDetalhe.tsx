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
import { embedYoutube, extrairIdYoutube } from "@/lib/youtube";
import { buscarConteudo } from "@/services/publico";

export function VideoDetalhe() {
    const { id = "" } = useParams();
    const buscar = useCallback(() => buscarConteudo(id), [id]);
    const { carga, recarregar } = useCarregar(buscar);

    const video = carga.status === "ok" && carga.dados.tipo === "VIDEO" ? carga.dados : null;

    usePageMeta({
        title: video ? `${video.titulo} — Perto de Você` : null,
        description: video?.descricao ?? null,
    });

    const voltar = (
        <Link to="/videos" className="mb-2 inline-flex min-h-11 items-center gap-1.5 font-semibold">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Vídeos
        </Link>
    );

    function conteudo() {
        if (carga.status === "carregando") {
            return <EstadoCarregando forma="detalhe" />;
        }

        // 404 também vale para vídeo despublicado; um id de outro tipo de conteúdo não é vídeo
        const naoExiste = carga.status === "erro" && axios.isAxiosError(carga.erro) && carga.erro.response?.status === 404;
        if (naoExiste || (carga.status === "ok" && !video)) {
            return (
                <NaoEncontrado
                    mensagem="Este vídeo não está mais disponível."
                    voltarPara="/videos"
                    rotuloVoltar="Ver todos os vídeos"
                />
            );
        }

        if (carga.status === "erro" || !video) {
            return <EstadoErro onTentarDeNovo={recarregar} />;
        }

        const idYoutube = video.link ? extrairIdYoutube(video.link) : null;

        return (
            <>
                {idYoutube ? (
                    <iframe
                        src={embedYoutube(idYoutube)}
                        title={video.titulo}
                        className="aspect-video w-full rounded-folha bg-noite"
                        allow="encrypted-media; picture-in-picture; fullscreen"
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                    />
                ) : (
                    video.link && (
                        <Button asChild size="lg">
                            <a href={video.link} target="_blank" rel="noopener noreferrer">
                                <ExternalLink aria-hidden="true" />
                                Abrir vídeo
                                <span className="sr-only">(abre em nova aba)</span>
                            </a>
                        </Button>
                    )
                )}
                <h1 className="mt-4 text-2xl">{video.titulo}</h1>
                <p className="mt-2 text-grafite">{video.descricao}</p>
            </>
        );
    }

    return (
        <div className="px-5 py-4">
            {voltar}
            {conteudo()}
        </div>
    );
}
