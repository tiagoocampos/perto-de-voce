import { useState } from "react";
import type { Desafio } from "../types";

// O progresso fica só neste aparelho (não há conta de usuário): guardamos os ids dos desafios concluídos
const CHAVE = "pdv:desafios-concluidos";

function ler(): string[] {
    try {
        const salvo = JSON.parse(localStorage.getItem(CHAVE) ?? "[]");
        return Array.isArray(salvo) ? salvo.filter((id): id is string => typeof id === "string") : [];
    } catch {
        return [];
    }
}

function salvar(ids: string[]) {
    try {
        localStorage.setItem(CHAVE, JSON.stringify(ids));
    } catch {
        // Navegação privada ou armazenamento cheio: o progresso vale só nesta visita
    }
}

export function useProgressoDesafios() {
    const [ids, setIds] = useState<string[]>(ler);

    function alternar(id: string) {
        const novos = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
        setIds(novos);
        salvar(novos);
    }

    // Conta só os desafios que existem hoje na API: um id salvo de um desafio já removido é ignorado
    function contarConcluidos(desafios: Desafio[]): number {
        return desafios.filter((d) => ids.includes(d.id)).length;
    }

    return { ids, alternar, contarConcluidos };
}
