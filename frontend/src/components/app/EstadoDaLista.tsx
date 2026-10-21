import type { ReactNode } from "react";
import axios from "axios";
import type { Carga } from "@/hooks/useCarregar";
import { EstadoCarregando } from "./EstadoCarregando";
import { EstadoErro } from "./EstadoErro";
import { EstadoVazio } from "./EstadoVazio";

interface EstadoDaListaProps<T> {
    carga: Carga<T[]>;
    onTentarDeNovo: () => void;
    forma: "folha" | "video" | "linha";
    mensagemVazio: string;
    // Só é chamada quando há itens para mostrar
    children: (itens: T[]) => ReactNode;
}

// Decide entre carregando, erro, vazio e a lista pronta, para cada tela não repetir isso
export function EstadoDaLista<T>({ carga, onTentarDeNovo, forma, mensagemVazio, children }: EstadoDaListaProps<T>) {
    if (carga.status === "carregando") {
        return <EstadoCarregando forma={forma} />;
    }

    if (carga.status === "erro") {
        // Se o servidor respondeu com erro, o problema não é a conexão da pessoa
        const servidorRespondeu = axios.isAxiosError(carga.erro) && !!carga.erro.response;
        return (
            <EstadoErro
                {...(servidorRespondeu && {
                    mensagem: "O servidor não conseguiu enviar o conteúdo. Tente de novo em instantes.",
                })}
                onTentarDeNovo={onTentarDeNovo}
            />
        );
    }

    if (carga.dados.length === 0) {
        return <EstadoVazio mensagem={mensagemVazio} />;
    }

    return <>{children(carga.dados)}</>;
}
