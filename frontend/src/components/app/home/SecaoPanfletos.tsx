import { useCarregar } from "@/hooks/useCarregar";
import { listarPanfletos } from "@/services/publico";
import { EstadoDaLista } from "../EstadoDaLista";
import { FolhaPanfleto } from "../FolhaPanfleto";
import { SecaoHome } from "./SecaoHome";

export function SecaoPanfletos() {
    const { carga, recarregar } = useCarregar(listarPanfletos);

    return (
        <SecaoHome id="home-panfletos" titulo="Panfletos" verTodosPara="/panfletos">
            <EstadoDaLista
                carga={carga}
                onTentarDeNovo={recarregar}
                forma="folha"
                mensagemVazio="Ainda não há panfletos por aqui."
            >
                {(panfletos) => (
                    // Fileira que rola por dentro (a página em si não rola na horizontal)
                    <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2">
                        {panfletos.slice(0, 8).map((panfleto) => (
                            <FolhaPanfleto key={panfleto.id} conteudo={panfleto} className="w-36 shrink-0" />
                        ))}
                    </div>
                )}
            </EstadoDaLista>
        </SecaoHome>
    );
}
