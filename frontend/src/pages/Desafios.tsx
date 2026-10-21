import { useState } from "react";
import { EstadoDaLista } from "@/components/app/EstadoDaLista";
import { GradeSelos } from "@/components/app/GradeSelos";
import { ItemDesafio } from "@/components/app/ItemDesafio";
import { TituloDePagina } from "@/components/app/TituloDePagina";
import { useCarregar } from "@/hooks/useCarregar";
import { usePageMeta } from "@/hooks/usePageMeta";
import { useProgressoDesafios } from "@/hooks/useProgressoDesafios";
import { listarDesafios } from "@/services/publico";

export function Desafios() {
    const { carga, recarregar } = useCarregar(listarDesafios);
    const { ids, alternar, contarConcluidos } = useProgressoDesafios();
    // O selo em que a pessoa acabou de tocar é o único que faz o carimbo
    const [carimbadoId, setCarimbadoId] = useState<string | null>(null);

    usePageMeta({
        title: "Desafios — Perto de Você",
        description: "Ações práticas para colocar sua fé em ação e levar a mensagem de Jesus a alguém.",
    });

    function aoAlternar(id: string) {
        setCarimbadoId(id);
        alternar(id);
    }

    return (
        <div className="px-5 py-6">
            <TituloDePagina
                titulo="Desafios"
                texto="Coloque sua fé em ação. Marque cada desafio quando concluir: o progresso fica salvo neste aparelho."
            />

            <EstadoDaLista
                carga={carga}
                onTentarDeNovo={recarregar}
                forma="linha"
                mensagemVazio="Ainda não há desafios por aqui."
            >
                {(desafios) => {
                    const concluidos = contarConcluidos(desafios);
                    return (
                        <>
                            <div className="mb-6 rounded-folha border border-border bg-papel p-4">
                                <p className="mb-3 font-extrabold" aria-live="polite">
                                    {concluidos} de {desafios.length} concluídos
                                </p>
                                <GradeSelos desafios={desafios} ids={ids} />
                            </div>

                            <ul className="space-y-3">
                                {desafios.map((desafio, indice) => (
                                    <ItemDesafio
                                        key={desafio.id}
                                        desafio={desafio}
                                        numero={indice + 1}
                                        concluido={ids.includes(desafio.id)}
                                        animar={carimbadoId === desafio.id}
                                        onAlternar={() => aoAlternar(desafio.id)}
                                    />
                                ))}
                            </ul>
                        </>
                    );
                }}
            </EstadoDaLista>
        </div>
    );
}
