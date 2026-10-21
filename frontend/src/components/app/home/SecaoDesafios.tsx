import { Link } from "react-router-dom";
import { useCarregar } from "@/hooks/useCarregar";
import { useProgressoDesafios } from "@/hooks/useProgressoDesafios";
import { listarDesafios } from "@/services/publico";
import { EstadoDaLista } from "../EstadoDaLista";
import { GradeSelos } from "../GradeSelos";
import { SecaoHome } from "./SecaoHome";

export function SecaoDesafios() {
    const { carga, recarregar } = useCarregar(listarDesafios);
    const { ids, contarConcluidos } = useProgressoDesafios();

    // O contador só existe depois que os desafios chegam
    const contador =
        carga.status === "ok" && carga.dados.length > 0 ? (
            <p className="font-extrabold">
                {contarConcluidos(carga.dados)} de {carga.dados.length}
            </p>
        ) : undefined;

    return (
        <SecaoHome id="home-desafios" titulo="Seus desafios" lateral={contador}>
            <EstadoDaLista
                carga={carga}
                onTentarDeNovo={recarregar}
                forma="linha"
                mensagemVazio="Ainda não há desafios por aqui."
            >
                {(desafios) => (
                    <Link
                        to="/desafios"
                        className="block rounded-folha border border-border bg-papel p-4"
                    >
                        <GradeSelos desafios={desafios} ids={ids} />
                        <span className="mt-4 inline-flex min-h-11 items-center font-semibold underline underline-offset-4">
                            Ver desafios
                        </span>
                    </Link>
                )}
            </EstadoDaLista>
        </SecaoHome>
    );
}
