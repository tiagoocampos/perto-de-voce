import { useCallback, useEffect, useState } from "react";

export type Carga<T> =
    | { status: "carregando" }
    | { status: "erro"; erro: unknown }
    | { status: "ok"; dados: T };

// Busca dados ao abrir a tela e permite "tentar de novo".
// `buscar` precisa ser sempre a mesma função (declarada fora do componente, ou com useCallback),
// senão ela dispara uma busca nova a cada renderização.
export function useCarregar<T>(buscar: () => Promise<T>) {
    const [carga, setCarga] = useState<Carga<T>>({ status: "carregando" });
    const [tentativa, setTentativa] = useState(0);

    useEffect(() => {
        let cancelado = false;

        buscar()
            .then((dados) => {
                if (!cancelado) setCarga({ status: "ok", dados });
            })
            .catch((erro) => {
                if (!cancelado) setCarga({ status: "erro", erro });
            });

        // Se a pessoa saiu da tela antes da resposta, a resposta é ignorada
        return () => {
            cancelado = true;
        };
    }, [buscar, tentativa]);

    // "Tentar de novo" depois de um erro: volta ao esqueleto de carregamento
    const recarregar = useCallback(() => {
        setCarga({ status: "carregando" });
        setTentativa((t) => t + 1);
    }, []);

    // Busca de novo sem trocar a tela pelo esqueleto (ex.: a tabela do admin depois de salvar)
    const atualizar = useCallback(() => {
        setTentativa((t) => t + 1);
    }, []);

    return { carga, recarregar, atualizar };
}
