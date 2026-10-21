import { EstadoDaLista } from "@/components/app/EstadoDaLista";
import { FolhaPanfleto } from "@/components/app/FolhaPanfleto";
import { TituloDePagina } from "@/components/app/TituloDePagina";
import { useCarregar } from "@/hooks/useCarregar";
import { usePageMeta } from "@/hooks/usePageMeta";
import { listarPanfletos } from "@/services/publico";

export function Panfletos() {
    const { carga, recarregar } = useCarregar(listarPanfletos);

    usePageMeta({
        title: "Panfletos — Perto de Você",
        description: "Panfletos evangelísticos em PDF para baixar, imprimir e entregar.",
    });

    return (
        <div className="px-5 py-6">
            <TituloDePagina titulo="Panfletos" texto="Baixe o PDF, imprima e entregue a quem estiver perto de você." />

            <EstadoDaLista
                carga={carga}
                onTentarDeNovo={recarregar}
                forma="folha"
                mensagemVazio="Ainda não há panfletos por aqui."
            >
                {(panfletos) => (
                    <div className="grid grid-cols-2 gap-4">
                        {panfletos.map((panfleto) => (
                            <FolhaPanfleto key={panfleto.id} conteudo={panfleto} />
                        ))}
                    </div>
                )}
            </EstadoDaLista>
        </div>
    );
}
