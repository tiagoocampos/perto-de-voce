import { useCarregar } from "@/hooks/useCarregar";
import { listarMateriais } from "@/services/publico";
import { EstadoDaLista } from "../EstadoDaLista";
import { LinhaMaterial } from "../LinhaMaterial";
import { SecaoHome } from "./SecaoHome";

export function SecaoMateriais() {
    const { carga, recarregar } = useCarregar(listarMateriais);

    return (
        <SecaoHome id="home-materiais" titulo="Materiais" verTodosPara="/materiais">
            <EstadoDaLista
                carga={carga}
                onTentarDeNovo={recarregar}
                forma="linha"
                mensagemVazio="Ainda não há materiais por aqui."
            >
                {(materiais) => (
                    <ul className="divide-y divide-border rounded-folha border border-border bg-papel">
                        {materiais.slice(0, 4).map((material) => (
                            <li key={material.id}>
                                <LinhaMaterial conteudo={material} compacta />
                            </li>
                        ))}
                    </ul>
                )}
            </EstadoDaLista>
        </SecaoHome>
    );
}
