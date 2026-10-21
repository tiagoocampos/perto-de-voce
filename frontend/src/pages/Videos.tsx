import { CartaoVideo } from "@/components/app/CartaoVideo";
import { EstadoDaLista } from "@/components/app/EstadoDaLista";
import { TituloDePagina } from "@/components/app/TituloDePagina";
import { useCarregar } from "@/hooks/useCarregar";
import { usePageMeta } from "@/hooks/usePageMeta";
import { listarVideos } from "@/services/publico";

export function Videos() {
    const { carga, recarregar } = useCarregar(listarVideos);

    usePageMeta({
        title: "Vídeos — Perto de Você",
        description: "Vídeos para aprender a abordar pessoas e a apresentar o plano da salvação.",
    });

    return (
        <div className="px-5 py-6">
            <TituloDePagina
                titulo="Vídeos"
                texto="Aprenda a abordar pessoas e a apresentar o plano da salvação."
            />

            <EstadoDaLista
                carga={carga}
                onTentarDeNovo={recarregar}
                forma="video"
                mensagemVazio="Ainda não há vídeos por aqui."
            >
                {(videos) => (
                    <div className="space-y-8">
                        {videos.map((video) => (
                            <CartaoVideo key={video.id} conteudo={video} nivelDoTitulo="h2" />
                        ))}
                    </div>
                )}
            </EstadoDaLista>
        </div>
    );
}
