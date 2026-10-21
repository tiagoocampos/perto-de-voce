import { api } from "./api";
import type { Conteudo, Desafio, TipoConteudo } from "../types";

// Chamadas das rotas públicas (sem login). São funções soltas, e não inline nos componentes,
// para que o useCarregar receba sempre a mesma função e não busque de novo a cada renderização.

async function listarConteudos(tipo: TipoConteudo): Promise<Conteudo[]> {
    const { data } = await api.get<Conteudo[]>("/conteudos", { params: { tipo } });
    return data;
}

export const listarPanfletos = () => listarConteudos("PANFLETO");
export const listarVideos = () => listarConteudos("VIDEO");
export const listarMateriais = () => listarConteudos("MATERIAL");

export async function buscarConteudo(id: string): Promise<Conteudo> {
    const { data } = await api.get<Conteudo>(`/conteudos/${id}`);
    return data;
}

export async function listarDesafios(): Promise<Desafio[]> {
    const { data } = await api.get<Desafio[]>("/desafios");
    return data;
}
