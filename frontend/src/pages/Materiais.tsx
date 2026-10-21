import { EstadoDaLista } from "@/components/app/EstadoDaLista";
import { LinhaMaterial } from "@/components/app/LinhaMaterial";
import { TituloDePagina } from "@/components/app/TituloDePagina";
import { useCarregar } from "@/hooks/useCarregar";
import { usePageMeta } from "@/hooks/usePageMeta";
import { listarMateriais } from "@/services/publico";

export function Materiais() {
    const { carga, recarregar } = useCarregar(listarMateriais);

    usePageMeta({
        title: "Materiais — Perto de Você",
        description: "Roteiros, estudos e ideias para conversar sobre Jesus.",
    });

    return (
        <div className="px-5 py-6">
            <TituloDePagina titulo="Materiais" texto="Roteiros, estudos e ideias para conversar sobre Jesus." />

            <EstadoDaLista
                carga={carga}
                onTentarDeNovo={recarregar}
                forma="linha"
                mensagemVazio="Ainda não há materiais por aqui."
            >
                {(materiais) => (
                    <ul className="divide-y divide-border rounded-folha border border-border bg-papel">
                        {materiais.map((material) => (
                            <li key={material.id}>
                                <LinhaMaterial conteudo={material} />
                            </li>
                        ))}
                    </ul>
                )}
            </EstadoDaLista>
        </div>
    );
}
