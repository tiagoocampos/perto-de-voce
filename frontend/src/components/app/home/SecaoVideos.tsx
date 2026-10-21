import { useCarregar } from "@/hooks/useCarregar";
import { listarVideos } from "@/services/publico";
import { CartaoVideo } from "../CartaoVideo";
import { EstadoDaLista } from "../EstadoDaLista";
import { SecaoHome } from "./SecaoHome";

export function SecaoVideos() {
    const { carga, recarregar } = useCarregar(listarVideos);

    return (
        <SecaoHome id="home-videos" titulo="Aprenda a evangelizar" verTodosPara="/videos">
            <EstadoDaLista
                carga={carga}
                onTentarDeNovo={recarregar}
                forma="video"
                mensagemVazio="Ainda não há vídeos por aqui."
            >
                {(videos) => (
                    <div className="space-y-6">
                        {videos.slice(0, 2).map((video) => (
                            <CartaoVideo key={video.id} conteudo={video} />
                        ))}
                    </div>
                )}
            </EstadoDaLista>
        </SecaoHome>
    );
}
